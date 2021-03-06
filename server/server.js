const express = require("express");
const path = require("path");
var cors = require("cors");
const { ApolloServer, gql } = require("apollo-server-express");
const app = express();

let todos = [
  {
    id: Date.now().toString(),
    text: "Hello from GraphQL",
    completed: true,
  },
];

const typeDefs = gql`
  type Todo {
    id: String
    text: String
    completed: Boolean
  }
  type Query {
    todos: [Todo]!
  }
  type Mutation {
    createTodo(text: String!): String
    removeTodo(id: String!): String
    updateTodo(id: String!): String
  }
`;

const resolvers = {
  Query: {
    todos: () => todos,
  },
  Mutation: {
    createTodo: (parent, args, context, info) => {
      return todos.push({
        id: Date.now().toString(),
        text: args.text,
        completed: false,
      });
    },
    removeTodo: (parent, args, context, info) => {
      for (let i in todos) {
        if (todos[i].id === args.id) {
          todos.splice(i, 1);
        }
      }
      return args.id;
    },
    updateTodo: (parent, args, context, info) => {
      for (let i in todos) {
        if (todos[i].id === args.id) {
          todos[i].completed = !todos[i].completed;
        }
      }
      return args.id;
    },
  },
};
const server = new ApolloServer({ typeDefs, resolvers });

server.applyMiddleware({ app });
app.use(express.static("../client/build"));
app.get("../client/build", (req, res) => {
  console.log("res", res);
  res.sendFile({ port: 5555 }, "../client/build");
});
app.use(cors());

app.listen({ port: 5555 }, () =>
  console.log("Now browse to http://localhost:5555")
);
