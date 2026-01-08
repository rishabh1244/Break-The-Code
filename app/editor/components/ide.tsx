"use client";

import dynamic from "next/dynamic";
import { useEffect, useEffectEvent, useState } from "react";

import gruvboxTheme from "./themes/gruvboxTheme";
import gruvboxLightTheme from "./themes/gruvboxThemeLight";

import Outputmodal from "./Outputmodal";
import { auth } from "@/app/api/firebase/config";
import "./styles/ide.css";

const Editor = dynamic(
    () => import("@monaco-editor/react"),
    { ssr: false }
);

export default function Ide({ fileName, metadata, code, setCode }) {
    const handleEditorDidMount = async (editor, monaco) => {

        monaco.editor.defineTheme("gruvbox-dark", gruvboxTheme);
        monaco.editor.defineTheme("gruvbox-light", gruvboxLightTheme);

        const storedTheme = localStorage.getItem("theme") || "dark";
        monaco.editor.setTheme(
            storedTheme === "dark" ? "gruvbox-dark" : "gruvbox-light"
        );

    };

    const [leftWidth, setLeftWidth] = useState(360);
    const [showSidebar, setShowSidebar] = useState(true);

    const [showOutput, setShowOutput] = useState(false);
    const [resultVal, setResult] = useState<any>(null);

    const [isRunning, setIsRunning] = useState(false);

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
    }

    const RunCode = async () => {
        const user = auth.currentUser;

        if (!user) {
            console.log("Not logged in");
            return;
        }
        setIsRunning(true);
        const code = localStorage.getItem(`editor_code ${metadata.name}`);

        const body: any = {
            filename: fileName,
        };

        if (code !== null) {
            body.code = code;
        }

        const token = await user.getIdToken();
        const res = await fetch(`/api/problems?slug=${metadata.name.replace(/ /g, "_")}`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, },
            body: JSON.stringify(body),
        })
        const data = await res.json();
        setResult(data.message);
        setShowOutput(true);
        setIsRunning(false);
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
                    <button
                        className="ide-btn run-btn"
                        onClick={RunCode}
                        disabled={isRunning}
                    >
                        {isRunning ? (
                            <span className="run-loading">
                                <span className="loader" />
                                Running
                            </span>
                        ) : (
                            "▶ Run"
                        )}
                    </button>

                    <button className="ide-btn console-btn" onClick={() => { setShowOutput(true) }}>Output</button>
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
            {showOutput && resultVal && (
                <Outputmodal
                    resultVal={resultVal}
                    onClose={() => setShowOutput(false)}
                />
            )}
        </div>
    );
}

