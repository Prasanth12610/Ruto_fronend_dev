import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ArcScrollCards.css";

gsap.registerPlugin(ScrollTrigger);

const cardData = [
  {
    title: "4K Video Streaming",
    desc: "Stable 4K video at 30fps for remote multi-display monitoring and UI validation.",
  },
  {
    title: "Audio Streaming & Analysis",
    desc: "High-fidelity real-time audio streaming with open-source analysis tools via Bluetooth, HDMI, USB, and 3.5mm.",
  },
  {
    title: "Integrated Oscilloscope",
    desc: "Built-in oscilloscope with logic analyzer and waveform generator replacing traditional lab tools.",
  },
  {
    title: "USB Over Network",
    desc: "Seamlessly access USB/serial devices remotely for VLSI, SoC, and FPGA debugging.",
  },
  {
    title: "GUI Architecture",
    desc: "Custom-built standalone GUI supporting legacy tools with efficient documentation and workflow.",
  }
];

const ArcScrollCards = () => {
  const containerRef = useRef();

  useEffect(() => {
    const cards = gsap.utils.toArray(".arc-card");

    gsap.to(cards, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top center",
        end: "bottom center",
        scrub: 1,
      },
      rotation: 360,
      ease: "none",
      stagger: {
        each: 0.2,
      },
    });
  }, []);

  return (
    <div className="arc-scroll-container" ref={containerRef}>
      <div className="arc">
        {cardData.map((card, i) => (
          <div key={i} className="arc-card">
            <h3>{card.title}</h3>
            <p>{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArcScrollCards;
