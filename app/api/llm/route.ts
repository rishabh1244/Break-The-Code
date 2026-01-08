import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";


import { requireAuth } from "../firebase/requireAuth";
import { chatLLM } from "./api";

const BASE_DIR = path.join(process.cwd(), "../btc-jobs", "problems");
/*
    const output = await chatLLM("HI WELCOME TO BREAK THE CODE")
    console.log(output.choices[0].message.content);
*/
export async function POST(req: Request) {

    //fireabase verification     
    const auth = await requireAuth(req);
    if ("error" in auth) return auth.error;

    let { problemName } = await req.json()
    problemName = problemName.replace(/\s+/g, '_');;

    // collect metadata from fs
    const metadataPath = path.join(BASE_DIR, problemName, "./metadata.json");

    let file;
    try {
        file = fs.readFileSync(metadataPath, "utf8");
    } catch (err) {
        console.error("Failed to read metadata:", err);

        return NextResponse.json(
            { error: "Metadata not found" },
            { status: 404 }
        );
    }

    const metadata = JSON.parse(file);

    return NextResponse.json(
        { prompt: metadata.prompt },
        { status: 200 }
    );

}
