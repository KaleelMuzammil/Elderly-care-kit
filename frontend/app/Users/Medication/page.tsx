'use client';

import React, { useEffect, useState } from 'react';
import NavBar from '../Navbar/page';
import { listMedicines, addMedicine, deleteMedicine } from '@/app/lib/api';

type Med = {
  _id: string;
  name: string;
  // backend stores times: string[]; we display the first one
  times?: string[];
  time?: string;            // tolerate old shape if you had it
  duration?: string;        // we’ll send this as instructions below
  instructions?: string;    // backend field; we map duration -> instructions
};

const Medication: React.FC = () => {
  const [medicationName, setMedicationName] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('');
  const [medications, setMedications] = useState<Med[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    (async () => {
      try {
        setLoading(true);
        const items = await listMedicines(token);
        setMedications(items);
      } catch (e: any) {
        setErr(e.message || 'Failed to load medicines');
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return setErr('You must be logged in.');
    if (!medicationName || !time || !duration) return;

    const today = new Date().toISOString().split('T')[0];

    // Map your UI fields to the backend model:
    // - Use times: [time]
    // - Store your "duration" text in instructions to keep your card unchanged
    const payload = {
      name: medicationName,
      times: [time],
      instructions: `${duration} days from ${today}`,
    };

    try {
      const created = await addMedicine(token, payload);
      setMedications([created, ...medications]);
      setMedicationName('');
      setTime('');
      setDuration('');
    } catch (e: any) {
      setErr(e.message || 'Error adding medication');
    }
  };

  const deleteMedicationCard = async (id: string) => {
    if (!token) return setErr('You must be logged in.');
    try {
      await deleteMedicine(token, id);
      setMedications(medications.filter((m) => (m._id || (m as any).id) !== id));
    } catch (e: any) {
      setErr(e.message || 'Error deleting medication');
    }
  };

  // helpers to read fields regardless of old/new shapes
  const displayTime = (m: Med) => (m.time ? m.time : (m.times && m.times[0]) || '');
  const displayDuration = (m: Med) => m.duration || m.instructions || '';

  return (
    <div>
      <div className="fixed top-0 left-0 right-0 z-50">
        <NavBar />
      </div>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pt-24 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Form Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Medication Tracker</h1>

            {err && <div className="mb-4 text-sm text-red-600">{err}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <label htmlFor="medicationName" className="block text-sm font-medium text-gray-700 mb-2">
                    Medication Name
                  </label>
                  <input
                    type="text"
                    id="medicationName"
                    value={medicationName}
                    onChange={(e) => setMedicationName(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    placeholder="Enter medication name"
                  />
                </div>

                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    id="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (days)
                  </label>
                  <input
                    type="number"
                    id="duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    placeholder="Enter number of days"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Add Medication
                </button>
              </div>
            </form>
          </div>

          {/* Medications Grid */}
          {loading ? (
            <div className="text-gray-600">Loading medications…</div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {medications.map((medication) => {
                const id = (medication as any)._id || (medication as any).id;
                return (
                  <div key={id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">{medication.name}</h3>
                      <button
                        onClick={() => deleteMedicationCard(id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        aria-label="Delete"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-sm">{displayTime(medication)}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-sm">{displayDuration(medication)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {!loading && medications.length === 0 && (
            <div className="bg-blue-50 text-blue-800 rounded-lg p-4">
              No medications added yet. Add your first medication using the form above.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Medication;
