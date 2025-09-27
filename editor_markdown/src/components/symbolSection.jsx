import '../styles/EquationEditor.css';

function SymbolSection({ symbols, onInsert }) {
  // Agrupar símbolos por seção
  const groupedSymbols = symbols.reduce((acc, symbol) => {
    const section = symbol.section || 'other';
    if (!acc[section]) acc[section] = [];
    acc[section].push(symbol);
    return acc;
  }, {});

  return (
    <div className="symbols-container">
      {Object.entries(groupedSymbols).map(([sectionId, sectionSymbols]) => (
        
        <div key={sectionId} >
          <span className="section-title">{sectionId.replace('-section', '').replace('section-', '')}</span>
          <div className="symbol-section">
          <div className="symbol-buttons">
            {sectionSymbols.map((symbol, index) => (
              <button
              type='button'
                key={index}
                onClick={() => onInsert(symbol.value)}
                title={symbol.name}
                className="symbol-button"
              >
                <img src={symbol.imgSrc} alt={symbol.name} style={{ width: symbol.width || '20px', height: symbol.height || '20px' }}/>
              </button>
            ))}
          </div>
        </div>
         </div>
      ))}
    </div>
  );
}

export default SymbolSection;