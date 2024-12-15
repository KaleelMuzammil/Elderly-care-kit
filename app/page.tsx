"use client";

import { useState, useEffect } from 'react';
import NavBar from "./Users/Navbar/page";
import VitalsDashboard from "./Users/Vitals/page";

export default function Home() {
  const [emergencyNumber, setEmergencyNumber] = useState('9876543210'); // Replace with your emergency number

  useEffect(() => {
    const handleSOSClick = () => {
      alert(`Sending emergency alert to ${emergencyNumber}`);
      // Add your logic to send the alert here
    };

    const sosButton = document.querySelector('button.sos');
    if (sosButton) {
      sosButton.addEventListener('click', handleSOSClick);
    }

    return () => {
      if (sosButton) {
        sosButton.removeEventListener('click', handleSOSClick);
      }
    };
  }, [emergencyNumber]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-200 flex flex-col items-center justify-center pt-16"> {/* Added pt-16 for padding */}
      <div className="flex flex-col w-full">
        <NavBar />
      </div>
      <div className="text-center text-gray-800">
        <h1 className="text-4xl font-bold mb-6">Elderly Care Companion</h1>
        <p className="text-lg mb-8 leading-relaxed">
          Empowering seniors with innovative technology to enhance mobility, health monitoring, and daily independence through personalized care solutions.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-100 hover:bg-gray-200 p-6 rounded-lg shadow-md">
            <span role="img" aria-label="Health Monitoring" className="text-4xl">❤️</span>
            <p className="text-sm font-medium mt-4">Health Monitoring</p>
          </div>
          <div className="bg-gray-100 hover:bg-gray-200 p-6 rounded-lg shadow-md">
            <span role="img" aria-label="Safety Features" className="text-4xl">🛡️</span>
            <p className="text-sm font-medium mt-4">Safety Features</p>
          </div>
          <div className="bg-gray-100 hover:bg-gray-200 p-6 rounded-lg shadow-md">
            <span role="img" aria-label="Voice Assistant" className="text-4xl">🎙️</span>
            <p className="text-sm font-medium mt-4">Voice Assistant</p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-6 mb-8">
          <div className="bg-gray-100 hover:bg-gray-200 p-6 rounded-lg shadow-md flex items-center">
            <span role="img" aria-label="Battery" className="text-4xl mr-4">🔋</span>
            <div className="bg-gray-300 rounded-full w-32 h-4 overflow-hidden">
              <div className="bg-green-500 h-full w-4/5"></div>
            </div>
            <p className="text-lg font-medium ml-4">80%</p>
          </div>
          <button
            className="bg-red-500 hover:bg-red-600 text-white py-3 px-8 rounded-lg sos"
          >
            Emergency SOS
          </button>
        </div>
      </div>
    </div>
  );
}