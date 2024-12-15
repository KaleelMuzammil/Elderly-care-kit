import React from 'react';
import NavBar from '../Navbar/page';

const Camera: React.FC = () => {
  return (
    <div>
      <div className="fixed top-0 left-0 right-0 z-50">
        <NavBar />
      </div>
      <iframe
        src="http://10.70.74.53:5000/" 
        className="w-full h-screen mt-16" 
        title="Camera Frame"
        frameBorder="0"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default Camera;
