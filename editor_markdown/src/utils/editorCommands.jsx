import { commands } from '@uiw/react-md-editor';
import { TbMath } from 'react-icons/tb';

export const customImageUpload = {
  name: 'custom-image-upload',
  keyCommand: 'custom-image-upload',
  buttonProps: { 'aria-label': 'Insert image' },
  icon: (
    <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
      <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
    </svg>
  ),
  execute: async (state, api, setShowImageSizeModal, setSelectedFile) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        setSelectedFile(file);
        setShowImageSizeModal(true);
      }
    };

    input.click();
  },
};

export const customEquationEditor = {
  name: 'custom-equation-editor',
  keyCommand: 'custom-equation-editor',
  buttonProps: { 'aria-label': 'Insert equation' },
  icon: <TbMath />,
  execute: (state, api, setShowEquationEditor) => {
    const insertLatex = (latex) => {
      const markdownLatex = `$${latex}$`;
      api.replaceSelection(markdownLatex);
    };
    setShowEquationEditor({ visible: true, insertLatex });
  },
};

export const filteredCommands = [
  commands.bold,
  commands.italic,
  commands.strikethrough,
  commands.hr,
  commands.title,
  commands.divider,
  commands.link,
  commands.quote,
  commands.code,
  commands.codeBlock,
  commands.divider,
            commands.orderedListCommand,
          commands.unorderedListCommand,
  customImageUpload,
  customEquationEditor,
  // Adicione outros se quiser
];