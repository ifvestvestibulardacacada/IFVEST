// Flash Messages - Popup/Toast de confirmação
(function() {
  'use strict';

  // Auto-remover mensagens após 5 segundos
  const flashMessages = document.querySelectorAll('.flash-message');
  
  flashMessages.forEach(message => {
    // Botão de fechar manual
    const closeBtn = message.querySelector('.flash-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        message.style.animation = 'fadeOut 0.3s ease-in forwards';
        setTimeout(() => message.remove(), 300);
      });
    }

    // Auto-remover após 5 segundos
    setTimeout(() => {
      if (message.parentNode) {
        message.style.animation = 'fadeOut 0.3s ease-in forwards';
        setTimeout(() => message.remove(), 300);
      }
    }, 5000);
  });
})();
