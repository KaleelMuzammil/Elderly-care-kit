'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from '../Navbar/page';

interface TimerButtonProps {
  onPress: () => void;
  title: string;
  color: string;
}

interface VideoSectionProps {
  title: string;
  description: string;
  videoUrl: string;
}

interface VideoData {
  title: string;
  description: string;
  url: string;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const TimerButton: React.FC<TimerButtonProps> = ({ onPress, title, color }) => (
  <button
    className={`px-6 py-3 rounded-md text-white font-medium ${color} hover:opacity-80 transition-opacity`}
    onClick={onPress}
  >
    {title}
  </button>
);

const VideoSection: React.FC<VideoSectionProps> = ({ title, description, videoUrl }) => (
  <div className="bg-white rounded-lg shadow-md p-6 mb-8">
    <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600 mb-4">{description}</p>
    <div className="h-96 rounded-md overflow-hidden">
      <iframe
        src={videoUrl}
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      ></iframe>
    </div>
  </div>
);

const Activity: React.FC = () => {
  const [timer, setTimer] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const videos: VideoData[] = [
    {
      title: "1. Diaphragmatic Breathing",
      description: "Place one hand on your navel and the other on your ribcage. Focus on deep, mindful breathing that expands your diaphragm.",
      url: "https://www.youtube.com/embed/9jpchJcKivk"
    },
    {
      title: "2. Three-Part Breathing",
      description: "Begin with belly breathing, then expand to ribcage, and finally to upper chest. Release in reverse order for complete breath awareness.",
      url: "https://www.youtube.com/embed/FypmWRNtHOc"
    },
    {
      title: "3. Bee Breathing (Bhramari)",
      description: "Create a gentle humming sound during exhale while keeping your ears covered. Experience deep relaxation and mental clarity.",
      url: "https://www.youtube.com/embed/jHAa1B0XctU"
    },
    {
      title: "4. Mindful Breathing",
      description: "Observe your natural breath without changing it. Notice the subtle sensations and rhythm of your breathing pattern.",
      url: "https://www.youtube.com/embed/Dcxjs6IlNmY"
    },
    {
      title: "5. Even Breathing with Visualization",
      description: "Maintain equal duration for inhale and exhale while visualizing peaceful scenes. Let your mind settle into deep tranquility.",
      url: "https://www.youtube.com/embed/4WfLftjEbQo"
    }
  ];

  return (
    <div>
      <div className="fixed top-0 left-0 right-0 z-50">
        <NavBar />
      </div>
      <div className="min-h-screen bg-gray-50 pt-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Pranayama Practice</h1>
            <div className="flex items-center justify-between mb-6">
              <div className="text-6xl font-bold text-gray-800">{formatTime(timer)}</div>
              <div className="space-x-4">
                <TimerButton
                  onPress={() => setIsRunning(true)}
                  title="Start"
                  color="bg-green-500"
                />
                <TimerButton
                  onPress={() => setIsRunning(false)}
                  title="Pause"
                  color="bg-orange-500"
                />
                <TimerButton
                  onPress={() => {
                    setIsRunning(false);
                    setTimer(0);
                  }}
                  title="Reset"
                  color="bg-red-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {videos.map((video, index) => (
              <VideoSection
                key={index}
                title={video.title}
                description={video.description}
                videoUrl={video.url}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Activity;