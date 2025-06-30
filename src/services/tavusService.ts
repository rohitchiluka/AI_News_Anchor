interface TavusConversationResponse {
  conversation_id: string;
  daily_url: string;
  status: string;
}

interface TavusCreateConversationRequest {
  persona_id: string;
  callback_url?: string;
  properties?: {
    max_call_duration?: number;
    participant_left_timeout?: number;
    participant_absent_timeout?: number;
  };
}

class TavusService {
  private apiKey: string;
  private baseUrl = 'https://tavusapi.com';

  constructor() {
    this.apiKey = import.meta.env.VITE_TAVUS_API_KEY;
    
    if (!this.apiKey || this.apiKey === 'your_tavus_api_key') {
      throw new Error('VITE_TAVUS_API_KEY is required. Please add it to your .env file.');
    }
  }

  async createConversation(personaId: string): Promise<TavusConversationResponse> {
    try {
      // Validate persona ID
      if (!personaId || personaId === 'your_tavus_persona_id') {
        throw new Error('Valid Tavus Persona ID is required. Please check your VITE_TAVUS_PERSONA_ID in the .env file.');
      }

      const requestBody: TavusCreateConversationRequest = {
        persona_id: personaId,
        properties: {
          max_call_duration: 3600, // 1 hour max
          participant_left_timeout: 60, // 1 minute timeout when participant leaves
          participant_absent_timeout: 300, // 5 minutes timeout when participant is absent
        },
      };

      console.log('Creating Tavus conversation with persona:', personaId);

      const response = await fetch(`${this.baseUrl}/v2/conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
        },
        body: JSON.stringify(requestBody),
      });

      let responseData: any;
      const responseText = await response.text();
      
      try {
        responseData = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse Tavus API response:', responseText);
        throw new Error(`Invalid JSON response from Tavus API: ${responseText}`);
      }

      if (!response.ok) {
        console.error('Tavus API Error Response:', responseData);
        
        // Handle specific error cases
        if (response.status === 401) {
          throw new Error('Invalid Tavus API key. Please check your VITE_TAVUS_API_KEY in the .env file.');
        } else if (response.status === 404) {
          throw new Error('Invalid Tavus Persona ID. Please check your VITE_TAVUS_PERSONA_ID in the .env file.');
        } else if (response.status === 403) {
          throw new Error('Access denied. Please check your Tavus account permissions and API key.');
        }
        
        const errorMessage = responseData?.message || responseData?.error || responseText || 'Unknown error';
        throw new Error(`Tavus API error (${response.status}): ${errorMessage}`);
      }

      console.log('Tavus API Response:', responseData);

      // Validate response structure
      if (!responseData || typeof responseData !== 'object') {
        throw new Error('Invalid response format from Tavus API');
      }

      // Check for conversation_url (the actual field name in the API response)
      if (!responseData.conversation_url) {
        console.error('Missing conversation_url in response:', responseData);
        throw new Error('No conversation_url received from Tavus API. This may indicate an issue with your API credentials or persona configuration.');
      }

      if (!responseData.conversation_id) {
        console.error('Missing conversation_id in response:', responseData);
        throw new Error('No conversation_id received from Tavus API');
      }

      const result: TavusConversationResponse = {
        conversation_id: responseData.conversation_id,
        daily_url: responseData.conversation_url, // Map conversation_url to daily_url for consistency
        status: responseData.status || 'created'
      };

      console.log('Successfully created Tavus conversation:', result.conversation_id);
      return result;
    } catch (error) {
      console.error('Error creating Tavus conversation:', error);
      
      // Re-throw with more context if it's a generic error
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(`Unexpected error creating Tavus conversation: ${String(error)}`);
      }
    }
  }

  async getConversationStatus(conversationId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/v2/conversations/${conversationId}`, {
        method: 'GET',
        headers: {
          'x-api-key': this.apiKey,
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Tavus API Error:', errorData);
        throw new Error(`Tavus API error (${response.status}): ${errorData}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting Tavus conversation status:', error);
      throw error;
    }
  }

  async endConversation(conversationId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/v2/conversations/${conversationId}`, {
        method: 'DELETE',
        headers: {
          'x-api-key': this.apiKey,
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Tavus API Error:', errorData);
        throw new Error(`Tavus API error (${response.status}): ${errorData}`);
      }
    } catch (error) {
      console.error('Error ending Tavus conversation:', error);
      throw error;
    }
  }
}

export const tavusService = new TavusService();
export type { TavusConversationResponse };