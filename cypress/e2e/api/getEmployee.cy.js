const apiConfig = require('../../config/apiConfig.js');

describe('Employee Retrieval Tests', () => {
  const invalidId = 'non-existent-id';
  before(() => {
    cy.generateAuthToken('adminUser');
    cy.generateAuthToken('invalidUser');
  });

  it('Create and retrieve an employee', () => {
    const epochTime = Date.now();
    const randomEmail = `peter_${epochTime}@example.com`;
    const employeeData = {
      firstName: 'Peter',
      lastName: 'Parker',
      dateOfBirth: '',
      contactInfo: {
        email: randomEmail,
        address: {
            street: '123',
        }
      }
    };

    cy.createEmployee('adminUser', employeeData).then((employeeResponse) => {
      const createdEmployeeId = employeeResponse.employeeId;
      cy.log(`Employee created with ID: ${createdEmployeeId}`);

      cy.getEmployee('adminUser', createdEmployeeId).then((employee) => {
        expect(employee.contactInfo.email).to.eq(randomEmail);
        expect(employee.firstName).to.eq(employeeData.firstName);
        expect(employee.lastName).to.eq(employeeData.lastName);
        expect(employee.contactInfo.address.street).to.eq(employeeData.contactInfo.address.street);
        expect(employee.employeeId).to.eq(createdEmployeeId);
      });
    });
  });

  it('Validate that the user cannot retrieve an employee with an invalid employee ID', () => {
    cy.getEmployee('adminUser', invalidId).then((response) => {
      expect(response.status).to.eq(404, 'Expected error for invalid ID');
      expect(response.body.message).to.eq('Employee not found');
    });
  });

  it('Validate that the user cannot retrieve an employee with an invalid token', () => {
    cy.getEmployee('invalidUser', invalidId).then((response) => {
      expect(response.status).to.eq(403, 'Expected error for invalid token');
      expect(response.body).to.eq('Forbidden');
    });
  });
});