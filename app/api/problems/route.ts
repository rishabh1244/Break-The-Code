import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const OWNER = "rishabh1244";
const REPO = "problem-set";
const BRANCH = "main";

import { requireAuth } from "../firebase/requireAuth";
const BASE_DIR = path.join(process.cwd(), "../btc-jobs", "problems");

import { compile_code } from "./compile";

type GitHubContentItem = {
    name: string;
    path: string;
    sha: string;
    type: "file" | "dir" | "symlink" | "submodule";
    download_url: string | null;
    url: string;
};

async function downloadDir(
    repoPath: string,
    localPath: string,
    shaObj: Record<string, string>,
    oldShaObj: Record<string, string>
) {
    fs.mkdirSync(localPath, { recursive: true });

    const res = await fetch(
        `https://api.github.com/repos/${OWNER}/${REPO}/contents/${repoPath}?ref=${BRANCH}`,
        {
            headers: {
                Accept: "application/vnd.github+json",
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            },
        }
    );

    if (!res.ok) {
        throw new Error(`Failed to fetch ${repoPath}`);
    }

    const items: GitHubContentItem[] = await res.json();

    for (const item of items) {
        const target = path.join(localPath, item.name);
        const relPath = item.path.replace(`${repoPath}/`, "");

        if (item.type === "dir") {
            await downloadDir(item.path, target, shaObj, oldShaObj);
            continue;
        }
        if (item.type === "file" && item.download_url) {
            if (oldShaObj[relPath] === item.sha) {
                shaObj[relPath] = item.sha;
                continue;
            }

            const fileRes = await fetch(item.download_url);
            const buf = Buffer.from(await fileRes.arrayBuffer());

            let shouldWrite = true;
            if (fs.existsSync(target)) {
                const existing = fs.readFileSync(target);
                shouldWrite = !buf.equals(existing);
            }

            if (shouldWrite) {
                fs.writeFileSync(target, buf);
            }

            shaObj[relPath] = item.sha;
        }
    }
}

export async function POST(req: Request) {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const { code, filename } = await req.json();

    //fireabase verification     
    const auth = await requireAuth(req);
    if ("error" in auth) return auth.error;

    try {


        if (!slug) {
            return NextResponse.json(
                { error: "Missing slug" },
                { status: 400 }
            );
        }
        const localPath = path.join(BASE_DIR, slug);

        let oldShaObj: Record<string, string> = {};
        const shaPath = path.join(localPath, ".sha.json");

        if (fs.existsSync(shaPath)) {
            const raw = fs.readFileSync(shaPath, "utf8");
            oldShaObj = JSON.parse(raw);
        }
        const shaObj: Record<string, string> = {};
        try {
            await downloadDir(slug, localPath, shaObj, oldShaObj);

            const shaPath = path.join(localPath, ".sha.json");
            const shaJson = JSON.stringify(shaObj, null, 2);

            fs.writeFileSync(shaPath, shaJson);
            fs.writeFileSync(path.join(localPath, `/code/${filename}`), code);

            const output = await compile_code("cpp", localPath.toString());

            return NextResponse.json({
                success: true,
                storedAt: localPath,
                message: output,
            });
        } catch (err: any) {
            return NextResponse.json(
                { error: err.message },
                { status: 500 }
            );
        }
    } catch (err) {
        return NextResponse.json(
            { error: "Invalid or expired token" },
            { status: 401 }
        );
    }
}

