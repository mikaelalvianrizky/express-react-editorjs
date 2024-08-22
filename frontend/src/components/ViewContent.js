import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';

function ViewContent() {
    const { id } = useParams();
    const editorInstance = useRef(null);

    useEffect(() => {
        const fetchContent = async () => {
            const response = await fetch(`http://localhost:5000/code/${id}`);
            if (response.ok) {
                const data = await response.json();

                editorInstance.current = new EditorJS({
                    holder: 'editorjs',
                    tools: {
                        header: {
                            class: Header,
                            inlineToolbar: true,
                            config: {
                                placeholder: 'Enter a header',
                                levels: [1, 2, 3], // Specify header levels
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
                    readOnly: true,
                    data: data.content, // Use data.content directly without parsing
                });
            }
        };

        fetchContent();

        return () => {
            if (editorInstance.current) {
                editorInstance.current.destroy();
                editorInstance.current = null;
            }
        };
    }, [id]);

    return <div id="editorjs"></div>;
}

export default ViewContent;
