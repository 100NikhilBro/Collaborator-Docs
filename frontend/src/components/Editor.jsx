// import React, { useEffect, useState } from 'react';
// import { EditorContent, useEditor } from '@tiptap/react';
// import StarterKit from '@tiptap/starter-kit';
// import * as Y from 'yjs';
// import { WebsocketProvider } from 'y-websocket';

// const Editor = ({ docId }) => {
//   const [yProvider, setYProvider] = useState(null);

//   useEffect(() => {
//     const ydoc = new Y.Doc();
//     const provider = new WebsocketProvider('ws://localhost:1234', docId, ydoc);
//     setYProvider(provider);

//     return () => {
//       provider.disconnect();
//     };
//   }, [docId]);

//   const editor = useEditor({
//     extensions: [StarterKit],
//     content: '',
//   });

//   useEffect(() => {
//     if (!yProvider || !editor) return;

//     const yXmlFragment = yProvider.doc.getXmlFragment('prosemirror');
//     const awareness = yProvider.awareness;

//     import('y-prosemirror').then(({ ySyncPlugin, yCursorPlugin, yUndoPlugin }) => {
//       editor.registerPlugin(ySyncPlugin(yXmlFragment));
//       editor.registerPlugin(yCursorPlugin(awareness));
//       editor.registerPlugin(yUndoPlugin());
//     });

//   }, [yProvider, editor]);

//   if (!editor) return <div>Loading Editor...</div>;

//   return <EditorContent editor={editor} />;
// };

// export default Editor;
