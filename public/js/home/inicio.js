// inicio.js - Versão moderna sem jQuery
document.addEventListener("DOMContentLoaded", function () {
  // ===== 1. SCROLL SUAVE NOS LINKS DO MENU =====
  const navLinks = document.querySelectorAll('.navbar a, footer a[href="#myPage"]');

  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      const hash = this.getAttribute('href');

      // Só ativa se for um link interno (#secao)
      if (hash.startsWith('#') && hash !== '#') {
        e.preventDefault();

        const target = document.querySelector(hash);
        if (target) {
          const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 60; // 60px = altura da navbar fixa

          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });

          // Atualiza URL com o hash
          history.pushState(null, null, hash);
        }
      }
    });
  });

  // ===== 2. ANIMAÇÃO DE ENTRADA (slideanim → slide) =====
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('slide');
        // Opcional: parar de observar após animar
        // observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px' // ativa um pouco antes
  });

  // Observa todos os elementos com .slideanim
  document.querySelectorAll('.slideanim').forEach(el => {
    observer.observe(el);
  });
});