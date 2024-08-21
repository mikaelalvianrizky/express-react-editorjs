import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function CodeRenderer() {
    const { id } = useParams();
    const [code, setCode] = useState({ html: '', css: '', js: '' });

    useEffect(() => {
        const fetchCode = async () => {
            try {
                const response = await fetch(`http://localhost:5000/get-code/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    console.log('Fetched data:', data);
                    setCode(data);
                } else {
                    console.error('Failed to fetch code.');
                }
            } catch (error) {
                console.error('Error fetching code:', error);
            }
        };

        fetchCode();
    }, [id]);

    useEffect(() => {
        if (code.css) {
            const style = document.createElement('style');
            style.innerHTML = code.css;
            document.head.appendChild(style);

            return () => {
                document.head.removeChild(style);
            };
        }
    }, [code.css]);

    useEffect(() => {
        if (code.js) {
            const executeScript = () => {
                try {
                    // Create a script element and append the JS code to the document body
                    const script = document.createElement('script');
                    script.innerHTML = code.js;
                    document.body.appendChild(script);

                    return () => {
                        document.body.removeChild(script);
                    };
                } catch (error) {
                    console.error('Error executing script:', error);
                }
            };

            executeScript();
        }
    }, [code.js]);

    return (
        <div
            id="rendered-code"
            dangerouslySetInnerHTML={{ __html: code.html }}
        />
    );
}

export default CodeRenderer;
