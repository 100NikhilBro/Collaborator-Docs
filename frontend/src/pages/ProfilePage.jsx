import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { HiArrowNarrowRight } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const fetchMe = async () => {
  const { data } = await axios.get('/api/users/me');
  return data;
};

const updateProfile = async (updatedData) => {
  const { data } = await axios.put('/api/users/update', updatedData);
  return data;
};

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

const buttonVariants = {
  hover: { scale: 1.05, backgroundColor: '#6366f1', boxShadow: '0px 5px 15px rgba(99,102,241,0.6)' },
  tap: { scale: 0.95 },
};

const inputVariants = {
  focus: { boxShadow: '0 0 8px 2px #6366f1' },
  hover: { borderColor: '#6366f1' },
};

const Profile = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['me'],
    queryFn: fetchMe,
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    password: '',
  });

  const avatarSeed = data?.profile?.name || 'guest';

  useEffect(() => {
    if (data && data.profile) {
      setFormData({
        name: data.profile.name || '',
        email: data.profile.email || '',
        role: data.profile.role || '',
        password: '',
      });
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (updatedData) => {
      queryClient.setQueryData(['me'], updatedData);
      setFormData((prev) => ({ ...prev, password: '' }));
    },
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...formData };
    if (!payload.password) delete payload.password;
    mutation.mutate(payload);
  };

  const handleIconClick = () => {
    navigate('/collaborate');
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen bg-slate-900 text-slate-300 text-lg">
        Loading profile...
      </div>
    );
  if (isError)
    return (
      <div className="flex justify-center items-center h-screen bg-slate-900 text-red-500 text-lg">
        Error loading profile: {error.message}
      </div>
    );

  return (
    <>
      <svg
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1 }}
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill="#312e81"
          fillOpacity="0.85"
          d="M0,224L48,192C96,160,192,96,288,96C384,96,480,160,576,165.3C672,171,768,117,864,117.3C960,117,1056,171,1152,170.7C1248,171,1344,117,1392,90.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
      </svg>

      <motion.div
        className="max-w-4xl mx-auto mt-16 flex bg-slate-900 rounded-2xl shadow-2xl overflow-hidden font-sans text-slate-300 min-h-[480px]"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={containerVariants}
      >
        {/* Left side: avatar + username + arrow */}
        <div className="flex flex-col items-center justify-center flex-[0.4] bg-indigo-900 border-r-2 border-indigo-700 p-10 select-none">
          <motion.img
            src={`https://api.dicebear.com/6.x/adventurer/svg?seed=${encodeURIComponent(avatarSeed)}`}
            alt="Profile Avatar"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="rounded-full w-40 h-40 mb-5 shadow-lg"
          />
          <h2 className="text-3xl font-bold tracking-widest text-indigo-300 mb-1 text-center">
            {formData.name || 'Guest User'}
          </h2>

          {/* Arrow inside circle */}
          <motion.div
            onClick={handleIconClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleIconClick();
              }
            }}
            aria-label="Go to Collaborate"
            whileHover={{ scale: 1.2 }}
            className="mt-1 cursor-pointer rounded-full bg-indigo-700 p-2 flex items-center justify-center w-12 h-12"
          >
            <HiArrowNarrowRight size={28} color="#a5b4fc" />
          </motion.div>
        </div>

        {/* Right side: form */}
        <div className="flex-[0.6] p-10 flex flex-col gap-5">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {['name', 'email', 'role', 'password'].map((field) => (
              <motion.div key={field} whileHover="hover" className="flex flex-col">
                <label
                  htmlFor={field}
                  className="mb-1 font-semibold text-indigo-300 capitalize tracking-wide"
                >
                  {field === 'password' ? 'Password (enter to update)' : field}
                </label>
                <motion.input
                  id={field}
                  name={field}
                  type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
                  value={formData[field]}
                  onChange={handleChange}
                  required={field !== 'role' && field !== 'password'}
                  placeholder={field === 'password' ? 'Enter new password' : ''}
                  autoComplete={field === 'password' ? 'new-password' : 'off'}
                  variants={inputVariants}
                  whileFocus="focus"
                  className="px-4 py-3 rounded-lg border-2 border-indigo-700 bg-slate-900 text-slate-300 text-base outline-none transition-colors duration-300"
                />
              </motion.div>
            ))}
            <motion.button
              type="submit"
              disabled={mutation.isLoading}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="py-3 rounded-xl bg-indigo-600 font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-colors duration-300"
            >
              {mutation.isLoading ? 'Updating...' : 'Update Profile'}
            </motion.button>
          </form>

          <AnimatePresence>
            {mutation.isError && (
              <motion.p
                key="error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="text-red-500 mt-5 font-semibold text-center"
              >
                Error updating profile
              </motion.p>
            )}
            {mutation.isSuccess && (
              <motion.p
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="text-green-400 mt-5 font-semibold text-center"
              >
                Profile updated!
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
};

export default Profile;
