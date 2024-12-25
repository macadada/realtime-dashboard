'use client'; // Ensures this runs only on the client in Next.js 13+

import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidProps {
  chart: string;
}

export default function Mermaid({ chart }: MermaidProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Prevent SSR or empty chart
    if (typeof window === 'undefined') return;
    if (!chart) return;
    if (!elementRef.current) return;

    // Clear any old diagram
    elementRef.current.innerHTML = '';

    // Create diagram container
    const container = document.createElement('div');
    container.classList.add('mermaid');
    container.textContent = chart;
    elementRef.current.appendChild(container);

    // Setup Mermaid
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      securityLevel: 'loose',
      // Disable transitions/animations to avoid layout race conditions
      themeVariables: {
        transitionDuration: '0',
      },
      flowchart: {
        curve: 'linear',
        rankSpacing: 50,
        nodeSpacing: 50,
      },
    });

    // Render after one animation frame
    requestAnimationFrame(() => {
      mermaid
        .run()
        .catch(error => {
          console.error('Failed to render mermaid diagram:', error);
          elementRef.current!.innerHTML = `<div>Failed to render diagram: ${error}</div>`;
        });
    });
  }, [chart]);

  return (
    <div
      ref={elementRef}
      style={{
        background: '#1a1a1a',
        padding: '1rem',
        borderRadius: '0.5rem',
        minWidth: '100px',
        minHeight: '100px',
      }}
    />
  );
} 