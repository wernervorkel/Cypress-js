const apiConfig = require('../../config/apiConfig.js');

describe('Employee Update Tests', () => {
  const invalidId = 'non-existent-id';
  before(() => {
    cy.generateAuthToken('adminUser');
    cy.generateAuthToken('invalidUser');
  });

  it('Delete and verify that the employee has been successfully removed', () => {
    const epochTime = Date.now();
    const randomEmail = `peter_${epochTime}@example.com`;
    const employeeData = {
      firstName: 'Peter',
      lastName: 'Parker',
      dateOfBirth: '2010-01-13',
      contactInfo: {
        email: randomEmail,
        phone: '+4434567890',
        address: {
            street: '123',
            town: 'Manchester',
            postCode: 'M12 3T2'
        }
      }
    };

    cy.createEmployee('adminUser', employeeData).then((employeeResponse) => {
      const createdEmployeeId = employeeResponse.employeeId;
      cy.log(`Employee created with ID: ${createdEmployeeId}`);
      //delete the employee
      cy.deleteEmployee('adminUser', createdEmployeeId).then((response) => {
        expect(response.message).to.eq('Employee deleted successfully!');
      });
      //check that the employee has been updated
      cy.getEmployee('adminUser', createdEmployeeId).then((response) => {
        expect(response.status).to.eq(404, 'Expected error for invalid ID');
        expect(response.body.message).to.eq('Employee not found');
      });
    });
  });

  it('Validate that the user cannot delete an employee with an invalid token', () => {
      //First, check if the token is invalid, and then inspect the payload for any issues.
      cy.deleteEmployee('invalidUser', invalidId).then((response) => {
        expect(response.status).to.eq(403);
        expect(response.body).to.eq('Forbidden');
      });
  });

  it('Validate that the user cannot delete an employee with a non-existent employee ID', () => { 
    cy.deleteEmployee('adminUser', invalidId).then((response) => {
      expect(response.status).to.eq(404);
      expect(response.body.message).to.eq('Employee not found');
    });
  });
});