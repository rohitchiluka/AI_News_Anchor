export class SpeechService {
  private recognition: SpeechRecognition | null = null;
  private synthesis: SpeechSynthesis;
  private isListening = false;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private websocket: WebSocket | null = null;
  private currentTranscript = '';
  private finalTranscript = '';
  private transcriptionPromise: {
    resolve: (value: string) => void;
    reject: (reason: any) => void;
  } | null = null;

  constructor() {
    this.synthesis = window.speechSynthesis;
    
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new (window as any).webkitSpeechRecognition();
      this.setupRecognition();
    } else if ('SpeechRecognition' in window) {
      this.recognition = new SpeechRecognition();
      this.setupRecognition();
    }
  }

  private setupRecognition() {
    if (!this.recognition) return;

    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-US';
  }

  async checkMicrophonePermission(): Promise<boolean> {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return false;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop the stream immediately as we only needed to check permission
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      return false;
    }
  }

  private async startRealtimeTranscription(): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        // Store the promise resolvers for later use
        this.transcriptionPromise = { resolve, reject };
        
        // Reset transcripts
        this.currentTranscript = '';
        this.finalTranscript = '';

        // Check if AssemblyAI API key is configured
        const apiKey = import.meta.env.VITE_SPEECH_API_KEY;
        if (!apiKey || apiKey === 'your_speech_api_key') {
          // Fall back to browser's native speech recognition
          return this.tryNativeSpeechRecognition().then(resolve).catch(reject);
        }

        // Get microphone access
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            sampleRate: 16000,
            channelCount: 1,
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          } 
        });

        // Create WebSocket connection to AssemblyAI
        const websocketUrl = `wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000&token=${apiKey}`;
        this.websocket = new WebSocket(websocketUrl);

        this.websocket.onopen = () => {
          console.log('WebSocket connection established');
          
          // Start recording audio
          this.mediaRecorder = new MediaRecorder(stream, {
            mimeType: 'audio/webm;codecs=opus'
          });

          this.mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0 && this.websocket?.readyState === WebSocket.OPEN) {
              // Convert blob to base64 and send to WebSocket
              const reader = new FileReader();
              reader.onload = () => {
                const base64Data = (reader.result as string).split(',')[1];
                if (this.websocket?.readyState === WebSocket.OPEN) {
                  this.websocket.send(JSON.stringify({
                    audio_data: base64Data
                  }));
                }
              };
              reader.readAsDataURL(event.data);
            }
          };

          this.mediaRecorder.onerror = (event) => {
            console.error('MediaRecorder error:', event);
            this.cleanup(stream);
            reject(new Error('microphone-recording-failed'));
          };

          // Start recording with frequent data events for real-time streaming
          this.mediaRecorder.start(250); // Send data every 250ms
        };

        this.websocket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            if (data.message_type === 'PartialTranscript') {
              // Update current transcript with partial results
              this.currentTranscript = data.text || '';
              console.log('Partial transcript:', this.currentTranscript);
            } else if (data.message_type === 'FinalTranscript') {
              // Accumulate final transcript
              if (data.text && data.text.trim()) {
                this.finalTranscript += (this.finalTranscript ? ' ' : '') + data.text.trim();
                console.log('Final transcript:', this.finalTranscript);
              }
            } else if (data.message_type === 'SessionBegins') {
              console.log('AssemblyAI session started:', data.session_id);
            } else if (data.message_type === 'SessionTerminated') {
              console.log('AssemblyAI session terminated');
              this.cleanup(stream);
              resolve(this.finalTranscript || this.currentTranscript || '');
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        this.websocket.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.cleanup(stream);
          
          // Fall back to native speech recognition
          this.tryNativeSpeechRecognition().then(resolve).catch(reject);
        };

        this.websocket.onclose = (event) => {
          console.log('WebSocket connection closed:', event.code, event.reason);
          this.cleanup(stream);
          
          if (event.code !== 1000) { // Not a normal closure
            // Fall back to native speech recognition
            this.tryNativeSpeechRecognition().then(resolve).catch(reject);
          } else {
            resolve(this.finalTranscript || this.currentTranscript || '');
          }
        };

        // Auto-stop after 30 seconds to prevent indefinite recording
        setTimeout(() => {
          if (this.isListening) {
            this.stopListening();
          }
        }, 30000);

      } catch (error) {
        console.error('Error starting real-time transcription:', error);
        
        if (error instanceof Error && error.message.includes('getUserMedia')) {
          reject(new Error('microphone-access-failed'));
        } else {
          // Fall back to native speech recognition
          this.tryNativeSpeechRecognition().then(resolve).catch(reject);
        }
      }
    });
  }

  private cleanup(stream?: MediaStream) {
    // Stop media recorder
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    this.mediaRecorder = null;

    // Close WebSocket
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      this.websocket.close();
    }
    this.websocket = null;

    // Stop audio stream
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    this.isListening = false;
  }

  async startListening(): Promise<string> {
    if (this.isListening) {
      throw new Error('Already listening');
    }

    // Check microphone permission first
    const hasPermission = await this.checkMicrophonePermission();
    if (!hasPermission) {
      throw new Error('microphone-permission-denied');
    }

    this.isListening = true;

    try {
      // Try real-time transcription (which includes its own fallback to native recognition)
      const result = await this.startRealtimeTranscription();
      this.isListening = false;
      return result;
    } catch (error) {
      this.isListening = false;
      // Directly propagate the error from startRealtimeTranscription
      // No redundant fallback here since startRealtimeTranscription already handles fallbacks
      throw error;
    }
  }

  private async tryNativeSpeechRecognition(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error('Speech recognition not supported'));
        return;
      }

      let hasResult = false;
      let timeoutId: NodeJS.Timeout;

      // Set a timeout to handle cases where no speech is detected
      timeoutId = setTimeout(() => {
        if (!hasResult) {
          this.recognition?.stop();
          reject(new Error('no-speech-detected'));
        }
      }, 10000); // 10 second timeout

      this.recognition.onresult = (event) => {
        hasResult = true;
        clearTimeout(timeoutId);
        const transcript = event.results[0][0].transcript;
        if (transcript.trim()) {
          resolve(transcript);
        } else {
          reject(new Error('no-speech-detected'));
        }
      };

      this.recognition.onerror = (event) => {
        hasResult = true;
        clearTimeout(timeoutId);
        
        // Provide more specific error messages based on error type
        switch (event.error) {
          case 'audio-capture':
            reject(new Error('microphone-access-failed'));
            break;
          case 'not-allowed':
            reject(new Error('microphone-permission-denied'));
            break;
          case 'no-speech':
            reject(new Error('no-speech-detected'));
            break;
          case 'network':
            reject(new Error('network-error'));
            break;
          case 'aborted':
            reject(new Error('speech-recognition-aborted'));
            break;
          default:
            reject(new Error(`speech-recognition-error: ${event.error}`));
        }
      };

      this.recognition.onend = () => {
        clearTimeout(timeoutId);
        if (!hasResult) {
          reject(new Error('no-speech-detected'));
        }
      };

      try {
        this.recognition.start();
      } catch (error) {
        clearTimeout(timeoutId);
        reject(new Error('failed-to-start-recognition'));
      }
    });
  }

  stopListening() {
    if (!this.isListening) return;

    // Stop real-time transcription
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      // Send termination message to AssemblyAI
      this.websocket.send(JSON.stringify({ terminate_session: true }));
      
      // Close WebSocket after a short delay to allow termination message to be sent
      setTimeout(() => {
        if (this.websocket) {
          this.websocket.close(1000, 'User stopped listening');
        }
      }, 100);
    }

    // Stop media recorder
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.stop();
    }

    // Stop native speech recognition
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
    
    this.isListening = false;

    // Resolve the transcription promise if it exists
    if (this.transcriptionPromise) {
      this.transcriptionPromise.resolve(this.finalTranscript || this.currentTranscript || '');
      this.transcriptionPromise = null;
    }
  }

  speak(text: string, options?: { rate?: number; pitch?: number; volume?: number }): Promise<void> {
    return new Promise((resolve) => {
      // Stop any ongoing speech
      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Apply options
      if (options) {
        utterance.rate = options.rate || 1;
        utterance.pitch = options.pitch || 1;
        utterance.volume = options.volume || 1;
      }

      // Find a suitable voice (prefer female voices for news anchor feel)
      const voices = this.synthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.lang.startsWith('en') && voice.name.toLowerCase().includes('female')
      ) || voices.find(voice => voice.lang.startsWith('en')) || voices[0];

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve(); // Resolve even on error to prevent hanging

      this.synthesis.speak(utterance);
    });
  }

  stopSpeaking() {
    this.synthesis.cancel();
  }

  get isSupported() {
    return !!this.recognition && !!this.synthesis;
  }

  get isSpeaking() {
    return this.synthesis.speaking;
  }

  get isCurrentlyListening() {
    return this.isListening;
  }

  // Get current partial transcript (useful for real-time display)
  get currentPartialTranscript() {
    return this.currentTranscript;
  }

  // Get accumulated final transcript
  get accumulatedTranscript() {
    return this.finalTranscript;
  }
}

export const speechService = new SpeechService();