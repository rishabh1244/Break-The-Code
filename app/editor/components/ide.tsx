"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import gruvboxTheme from "./themes/gruvboxTheme";
import gruvboxLightTheme from "./themes/gruvboxThemeLight";
import "./styles/ide.css";

const Editor = dynamic(
    () => import("@monaco-editor/react"),
    { ssr: false }
);

export default function Ide({ fileName, metadata, code, setCode }) {


    const handleEditorDidMount = (editor, monaco) => {

        monaco.editor.defineTheme("gruvbox-dark", gruvboxTheme);
        monaco.editor.defineTheme("gruvbox-light", gruvboxLightTheme);

        const storedTheme = localStorage.getItem("theme") || "dark";
        monaco.editor.setTheme(
            storedTheme === "dark" ? "gruvbox-dark" : "gruvbox-light"
        );
    };

    const [leftWidth, setLeftWidth] = useState(360);
    const [showSidebar, setShowSidebar] = useState(true);

    const startDrag = (e: React.MouseEvent) => {
        const startX = e.clientX;
        const startWidth = leftWidth;

        const onMouseMove = (e: MouseEvent) => {
            const delta = e.clientX - startX;
            setLeftWidth(Math.max(200, startWidth + delta));
        };

        const onMouseUp = () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
    };
    const onCodeChange = (newCode) => {
        localStorage.setItem(`editor_code ${metadata.name}`, newCode);
        console.log(localStorage.getItem(`editor_code ${metadata.name}`));
    }



    if (!metadata) {
        return <div >Loading problem…</div>;
    }
    return (
        <div className="ide-wrapper">
            <div className="ide-topbar floating">
                <div className="ide-topbar-left">
                    <span className="ide-filename">{metadata.name}</span>
                </div>

                <div className="ide-topbar-right">
                    <button className="ide-btn run-btn">▶ Run</button>
                    <button className="ide-btn console-btn">▢ Console</button>
                </div>
            </div>
            <div className="ide-container">
                {showSidebar && (
                    <div
                        className="ide-spacer"
                        style={{ width: leftWidth }}
                    >
                        <div className="meta-panel">
                            <h1 className="meta-title">{metadata.name}</h1>

                            <p className="meta-desc">{metadata.description}</p>

                            <div className="meta-section">
                                <h3>Prompt</h3>
                                <p>{metadata.prompt}</p>
                            </div>

                            <div className="meta-section">
                                <h3>Tech</h3>
                                <span className="meta-pill">{metadata.Tech}</span>
                            </div>

                            {metadata.tags && (
                                <div className="meta_section">
                                    <h3 className="meta_heading">Tags</h3>
                                    <div className="meta_tags">
                                        {metadata.tags.map((tag: string) => (
                                            <span key={tag} className="meta_pill">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="meta-footer">
                                Author: <strong>{metadata.author}</strong>
                            </div>
                        </div>
                    </div>
                )}

                {showSidebar && (
                    <div
                        className="ide-divider"
                        onMouseDown={startDrag}
                    />
                )}

                <div className="ide-editor">
                    <button
                        className="sidebar-toggle"
                        onClick={() => setShowSidebar(prev => !prev)}
                    >
                        {showSidebar ? "⟨⟨" : "⟩⟩"}
                    </button>

                    <Editor
                        height="100%"
                        defaultLanguage="cpp"
                        value={localStorage.getItem(`editor_code ${metadata.name}`) ? localStorage.getItem(`editor_code ${metadata.name}`) : code}
                        onChange={(value) => {
                            onCodeChange(value);
                        }}
                        onMount={handleEditorDidMount}
                        options={{
                            fontSize: 14,
                            minimap: { enabled: false },
                            automaticLayout: true,
                            scrollBeyondLastLine: false,
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

