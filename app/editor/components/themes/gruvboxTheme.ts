const gruvboxTheme = {
    base: "vs-dark",
    inherit: true,
    rules: [
        { token: "", foreground: "ebdbb2" },
        { token: "comment", foreground: "928374", fontStyle: "italic" },
        { token: "keyword", foreground: "fb4934" },
        { token: "number", foreground: "d3869b" },
        { token: "string", foreground: "b8bb26" },
        { token: "delimiter", foreground: "ebdbb2" },
        { token: "type", foreground: "fabd2f" },
        { token: "function", foreground: "83a598" },
    ],
    colors: {
        "editor.background": "#282828",
        "editor.foreground": "#ebdbb2",
        "editorCursor.foreground": "#fe8019",
        "editor.lineHighlightBackground": "#3c3836",
        "editorLineNumber.foreground": "#7c6f64",
        "editor.selectionBackground": "#504945",
        "editor.inactiveSelectionBackground": "#3c3836",
    },
};

export default gruvboxTheme;

