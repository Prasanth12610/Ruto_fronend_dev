import React, { useRef, useEffect } from "react";
import "./InfiniteMovingCards.css";

const InfiniteMovingCards = () => {
  const containerRef = useRef(null);
  const scrollerRef = useRef(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const items = [
    {
      title: "4K Video Streaming",
      desc: "Stable 4K video at 30fps for remote multi-display monitoring and UI validation."
    },
    {
      title: "Audio Streaming & Analysis",
      desc: "High-fidelity real-time audio streaming with open-source analysis tools via Bluetooth, HDMI, USB, and 3.5mm."
    },
    {
      title: "Integrated Oscilloscope",
      desc: "Built-in oscilloscope with logic analyzer and waveform generator replacing traditional lab tools."
    },
    {
      title: "USB Over Network",
      desc: "Seamlessly access USB/serial devices remotely for VLSI, SoC, and FPGA debugging."
    },
    {
      title: "GUI Architecture",
      desc: "Custom-built standalone GUI supporting legacy tools with efficient documentation and workflow."
    }
  ];

  // Duplicate cards for seamless infinite effect
  const doubledItems = [...items, ...items];

  useEffect(() => {
    const container = containerRef.current;

    const handleMouseDown = (e) => {
      isDown.current = true;
      startX.current = e.pageX - container.offsetLeft;
      scrollLeft.current = container.scrollLeft;
      container.style.cursor = "grabbing";
    };

    const handleMouseLeave = () => {
      isDown.current = false;
      container.style.cursor = "grab";
    };

    const handleMouseUp = () => {
      isDown.current = false;
      container.style.cursor = "grab";
    };

    const handleMouseMove = (e) => {
      if (!isDown.current) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX.current) * 1.5; // drag speed
      container.scrollLeft = scrollLeft.current - walk;
    };

    container.addEventListener("mousedown", handleMouseDown);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("mousemove", handleMouseMove);

    return () => {
      container.removeEventListener("mousedown", handleMouseDown);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);
return (
  <div className="scroller" ref={containerRef}>
    <div className="scroller-inner" ref={scrollerRef}>
      {[...items, ...items].map((item, index) => {
        const themeClass =
          index % 3 === 0 ? 'white-theme' :
          index % 3 === 1 ? 'blue-theme' :
          'black-theme';

        return (
          <div key={index} className={`tile-card ${themeClass}`}>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        );
      })}
    </div>
  </div>
);
}
export default InfiniteMovingCards;
