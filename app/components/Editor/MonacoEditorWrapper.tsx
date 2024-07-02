import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const MonacoEditor = dynamic(import('@monaco-editor/react'), { ssr: false });

const MonacoEditorWrapper = ({ language, code, onChange }: any) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null; // Or a loading indicator
    }

    return (
        <MonacoEditor
            height="60vh"
            language={language}
            theme="vs-dark"
            value={code}
            onChange={onChange}
        />
    );
};

export default MonacoEditorWrapper;
