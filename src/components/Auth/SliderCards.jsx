import React, { useState, useEffect } from "react";
import "./SliderCards.css";
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Import local images
import feature1 from "../../assets/4K Video Streaming.jpg";
import feature2 from "../../assets/Audio Streaming & Analysis.png";
import feature3 from "../../assets/Integrated Oscilloscope.png";
import feature4 from "../../assets/USB Over Network.png";
//import feature5 from "../../assets/GUI Architecture.jpg";

const SliderCards = () => {
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);

  const features = [
    {
      title: "4K Video Streaming",
      desc: "Stable 4K video at 30fps for remote multi-display monitoring and UI validation.",
      image: feature1,
    },
    {
      title: "Audio Streaming & Analysis",
      desc: "High-fidelity real-time audio streaming with open-source analysis tools via Bluetooth, HDMI, USB, and 3.5mm.",
      image: feature2,
    },
    {
      title: "Integrated Oscilloscope",
      desc: "Built-in oscilloscope with logic analyzer and waveform generator replacing traditional lab tools.",
      image: feature3,
    },
    {
      title: "USB Over Network",
      desc: "Seamlessly access USB/serial devices remotely for VLSI, SoC, and FPGA debugging.",
      image: feature4,
    },
    {
      title: "GUI Architecture",
      desc: "Custom-built standalone GUI supporting legacy tools with efficient documentation and workflow.",

    },
  ];

   const triggerFade = (updateIndex) => {
    setFade(false); // start fade out
    setTimeout(() => {
      updateIndex();        // update index
      setFade(true);        // fade in after update
    }, 300); // match CSS fade duration
  };

  const nextCard = () => {
    triggerFade(() => setCurrent((prev) => (prev + 1) % features.length));
  };

  const prevCard = () => {
    triggerFade(() => setCurrent((prev) => (prev - 1 + features.length) % features.length));
  };

   // Auto slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextCard();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
     <><>
      <div className="slider-container">
        <div className="slider-image">
          <img
            src={features[current].image}
            alt={features[current].title} />
        </div>
        <div className="slider-card">
          <h2>{features[current].title}</h2>
          <p>{features[current].desc}</p>
        </div>
      </div>
    </><div className="slider-buttons">
        <button onClick={prevCard}><ChevronLeft /></button>
        <button onClick={nextCard}><ChevronRight /></button>
      </div></>

  );
};

export default SliderCards;
