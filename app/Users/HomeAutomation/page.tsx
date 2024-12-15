// pages/ToggleSwitch.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { ref, onValue, set, database } from '../../Firebase/firebaseConfig';
import NavBar from '../Navbar/page';

const ToggleSwitch: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    const toggleRef = ref(database, 'toggleSwitch');
    onValue(toggleRef, (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        setIsEnabled(data);
      }
    });
  }, []);

  const toggleSwitch = () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    set(ref(database, 'toggleSwitch'), newValue)
      .then(() => {
        console.log(`Toggle set to ${newValue}`);
      })
      .catch((error) => {
        console.error('Failed to update toggle', error);
      });
  };

  return (
    <div>
      <div className="fixed top-0 left-0 right-0 z-50">
        <NavBar />
      </div>
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-4">Toggle Switch</h1>
          <p className="text-lg text-gray-600 mb-6">
            Control the toggle switch state in real-time.
          </p>

          <div className="flex items-center justify-center space-x-4">
            <span
              className={`text-xl font-semibold ${isEnabled ? 'text-green-500' : 'text-red-500'}`}
            >
              {isEnabled ? 'ON' : 'OFF'}
            </span>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only"
                checked={isEnabled}
                onChange={toggleSwitch}
              />
              <div
                className="w-14 h-8 bg-gray-200 rounded-full shadow-inner transition-all duration-300 ease-in-out
                  ${isEnabled ? 'bg-green-400' : 'bg-gray-300'}"
              ></div>
              <div
                className={`absolute w-8 h-8 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out
                  ${isEnabled ? 'translate-x-6' : 'translate-x-0'}`}
              ></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToggleSwitch;