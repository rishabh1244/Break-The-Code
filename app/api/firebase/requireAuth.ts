import { NextResponse } from "next/server";
import { adminAuth } from "./firebase-admin";
type AuthResult =
    | { user: any }
    | { error: Response };

export async function requireAuth(req: Request): Promise<AuthResult> {
    const authHeader = req.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
        return {
            error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
        };
    }

    const idToken = authHeader.slice(7);

    try {
        const user = await adminAuth.verifyIdToken(idToken);
        return { user };
    } catch {
        return {
            error: NextResponse.json({ error: "Invalid or expired token" }, { status: 401 }),
        };
    }
}

