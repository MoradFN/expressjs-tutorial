// POST http://localhost:3000/api/users
// {
//   "username": "sss",
//   "displayName": "sadasd"
// }

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
// ############## GET / READ USER ############################
// GET
//localhost:3000/api/users
// http://localhost:3000/api/users?filter=username&value=mor
//localhost:3000/api/users?filter=displayName&value=dra
export const getUsersValidationSchema = {
  filter: {
    optional: true,
    custom: {
      options: (value, { req }) => (value && req.query.value ? true : false),
      errorMessage: [
        "no value provided after filter",
        "examples below:",
        "/api/users?filter=username&value=mor",
        "/api/users?filter=displayName&value=dra",
        "redirect back to all users below:",
        "/api/users",
      ],
    },
    isIn: {
      options: [["username", "displayName"]],
      errorMessage: [
        "filter must contain either 'username' or 'displayName!",
        "examples below:",
        "/api/users?filter=username&value=mor",
        "/api/users?filter=displayName&value=dra",
        "redirect back to all users below:",
        "/api/users",
      ],
    },
  },
  value: {
    optional: true,
    custom: {
      options: (value, { req }) => (value && req.query.filter ? true : false),
      errorMessage: [
        "no filter provided before value!",
        "examples below:",
        "/api/users?filter=username&value=mor",
        "/api/users?filter=displayName&value=dra",
        "redirect back to all users below:",
        "/api/users",
      ],
    },
    isString: {
      errorMessage: "value must be a string!",
    },
    isLength: {
      options: { min: 3, max: 32 },
      errorMessage: [
        "value must be between 3 and 32 characters!",
        "examples below:",
        "/api/users?filter=username&value=mor",
        "/api/users?filter=displayName&value=dra",
        "redirect back to all users below:",
        "/api/users",
      ],
    },
  },
};
