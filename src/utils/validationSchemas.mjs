export const createUserValidationSchema = {
  username: {
    isLength: {
      options: { min: 3, max: 32 },
      errorMessage: "username must be between 3 and 32 characters!",
    },
    notEmpty: {
      errorMessage: "username must not be empty!",
    },
    isString: {
      errorMessage: "username must be a string!",
    },
  },
  displayName: {
    notEmpty: {
      errorMessage: "displayName must not be empty!",
    },
  },
};

export const getUsersValidationSchema = {
  filter: {
    notEmpty: {
      errorMessage: "filter must not be empty!",
    },
    isIn: {
      options: [["username", "displayName"]],
      errorMessage: "filter must be 'username' or 'displayName'",
    },
  },
  value: {
    notEmpty: {
      errorMessage: "No provided value",
    },
    isString: {
      errorMessage: "value must be a string!",
    },
    isLength: {
      options: { min: 3, max: 32 },
      errorMessage: "value must be between 3 and 32 characters!",
    },
  },
};
