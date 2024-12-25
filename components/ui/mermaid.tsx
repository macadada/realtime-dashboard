import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidProps {
  chart: string;
}

const Mermaid: React.FC<MermaidProps> = ({ chart }) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('Mermaid useEffect triggered with chart:', chart);

    if (elementRef.current) {
      try {
        console.log('Initializing mermaid...');
        mermaid.initialize({
          startOnLoad: true,
          theme: 'dark',
          securityLevel: 'loose',
          logLevel: 'debug',
        });

        console.log('Attempting to render diagram...');
        mermaid.render('mermaid-diagram', chart)
          .then(({ svg }) => {
            console.log('Diagram rendered successfully');
            if (elementRef.current) {
              elementRef.current.innerHTML = svg;
            }
          })
          .catch((error) => {
            console.error('Failed to render diagram:', error);
            if (elementRef.current) {
              elementRef.current.innerHTML = `<pre>Error rendering diagram: ${error.message}</pre>`;
            }
          });
      } catch (error) {
        console.error('Error in mermaid initialization:', error);
        if (elementRef.current) {
          elementRef.current.innerHTML = `<pre>Error initializing mermaid: ${error}</pre>`;
        }
      }
    }
  }, [chart]);

  return (
    <div className="mermaid-container">
      <div ref={elementRef} />
      {process.env.NODE_ENV === 'development' && (
        <pre className="text-xs text-muted-foreground mt-2">
          Raw diagram code:
          {chart}
        </pre>
      )}
    </div>
  );
};

export default Mermaid; 