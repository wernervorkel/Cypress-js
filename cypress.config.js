const { defineConfig } = require('cypress');

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  video: false,
  screenshotOnRunFailure: false,
  reporterOptions: {
    charts: true,
    reportPageTitle: 'Api test results',
    embeddedScreenshots: false,
    inlineAssets: true,
    saveAllAttempts: false,
  },
  e2e: {
    baseUrl: 'https://apisforemployeecatalogmanagementsystem.onrender.com', // Replace with your API base URL
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/index.js',
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
    }
  }
});