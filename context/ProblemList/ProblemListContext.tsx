"use client";

import { createContext, useState } from "react";

type Problem = {
    slug: string;
    title?: string;
    difficulty?: string;
};

type ProblemListContextType = {
    problemList: Problem[];
    listProblems: () => Promise<void>;
};

const ProblemListContext = createContext<ProblemListContextType | null>(null);
const GITHUB_API = process.env.NEXT_PUBLIC_GITHUB_API!;

export function ProblemListProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [problemList, setProblemList] = useState<Problem[]>([]);

    const listProblems = async () => {


        try {
            const response = await fetch(GITHUB_API, {
                headers: {
                    Accept: "application/vnd.github+json",
                },
            });

            if (!response.ok) throw new Error("GitHub fetch failed");

            const data = await response.json();

            const problems: Problem[] = data.map((item: any) => ({
                slug: item.name,
                title: item.name.replace(/_/g, " "),
            }));

            setProblemList(problems);

        } catch (err) {
            console.error("Error fetching problems:", err);
        }


    };

    return (
        <ProblemListContext.Provider value={{ problemList, listProblems }}>
            {children}
        </ProblemListContext.Provider>
    );
}

export default ProblemListContext;

