
import MarkdownEditor from './components/MarkdownEditor';
import React from 'react';
import { createRoot } from 'react-dom/client';
import EditorDeLinks from './components/EditorLinks';


const App = () => {
  return (
    <div>
      <div class="form-group">
        <label for="markdownEditor">Conteúdo do Material (Markdown)</label>
        <MarkdownEditor />
      </div>
      <div class="form-group">
        <label for="linksExternos">Links Externos (um por linha)</label>
        <EditorDeLinks />
      </div>
      <br />
    </div>
  );
};
const editor = createRoot(document.getElementById('editor'));
editor.render(<App />);
