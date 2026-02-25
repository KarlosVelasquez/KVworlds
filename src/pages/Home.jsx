import React from 'react';
import Spline from '@splinetool/react-spline';
import './Home.css';

export default function Home() {
  return (
    <main className="home-main">
      <div className="home-spline-bg">
        <Spline scene="https://draft.spline.design/xpUC1eE2kM7-A1-Z/scene.splinecode" style={{ width: '100vw', height: '100vh' }} />
      </div>
      <div className="hide-watermark-btn">
        logo de mi
      </div>
    </main>
  );
}

