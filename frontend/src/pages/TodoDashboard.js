import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";

export default function TodoDashboard({ user, onLogout }) {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: "", description: "" });
  const [editingTodo, setEditingTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await API.get("/todos");
      setTodos(res.data);
    } catch (error) {
      setError("Failed to fetch todos");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.title.trim()) return;

    try {
      const res = await API.post("/todos", newTodo);
      setTodos([res.data, ...todos]);
      setNewTodo({ title: "", description: "" });
    } catch (error) {
      setError(error.response?.data?.error || "Failed to create todo");
    }
  };

  const handleUpdateTodo = async (id, updatedTodo) => {
    try {
      const res = await API.put(`/todos/${id}`, updatedTodo);
      setTodos(todos.map(todo => todo.id === id ? res.data : todo));
      setEditingTodo(null);
    } catch (error) {
      setError("Failed to update todo");
    }
  };

  const handleDeleteTodo = async (id) => {
    if (!window.confirm("Are you sure you want to delete this todo?")) return;

    try {
      await API.delete(`/todos/${id}`);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      setError("Failed to delete todo");
    }
  };

  const canCreateTodo = user.permissions?.includes('create:todo');
  const canManageUsers = user.role === 'Admin' || user.role === 'Super Admin';

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Todo Dashboard</h1>
          <div className="user-info">
            <span>Welcome, {user.name} ({user.role})</span>
            <button onClick={onLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      <nav className="dashboard-nav">
        <Link to="/todos" className="nav-link active">My Todos</Link>
        {canManageUsers && (
          <Link to="/users" className="nav-link">Manage Users</Link>
        )}
      </nav>

      <main className="dashboard-main">
        {error && <div className="error">{error}</div>}

        {canCreateTodo && (
          <div className="create-todo-section">
            <h2>Create New Todo</h2>
            <form onSubmit={handleCreateTodo} className="todo-form">
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Todo title"
                  value={newTodo.title}
                  onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <textarea
                  placeholder="Todo description (optional)"
                  value={newTodo.description}
                  onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                  rows="3"
                />
              </div>
              <button type="submit">Add Todo</button>
            </form>
          </div>
        )}

        <div className="todos-section">
          <h2>My Todos ({todos.length})</h2>
          {loading ? (
            <div className="loading">Loading todos...</div>
          ) : todos.length === 0 ? (
            <div className="no-todos">
              <p>No todos yet. {canCreateTodo ? 'Create your first todo above!' : 'You need permission to create todos.'}</p>
            </div>
          ) : (
            <div className="todos-list">
              {todos.map(todo => (
                <div key={todo.id} className="todo-item">
                  {editingTodo === todo.id ? (
                    <TodoEditForm
                      todo={todo}
                      onSave={(updatedTodo) => handleUpdateTodo(todo.id, updatedTodo)}
                      onCancel={() => setEditingTodo(null)}
                    />
                  ) : (
                    <TodoDisplay
                      todo={todo}
                      onEdit={() => setEditingTodo(todo.id)}
                      onDelete={() => handleDeleteTodo(todo.id)}
                      canEdit={canCreateTodo}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

const TodoDisplay = ({ todo, onEdit, onDelete, canEdit }) => (
  <div className="todo-display">
    <div className="todo-content">
      <h3>{todo.title}</h3>
      {todo.description && <p>{todo.description}</p>}
      <small>Created: {new Date(todo.createdAt).toLocaleDateString()}</small>
    </div>
    {canEdit && (
      <div className="todo-actions">
        <button onClick={onEdit} className="edit-btn">Edit</button>
        <button onClick={onDelete} className="delete-btn">Delete</button>
      </div>
    )}
  </div>
);

const TodoEditForm = ({ todo, onSave, onCancel }) => {
  const [editData, setEditData] = useState({
    title: todo.title,
    description: todo.description || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editData);
  };

  return (
    <form onSubmit={handleSubmit} className="todo-edit-form">
      <div className="form-group">
        <input
          type="text"
          value={editData.title}
          onChange={(e) => setEditData({ ...editData, title: e.target.value })}
          required
        />
      </div>
      <div className="form-group">
        <textarea
          value={editData.description}
          onChange={(e) => setEditData({ ...editData, description: e.target.value })}
          rows="3"
        />
      </div>
      <div className="form-actions">
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
};