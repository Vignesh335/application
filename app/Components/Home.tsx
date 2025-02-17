import React, { useState, useEffect } from 'react';

const Home = () => {
  const [index, setIndex] = useState(0);
  const strings = ['pregnant', 'village', 'oldWomen', 'child', 'widow'];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % strings.length);
    }, 5500);

    return () => clearInterval(interval);
  }, []);

  const getImageSrc = () => {
    switch (index) {
      case 0:
        return '/assets/images/Pregnant.gif';
      case 1:
        return '/assets/images/village.gif';
      case 2:
        return '/assets/images/agedWomen.gif';
      case 3:
        return '/assets/images/student.gif';
      case 4:
        return '/assets/images/widowWomen.gif';
      default:
        return '/assets/images/student.gif';
    }
  };

  return (
    <div className="home-cont">
      <center>
        <div style={{ margin: '5% 0 5% 0' }} id="textdata">
          <div className="trigger" style={{ justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ justifyContent: 'center', display: 'flex' }} className="inner-crown">
              <div className="outer-crown" style={{ display: 'grid' }}>
                <img src={getImageSrc()} className="crown-img" alt="" data-parallax="{&quot;x&quot; : 60 }" style={{ width: '100%', animation: 'flip 0.8s linear' }} />
                <div style={{ width: '100%', zIndex: 1000, height: '100px', marginTop: '-45%' }} id="textdata"></div>
              </div>
            </div>
          </div>
        </div>
      </center>
      <div id="marquee-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div id="marquee-content">
          <video autoPlay muted loop style={{ height: '120px', width: '120px' }}>
            <source src="/assets/images/walking.mp4" type="video/mp4" />
          </video>
          <div className="my-text">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;𝐻𝒾👋🏻... 𝒲𝑒𝓁𝒸𝑜𝓂𝑒 𝓉𝑜 𝑜𝓊𝓇 𝒫𝒶𝑔𝑒
            𝒫𝓁𝑒𝒶𝓈𝑒 𝓈𝒾𝑔𝓃 𝐼𝓃 𝓉𝑜 𝒮𝑒𝑒 𝒪𝓊𝓇 𝒜𝒸𝓉𝒾𝓋𝒾𝓉𝒾𝑒𝓈.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;