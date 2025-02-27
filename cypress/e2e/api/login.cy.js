const apiConfig = require('../../config/apiConfig.js');

describe('User Authentication', () => {
  before(() => {
    cy.generateAuthToken('adminUser');
    cy.generateAuthToken('invalidUser');
  });

  it('Generate and retrieve a token for an admin user', () => {
    cy.getAuthToken('adminUser').then((token) => {
      expect(token).to.be.a('string');
      cy.log(`Retrieved token: ${token}`);
    });
  });

  it('Validate that the user cannot log in with invalid credentials', () => {
    cy.getAuthToken('invalidUser').then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body.error).to.eq('Invalid credentials');
    });
  });
});