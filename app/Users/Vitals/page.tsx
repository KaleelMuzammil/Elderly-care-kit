'use client'; 

import React, { useState, useEffect } from 'react';
import { Heart, Activity, Thermometer } from 'lucide-react';
import NavBar from '../Navbar/page';
import { database, ref, onValue } from '../../Firebase/firebaseConfig';


const GaugeCircle = ({ 
  value, 
  unit, 
  color = 'bg-green-500',
  size = 'h-48 w-48'
}) => {
  const circumference = 2 * Math.PI * 45; 
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className={`relative ${size} flex items-center justify-center`}>
      <svg className="transform -rotate-90 w-full h-full">
        <circle
          className="stroke-gray-200"
          strokeWidth="10"
          fill="transparent"
          r="45"
          cx="50%"
          cy="50%"
        />
        <circle
          className={`${color}`}
          strokeWidth="10"
          fill="transparent"
          r="45"
          cx="50%"
          cy="50%"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-gray-800">{unit}</span>
      </div>
    </div>
  );
};

// Main Vitals component
const Vitals = () => {
  const [vitalsData, setVitalsData] = useState({
    heartRate: 0,
    spO2: 0,
    temperature: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const vitalsRef = ref(database, 'vitals');
    const unsubscribe = onValue(vitalsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setVitalsData({
          heartRate: data.heart_beat || 0,
          spO2: data.spo2 || 0,
          temperature: data.temperature || 0,
        });
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="fixed top-0 left-0 right-0 z-50">
        <NavBar />
      </div>
      <div className="pt-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Hello, User!</h1>
          <p className="text-xl text-gray-600 mb-8">Take a look at your vitals</p>

          {loading ? (
            <div className="flex justify-center items-center h-48">
              <p className="text-gray-600">Loading data...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Heart Rate Card */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="w-8 h-8 text-gray-700" />
                  <span className="text-xl font-semibold text-gray-700">Heart Rate</span>
                </div>
                <div className="flex justify-center">
                  <GaugeCircle 
                    value={vitalsData.heartRate} 
                    unit={`${vitalsData.heartRate} bpm`}
                    color={vitalsData.heartRate >= 60 && vitalsData.heartRate <= 100 ? 'bg-green-500' : 'bg-red-500'}
                  />
                </div>
              </div>

              {/* SpO2 Card */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-8 h-8 text-gray-700" />
                  <span className="text-xl font-semibold text-gray-700">SpO2</span>
                </div>
                <div className="flex justify-center">
                  <GaugeCircle 
                    value={vitalsData.spO2} 
                    unit={`${vitalsData.spO2}%`}
                    color={vitalsData.spO2 >= 95 ? 'bg-green-500' : 'bg-red-500'}
                  />
                </div>
              </div>

              {/* Temperature Card */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center gap-2 mb-4">
                  <Thermometer className="w-8 h-8 text-gray-700" />
                  <span className="text-xl font-semibold text-gray-700">Temperature</span>
                </div>
                <div className="flex justify-center">
                  <GaugeCircle 
                    value={vitalsData.temperature} 
                    unit={`${vitalsData.temperature}°C`}
                    color={vitalsData.temperature >= 36.1 && vitalsData.temperature <= 37.2 ? 'bg-green-500' : 'bg-red-500'}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Vitals;