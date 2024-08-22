import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function CodeRenderer() {
    const { id } = useParams();
    const [code, setCode] = useState({ html: '', css: '', js: '' });

    useEffect(() => {
        const fetchCode = async () => {
            const response = await fetch(`http://localhost:5000/code/${id}`);
            if (response.ok) {
                const data = await response.json();
                setCode(data);
            } else {
                console.error('Failed to fetch code.');
            }
        };

        fetchCode();
    }, [id]);

    useEffect(() => {
        // Inject CSS into the DOM
        const styleTag = document.createElement('style');
        styleTag.innerHTML = code.css;
        document.head.appendChild(styleTag);

        // Execute JavaScript after the DOM has been updated
        try {
            const scriptTag = document.createElement('script');
            scriptTag.innerHTML = code.js;
            document.body.appendChild(scriptTag);
        } catch (error) {
            console.error('Error executing script:', error);
        }

        return () => {
            // Cleanup injected style and script
            document.head.removeChild(styleTag);
        };
    }, [code.css, code.js]);

    return (
        <div id="rendered-code" dangerouslySetInnerHTML={{ __html: code.html }} />
    );
}

export default CodeRenderer;
