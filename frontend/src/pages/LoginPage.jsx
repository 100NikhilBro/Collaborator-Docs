import React, { useState } from 'react';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { toast, ToastContainer } from 'react-toastify';
import { motion } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const navProfile = useNavigate();

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post('/api/users/login', formData);
      return response.data; // assume response.data = { token: "...", user: {...} }
    },
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }
      toast.success('✅ Logged in successfully!');
      setFormData({ email: '', password: '' });
      navProfile('/profile'); // redirect after success
    },
    onError: (error) => {
      toast.error(`❌ ${error.response?.data?.message || 'Login failed'}`);
    },
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-black via-slate-900 to-slate-800 overflow-hidden">
      {/* Cross pattern background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cline x1='0' y1='0' x2='40' y2='40' stroke='%23707070' stroke-width='1'/%3e%3cline x1='40' y1='0' x2='0' y2='40' stroke='%23707070' stroke-width='1'/%3e%3c/svg%3e")`,
          backgroundRepeat: 'repeat',
          opacity: 0.1,
          zIndex: 0,
        }}
      />

      {/* Content container */}
      <div className="relative z-10 max-w-md w-full p-10 bg-slate-900/90 rounded-2xl shadow-lg backdrop-blur-md border border-slate-700">

        {/* Heading */}
        <motion.h1
          className="text-3xl font-extrabold mb-8 text-white text-center"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Welcome Back
        </motion.h1>

        {/* Toast */}
        <ToastContainer position="top-right" autoClose={3000} />

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-white">

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="px-4 py-3 rounded-lg border border-slate-600 bg-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 transition"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="px-4 py-3 rounded-lg border border-slate-600 bg-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 transition"
          />

          <motion.button
            type="submit"
            disabled={mutation.isLoading}
            initial={{
              background: 'linear-gradient(to right, #111827, #1f2937, #374151)', // dark slate gradient
              color: '#f9fafb', // almost white text
            }}
            whileHover={{
              background: 'linear-gradient(to right, #374151, #1f2937, #111827)', // reversed dark gradient on hover
              color: '#e0e7ff', // lighter text on hover
            }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="font-semibold py-3 rounded-lg shadow-md w-full"
          >
            {mutation.isLoading ? 'Logging in...' : 'Login'}
          </motion.button>
        </form>

        {/* Extra line below form */}
        <p className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <a href="/signup" className="text-blue-400 hover:underline">
            Register
          </a>
        </p>

      </div>
    </div>
  );
};

export default LoginForm;
