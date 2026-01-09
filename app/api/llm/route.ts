import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";


import { requireAuth } from "../firebase/requireAuth";
import { chatLLM } from "./api";

const generalPrompt = `
You are an expert competitive programming code-fixing engine.

Your task is to FIX the user's code so that it correctly solves the given problem.

STRICT RULES:
- Do NOT change the programming language.
- Make the MINIMAL changes required.
- Preserve the overall structure of the code.
- Do NOT rewrite the solution from scratch.
- The final code MUST compile and pass all tests.
- Do NOT include explanations outside JSON.
- Do NOT include markdown, comments, or extra text.

OUTPUT FORMAT (STRICT — NO EXTRA KEYS):
{
  "status": "fixed" | "unchanged" | "cannot_fix",
  "fixed_code": "<complete corrected source code or empty string>",
  "note": "<one-line reason or empty string>"
}

Return ONLY valid JSON matching this schema.
`;
const SRC_DIR = path.join(process.cwd(), "../btc-jobs", "problems");
const BASE_DIR = path.join(process.cwd(), "../btc-jobs", "llm_attempts")
/*
    const output = await chatLLM("HI WELCOME TO BREAK THE CODE")
    console.log(output.choices[0].message.content);
*/

async function exists(path: string): Promise<boolean> {
    try {
        await fs.access(path);
        return true;
    } catch {
        return false;
    }
}


export async function POST(req: Request) {

    //fireabase verification     
    const auth = await requireAuth(req);
    if ("error" in auth) return auth.error;

    const { problemName, filename } = await req.json()
    const probName = problemName.replace(/\s+/g, '_')

    //move folder to llm_attempts
    const from = path.join(SRC_DIR, probName);
    const to = path.join(BASE_DIR, probName);

    await fs.mkdir(BASE_DIR, { recursive: true });
    await fs.cp(from, to, { recursive: true });
    // collect metadata from fs
    const metadataPath = path.join(BASE_DIR, probName, "./metadata.json");
    const srcFilePath = path.join(SRC_DIR, probName, `./code/${filename}`);

    let file;
    try {
        file = await fs.readFile(metadataPath, "utf8");
    } catch (err) {
        console.error("Failed to read metadata:", err);

        return NextResponse.json(
            { error: "Metadata not found" },
            { status: 404 }
        );
    }
    let code;
    try {
        code = await fs.readFile(srcFilePath, "utf8");
    } catch (err) {
        console.error("Failed to read code:", err);
        return NextResponse.json(
            { error: "code not found" },
            { status: 404 }
        );
    }
    const metadata = JSON.parse(file);
    const LLMPrompt = generalPrompt + ` filename : ${filename} ${metadata.prompt} ${code}`;
    const result = await chatLLM(LLMPrompt);

    let parsed;
    try {
        parsed = JSON.parse(result.choices[0].message.content);
    } catch (err) {
        throw new Error("LLM returned invalid JSON");
    }
    const output = parsed.fixed_code;

    console.log(output);
    const outputFilePath = path.join(BASE_DIR, probName, `./code/${filename}`);
    await fs.writeFile(outputFilePath, output.toString());


    return NextResponse.json(
        {
            message: "ok"
        },
        { status: 200 }
    );

}
