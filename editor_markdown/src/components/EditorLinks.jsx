import { createRoot } from 'react-dom/client';
import MDEditor, { commands } from '@uiw/react-md-editor';
import {useState} from 'react';
import { useEffect } from 'react';  

function EditorDeLinks() {

    const [reference, setReference] = useState(() => {
      const savedMarkdown = window.ContentManager ? window.ContentManager.getReferencias() : '# Digite aqui os links ...';
      console.log('Saved Markdown:', savedMarkdown);
      return savedMarkdown ;
    });



  useEffect(() => {
    // Dispara um evento personalizado
    const event = new CustomEvent('referenceContentChange', {
      detail: { content: reference }
    });
    window.dispatchEvent(event);
  }, [reference]);


 

  return (
    <div  data-color-mode="light">
      <MDEditor
        value={reference}
        onChange={setReference}
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