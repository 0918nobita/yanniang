import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
    content: ['./app/**/*.{ts,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Noto Sans SC', ...defaultTheme.fontFamily.sans],
            },
            animation: {
                'spin-slow': 'spin 2s linear infinite',
            },
        },
    },
} satisfies Config;
