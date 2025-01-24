import React, { useEffect, useState, useRef } from 'react';
import { invoke } from '@forge/bridge';

function App() {
  // We'll store the raw HTML/JS in a state variable
  const [code, setCode] = useState('');
  // We'll also keep a reference to the DOM container
  const containerRef = useRef(null);

  useEffect(() => {
    // 1. Ask the backend for the macro's code param
    invoke('getCode')
      .then((fetchedCode) => {
        setCode(fetchedCode);
      })
      .catch((err) => {
        console.error('Error fetching code:', err);
        setCode('<div style="color:red">Error loading code.</div>');
      });
  }, []);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    // 2. Inject the code as innerHTML
    containerRef.current.innerHTML = code;
    // 3. Re-run scripts
    runScriptsIn(containerRef.current);
  }, [code]);

  // Helper function that re-injects script tags
  const runScriptsIn = (container) => {
    const scriptTags = container.querySelectorAll('script');
    scriptTags.forEach((oldScript) => {
      const newScript = document.createElement('script');
      // Copy any attributes
      for (let i = 0; i < oldScript.attributes.length; i++) {
        const attr = oldScript.attributes[i];
        newScript.setAttribute(attr.name, attr.value);
      }
      // Copy script content
      newScript.appendChild(document.createTextNode(oldScript.innerHTML));
      // Replace old script
      oldScript.parentNode.replaceChild(newScript, oldScript);
    });
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h3>Custom HTML/JS Macro</h3>
      <div ref={containerRef} />
    </div>
  );
}

export default App;
