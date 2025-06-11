import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const createDocAPI = async (docData) => {
  const res = await axios.post("/api/documents/createdoc", docData);
  return res.data; // Expected: { document: { _id, title, collaborators }, message }
};

const DocPage = () => {
  const [title, setTitle] = useState("");
  const [collaborators, setCollaborators] = useState("");
  const [message, setMessage] = useState(null);

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: createDocAPI,
    onSuccess: (data) => {
      if (data?.document?._id) {
        setMessage({ type: "success", text: "Document created successfully!" });
        // Automatic navigate after creation:
        navigate(`/showdoc/${data.document._id}`);
      } else {
        setMessage({ type: "success", text: data.message || "Document created!" });
      }
    },
    onError: (error) => {
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to create document. Please try again.",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mutation.isLoading) return; // Prevent double submit

    const collabArr = collaborators
      .split(",")
      .filter(Boolean)
      .map((id) => ({ user: id.trim(), role: "editor" }));

    mutation.mutate({ title, collaborators: collabArr });
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-slate-900 to-black p-6 text-white">
      <h2 className="text-3xl font-bold mb-8">Create New Document</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-slate-800 p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <label className="block mb-4">
          <span className="block text-sm font-semibold mb-1">Title</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-md bg-slate-700 border border-slate-600 focus:outline-none focus:border-slate-400"
            placeholder="Document Title"
          />
        </label>

        <label className="block mb-6">
          <span className="block text-sm font-semibold mb-1">
            Collaborators (comma separated user IDs)
          </span>
          <input
            type="text"
            value={collaborators}
            onChange={(e) => setCollaborators(e.target.value)}
            placeholder="e.g. userId1, userId2"
            className="w-full px-4 py-2 rounded-md bg-slate-700 border border-slate-600 focus:outline-none focus:border-slate-400"
          />
        </label>

        <button
          type="submit"
          disabled={mutation.isLoading}
          className="w-full bg-slate-600 hover:bg-slate-500 transition-colors py-3 rounded-lg font-semibold disabled:opacity-50"
        >
          {mutation.isLoading ? "Creating..." : "Create Document"}
        </button>

        {message && (
          <p
            className={`mt-4 text-center ${
              message.type === "success" ? "text-green-400" : "text-red-500"
            }`}
          >
            {message.text}
          </p>
        )}
      </form>
    </div>
  );
};

export default DocPage;
