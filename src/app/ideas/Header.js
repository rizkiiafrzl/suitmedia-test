"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

const MENU = [
  { label: "Work", href: "#" },
  { label: "About", href: "#" },
  { label: "Services", href: "#" },
  { label: "Ideas", href: "/ideas" },
  { label: "Careers", href: "#" },
  { label: "Contact", href: "#" },
];

export default function Header() {
  const [show, setShow] = useState(true);
  const [lastScroll, setLastScroll] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 0);
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          setShow(y < lastScroll || y < 10);
          setLastScroll(y);
          ticking.current = false;
        });
        ticking.current = true;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line
  }, [lastScroll]);

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: "transform 0.3s cubic-bezier(.4,0,.2,1), background 0.3s",
        transform: show ? "translateY(0)" : "translateY(-100%)",
        background: scrolled
          ? "rgba(255, 102, 0, 0.92)"
          : "#ff6600",
        boxShadow: scrolled ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
      }}
    >
      <div className="header-inner">
        {/* Logo */}
        <div className="header-logo">
          <span style={{ color: "#fff" }}>suit</span>
          <span style={{ color: "#ffd600" }}>media</span>
        </div>
        {/* Menu */}
        <nav className="header-menu">
          {MENU.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              style={{
                color: item.label === "Ideas" ? "#fff" : "#fff9",
                fontWeight: item.label === "Ideas" ? 600 : 400,
                borderBottom: item.label === "Ideas" ? "3px solid #fff" : "none",
                padding: "4px 0",
                fontSize: 16,
                transition: "color 0.2s",
                textDecoration: "none",
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
} 