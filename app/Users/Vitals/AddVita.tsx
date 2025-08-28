"use client";

import { useState } from "react";

export default function AddVitals({ onAdded }: { onAdded?: () => void }) {
  const [heartRate, setHeartRate] = useState("");
  const [spo2, setSpo2] = useState("");
  const [temperature, setTemperature] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("No token found. Please log in.");
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vitals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          heartRate: Number(heartRate),
          spo2: Number(spo2),
          temperature: Number(temperature),
        }),
      });

      if (!res.ok) throw new Error(await res.text());

      setMessage("✅ Vitals saved!");
      setHeartRate("");
      setSpo2("");
      setTemperature("");

      // Tell parent page to refresh vitals
      if (onAdded) onAdded();
    } catch (err: any) {
      setMessage("❌ " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md mt-6">
      <h2 className="text-lg font-bold mb-4">Add Vitals</h2>
      {message && <p className="mb-4 text-sm">{message}</p>}

      <input
        type="number"
        placeholder="Heart Rate (bpm)"
        value={heartRate}
        onChange={(e) => setHeartRate(e.target.value)}
        className="w-full mb-2 px-3 py-2 border rounded"
        required
      />
      <input
        type="number"
        placeholder="SpO₂ (%)"
        value={spo2}
        onChange={(e) => setSpo2(e.target.value)}
        className="w-full mb-2 px-3 py-2 border rounded"
        required
      />
      <input
        type="number"
        placeholder="Temperature (°C)"
        value={temperature}
        onChange={(e) => setTemperature(e.target.value)}
        className="w-full mb-4 px-3 py-2 border rounded"
        required
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Save Vitals
      </button>
    </form>
  );
}
