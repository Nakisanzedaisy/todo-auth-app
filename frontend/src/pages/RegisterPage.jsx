// src/pages/RegisterPage.js
import React, { useState } from "react";
import API from "../api";

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    roleName: "admin", // matches backend roles
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const registerUser = async () => {
    try {
      await API.post("/auth/register", form);
      alert("Registered successfully! Please login.");
    } catch (error) {
      alert(error.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="container mx-auto max-w-md mt-20 p-6 border rounded shadow">
      <h2 className="text-2xl mb-6 font-semibold">Register</h2>
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="w-full p-2 mb-4 border rounded"
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        className="w-full p-2 mb-4 border rounded"
      />
      <select
        name="roleName"
        value={form.roleName}
        onChange={handleChange}
        className="w-full p-2 mb-6 border rounded"
      >
        <option value="admin">Admin</option>
        <option value="super_admin">Super Admin</option>
      </select>
      <button
        onClick={registerUser}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        Register
      </button>
    </div>
  );
}
