///Routes
//https://www.youtube.com/watch?v=nH9E25nkk3I&list=WL&index=11&t=40s

import express, { request, response } from "express";
import {
  query,
  validationResult,
  body,
  matchedData,
  checkSchema,
} from "express-validator";
import {
  createUserValidationSchema,
  getUsersValidationSchema,
} from "./utils/validationSchemas.mjs";

const app = express();
app.use(express.json());

const loggingMiddleware = (request, response, next) => {
  const logObject = {
    method: request.method,
    url: request.url,
  };
  if (request.method === "PUT") {
    logObject.body = request.body;
  }
  if (request.method === "PATCH") {
    logObject.patch = request.body;
  }
  console.dir(logObject, { colors: true });
  next();
};

app.use(loggingMiddleware);

const resolveIndexByUserId = (request, response, next) => {
  const {
    params: { id },
  } = request;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return response.sendStatus(400);
  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
  if (findUserIndex === -1) return response.sendStatus(404);
  request.findUserIndex = findUserIndex;
  next();
};

const PORT = process.env.PORT || 3000;

//User Database
const mockUsers = [
  { id: 1, username: "morad90", displayName: "natulix" },
  { id: 2, username: "fredde90", displayName: "dragonslayer3000" },
  { id: 3, username: "kalle90", displayName: "blitzKrieg" },
];

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});

app.get("/", (request, response) => {
  response.status(201).send({ msg: "Hello world" });
});

//localhost:3000/api/users?filter=dfhggfdfg
//Validera sen.
app.get(
  "/api/users",
  checkSchema(getUsersValidationSchema),
  query("filter"),
  (request, response) => {
    const result = validationResult(request);
    if (!result.isEmpty()) {
      return response.status(400).json({ errors: result.array() });
    }
    console.log(result);
    const {
      query: { filter, value },
    } = request;
    //2. when defined -> http://localhost:3000/api/users?filter=username&value=mo
    //3. when defined -> http://localhost:3000/api/users?filter=displayName&value=mo
    if (filter && value)
      return response.send(
        mockUsers.filter((user) => user[filter].includes(value))
      );
    //3. else return all
    response.send(mockUsers);
  }
);

// ############################## POST / CREATE USER############################
app.post(
  "/api/users",
  // #### Schema Validation ####
  checkSchema(createUserValidationSchema),
  (request, response) => {
    const result = validationResult(request);
    console.log(result);

    if (!result.isEmpty())
      return response.status(400).send({ errors: result.array() });
    const data = matchedData(request);

    // eftersom vi inte har en DB tar vi sista användaren och lägger till en etta när vi ska skapa en användare med nytt id.
    const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data };
    mockUsers.push(newUser);
    return response.status(201).send(newUser);
  }
);
// ############################## GET / READ USER ############################
app.get("/api/users/:id", resolveIndexByUserId, (request, response) => {
  console.log(request.params);
  const { findUserIndex } = request;
  const findUser = mockUsers[findUserIndex];
  if (!findUser) return response.sendStatus(404);
  return response.send(findUser);
});

// app.get("/api/products", (request, response) => {
//   response.send([
//     { id: 11, product: "chair", price: 190 },
//     { id: 12, product: "table", price: 200 },
//     { id: 13, product: "flingor", price: 69 },
//   ]);
// });

// ############################## PUT / UPDATE USER ############################
app.put("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { body, findUserIndex } = request;
  mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
  return response.sendStatus(200);
});
// ############################## PATCH / UPDATE USER ############################
app.patch("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { body, findUserIndex } = request;
  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
  return response.sendStatus(200);
});
// ############################## DELETE / DELETE USER ############################
app.delete("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { findUserIndex } = request;
  mockUsers.splice(findUserIndex, 1);
  return response.sendStatus(200);
});

//http://localhost:3000
//http://localhost:3000/users
//http://localhost:3000/products
//http://localhost:3000/products?key=value&key2=value2
//http://localhost:3000/api/users?filter=moradmorad10length
