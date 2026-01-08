const KEY = process.env.OPENROUTER_API_KEY;

if (!KEY) {
    throw new Error("OPENROUTER_API_KEY is missing");
}
export const chatLLM = async (prompt: string) => {
    const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${KEY}`,
                "Content-Type": "application/json",

                "HTTP-Referer": "http://localhost",
                "X-Title": "breakthecode-test",
            },
            body: JSON.stringify({
                model: "meta-llama/llama-3-8b-instruct",
                messages: [
                    { role: "user", content: prompt }
                ],
            }),
        }
    );
    return response.json();
}


