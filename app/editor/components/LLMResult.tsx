import styles from "./styles/output.module.css"


type TestResult = {
    input: string;
    status: "PASS" | "FAIL";
};
type ResultPayload =
    | {
        compiled: true;
        tests: TestResult[];
    }
    | {
        compiled: false;
        error: string;
    };

type LLMResultProps = {
    resultVal: ResultPayload;
    onClose: () => void;
    onBack: () => void;
};

const llmCompileFailComments = [
    "Didn’t even compile. Humans 1, AI 0.",
    "The AI folded at the compiler stage 💀",
    "Syntax beats intelligence.",
    "AI failed before it could even compete.",
    "Compiler said: no machines allowed.",
];

const comments = {
    perfect: [
        "The AI cooked. Not gonna lie 🤖🔥",
        "LLM cleared everything. Machines stay winning.",
        "No bugs. No mercy.",
        `Code saved.Can’t say the same about your job.`
    ],

    mixed: [
        "The AI stumbled… but didn’t fall 👀",
        "Almost perfect — even machines miss edge cases.",
        "Not bad for silicon and tokens.",
        "Close, but not unbeatable.",
    ],

    fail: [
        "The AI fumbled 💀",
        "Turns out intelligence is artificial.",
        "The model tried. The tests disagreed.",
        "Even the LLM couldn’t save this one.",
    ],

};

const LLMResult = ({ resultVal, onClose, onBack }: LLMResultProps) => {
    if (resultVal.compiled === false) {
        const comment =
            llmCompileFailComments[
            Math.floor(Math.random() * llmCompileFailComments.length)
            ];
        return (

            <div className={styles.backdrop}>
                <div className={styles.modal}>
                    <button className={styles.closeBtn} onClick={onClose}>
                        ✕
                    </button>

                    <h2 className={styles.title}>Compilation Failed</h2>
                    {/*
                        <span className={styles.input}>Compiled</span>
                        <span className={styles.status}>FAIL</span>
                    </div>
*/}
                    <div className={styles.errorBox}>
                        <pre className={styles.errorText}>
                            {resultVal.error}
                        </pre>
                    </div>
                    <div className={styles.comment}>
                        {comment}
                    </div>

                    <br />
                </div>
            </div>
        );
    }

    const tests = resultVal.tests;

    const fails = tests.filter(t => t.status === "FAIL").length;

    const commentPool =
        fails === 0
            ? comments.perfect
            : fails === tests.length
                ? comments.fail
                : comments.mixed;

    const comment =
        commentPool[Math.floor(Math.random() * commentPool.length)];

    return (
        <div className={styles.backdrop}>
            <div className={styles.modal}>
                <button className={styles.closeBtn} onClick={onClose}>
                    ✕
                </button>

                <h2 className={styles.title}>LLM Test Results</h2>
                <div className={styles.results}>

                    {tests.map((t, i) => (

                        <div
                            key={i}
                            className={`${styles.testBox} ${t.status === "PASS" ? styles.pass : styles.fail
                                }`}
                        >
                            <span className={styles.input}>{t.input}</span>
                            <span className={styles.status}>{t.status}</span>
                        </div>
                    ))}

                    <div className={styles.comment}>
                        {comment}
                    </div>
                    <button
                        onClick={onBack}
                        className={styles.backBtn}
                        aria-label="Back to your result"
                    >
                        ←
                    </button>

                </div>

            </div>
        </div>
    );



}

export default LLMResult
