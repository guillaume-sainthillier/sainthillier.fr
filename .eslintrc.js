module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: ['eslint:recommended', 'airbnb-base', 'plugin:prettier/recommended'],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    rules: {
        'import/no-extraneous-dependencies': 'off',
        'func-names': 'off',
        'no-plusplus': 'off',
        'no-use-before-define': 'off',
        'no-param-reassign': 'off',
        'no-underscore-dangle': 'off',
        'max-len': 'off',
        'no-shadow': 'off',
        'no-console': 'off',
        'consistent-return': 'off',
        'no-multi-assign': 'off',
        'no-nested-ternary': 'off',
        'no-undef': 'off',
    },
};
