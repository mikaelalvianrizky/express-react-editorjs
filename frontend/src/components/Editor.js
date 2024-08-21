import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import MathTex from 'editorjs-math'
import Paragraph from '@editorjs/paragraph';

function Editor() {
    const editorInstance = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!editorInstance.current) {
            const editor = new EditorJS({
                holder: 'editorjs',
                tools: {
                    math: {
                        class: MathTex, // for CDN: window.MathTex
                    },
                    header: {
                        class: Header,
                        inlineToolbar: true,
                        config: {
                            placeholder: 'Enter a header',
                            levels: [1, 2, 3],
                            defaultLevel: 2,
                        },
                    },
                    list: {
                        class: List,
                        inlineToolbar: true,
                        config: {
                            defaultStyle: 'unordered',
                        },
                    },
                    paragraph: {
                        class: Paragraph,
                        inlineToolbar: true,
                    },
                },
                autofocus: true,
                onReady: () => {
                    editorInstance.current = editor;
                },
            });
        }

        return () => {
            if (editorInstance.current) {
                editorInstance.current.isReady
                    .then(() => {
                        editorInstance.current.destroy();
                        editorInstance.current = null;
                    })
                    .catch((error) => console.error('Error destroying Editor.js instance:', error));
            }
        };
    }, []);

    const handleSave = async () => {
        if (editorInstance.current) {
            try {
                const outputData = await editorInstance.current.save();
                console.log('Captured content:', outputData);

                const response = await fetch('http://localhost:5000/save-editor-content', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ content: outputData }),
                });

                if (response.ok) {
                    const data = await response.json();
                    alert('Content saved successfully!');
                    console.log('Saved content ID:', data.id);
                    navigate(`/view/${data.id}`);
                } else {
                    alert('Failed to save content.');
                }
            } catch (error) {
                console.error('Error saving Editor.js content:', error);
            }
        }
    };

    return (
        <div>
            <div id="editorjs"></div>
            <button onClick={handleSave}>Save</button>
        </div>
    );
}

export default Editor;
