import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaEdit, FaTrash, FaUserPlus, FaUserMinus, FaExternalLinkAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const getDoc = async () => {
  const res = await axios.get('/api/documents/mydoc');
  return res.data;
};

const updateDoc = async ({ id, title }) => {
  return axios.put(`/api/documents/updatedoc/${id}`, { title });
};

const deleteDoc = async (id) => {
  return axios.delete(`/api/documents/deletedoc/${id}`);
};

const addCollaborator = async ({ docId, collaboratorId, role }) => {
  return axios.post(`/api/documents/add/${docId}/collaborators`, { collaboratorId, role });
};

const removeCollaborator = async ({ docId, collaboratorId }) => {
  return axios.delete(`/api/documents/delete/${docId}/collaborators`, { data: { collaboratorId } });
};

const Show = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [editingDocId, setEditingDocId] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [collabDocId, setCollabDocId] = useState(null);
  const [collabUserId, setCollabUserId] = useState('');
  const [collabRole, setCollabRole] = useState('editor');
  const [toast, setToast] = useState(null);

  const { data, isError, isLoading } = useQuery({
    queryKey: ['docs'],
    queryFn: getDoc,
  });

  const updateMutation = useMutation({
    mutationFn: updateDoc,
    onSuccess: () => {
      queryClient.invalidateQueries(['docs']);
      setEditingDocId(null);
      setToast({ type: 'success', message: 'Document updated successfully!' });
    },
    onError: () => {
      setToast({ type: 'error', message: 'Failed to update document.' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDoc,
    onSuccess: () => {
      queryClient.invalidateQueries(['docs']);
      setToast({ type: 'success', message: 'Document deleted successfully!' });
    },
    onError: () => {
      setToast({ type: 'error', message: 'Failed to delete document.' });
    },
  });

  const addCollabMutation = useMutation({
    mutationFn: addCollaborator,
    onSuccess: () => {
      queryClient.invalidateQueries(['docs']);
      setCollabDocId(null);
      setCollabUserId('');
      setCollabRole('editor');
      setToast({ type: 'success', message: 'Collaborator added successfully!' });
    },
    onError: () => {
      setToast({ type: 'error', message: 'Failed to add collaborator.' });
    },
  });

  const removeCollabMutation = useMutation({
    mutationFn: removeCollaborator,
    onSuccess: () => {
      queryClient.invalidateQueries(['docs']);
      setCollabDocId(null);
      setCollabUserId('');
      setToast({ type: 'success', message: 'Collaborator removed successfully!' });
    },
    onError: () => {
      setToast({ type: 'error', message: 'Failed to remove collaborator.' });
    },
  });

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleEditClick = (doc) => {
    setEditingDocId(doc._id);
    setNewTitle(doc.title);
  };

  const handleEditSubmit = () => {
    if (newTitle.trim() !== '') {
      updateMutation.mutate({ id: editingDocId, title: newTitle });
    }
  };

  const handleOpenAddCollab = (docId) => {
    setCollabDocId(docId);
    setCollabUserId('');
    setCollabRole('editor');
  };

  const handleAddCollaborator = () => {
    if (!collabUserId.trim()) {
      alert('Please enter Collaborator User ID');
      return;
    }
    addCollabMutation.mutate({ docId: collabDocId, collaboratorId: collabUserId, role: collabRole });
  };

  const handleRemoveCollaborator = (docId, collaboratorId) => {
    if (window.confirm('Remove this collaborator?')) {
      removeCollabMutation.mutate({ docId, collaboratorId });
    }
  };

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-red-400">
        Error fetching documents.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white text-xl animate-pulse">
        Loading...
      </div>
    );
  }

  const userId = data?.userId ?? '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black text-white p-6 relative overflow-hidden">
      {toast && (
        <div
          className={`fixed top-5 right-5 px-4 py-2 rounded shadow-lg z-50 ${
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-10">
        <svg viewBox="0 0 800 600" className="w-full h-full">
          <circle cx="400" cy="300" r="280" fill="#1e293b" />
        </svg>
      </div>

      <div className="flex items-center justify-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mr-3">
          Your Documents
        </h1>
       
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data?.documents?.map((doc, index) => {
          const isOwner = doc.owner?._id === userId;
          const isEditor = doc.collaborators?.some(
            (c) => c.user?._id === userId && c.role === 'editor'
          );

          const isEditing = editingDocId === doc._id;
          const isAddingCollab = collabDocId === doc._id;

          return (
            <motion.div
              key={doc._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-600 hover:scale-105 transition-transform duration-300 relative"
            >
              {isEditing ? (
                <div className="mb-3">
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full p-2 rounded-md text-black mb-2"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleEditSubmit}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingDocId(null)}
                      className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <h2 className="text-xl font-bold mb-2">{doc.title}</h2>
              )}

              <p className="text-sm text-slate-400 mb-2">
                Owner: <span className="text-white">{doc.owner.name}</span>
              </p>
              <p className="text-xs text-slate-500 mb-3">ID: {doc._id}</p>

              <h3 className="text-sm font-semibold text-slate-300 mb-2">
                Collaborators:
              </h3>
              <ul className="pl-4 list-disc space-y-1 mb-4 max-h-40 overflow-auto">
                {doc.collaborators.map((col) => (
                  <li
                    key={col.user._id}
                    className="text-sm text-slate-400 flex justify-between items-center"
                  >
                    <span>
                      <span className="text-white">{col.user.name}</span> ({col.role})
                    </span>
                    {isOwner && (
                      <button
                        onClick={() => handleRemoveCollaborator(doc._id, col.user._id)}
                        title="Remove collaborator"
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaUserMinus />
                      </button>
                    )}
                  </li>
                ))}
              </ul>

              {isAddingCollab && (
                <div className="mb-4 p-4 bg-slate-700 rounded">
                  <input
                    type="text"
                    placeholder="Collaborator User ID"
                    value={collabUserId}
                    onChange={(e) => setCollabUserId(e.target.value)}
                    className="w-full p-2 mb-2 rounded-md text-black"
                  />
                  <select
                    value={collabRole}
                    onChange={(e) => setCollabRole(e.target.value)}
                    className="w-full p-2 mb-2 rounded-md text-black"
                  >
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                  </select>
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddCollaborator}
                      disabled={addCollabMutation.isLoading}
                      className="px-4 py-1 bg-green-600 hover:bg-green-700 rounded text-white text-sm"
                    >
                      {addCollabMutation.isLoading ? 'Adding...' : 'Add Collaborator'}
                    </button>
                    <button
                      onClick={() => setCollabDocId(null)}
                      className="px-4 py-1 bg-gray-600 hover:bg-gray-700 rounded text-white text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {!isEditing && !isAddingCollab && (
                <div className="flex flex-wrap gap-3 mt-4">
                  {(isOwner || isEditor) && (
                    <button
                      onClick={() => handleEditClick(doc)}
                      className="flex items-center gap-1 px-4 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm"
                    >
                      <FaEdit /> Edit
                    </button>
                  )}

                  {isOwner && (
                    <>
                      <button
                        onClick={() => handleDelete(doc._id)}
                        className="flex items-center gap-1 px-4 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm"
                      >
                        <FaTrash /> Delete
                      </button>

                      <button
                        onClick={() => handleOpenAddCollab(doc._id)}
                        className="flex items-center gap-1 px-4 py-1 rounded-md bg-green-600 hover:bg-green-700 text-white text-sm"
                      >
                        <FaUserPlus /> Add Collaborator
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => navigate(`/editor/${doc._id}`)}
                    className="flex items-center gap-1 px-4 py-1 rounded-md bg-purple-600 hover:bg-purple-700 text-white text-sm"
                  >
                    <FaExternalLinkAlt /> Open
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Show;
