import { Link } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-green-100 flex items-center justify-center pt-16"> {/* Added pt-16 for padding */}
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-2xl text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Elderly Care Companion</h1>
        <p className="text-gray-600 mb-6">
          Empowering seniors with innovative technology to enhance mobility, health monitoring, and daily independence through personalized care solutions.
        </p>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-red-100 hover:bg-red-200 p-4 rounded-lg shadow-md">
            <span role="img" aria-label="Health Monitoring" className="text-2xl">❤️</span>
            <p className="text-sm font-medium mt-2">Health Monitoring</p>
          </div>
          <div className="bg-blue-100 hover:bg-blue-200 p-4 rounded-lg shadow-md">
            <span role="img" aria-label="Safety Features" className="text-2xl">🛡️</span>
            <p className="text-sm font-medium mt-2">Safety Features</p>
          </div>
          <div className="bg-green-100 hover:bg-green-200 p-4 rounded-lg shadow-md">
            <span role="img" aria-label="Voice Assistant" className="text-2xl">🎙️</span>
            <p className="text-sm font-medium mt-2">Voice Assistant</p>
          </div>
        </div>
        <button className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-lg mb-4">
          Emergency SOS
        </button>
        <div className="bg-green-100 hover:bg-green-200 p-4 rounded-lg shadow-md">
          <span role="img" aria-label="Battery" className="text-2xl">🔋</span>
          <p className="text-sm font-medium mt-2">80%</p>
        </div>
      </div>
    </div>
  );
}