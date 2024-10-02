import simpleImportSort from "eslint-plugin-simple-import-sort";

export default [
    {
        plugins: {
            "simple-import-sort": simpleImportSort,
        },
        rules: {
            "simple-import-sort/imports": "error",
            "simple-import-sort/exports": "error",
            "semi": ["error", "always"],
            "quotes": ["error", "double", { "avoidEscape": true }],
            "semi-style": ["error", "last"],
        }
    }
];
