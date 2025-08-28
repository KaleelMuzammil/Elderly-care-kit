'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Mic, MicOff, Loader2, Volume2, VolumeX, RefreshCw } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import NavBar from '../Navbar/page';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI("AIzaSyAHSrzi5fTu3DYPbE5wjMckS2UfbT1j3vg");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
    speechRecognition?: any;
  }
}

interface AssistantProps {
  onTranscriptChange?: (transcript: string) => void;
}

const Assistant: React.FC<AssistantProps> = ({ onTranscriptChange }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<'idle' | 'processing' | 'completed' | 'error'>('idle');

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsSupported(false);
    }
  }, []);

  const speakText = useCallback(async (text: string) => {
    setIsSpeaking(true);
    try {
      if ('speechSynthesis' in window) {
        await window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.pitch = 1;
        utterance.rate = 0.9;

        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error("Speech error:", error);
      setIsSpeaking(false);
    }
  }, []);

  const stopSpeaking = useCallback(async () => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
    } catch (error) {
      console.error("Error stopping speech:", error);
    }
  }, []);

  const generateAIResponse = useCallback(async (input: string) => {
    setIsLoading(true);
    setProcessingStatus('processing');
    try {
      const result = await model.generateContent(input);
      const responseText = result.response.text();
      setAiResponse(responseText);
      setProcessingStatus('completed');
      await speakText(responseText);
    } catch (error) {
      console.error("Error generating AI response:", error);
      const errorMessage = "I'm sorry, I couldn't process that request. Please try again.";
      setAiResponse(errorMessage);
      setProcessingStatus('error');
      await speakText(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [speakText]);

  const resetAll = () => {
    setTranscript('');
    setAiResponse('');
    setProcessingStatus('idle');
    stopSpeaking();
  };

  const startListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setProcessingStatus('idle');
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let currentTranscript = '';
      for (let i = 0; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      setTranscript(currentTranscript);
      onTranscriptChange?.(currentTranscript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);

      switch (event.error) {
        case 'network':
          alert('Network error occurred. Check your connection and try again.');
          break;
        case 'not-allowed':
          alert('Microphone access denied. Please allow microphone permissions.');
          break;
        case 'no-speech':
          alert('No speech detected. Please speak clearly into the microphone.');
          break;
        default:
          alert('An error occurred. Please try again.');
      }

      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      if (transcript.trim()) {
        generateAIResponse(transcript);
      }
    };

    recognition.start();
    return recognition;
  }, [generateAIResponse, onTranscriptChange, transcript]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      window.speechRecognition?.stop();
      setIsListening(false);
    } else {
      window.speechRecognition = startListening();
    }
  }, [isListening, startListening]);

  if (!isSupported) {
    return (
      <div className="text-red-500 p-4 text-center rounded-lg border border-red-200 bg-red-50">
        Speech recognition is not supported in your browser. Please use Chrome or Edge.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-0 left-0 right-0 z-50">
        <NavBar />
      </div>
      <div className="pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">AI Voice Assistant</h1>
            <p className="text-sm text-gray-500 mt-1">Speak your message and get AI-powered responses</p>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex gap-2">
              <button
                onClick={toggleListening}
                className={`flex-1 flex items-center justify-center rounded-lg px-4 py-3 text-sm font-medium text-white transition-all duration-200 shadow-sm
                  ${isListening 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-blue-500 hover:bg-blue-600'}`}
              >
                {isListening ? (
                  <>
                    <MicOff className="mr-2 h-5 w-5" />
                    Stop Listening
                  </>
                ) : (
                  <>
                    <Mic className="mr-2 h-5 w-5" />
                    Start Listening
                  </>
                )}
              </button>

              <button
                onClick={resetAll}
                className="p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                title="Reset conversation"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-700">Your Message</h3>
                  {isListening && (
                    <div className="flex items-center text-sm text-blue-500">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Listening...
                    </div>
                  )}
                </div>
                <p className="whitespace-pre-wrap text-gray-600 min-h-[3rem]">
                  {transcript || 'Start speaking to see your message here...'}
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-700">AI Response</h3>
                  <div className="flex items-center gap-2">
                    {processingStatus === 'processing' && (
                      <span className="text-sm text-blue-500 flex items-center">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Processing...
                      </span>
                    )}
                    {aiResponse && (
                      <button
                        onClick={isSpeaking ? stopSpeaking : () => speakText(aiResponse)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title={isSpeaking ? "Stop speaking" : "Speak response"}
                      >
                        {isSpeaking ? (
                          <VolumeX className="h-5 w-5 text-gray-600" />
                        ) : (
                          <Volume2 className="h-5 w-5 text-gray-600" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
                <p className={`whitespace-pre-wrap min-h-[3rem] ${
                  processingStatus === 'error' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {aiResponse || 'AI response will appear here...'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assistant;