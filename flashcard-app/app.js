let flashcards = JSON.parse(localStorage.getItem('flashcards') || '[]');
let current = 0;

function renderCard() {
  const container = document.getElementById('flashcard-container');
  if (!flashcards.length) {
    container.textContent = 'No flashcards yet.';
    return;
  }
  const card = flashcards[current];
  container.innerHTML = `<div id="card" style="cursor:pointer;padding:20px;border:1px solid #ccc;border-radius:8px;">
      <span>${card.showAnswer ? card.answer : card.question}</span>
    </div>`;
  document.getElementById('card').onclick = function() {
    card.showAnswer = !card.showAnswer;
    renderCard();
  };
}
document.getElementById('flashcard-form').onsubmit = function(e) {
  e.preventDefault();
  flashcards.push({question: question.value, answer: answer.value, showAnswer: false});
  localStorage.setItem('flashcards', JSON.stringify(flashcards));
  question.value = answer.value = '';
  current = flashcards.length - 1;
  renderCard();
};
document.getElementById('prev').onclick = function() {
  if (flashcards.length) {
    current = (current - 1 + flashcards.length) % flashcards.length;
    renderCard();
  }
};
document.getElementById('next').onclick = function() {
  if (flashcards.length) {
    current = (current + 1) % flashcards.length;
    renderCard();
  }
};
renderCard();
