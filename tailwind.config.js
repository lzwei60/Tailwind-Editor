/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  safelist: [
    // Spacing utilities (padding, margin)
    {
      pattern:
        /^(p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr)-(0|0\.5|1|1\.5|2|2\.5|3|3\.5|4|5|6|7|8|9|10|11|12|14|16|20|24|28|32|36|40|44|48|52|56|60|64|72|80|96)$/,
    },
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
