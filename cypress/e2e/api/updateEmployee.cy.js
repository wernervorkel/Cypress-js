const apiConfig = require('../../config/apiConfig.js');

describe('Employee Update Tests', () => {
  const invalidId = 'non-existent-id';
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
  
  before(() => {
    cy.generateAuthToken('adminUser');
    cy.generateAuthToken('invalidUser');
  });

  it('Verify that an employee has been successfully updated', () => {
    const newEmail = `spiderman_${epochTime}@example.com`;
    const updatedEmployeeData = {
        firstName: 'Spider',
        lastName: 'Man',
        dateOfBirth: '2011-11-11',
        contactInfo: {
          email: newEmail,
          phone: '+44123456890',
          address: {
              street: '20 Ingram Street',
              town: 'Forest Hills, Queens',
              postCode: 'S00 M99'
          }
        }
      };
    //create an employee
    cy.createEmployee('adminUser', employeeData).then((employeeResponse) => {
      const createdEmployeeId = employeeResponse.employeeId;
      cy.log(`Employee created with ID: ${createdEmployeeId}`);
      //update the employee
      cy.updateEmployee('adminUser', createdEmployeeId, updatedEmployeeData).then((employee) => {
        expect(employee.contactInfo.email).to.eq(newEmail);
        expect(employee.firstName).to.eq(updatedEmployeeData.firstName);
        expect(employee.lastName).to.eq(updatedEmployeeData.lastName);
        expect(employee.contactInfo.address.street).to.eq(updatedEmployeeData.contactInfo.address.street);
        expect(employee.contactInfo.address.town).to.eq(updatedEmployeeData.contactInfo.address.town);
        expect(employee.contactInfo.address.postCode).to.eq(updatedEmployeeData.contactInfo.address.postCode);
        expect(employee.contactInfo.phone).to.eq(updatedEmployeeData.contactInfo.phone);
        expect(employee.dateOfBirth).to.eq(updatedEmployeeData.dateOfBirth);
      });
      //check that the employee has been updated
      cy.getEmployee('adminUser', createdEmployeeId).then((employee) => {
        expect(employee.contactInfo.email).to.eq(newEmail);
        expect(employee.firstName).to.eq(updatedEmployeeData.firstName);
        expect(employee.lastName).to.eq(updatedEmployeeData.lastName);
        expect(employee.contactInfo.address.street).to.eq(updatedEmployeeData.contactInfo.address.street);
        expect(employee.contactInfo.address.town).to.eq(updatedEmployeeData.contactInfo.address.town);
        expect(employee.contactInfo.address.postCode).to.eq(updatedEmployeeData.contactInfo.address.postCode);
        expect(employee.contactInfo.phone).to.eq(updatedEmployeeData.contactInfo.phone);
        expect(employee.dateOfBirth).to.eq(updatedEmployeeData.dateOfBirth);
        expect(employee.employeeId).to.eq(createdEmployeeId);
      });
    });
  });

  // Skip this test, Fix validation for email, first name, and last name
  it.skip('Validate that the user cannot update an employee with a missing email', () => {
    const newEmail = `spiderman_${epochTime}@example.com`;
    const updatedEmployeeData = {
        firstName: 'New',
        lastName: 'Man',
        contactInfo: {
          email: '',
        }
      };

    cy.createEmployee('adminUser', employeeData).then((employeeResponse) => {
      const createdEmployeeId = employeeResponse.employeeId;
      cy.log(`Employee created with ID: ${createdEmployeeId}`);

      cy.updateEmployee('adminUser', createdEmployeeId, updatedEmployeeData).then((employee) => {
        expect(response.status).to.eq(400);
        expect(response.body.message).to.eq('Missing email');
      });
    });
  });

  it('Validate that the user cannot update an employee with an invalid token', () => {
    //First, check if the token is invalid, and then inspect the payload for any issues.
    cy.createEmployee('adminUser', employeeData).then((employeeResponse) => {
      const createdEmployeeId = employeeResponse.employeeId;
      cy.log(`Employee created with ID: ${createdEmployeeId}`);
      cy.updateEmployee('invalidUser', invalidId, {}).then((response) => {
        expect(response.status).to.eq(403);
        expect(response.body).to.eq('Forbidden');
      });
    });
  });

  it('Validate that the user cannot update an employee with a non-existent employee ID', () => {
    cy.updateEmployee('adminUser', invalidId, employeeData).then((response) => {
      expect(response.status).to.eq(404);
      expect(response.body.message).to.eq('Employee not found');
    });
  });
});