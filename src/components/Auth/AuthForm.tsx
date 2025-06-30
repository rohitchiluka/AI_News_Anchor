import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, RefreshCw, CheckCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface AuthFormProps {
  onSuccess: () => void;
}

export function AuthForm({ onSuccess }: AuthFormProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const { signIn, signUp, resendConfirmationEmail } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResendSuccess(false);
    setSignUpSuccess(false);

    try {
      if (isSignUp) {
        const { data, error } = await signUp(email, password);
        
        if (error) {
          setError(error.message);
        } else if (data.user && !data.user.email_confirmed_at) {
          // Sign-up successful but email confirmation required
          setSignUpSuccess(true);
          setIsSignUp(false); // Switch to sign-in mode
        } else if (data.user && data.user.email_confirmed_at) {
          // Sign-up successful and user is immediately logged in
          onSuccess();
        }
      } else {
        const { error } = await signIn(email, password);
        
        if (error) {
          setError(error.message);
        } else {
          onSuccess();
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!email) return;
    
    setResendLoading(true);
    setResendSuccess(false);
    
    try {
      const { error } = await resendConfirmationEmail(email);
      
      if (error) {
        setError(error.message);
      } else {
        setResendSuccess(true);
        setError('');
      }
    } catch (err) {
      setError('Failed to resend confirmation email');
    } finally {
      setResendLoading(false);
    }
  };

  const getErrorMessage = (errorMessage: string) => {
    if (errorMessage.includes('Email not confirmed') || errorMessage.includes('email_not_confirmed')) {
      return 'Your email address has not been confirmed. Please check your inbox (and spam folder) for a confirmation link and click it to activate your account.';
    }
    return errorMessage;
  };

  const isEmailNotConfirmedError = error.includes('Email not confirmed') || error.includes('email_not_confirmed');

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Animated Background Elements - matching landing page */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 md:w-64 md:h-64 bg-sci-cyan/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 md:w-96 md:h-96 bg-sci-purple/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-128 md:h-128 bg-sci-blue/5 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 md:p-8 w-full max-w-md relative z-10"
      >
        <div className="text-center mb-6 md:mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-12 h-12 md:w-16 md:h-16 bg-gradient-cyan-to-blue rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-glow-cyan"
          >
            <User className="w-6 h-6 md:w-8 md:h-8 text-sci-white" />
          </motion.div>
          <h1 className="text-xl md:text-2xl font-bold font-poppins gradient-text mb-2">
            Hello from Intellect !
          </h1>
          <p className="text-sci-light-gray text-sm md:text-base">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div>
            <label className="block text-sm font-medium text-sci-light-gray mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-sci-light-gray/60" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 md:py-3 bg-sci-black/50 backdrop-blur-sm border border-sci-gray-100 rounded-lg text-sci-white placeholder-sci-light-gray/60 focus:outline-none focus:ring-2 focus:ring-sci-cyan focus:border-transparent transition-all duration-200 text-sm md:text-base"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-sci-light-gray mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-sci-light-gray/60" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-2 md:py-3 bg-sci-black/50 backdrop-blur-sm border border-sci-gray-100 rounded-lg text-sci-white placeholder-sci-light-gray/60 focus:outline-none focus:ring-2 focus:ring-sci-cyan focus:border-transparent transition-all duration-200 text-sm md:text-base"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sci-light-gray/60 hover:text-sci-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4 md:w-5 md:h-5" /> : <Eye className="w-4 h-4 md:w-5 md:h-5" />}
              </button>
            </div>
          </div>

          {signUpSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-green-500/20 border border-green-500/50 rounded-lg p-3 md:p-4 text-green-200 text-sm"
            >
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium mb-1">Account Created Successfully!</p>
                  <p className="text-green-300 mb-2 md:mb-3 text-xs md:text-sm">
                    A confirmation email has been sent to <strong>{email}</strong>. Please check your inbox (and spam folder) and click the confirmation link to activate your account.
                  </p>
                  <p className="text-green-300 text-xs md:text-sm">
                    Once confirmed, you can sign in using the form below.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 md:p-4 text-red-200 text-sm"
            >
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium mb-1">Authentication Error</p>
                  <p className="text-red-300 mb-2 md:mb-3 text-xs md:text-sm">{getErrorMessage(error)}</p>
                  
                  {isEmailNotConfirmedError && email && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={handleResendConfirmation}
                      disabled={resendLoading}
                      className="flex items-center space-x-2 bg-blue-600/80 hover:bg-blue-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {resendLoading ? (
                        <RefreshCw className="w-3 h-3 md:w-4 md:h-4 animate-spin" />
                      ) : (
                        <Mail className="w-3 h-3 md:w-4 md:h-4" />
                      )}
                      <span>
                        {resendLoading ? 'Sending...' : 'Resend Confirmation Email'}
                      </span>
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {resendSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-green-500/20 border border-green-500/50 rounded-lg p-3 md:p-4 text-green-200 text-sm"
            >
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium mb-1">Email Sent Successfully</p>
                  <p className="text-green-300 text-xs md:text-sm">
                    A new confirmation email has been sent to <strong>{email}</strong>. Please check your inbox and spam folder.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full sci-button py-2 md:py-3 text-sm md:text-base font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </motion.button>
        </form>

        <div className="mt-4 md:mt-6 text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setSignUpSuccess(false);
              setError('');
              setResendSuccess(false);
            }}
            className="text-sci-cyan hover:text-sci-cyan/80 transition-colors text-sm md:text-base"
          >
            {isSignUp 
              ? 'Already have an account? Sign in' 
              : "Don't have an account? Sign up"
            }
          </button>
        </div>
      </motion.div>
    </div>
  );
}