module.exports = {
    root: true,
    extends: "@react-native-community",
    parser: "@typescript-eslint/parser",
    plugins: [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:prettier/recommended",
    ],
    overrides: [
        {
            files: ["*.ts", "*.tsx"],
            rules: {
                "react-hooks/exhaustive-deps": "on",
                "no-var": "error",
                "prefer-arrow-callback": "error",
                "react/prop-types": "off",
                "no-extra-parens": "off",
                "prettier/prettier": [
                    "error",
                    {
                        endOfLine: "auto",
                    },
                ],
            },
        },
    ],
}
