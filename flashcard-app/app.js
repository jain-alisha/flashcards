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
document.getElementById('share-btn').onclick = function() {
  if (!flashcards.length) return;
  const card = flashcards[current];
  // For demo, copy question+answer as text
  const shareText = `Flashcard\nQ: ${card.question}\nA: ${card.answer}`;
  navigator.clipboard.writeText(shareText).then(() => {
    alert('Flashcard copied to clipboard! Share it anywhere you like.');
  });
};
// Dummy trending data - you can expand!
const trending = [
  { question: "What is the capital of France?", answer: "Paris" },
  { question: "2 + 2 × 2 = ?", answer: "6" },
  { question: "Largest mammal?", answer: "Blue whale" },
  { question: "Photosynthesis makes what?", answer: "Glucose & Oxygen" },
  { question: "Meaning of 'carpe diem'?", answer: "Seize the day" },
  { question: "Who wrote 'Romeo and Juliet'?", answer: "William Shakespeare" },
  // ...more!
];

function renderTrending() {
  const trendDiv = document.getElementById('trending-cards');
  trendDiv.innerHTML = trending.map(card => `
    <div class="trending-card">
      <div class="trending-q">${card.question}</div>
      <div class="trending-a">${card.answer}</div>
    </div>
  `).join('');
}
renderTrending();

renderCard();
