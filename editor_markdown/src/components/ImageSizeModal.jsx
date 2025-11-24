import React, { useState } from 'react';

const ImageSizeModal = ({ onSubmit, onClose }) => {
  const [size, setSize] = useState('média');

  const sizeOptions = [
    { value: 'muito_pequena', label: 'Muito Pequena (100x75)', width: 100, height: 75 },
    { value: 'pequena', label: 'Pequena (200x150)', width: 200, height: 150 },
    { value: 'média', label: 'Média (400x300)', width: 400, height: 300 },
    { value: 'grande', label: 'Grande (600x450)', width: 600, height: 450 },
    { value: 'extra_grande', label: 'Extra Grande (800x600)', width: 800, height: 600 },
  ];

  const handleSubmit = () => {
    const selectedSize = sizeOptions.find(option => option.value === size);
    onSubmit({ width: selectedSize.width, height: selectedSize.height });
  };

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'white',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
      zIndex: 1000,
    }}>
      <h3>Selecione o tamanho da imagem</h3>
      <div style={{ marginBottom: '15px' }}>
        <label>
          Tamanho:
          <select
            value={size}
            onChange={(e) => setSize(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px' }}
          >
            {sizeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          type="button"
          onClick={handleSubmit}
          style={{ padding: '8px 16px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Inserir
        </button>
        <button
          type="button"
          onClick={onClose}
          style={{ padding: '8px 16px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default ImageSizeModal;