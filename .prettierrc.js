module.exports = {
    singleQuote: true,
    printWidth: 80,
    tabWidth: 4,
    overrides: [
        {
            files: ['*.yaml', '*.yml'],
            options: {
                tabWidth: 2,
            },
        },
    ],
};
