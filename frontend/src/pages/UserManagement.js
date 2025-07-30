import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';

export default function UserManagement({ user, onLogout }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await API.get('/users');
      setUsers(response.data);
    } catch (error) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"?`)) return;

    try {
      await API.delete(`/users/${userId}`);
      setUsers(users.filter(u => u.id !== userId));
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to delete user');
    }
  };

  const canDeleteUser = user.permissions?.includes('delete:user');

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>User Management</h1>
          <div className="user-info">
            <span>Welcome, {user.name} ({user.role})</span>
            <button onClick={onLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      <nav className="dashboard-nav">
        <Link to="/todos" className="nav-link">My Todos</Link>
        <Link to="/users" className="nav-link active">Manage Users</Link>
      </nav>

      <main className="dashboard-main">
        {error && <div className="error">{error}</div>}

        <div className="users-section">
          <h2>All Users ({users.length})</h2>
          {loading ? (
            <div className="loading">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="no-users">
              <p>No users found.</p>
            </div>
          ) : (
            <div className="users-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Created</th>
                    {canDeleteUser && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`role-badge ${u.role.name.toLowerCase().replace(' ', '-')}`}>
                          {u.role.name}
                        </span>
                      </td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                      {canDeleteUser && (
                        <td>
                          {u.id !== user.id ? (
                            <button
                              onClick={() => handleDeleteUser(u.id, u.name)}
                              className="delete-btn"
                              disabled={u.role.name === 'Super Admin' && user.role !== 'Super Admin'}
                            >
                              Delete
                            </button>
                          ) : (
                            <span className="disabled">Self</span>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="user-stats">
          <h3>User Statistics</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <h4>Total Users</h4>
              <p>{users.length}</p>
            </div>
            <div className="stat-card">
              <h4>Super Admins</h4>
              <p>{users.filter(u => u.role.name === 'Super Admin').length}</p>
            </div>
            <div className="stat-card">
              <h4>Admins</h4>
              <p>{users.filter(u => u.role.name === 'Admin').length}</p>
            </div>
            <div className="stat-card">
              <h4>Users</h4>
              <p>{users.filter(u => u.role.name === 'User').length}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}