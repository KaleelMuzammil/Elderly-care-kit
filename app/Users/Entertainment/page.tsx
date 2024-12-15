'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from '../Navbar/page';

interface VideoData {
  title: string;
  description: string;
  url: string;
}

const Entertainment: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const videos: VideoData[] = [
    {
      title: 'YouTube Trending',
      description: 'Check out the latest trending videos on YouTube',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    },
    {
      title: 'YouTube Search',
      description: 'Search for any video on YouTube',
      url: 'https://www.youtube.com/embed/8BcPHWGQO44',
    },
  ];

  const handleSearch = () => {
    router.push(`https://www.youtube.com/results?search_query=${searchQuery}`);
  };

  return (
    <div>
      <div className="fixed top-0 left-0 right-0 z-50">
        <NavBar />
      </div>
      <div className="min-h-screen bg-gray-50 pt-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">YouTube</h1>
            <div className="flex items-center mb-6">
              <input
                type="text"
                className="flex-1 px-4 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search YouTube"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-md"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
            <div className="space-y-8">
              {videos.map((video, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{video.title}</h3>
                  <p className="text-gray-600 mb-4">{video.description}</p>
                  <div className="h-96 rounded-md overflow-hidden"> {/* Increased height */}
                    <iframe
                      src={video.url}
                      frameBorder="0"
                      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full" // Full width and height
                    ></iframe>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Entertainment;