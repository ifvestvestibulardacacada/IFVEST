
import MarkdownEditor from './components/MarkdownEditor';
import React from 'react';
import { createRoot } from 'react-dom/client';


const App = () => {
  return <MarkdownEditor />;
};
const root = createRoot(document.getElementById('root'));
root.render(<App />);
