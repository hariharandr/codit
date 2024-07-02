'use client';

import { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';

export default function CodeEditor({ language, code, onChange }: { language: string; code: string; onChange: (code: string) => void }) {
    const editorRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (editorRef.current) {
            const editor = monaco.editor.create(editorRef.current, {
                value: code,
                language,
                theme: 'vs-dark',
                automaticLayout: true
            });

            editor.onDidChangeModelContent(() => {
                onChange(editor.getValue());
            });

            return () => editor.dispose();
        }
    }, [editorRef.current]);

    return <div ref={editorRef} style={{ height: '100%', width: '100%' }} />;
}
