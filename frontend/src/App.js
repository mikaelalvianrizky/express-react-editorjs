import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CodeForm from './components/CodeForm';
import CodeRenderer from './components/CodeRenderer';
import EditorWithNavigate from './components/Editor'; // Import the wrapped component
import ViewContent from './components/ViewContent';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<CodeForm />} />
                    <Route path="/render/:id" element={<CodeRenderer />} />
                    <Route path="/editor" element={<EditorWithNavigate />} /> {/* Use the wrapped component */}
                    <Route path="/view/:id" element={<ViewContent />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
