import React, { useState, useEffect, useRef } from 'react';
import SymbolSection from './SymbolSection';
import '../styles/EquationEditor.css';
import katex from 'katex';
import 'katex/dist/katex.min.css';

function EquationEditor({ onInsert, onClose, symbols }) {
  const [equation, 
    setEquation] = useState('');
  const [isSymbolsVisible, 
    setIsSymbolsVisible] = useState(true);
  const equationPreviewRef = useRef(null);
  const equationInputRef = useRef(null);

  // Renderiza o LaTeX na div de visualização
  const renderLatex = () => {
    try {
      return katex.renderToString(equation, 
        { throwOnError: false });
    } catch (error) {
      return 'Invalid LaTeX';
    }
  };

  // Atualiza a visualização sempre que o equation mudar
  useEffect(() => {
    if (equationPreviewRef.current) {
      equationPreviewRef.current.innerHTML = renderLatex();
    }
  }, [equation]);

  const handleInsertSymbol = (value) => {
    setEquation((prev) => prev + value);
    if (equationInputRef.current) {
      equationInputRef.current.focus();
    }
  };

  const handleInputChange = (e) => {
    setEquation(e.target.value);
  };

  const handleClear = () => {
    setEquation('');
    if (equationInputRef.current) {
      equationInputRef.current.focus();
    }
  };

  const handleInsert = () => {
    onInsert(equation);
    setEquation('');
    setIsSymbolsVisible(true);
    onClose();
  };

  return (
    <div className="editor-container">
      <div className={
        `symbols-container ${isSymbolsVisible 
        ? '' : 'hide'}`}>
        <SymbolSection symbols={symbols} 
        onInsert={handleInsertSymbol} />
      </div>
      <div className="equation-editor">
        <button type='button' 
        className="editor-close-btn" 
        onClick={onClose}>×</button>
        <div className="equation-preview" 
        ref={equationPreviewRef}>
        </div>
        <div className="item">
          <textarea
            id="equation-input"
            ref={equationInputRef}
            value={equation}
            onChange={handleInputChange}
            placeholder="Digite o LaTeX aqui..."
          />
          <div className="equation-btn-box">
            <button type='button' 
            onClick={() => 
            setIsSymbolsVisible(!isSymbolsVisible)}>
              ☰</button>
            <button type='button' 
            onClick={handleClear}>C</button>
          </div>
        </div>
        <div className="item">
          <button type='button' 
          className="generator-btn" 
          onClick={handleInsert}>
            Inserir
          </button>
        </div>
      </div>
    </div>
  );
}

export default EquationEditor;