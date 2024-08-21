import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CodeForm() {
    const [html, setHtml] = useState('');
    const [css, setCss] = useState('');
    const [js, setJs] = useState('');
    const navigate = useNavigate();  // Replaced useHistory with useNavigate

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:5000/save-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ html, css, js }),
        });

        if (response.ok) {
            const data = await response.json();
            alert('Code saved successfully!');
            // Redirect to the render page with the new code ID
            const codeId = data.id; // Assuming the server returns the saved code's ID
            console.log(data);
            navigate(`/render/${codeId}`);  // Replaced history.push with navigate
        } else {
            alert('Failed to save code.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>HTML:</label>
                <textarea value={html} onChange={(e) => setHtml(e.target.value)} />
            </div>
            <div>
                <label>CSS:</label>
                <textarea value={css} onChange={(e) => setCss(e.target.value)} />
            </div>
            <div>
                <label>JS:</label>
                <textarea value={js} onChange={(e) => setJs(e.target.value)} />
            </div>
            <button type="submit">Save Code</button>
        </form>
    );
}

export default CodeForm;
