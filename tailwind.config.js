/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './layouts/**/*.html',
        './content/**/*.md',
        './assets/js/**/*.js',
    ],
    theme: {
        extend: {
            colors: {
                primary: '#fed136',
                'gray-900': '#212529',
                'gray-800': '#343a40',
                'gray-700': '#495057',
                'gray-600': '#6c757d',
                'gray-500': '#adb5bd',
                'gray-400': '#ced4da',
                'gray-300': '#dee2e6',
                'gray-200': '#e9ecef',
                'gray-100': '#f8f9fa',
            },
            fontFamily: {
                sans: ['"Google Sans"', 'sans-serif'],
            },
            fontWeight: {
                heading: '700',
            },
        },
    },
    plugins: [],
};
