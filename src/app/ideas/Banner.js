"use client";
import React, { useEffect, useRef, useState } from "react";

export default function Banner() {
  const [offset, setOffset] = useState(0);
  const bannerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!bannerRef.current) return;
      const scrollY = window.scrollY;
      setOffset(scrollY * 0.4); // Parallax: gambar bergerak lebih lambat
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section ref={bannerRef} className="banner-section">
      {/* Gambar banner dengan parallax */}
      <div
        className="banner-img-wrap"
        style={{ transform: `translateY(${offset}px)` }}
      >
        <img
          src="/globe.svg"
          alt="Banner"
          className="banner-img"
          draggable={false}
        />
      </div>
      {/* Teks di atas gambar */}
      <div className="banner-content">
        <h1 style={{ fontSize: 40, fontWeight: 700, margin: 0, letterSpacing: 1 }}>
          Ideas
        </h1>
        <div style={{ fontSize: 20, fontWeight: 400, marginTop: 8, opacity: 0.92 }}>
          Where all our great things begin
        </div>
      </div>
    </section>
  );
} 