import React, { useState } from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import 'prismjs/components/prism-json';

function ScriptEditor({ onApplyScript }) {
    const [script, setScript] = useState(`{
        "geometry": "box",
        "material": {
            "color": "#0077ff"
        },
        "position": [0, 0, 0],
        "rotation": [0, 0, 0],
        "scale": [1, 1, 1]
    }`);
    const [error, setError] = useState(null);

    const handleApplyScript = () => {
        try {
            const parsedScript = JSON.parse(script);
            onApplyScript(parsedScript);
            setError(null);
        } catch (e) {
            setError(`Invalid JSON: ${e.message}`);
        }
    };

    return (
        <div style={{ marginBottom: '1rem' }}>
            <h3>Script Editor</h3>
            <Editor
                value={script}
                onValueChange={setScript}
                highlight={code => Prism.highlight(code, Prism.languages.json, 'json')}
                padding={10}
                style={{
                    fontFamily: '"Fira code", "Fira Mono", monospace',
                    fontSize: 14,
                    backgroundColor: '#f5f5f5',
                    borderRadius: '4px',
                    minHeight: '150px',
                    border: '1px solid #ddd',
                }}
            />
            <button onClick={handleApplyScript} style={{ marginTop: '10px', padding: '10px 20px', cursor: 'pointer' }}>
                Apply Script
            </button>
            {error && <pre style={{ color: 'red' }}>{error}</pre>}
        </div>
    );
}

export default ScriptEditor;
