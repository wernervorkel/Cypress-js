const apiConfig = require('../../config/apiConfig.js');

describe('User Authentication', () => {
  before(() => {
    cy.generateAuthToken('adminUser');
    cy.generateAuthToken('invalidUser');
  });

  it('Generate and retrieve a token for an admin user', () => {
    //admin user login
    cy.getAuthToken('adminUser').then((token) => {
      expect(token).to.be.a('string');
      cy.log(`Retrieved token: ${token}`);
    });
  });

  it('Validate that the user cannot log in with invalid credentials', () => {
    //invalid user login
    cy.getAuthToken('invalidUser').then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body.error).to.eq('Invalid credentials');
    });
  });
});