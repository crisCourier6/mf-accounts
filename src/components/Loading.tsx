import React from 'react';
import Lottie from 'react-lottie-player'
import animationData from "../../public/loadingAnim2.json"; // Import the Lottie JSON

const Loading = () => {
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <Lottie
        loop
        animationData={animationData}
        play
        style={{ width: "20vw", height: "auto", maxWidth: 300 }}
    />
    </div>
  );
};

export default Loading;