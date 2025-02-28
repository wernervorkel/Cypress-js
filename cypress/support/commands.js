//const users = require('../config/users.json');
const apiConfig = require('../config/apiConfig');
const { apiRequest } = require('./apiUtils');

let tokenStore = {};
let responseStore;

// this needs to be in a json file.
const users = {
  "adminUser": {
    "username": "admin5",
    "password": "securePassword"
  },
  "invalidUser": {
    "username": "admin2",
    "password": "password"
  }
}
// Generate a token for the specified user
Cypress.Commands.add('generateAuthToken', (userKey = 'adminUser') => {
  const user = users[userKey];
  if (!user) {
    throw new Error(`User "${userKey}" not found in config/users.json`);
  }

  cy.log(`Generating token for ${userKey}`);

  return cy
    .request({
      method: 'POST',
      url: `${apiConfig.baseUrl}${apiConfig.endpoints.login}`,
      body: {
        username: user.username,
        password: user.password,
      },
      failOnStatusCode: false,
    })
    .then((response) => {
      if (response.status === 200) {
        expect(response.status).to.eq(200, 'Expected successful login');
        const token = response.body.token;
        expect(token).to.exist.and.to.be.a('string', 'Expected a valid token');

        tokenStore[userKey] = token;
      } else {
        responseStore = response;
      }
    });
});
// Get the token for the specified user
Cypress.Commands.add('getAuthToken', (userKey = 'adminUser') => {
  if (userKey === 'adminUser') {
    const token = tokenStore[userKey];
    return cy.wrap(token);
  } else {
    const response = responseStore;
    return cy.wrap(response);
  }
});

Cypress.Commands.add(
  'apiRequestWithToken',
  (userKey, method, endpoint, options = {}) => {
    return cy.getAuthToken(userKey).then((token) => {
      const { headers = {}, ...rest } = options;
      return apiRequest(method, endpoint, {
        headers: { Authorization: `Bearer ${token}`, ...headers },
        ...rest,
      });
    });
  }
);
// API: Create an employee
Cypress.Commands.add('createEmployee', (userKey, employeeData) => {
  return cy
    .apiRequestWithToken(userKey, 'POST', apiConfig.endpoints.employees, {
      body: employeeData,
    })
    .then((response) => {
      if (response.status === 201) {
        expect(response.status).to.eq(
          201,
          'Expected employee creation to succeed'
        );
        return response.body;
      } else {
        return response;
      }
    });
});
//API: Get an employee
Cypress.Commands.add('getEmployee', (userKey, employeeId) => {
  return cy
    .apiRequestWithToken(
      userKey,
      'GET',
      `${apiConfig.endpoints.employees}/${employeeId}`
    )
    .then((response) => {
      if (response.status === 200) {
        expect(response.status).to.eq(
          200,
          'Expected employee retrieval to succeed'
        );
        return response.body;
      } else {
        return response;
      }
    });
});
//API: Delete an employee
Cypress.Commands.add('deleteEmployee', (userKey, employeeId) => {
  return cy
    .apiRequestWithToken(
      userKey,
      'DELETE',
      `${apiConfig.endpoints.employees}/${employeeId}`
    )
    .then((response) => {
      if (response.status === 200) {
        expect(response.status).to.eq(
          200,
          'Expected employee deletion to succeed'
        );
        return response.body;
      } else {
        return response;
      }
    });
});
//API: Update an employee
Cypress.Commands.add('updateEmployee', (userKey, employeeId, employeeData) => {
  return cy
    .apiRequestWithToken(userKey, 'PUT', `${apiConfig.endpoints.employees}/${employeeId}`, {
      body: employeeData,
    })
    .then((response) => {
      if (response.status === 200) {
        expect(response.status).to.eq(
          200,
          'Employee updated successfully'
        );
        return response.body.user;
      } else {
        return response;
      }
    });
});
