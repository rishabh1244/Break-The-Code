// fetch the only problem file from github.com
// replace the main index file from the edited version of the user from localStorage 
//
import { NextResponse } from "next/server";

const OWNER = "rishabh1244";
const REPO = "problem-set";
const BRANCH = "main";

export async function GET(
    request: Request,
    { params }: { params: { slug: string } }
) {
    const { slug } = params;

    const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${slug}?ref=${BRANCH}`;

    const res = await fetch(url, {
        headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
        cache: "no-store",
    });

    if (!res.ok) {
        return NextResponse.json(
            { error: "Folder not found or GitHub error" },
            { status: res.status }
        );
    }

    const files = await res.json();

    return NextResponse.json({
        slug,
        files,
    });
}

