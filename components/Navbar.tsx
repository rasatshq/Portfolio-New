"use client";
import { useState, useEffect, useRef } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";

const links = [{ label: "Projects", href: "#projects" }, { label: "About", href: "#about" }, { label: "Experience", href: "#experience" }, { label: "Skills", href: "#skills" }];
export function Navbar() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); toggle.current?.focus(); }
    };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [open]);
  return (
    <header className="site-header">
      <div className="nav-inner">
        <a href="#top" className="wordmark" aria-label="Rashad home">Rashad<span>.</span></a>
        <nav className="desktop-nav" aria-label="Main navigation">{links.map(link => <a key={link.href} href={link.href}>{link.label}</a>)}</nav>
        <a href="#contact" className="nav-contact">Let’s Talk <ArrowUpRight size={16} /></a>
        <button ref={toggle} className="menu-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-navigation" aria-label="Toggle navigation menu">{open ? <X /> : <Menu />}</button>
      </div>
      {open && <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">{[...links, {label: "Contact", href: "#contact"}].map(link => <a href={link.href} key={link.href} onClick={() => setOpen(false)}>{link.label}<ArrowUpRight size={16} /></a>)}</nav>}
    </header>
  );
}
