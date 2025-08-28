// app/Users/ToggleSwitch/page.tsx (adjust path as needed)
"use client";

import React, { useEffect, useState } from "react";
// Adjust this import if your NavBar lives elsewhere:
import NavBar from "../Navbar/page";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const TOGGLE_PATH = "/api/toggles/toggleSwitch";

const ToggleSwitch: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // Load current toggle value from backend
  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setErr("No token found. Please log in.");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await fetch(`${API}${TOGGLE_PATH}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });
        if (!res.ok) {
          const msg = await res.text().catch(() => "");
          throw new Error(`GET failed (${res.status}) ${msg}`);
        }
        const data = (await res.json()) as { value: boolean };
        setIsEnabled(Boolean(data?.value));
      } catch (e: any) {
        setErr(e?.message ?? "Failed to load toggle");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleSwitch = async () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setErr("No token found. Please log in.");
      return;
    }

    const newValue = !isEnabled;
    // Optimistic UI
    setIsEnabled(newValue);
    try {
      const res = await fetch(`${API}${TOGGLE_PATH}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ value: newValue }),
      });
      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(`PUT failed (${res.status}) ${msg}`);
      }
      // (Optional) read response to confirm
      // const data = await res.json();
    } catch (e: any) {
      // Revert on failure
      setIsEnabled(!newValue);
      setErr(e?.message ?? "Failed to update toggle");
      console.error("Failed to update toggle", e);
    }
  };

  return (
    <div>
      <div className="fixed top-0 left-0 right-0 z-50">
        <NavBar />
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 pt-16">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
            Toggle Switch
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Control the toggle switch state in real-time.
          </p>

          {loading && <div>Loading…</div>}
          {err && <div className="text-red-600 mb-4">Error: {err}</div>}

          {!loading && (
            <div className="flex items-center justify-center space-x-4">
              <span
                className={`text-xl font-semibold ${
                  isEnabled ? "text-green-500" : "text-red-500"
                }`}
              >
                {isEnabled ? "ON" : "OFF"}
              </span>

              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={isEnabled}
                  onChange={toggleSwitch}
                />
                {/* Track (fix: use backticks for conditional classes) */}
                <div
                  className={`w-14 h-8 rounded-full shadow-inner transition-colors duration-300 ease-in-out ${
                    isEnabled ? "bg-green-400" : "bg-gray-300"
                  }`}
                />
                {/* Knob */}
                <div
                  className={`absolute w-8 h-8 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
                    isEnabled ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToggleSwitch;
