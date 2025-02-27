const apiConfig = require('../config/apiConfig');

const apiRequest = (method, endpoint, options = {}) => {
  const { headers = {}, body, failOnStatusCode = false } = options;
  return cy.request({
    method,
    url: `${apiConfig.baseUrl}${endpoint}`,
    headers: { ...apiConfig.headers.default, ...headers },
    body,
    failOnStatusCode,
  });
};

module.exports = { apiRequest };
