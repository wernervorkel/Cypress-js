# Cypress API Testing Framework

A modular Cypress framework for testing an API with token-based authentication, employee CRUD operations, and error handling.

## Project Structure

```
cypress/
├── e2e/
│ ├── api/
│ │ ├── createEmployee.cy.js # Tests employee creation
│ │ ├── deleteEmployee.cy.js # Tests employee deletion
│ │ ├── getEmployee.cy.js # Tests employee retrieval
│ │ ├── login.cy.js # Tests user login
│ │ └── updateEmployee.cy.js # Tests employee update
├── support/
│ ├── commands.js # Custom commands (token, CRUD ops)
│ ├── apiUtils.js # Api request call
│ └── index.js # Support file entry point
├── config/
│ ├── users.json # User credentials
│ └── apiConfig.js # API endpoints and config
└── cypress.config.js # Cypress configuration
```

## Prerequisites

- Node.js (v14+ recommended)
- Cypress (v10+)

## Setup

1. Clone the repository:

```

git clone https://github.com/wernervorkel/Cypress-js.git

```

2. Install dependencies:

```

npm install

```

## Running Tests

- Open Cypress interactively:

```
For Headless
npm run cypress:run

For Browser
npm run cypress:open

```

- Select `createEmployee.cy.js`, `getEmployee.cy.js`, `updateEmployee.cy.js`, `deleteEmployee.cy.js`, or `login.cy.js` from `e2e/api/`.
- Run all tests in headless mode:

```

npm run cypress:run --spec "cypress/e2e/api/\*_/_.cy.js"

```

## Features

- **Token Authentication**: Generates and stores tokens in memory for authenticated requests.
- **Employee CRUD**: Tests creation, retrieval, update and deletion of employees via `/employees` endpoint.
- **Error Handling**: Handles API errors (e.g., 500) without failing, returning the response for assertion.
- **Modular Tests**: Separate files for each operation, reusable via custom commands.
- **Isolated Test**: Ensuring each test runs independently in parallel, without affecting other tests.

## Custom Commands

- `cy.generateAuthToken(userKey)`: Generates a token for the specified user.
- `cy.getAuthToken(userKey)`: Retrieves a stored token.
- `cy.apiRequestWithToken(userKey, method, endpoint, options)`: Makes an authenticated API request (doesn’t fail on 500).
- `cy.createEmployee(userKey, employeeData)`: Creates an employee.
- `cy.getEmployee(userKey, employeeId)`: Retrieves an employee.
- `cy.deleteEmployee(userKey, employeeId)`: Deletes an employee.
- `cy.updateEmployee(userKey, employeeId, employeeData)`: Update an employee.

## Test Details

- **Employee Data**: Uses a random email (e.g., `peter_123456789@example.com`) for uniqueness.
- **Assertions**: Checks status codes and response bodies explicitly in tests.
- **No Cleanup**: Each test creates a unique employee; add `cy.deleteEmployee` in `after` hooks if needed.

## Troubleshooting

- **Token Issues**: Check logs for `Login status` and `Token generated`. Update `token` key in `commands.js` if your API differs (e.g., `access_token`).
- **API Errors**: Logs show status and body for debugging (e.g., `Response body: ...`).
- **Path Errors**: Ensure file paths match the structure (e.g., `../../config/apiConfig.js`).

## Notes

- There are several validation issues that need to be addressed in the PUT call, such as email, first name, and last name not being validated.
- In the POST call, the birthday is not being saved correctly, and there is no validation for the email format.
- There are no character length limits for fields in the PUT and POST calls.

```

```
