module.exports = {
  env: {
    browser: true,      // Enables browser globals like window, document
    node: true,         // Enables Node.js globals like process
    'cypress/globals': true  // Adds Cypress-specific globals (cy, expect, etc.)
  },
  extends: [
    'eslint:recommended',            // Base ESLint recommended rules
    'plugin:cypress/recommended',    // Cypress-specific recommended rules
    'plugin:prettier/recommended'    // Integrates Prettier with ESLint
  ],
  plugins: [
    'cypress',    // Cypress plugin
    'prettier'    // Prettier plugin
  ],
  rules: {
    // ESLint rules
    'no-unused-vars': ['error', { vars: 'all', args: 'after-used', ignoreRestSiblings: false }],
    
    // Prettier rules (let Prettier handle formatting)
    'indent': 'off',                  // Disable ESLint's indent rule (Prettier handles it)
    'quotes': 'off',                  // Disable ESLint's quotes rule (Prettier handles it)
    'semi': 'off',                    // Disable ESLint's semicolon rule (Prettier handles it)
    
    // Cypress-specific rules
    'cypress/no-assigning-return-values': 'error',
    'cypress/no-unnecessary-waiting': 'error',
    'cypress/assertion-before-screenshot': 'warn',
    'cypress/no-force': 'warn',
    'cypress/no-async-tests': 'error',
    
    // Prettier rule to catch formatting issues as ESLint errors
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,    // Prettier: Use single quotes
        semi: true,           // Prettier: Add semicolons
        tabWidth: 2,          // Prettier: 2-space indentation
        trailingComma: 'es5', // Prettier: Trailing commas where valid in ES5
        printWidth: 80        // Prettier: Line width
      }
    ]
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  }
};