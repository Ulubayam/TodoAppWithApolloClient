import React from "react";
import "./App.css";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

const READ_TODOS = gql`
  query todos {
    todos {
      id
      text
      completed
    }
  }
`;

const CREATE_TODO = gql`
  mutation CreateTodo($text: String!) {
    createTodo(text: $text)
  }
`;
const REMOVE_TODO = gql`
  mutation RemoveTodo($id: String!) {
    removeTodo(id: $id)
  }
`;

const UPDATE_TODO = gql`
  mutation UpdateTodo($id: String!) {
    updateTodo(id: $id)
  }
`;

function App() {
  let input;
  const { loading, error, data } = useQuery(READ_TODOS);
  const [createTodo] = useMutation(CREATE_TODO);
  const [deleteTodo] = useMutation(REMOVE_TODO);
  const [updateTodo] = useMutation(UPDATE_TODO);

  if (loading) return <p>loading</p>;
  if (error) return <p>Opps!!</p>;
  if (!data) return <p>Not Found</p>;

  return (
    <div className="app">
      <h3>Create New Todo</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createTodo({ variables: { text: input.value } });
          input.value = "";
          window.location.reload();
        }}
      >
        <input
          className="form-control"
          type="text"
          placeholder="Enter todo"
          ref={(node) => {
            input = node;
          }}
        ></input>
        <button className="btn btn-primary px-5 my-2" type="submit">
          Submit
        </button>
      </form>
      <ul>
        {data.todos.map((todo) => (
          <li key={todo.id} className="w-100">
            <span className={todo.completed ? "done" : "pending"}>
              {todo.text}
            </span>
            <button
              className="btn btn-sm btn-danger rounded-circle float-right"
              onClick={() => {
                deleteTodo({ variables: { id: todo.id } });
                window.location.reload();
              }}
            >
              X
            </button>
            <button
              className={`btn btn-sm float-right ${
                todo.completed ? "btn-success" : "btn-info"
              }`}
              onClick={() => {
                updateTodo({ variables: { id: todo.id } });
                window.location.reload();
              }}
            >
              {todo.completed ? (
                <span>Completed</span>
              ) : (
                <span>Not completed</span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
