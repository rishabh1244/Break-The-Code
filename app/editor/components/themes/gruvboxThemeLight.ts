
const gruvboxLightTheme = {
    base: "vs",
    inherit: true,

    rules: [
        { token: "", foreground: "2a2a28" },                 // charcoal text
        { token: "comment", foreground: "6f6c64", fontStyle: "italic" },
        { token: "keyword", foreground: "3b5374" },          // muted blue accent
        { token: "number", foreground: "6b4f7d" },           // muted plum
        { token: "string", foreground: "6a7b3f" },           // olive
        { token: "delimiter", foreground: "3f3f3b" },
        { token: "type", foreground: "7b5e2e" },             // brass
        { token: "function", foreground: "2f6f8f" },         // steel blue
        { token: "variable", foreground: "2a2a28" },
    ],

    colors: {
        /* Editor background — darker paper */
        "editor.background": "#e5dfcb",

        "editor.foreground": "#2a2a28",

        /* Cursor */
        "editorCursor.foreground": "#3b5374",

        /* Line highlight */
        "editor.lineHighlightBackground": "#dcd6c2",

        /* Line numbers */
        "editorLineNumber.foreground": "#7d796f",
        "editorLineNumber.activeForeground": "#3b5374",

        /* Selection */
        "editor.selectionBackground": "#cfc8b3",
        "editor.inactiveSelectionBackground": "#ddd6c3",

        /* Gutter */
        "editorGutter.background": "#e5dfcb",

        /* Brackets */
        "editorBracketMatch.background": "#cfc8b3",
        "editorBracketMatch.border": "#8f8a7e",

        /* Find */
        "editor.findMatchBackground": "#c6bfab",
        "editor.findMatchHighlightBackground": "#dbd4c1",

        /* Scrollbar */
        "scrollbarSlider.background": "#bfb8a555",
        "scrollbarSlider.hoverBackground": "#a9a39288",
        "scrollbarSlider.activeBackground": "#8f8a7ecc",
    },
}

export default gruvboxLightTheme;

