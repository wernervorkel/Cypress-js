module.exports = {
  baseUrl: 'https://apisforemployeecatalogmanagementsystem.onrender.com',
  endpoints: {
    login: '/hr/login',
    employees: '/employees',
  },
  headers: {
    default: {
      'Content-Type': 'application/json',
    },
  },
};
