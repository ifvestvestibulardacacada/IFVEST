// navega-flashcards.js

document.addEventListener('DOMContentLoaded', () => {
  const flashcards = document.querySelectorAll('.flashcard');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const progressIndicator = document.getElementById('progress-indicator');
  
  const totalCards = flashcards.length;
  let currentIndex = 0;

  if (totalCards === 0) return;

  function updateView() {
    flashcards.forEach((card, index) => {
      card.classList.remove('active');
      card.classList.remove('flip'); 
    });
    flashcards[currentIndex].classList.add('active');
    progressIndicator.textContent = `${currentIndex + 1} / ${totalCards}`;
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === totalCards - 1;
  }

  nextBtn.addEventListener('click', () => {
    if (currentIndex < totalCards - 1) {
      currentIndex++;
      updateView();
    }
  });

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateView();
    }
  });

  document.querySelectorAll('.ver-resposta').forEach(button => {
    button.addEventListener('click', (event) => {
      const flashcard = event.target.closest('.flashcard');
      flashcard.classList.add('flip');
    });
  });

  document.querySelectorAll('.ver-pergunta').forEach(button => {
    button.addEventListener('click', (event) => {
      const flashcard = event.target.closest('.flashcard');
      flashcard.classList.remove('flip');
    });
  });

  updateView();
});
