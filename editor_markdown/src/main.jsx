
import MarkdownEditor from './components/MarkdownEditor';
import React from 'react';
import { createRoot } from 'react-dom/client';


const App = () => {
  return <MarkdownEditor />;
};
const editor = createRoot(document.getElementById('editor'));
editor.render(<App />);
