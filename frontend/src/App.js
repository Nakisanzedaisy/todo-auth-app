import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:4000/api';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token'));

  const register = async () => {
    await axios.post(`${API}/auth/register`, { email, password });
    alert('Registered. Now login.');
  };

  const login = async () => {
    const res = await axios.post(`${API}/auth/login`, { email, password });
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
  };

  const fetchTodos = async () => {
    const res = await axios.get(`${API}/todos`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTodos(res.data);
  };

  const addTodo = async () => {
    const res = await axios.post(
      `${API}/todos`,
      { title },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setTodos([...todos, res.data]);
  };

  useEffect(() => {
    if (token) fetchTodos();
  }, [token]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Todo App</h1>

      {!token && (
        <>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
          />
          <button onClick={register}>Register</button>
          <button onClick={login}>Login</button>
        </>
      )}

      {token && (
        <>
          <div>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New Todo" />
            <button onClick={addTodo}>Add</button>
          </div>

          <ul>
            {todos.map((todo) => (
              <li key={todo.id}>{todo.title}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
