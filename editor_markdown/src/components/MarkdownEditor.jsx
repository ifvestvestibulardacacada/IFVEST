import React, { useState, useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import "@uiw/react-md-editor/markdown-editor.css";
import {filteredCommands } from '../utils/editorCommands';
import ImageSizeModal from './ImageSizeModal';
import EquationEditor from './EquationEditor';
import { handleImageUpload } from '../utils/imageUtils';
import symbolButtons from '../utils/symbolButtons';

const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useState(() => {
    const savedMarkdown = localStorage.getItem('EditorContent');
    return savedMarkdown || 'Ex: # Digite aqui o material ...';
  });
  const [showEquationEditor, setShowEquationEditor] = useState({
    visible: false,
    insertLatex: null,
  });
  const [showImageSizeModal, setShowImageSizeModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    localStorage.setItem('EditorContent', markdown);
  }, [markdown]);

  const handleInsertImage = async ({ width, height }) => {
    if (selectedFile) {
      const markdownImage = await handleImageUpload(selectedFile, width, height);
      if (markdownImage) {
        setMarkdown((prev) => prev + markdownImage);
        setShowImageSizeModal(false);
        setSelectedFile(null);
      }
    }
  };

  return (
    <div data-color-mode="light">
      <MDEditor
        height={400}
        value={markdown}
        onChange={setMarkdown}
        commands={filteredCommands.map(cmd =>
          cmd.name === 'custom-image-upload'
            ? { ...cmd, execute: (state, api) => cmd.execute(state, api, setShowImageSizeModal, setSelectedFile) }
            : cmd.name === 'custom-equation-editor'
            ? { ...cmd, execute: (state, api) => cmd.execute(state, api, setShowEquationEditor) }
            : cmd
        )}
        previewOptions={{
          remarkPlugins: [remarkMath],
          rehypePlugins: [[rehypeKatex]],
        }}
      />
      {showEquationEditor.visible && (
        <div className="equation-editor">
          <EquationEditor
            onInsert={(latex) => {
              showEquationEditor.insertLatex(latex);
              setShowEquationEditor({ visible: false, insertLatex: null });
            }}
            onClose={() => setShowEquationEditor({ visible: false, insertLatex: null })}
            symbols={symbolButtons}
          />
        </div>
      )}
      {showImageSizeModal && (
        <ImageSizeModal
          onSubmit={handleInsertImage}
          onClose={() => {
            setShowImageSizeModal(false);
            setSelectedFile(null);
          }}
        />
      )}
    </div>
  );
};

export default MarkdownEditor;