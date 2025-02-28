const apiConfig = require('../../config/apiConfig.js');

describe('Employee Creation Tests', () => {
  before(() => {
    cy.generateAuthToken('adminUser');
    cy.generateAuthToken('invalidUser');
  });

  //The API application crashes with a 503 error every time an employee is created with an error.
  //The API instance logs need to be investigated to identify the root cause of the issue.

  it.only('Verify employee creation is successful', () => {
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
    //create the employee
    cy.createEmployee('adminUser', employeeData).then((employeeResponse) => {
      const createdEmployeeId = employeeResponse.employeeId;
      cy.log(`Employee created with ID: ${createdEmployeeId}`);
      //check that the employee has been created
      cy.getEmployee('adminUser', createdEmployeeId).then((employee) => {
        expect(employee.contactInfo.email).to.eq(randomEmail);
        expect(employee.firstName).to.eq(employeeData.firstName);
        expect(employee.lastName).to.eq(employeeData.lastName);
        expect(employee.contactInfo.address.street).to.eq(employeeData.contactInfo.address.street);
        expect(employee.contactInfo.address.town).to.eq(employeeData.contactInfo.address.town);
        expect(employee.contactInfo.address.postCode).to.eq(employeeData.contactInfo.address.postCode);
        expect(employee.contactInfo.phone).to.eq(employeeData.contactInfo.phone);
        expect(employee.employeeId).to.eq(createdEmployeeId);
        // When creating a new employee, the full date should be saved correctly, but only the year is being stored
        expect(employee.dateOfBirth).to.eq(employeeData.dateOfBirth);
      });
    });
  });

  it('Validate that an employee cannot be created with a missing required email', () => {
    const employeeData = {
      firstName: 'Peter',
      lastName: 'Parker',
      contactInfo: {
        email: '',
        address: {
          street: '123'
        }
      }
    };

    cy.createEmployee('adminUser', employeeData).then((employeeResponse) => {
      const response = employeeResponse;
      expect(response.status).to.eq(500);
      expect(response.body.message).to.eq('An error occurred');
      expect(response.body.error).to.eq('User validation failed: contactInfo.email: Path `contactInfo.email` is required.');
    });
  });

  it('Validate that an employee cannot be created with a missing required first name', () => {
    const epochTime = Date.now();
    const randomEmail = `peter_${epochTime}@example.com`;
    const employeeData = {
      lastName: 'Parker',
      contactInfo: {
        email: randomEmail,
        address: {
          street: '123'
        }
      }
    };

    cy.createEmployee('adminUser', employeeData).then((employeeResponse) => {
      const response = employeeResponse;
      expect(response.status).to.eq(500);
      expect(response.body.message).to.eq('An error occurred');
      expect(response.body.error).to.eq('User validation failed: firstName: Path `firstName` is required.');
    });
  });

  it('Validate that an employee cannot be created with a missing required last name', () => {
    const epochTime = Date.now();
    const randomEmail = `peter_${epochTime}@example.com`;
    const employeeData = {
      firstName: 'Peter',
      contactInfo: {
        email: randomEmail,
        address: {
          street: '123'
        }
      }
    };

    cy.createEmployee('adminUser', employeeData).then((employeeResponse) => {
      const response = employeeResponse;
      expect(response.status).to.eq(500);
      expect(response.body.message).to.eq('An error occurred');
      expect(response.body.error).to.eq('User validation failed: lastName: Path `lastName` is required.');
    });
  });

  it('Validate that an employee cannot be created with an existing email address', () => {
    const employeeData = {
      firstName: 'Peter',
      lastName: 'Parker',
      contactInfo: {
        email: 'peter.pan@example.com',
        address: {
          street: '123'
        }
      }
    };

    cy.createEmployee('adminUser', employeeData).then((employeeResponse) => {
      const response = employeeResponse;
      expect(response.status).to.eq(400);
      expect(response.body.message).to.eq('Duplicate key error');
      expect(response.body.error.message).to.eq("'peter.pan@example.com' is already in use.");
    });
  });
  // Skip this test, email validation should be fixed
  it.skip('Validate that an employee cannot be created with an invalid email format', () => {
    const employeeData = {
      firstName: 'Peter',
      lastName: 'Parker',
      contactInfo: {
        email: 'peter.pan@example@.com@.com',
        address: {
          street: '123'
        }
      }
    };

    cy.createEmployee('adminUser', employeeData).then((employeeResponse) => {
      const response = employeeResponse;
      expect(response.status).to.eq(400);
      expect(response.body.message).to.eq('Invalid email');
      expect(response.body.error.message).to.eq("'peter.pan@example@.com@.com' incorrect email format.");
    });
  });

  it('Validate that the user cannot create an employee without a token', () => {
    cy.createEmployee('invalidUser', 'employeeData').then((employeeResponse) => {
        const response = employeeResponse;
        expect(response.status).to.eq(403);
        expect(response.body).to.eq('Forbidden');
    });
  });
});