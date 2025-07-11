// termColors.js
/**
 * Um utilitário simples e sem dependências para adicionar cores e estilos
 * ao texto no terminal usando códigos de escape ANSI, para Node.js.
 */
'use strict';

const AnsiCodes = {
  // Cores de Texto (Brilhantes)
  BLACK: '\x1b[90m',
  RED: '\x1b[91m',
  GREEN: '\x1b[92m',
  YELLOW: '\x1b[93m',
  BLUE: '\x1b[94m',
  MAGENTA: '\x1b[95m',
  CYAN: '\x1b[96m',
  WHITE: '\x1b[97m',

  // Estilos de Texto
  BOLD: '\x1b[1m',
  UNDERLINE: '\x1b[4m',

  // Reset
  RESET: '\x1b[0m',
};

/**
 * Aplica uma cor ou estilo a uma string de texto.
 * @param {string} text O texto a ser colorido.
 * @param {string} colorName O nome da cor ou estilo (ex: 'red', 'bold').
 * @returns {string} O texto formatado com os códigos ANSI.
 */
function colorize(text, colorName) {
  const code = AnsiCodes[colorName.toUpperCase()];
  if (code) {
    return `${code}${text}${AnsiCodes.RESET}`;
  }
  return text;
}

// --- Funções de conveniência ---

function red(text) { return colorize(text, 'red'); }
function green(text) { return colorize(text, 'green'); }
function yellow(text) { return colorize(text, 'yellow'); }
function blue(text) { return colorize(text, 'blue'); }
function magenta(text) { return colorize(text, 'magenta'); }
function cyan(text) { return colorize(text, 'cyan'); }
function white(text) { return colorize(text, 'white'); }
function bold(text) { return colorize(text, 'bold'); }
function underline(text) { return colorize(text, 'underline'); }

// --- Exportando as funções para que possam ser usadas em outros arquivos ---
module.exports = {
  red,
  green,
  yellow,
  blue,
  magenta,
  cyan,
  white,
  bold,
  underline,
  colorize // Exportando a função principal também, por flexibilidade
};


// --- Bloco de Demonstração ---
// Este bloco só executa se o arquivo for chamado diretamente (ex: node termColors.js)
if (require.main === module) {
  console.log(`Este é um teste do módulo ${module.filename.split('/').pop()}.`);
  console.log('--- Cores Básicas ---');
  console.log(red('Texto em Vermelho - usado para ERROS'));
  console.log(yellow('Texto em Amarelo - usado para WARNINGS'));
  console.log(green('Texto em Verde - usado para SUCESSO'));
  console.log(blue('Texto em Azul - usado para INFO'));
  console.log(magenta('Texto em Magenta'));
  console.log(cyan('Texto em Ciano'));
  console.log(white('Texto em Branco'));

  console.log('\n--- Estilos ---');
  console.log(bold('Texto em Negrito'));
  console.log(underline('Texto Sublinhado'));

  console.log('\n--- Combinações ---');
  console.log(bold(red('Erro Crítico em Negrito e Vermelho')));
  console.log(green(bold('Sucesso em Negrito e Verde')));
  console.log(`Você pode misturar texto normal com ${cyan('texto colorido')} no meio de uma frase.`);
}