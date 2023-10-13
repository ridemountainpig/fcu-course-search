/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./templates/*.{html,js}", "./static/script/*.{js}"],
    theme: {
        extend: {
            colors: {
                backgroundGreen: "#dfe7d5",
                backgroundBrown: "#E3CAA5",
                gradient1: "#FFABAB",
                gradient2: "#FEF2F4",
                gradient3: "#D9ACF5",
                gradient4: "#FDEBED",
            },
            width: {
                88: "22rem",
                100: "25rem",
            },
            height: {
                "70%": "70%",
                "80%": "80%",
                "90%": "90%",
                "95%": "95%",
                88: "22rem",
                92: "23rem",
            },
            margin: {
                "90%": "90%",
                30: "7.5rem",
                84: "21rem",
                88: "22rem",
                92: "23rem",
            },
            fontSize: {
                "4.5xl": "2.625rem",
            },
            animation: {
                "bounce-y": "bounce-y 1s infinite",
                "fade-in": "fade-in 0.5s ease-out",
            },
            keyframes: {
                "bounce-y": {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-25%)" },
                },
                "fade-in": {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
            },
            spacing: {
                26: "6.5rem",
            },
        },
        plugins: [],
    },
};
