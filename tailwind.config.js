/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./templates/**/*.html", "./static/script/*.js"],
    theme: {
        extend: {
            colors: {
                bg: "var(--bg)",
                card: "var(--card)",
                ink: "var(--ink)",
                dim: "var(--dim)",
                faint: "var(--faint)",
                line: "var(--line)",
                soft: "var(--soft)",
                pen: "var(--pen)",
                "pen-soft": "var(--pen-soft)",
                mark: "var(--mark)",
                "mark-ink": "var(--mark-ink)",
                ok: "var(--ok)",
                low: "var(--low)",
            },
            fontFamily: {
                sans: [
                    "Noto Sans TC",
                    "PingFang TC",
                    "system-ui",
                    "sans-serif",
                ],
                mono: ["JetBrains Mono", "ui-monospace", "Menlo", "monospace"],
            },
            borderRadius: {
                sm: "var(--r-sm)",
                DEFAULT: "var(--r)",
                lg: "var(--r-lg)",
            },
        },
    },
    plugins: [],
};
