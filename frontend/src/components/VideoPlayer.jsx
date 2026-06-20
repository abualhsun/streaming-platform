import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VideoPlayer = ({ videoUrl, title, onProgress }) => {
  const videoRef = React.useRef(null);

  const handleTimeUpdate = () => {
    if (videoRef.current && onProgress) {
      onProgress({
        currentTime: videoRef.current.currentTime,
        duration: videoRef.current.duration
      });
    }
  };

  return (
    <div className="w-full bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        onTimeUpdate={handleTimeUpdate}
        className="w-full h-full"
        controls
        controlsList="nodownload"
      >
        <source src={videoUrl} type="video/mp4" />
        متصفحك لا يدعم تشغيل الفيديو
      </video>
    </div>
  );
};

export default VideoPlayer;
