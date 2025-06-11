// import React, { useEffect } from "react";
// import socket from "../socket/sok"; 
// import { useParams } from "react-router-dom";

// const EditorPage = () => {
//     console.log(useParams());
//   const { id } = useParams(); // get from route like /document/:docId

//   console.log("-------->",id);

//   useEffect(() => {
//     socket.emit("join-document", id);

//     return () => {
//       socket.disconnect(); // optional: disconnect or leave room
//     };
//   }, [id]);

//   return <div className="p-4">Real-time Editor for Document: {id}</div>;
// };

// export default EditorPage;

// pages/EditorPage.jsx
import React from 'react';
// import Editor from '../components/Editor' ;
import { useParams } from 'react-router-dom';

const EditorPage = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Editing Document: {id}</h1>
    </div>
  );
};

export default EditorPage;
