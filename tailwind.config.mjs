/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ["Inter", ...defaultTheme.fontFamily.sans],
				serif: ["Lora", ...defaultTheme.fontFamily.serif],
			},
			colors: {
				'void': '#050505',
				'cyber': {
					purple: '#a855f7',
					blue: '#3b82f6',
					cyan: '#06b6d4',
					pink: '#ec4899',
					green: '#10b981',
				},
				'neon': {
					purple: '#c084fc',
					blue: '#60a5fa',
					cyan: '#22d3ee',
				}
			},
			fontSize: {
				'display': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
				'hero': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
			}
		},
	},
	plugins: [],
}
