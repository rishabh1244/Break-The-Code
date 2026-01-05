
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import problemStyles from "./styles/problemStyles.module.css";

import ToggleTheme from "../components/toggle_theme/ToggleTheme";
import Navbar from "../components/navbar/Navbar";
import Ide from "./components/ide";

const GITHUB_API = process.env.NEXT_PUBLIC_GITHUB_API!;

export default function EditorPage() {
    const params = useSearchParams();
    const slug = params.get("slug");

    const [fileName, setFileName] = useState<string | null>(null);
    const [code, setCode] = useState<string>("");
    const [metadata, setMetadata] = useState<string>("");
    useEffect(() => {
        if (!slug) return;

        const fetchSource = async () => {
            try {
                const codeRes = await fetch(`${GITHUB_API}/${slug}/code`);
                if (!codeRes.ok) throw new Error("Failed to fetch code dir");

                const codeData = await codeRes.json();

                const codeFiles = codeData.filter(
                    (f: any) => f.type === "file"
                );

                if (codeFiles.length !== 1) {
                    throw new Error("Exactly one source file required in /code");
                }
                const srcFile = codeFiles[0];

                const metaRes = await fetch(
                    `${GITHUB_API}/${slug}/metadata.json`
                );
                if (!metaRes.ok) throw new Error("metadata.json missing");

                const metaJson = await metaRes.json();

                const [codeText, metaText] = await Promise.all([
                    fetch(srcFile.download_url).then(r => r.text()),
                    fetch(metaJson.download_url).then(r => r.text())
                ]);

                setFileName(srcFile.name);
                setCode(codeText);
                setMetadata(metaText);
            } catch (err) {
                console.error(err);
            }
        };

        fetchSource();
    }, [slug]);
    if (!slug) return <div>No slug provided.</div>;
    if (!fileName) return <div>Loading...</div>;

    return (
        <div className={problemStyles.page}>
            <Navbar></Navbar>


            <Ide
                fileName={fileName}
                metadata={JSON.parse(metadata)}
                code={code}
                setCode={setCode}
            />
            <ToggleTheme />
        </div>
    );
}

