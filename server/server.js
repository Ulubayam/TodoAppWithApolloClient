const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const cors = require("cors");

let todos = [
  {
    id: Date.now().toString(),
    text: "Hello from GraphQL",
    completed: true
  }
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
    todos: () => todos
  },
  Mutation: {
    createTodo: (parent, args, context, info) => {
      return todos.push({
        id: Date.now().toString(),
        text: args.text,
        completed: false
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
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
server.applyMiddleware({ app });

app.use(cors());

app.listen({ port: 5555 }, () =>
  console.log("Now browse to http://localhost:5555" + server.graphqlPath)
);
