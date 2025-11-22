import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import { motion } from 'framer-motion';
import { UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; 

const fetchUsers = async () => {
  try {
    const data = await axios.get("/api/users/allUser");
    return data.data;
  } catch (e) {
    console.log("Error in fetching", e);
  }
};

const Collborate = () => {
  const navigate = useNavigate(); 

  const { data, isLoading, isError } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  if (isError) {
    console.log("Error is --->", isError);
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-900 to-black text-white">
        <p className="text-xl animate-pulse">Loading...</p>
      </div>
    );
  }

  const user = data?.users || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black text-white relative overflow-hidden">
     
      <div className="absolute top-0 left-0 opacity-20 blur-2xl w-full h-full -z-10">
        <svg viewBox="0 0 800 600" className="w-full h-full">
          <circle cx="400" cy="300" r="250" fill="#0f172a" />
        </svg>
      </div>

      <div className="relative z-10 py-12 px-6 md:px-16">
       
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
         
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/doc')}
            className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded-xl shadow-md transition-all duration-300 border border-slate-500"
          >
            ➕ Create New Doc
          </motion.button>

          
          <h1 className="text-4xl font-bold text-center w-full md:w-auto bg-gradient-to-r from-white to-slate-400 text-transparent bg-clip-text">
            Collaborate with Team
          </h1>
        </div>

      
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {user.map((d) => (
            <motion.div
              key={d._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-slate-800 rounded-2xl p-6 shadow-md hover:scale-105 transform transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <UserRound className="w-10 h-10 text-slate-300" />
                <div>
                  <p className="text-lg font-semibold text-white">{d.name}</p>
                  <p className="text-sm text-slate-400">{d.email}</p>
                </div>
              </div>
              <p className="text-xs text-slate-500">ID: {d._id}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collborate;
