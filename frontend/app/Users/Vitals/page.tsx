'use client';

import { useEffect, useState } from 'react';
import { Heart, Activity, Thermometer } from 'lucide-react';
import NavBar from '../Navbar/page';
import { getLatestVitals } from '../../lib/api';
import AddVitals from "./AddVita";

type Vitals = {
  heartRate?: number;
  spo2?: number;
  temperature?: number;
};

export default function VitalsPage() {
  const [vitals, setVitals] = useState<Vitals | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVitals = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please log in.');
        setLoading(false);
        return;
      }
      const data = await getLatestVitals(token);
      setVitals(data);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load vitals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVitals();
  }, []);

  const GaugeCircle = ({
    label, value, unit, icon,
  }: { label: string; value?: number; unit?: string; icon: React.ReactNode }) => (
    <div className="flex flex-col items-center justify-center rounded-2xl border p-6 shadow-sm">
      <div className="mb-3">{icon}</div>
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-3xl font-semibold">
        {value ?? '--'}{unit ? <span className="text-base text-gray-500"> {unit}</span> : null}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="mx-auto max-w-5xl p-6 pt-24">
        <h1 className="mb-6 text-2xl font-bold">Latest Vitals</h1>

        {loading && <div>Loading…</div>}
        {error && <div className="text-red-600">Error: {error}</div>}

        {!loading && !error && vitals && (
          <div className="grid gap-6 sm:grid-cols-3 mb-8">
            <GaugeCircle label="Heart Rate" value={vitals?.heartRate} unit="bpm" icon={<Heart className="h-8 w-8" />} />
            <GaugeCircle label="SpO₂" value={vitals?.spo2} unit="%" icon={<Activity className="h-8 w-8" />} />
            <GaugeCircle label="Temperature" value={vitals?.temperature} unit="°C" icon={<Thermometer className="h-8 w-8" />} />
          </div>
        )}

        {/* Add new vitals */}
        <AddVitals onAdded={fetchVitals} />
      </main>
    </div>
  );
}
