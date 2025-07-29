// src/pages/TodoDashboard.js
import React, { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function TodoDashboard() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await API.get("/todos");
      setTodos(res.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("Please login first.");
        navigate("/login");
      } else {
        alert("Failed to fetch todos");
      }
    }
  };

  const addTodo = async () => {
    if (!text.trim()) return alert("Enter todo text");
    try {
      await API.post("/todos", { text });
      setText("");
      fetchTodos();
    } catch {
      alert("Failed to add todo");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="container mx-auto max-w-lg mt-10 p-6 border rounded shadow">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-semibold">Todo List</h2>
        <button
          onClick={logout}
          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      <div className="flex mb-4 gap-2">
        <input
          type="text"
          placeholder="Add new todo..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-grow p-2 border rounded"
        />
        <button
          onClick={addTodo}
          className="bg-green-600 text-white px-4 rounded hover:bg-green-700"
        >
          Add
        </button>
      </div>

      <ul className="list-disc pl-5">
        {todos.length === 0 ? (
          <li>No todos yet!</li>
        ) : (
          todos.map((todo) => (
            <li key={todo.id} className="mb-2">
              {todo.text}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
