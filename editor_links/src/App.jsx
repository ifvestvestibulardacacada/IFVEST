import { createRoot } from 'react-dom/client';
import MDEditor, { commands } from '@uiw/react-md-editor';
import {useState} from 'react';
import { useEffect } from 'react';  

function EditorDeLinks() {

    const [markdown, setMarkdown] = useState(() => {
      const savedMarkdown = localStorage.getItem('LinksContent');
      return savedMarkdown || '# Digite aqui os links ...';
    });

  
    useEffect(() => {
      localStorage.setItem('LinksContent', markdown);
    }, [markdown]);
  
 

  return (
    <div  data-color-mode="light">
      <MDEditor
        value={markdown}
        onChange={setMarkdown}
        commands={[
          commands.bold,
          commands.italic,
          commands.link,
          commands.quote,
          commands.orderedListCommand,
          commands.unorderedListCommand
        ]}
        height={200}
        preview="edit"
      />
    </div>
  );
}

export default EditorDeLinks;

const App = () => {
  return <EditorDeLinks />;
};

const links = createRoot(document.getElementById('link'));
links.render(<App />);