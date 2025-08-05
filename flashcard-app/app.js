// localstorage for decks, theme, achievements
let userDecks = JSON.parse(localStorage.getItem('userDecks') || '[]')
let selectedDeckIndex = userDecks.length ? 0 : null
let achievements = JSON.parse(localStorage.getItem('achievements') || '[]')
let theme = JSON.parse(localStorage.getItem('theme') || '{}')
let currentDeck = userDecks[selectedDeckIndex] || { title: '', tag: '', cards: [] }
let currentCardIdx = 0
let mergeMode = false
let mergeSelection = []

const trendingDecks = [
  {
    title: "World Capitals",
    author: "alex_edu",
    tag: "Geography",
    cards: [
      {question: "Capital of France?", answer: "Paris"},
      {question: "Capital of Japan?", answer: "Tokyo"},
      {question: "Capital of Brazil?", answer: "Brasília"},
      {question: "Capital of Canada?", answer: "Ottawa"},
      {question: "Capital of Australia?", answer: "Canberra"},
      {question: "Capital of India?", answer: "New Delhi"},
      {question: "Capital of Egypt?", answer: "Cairo"},
      {question: "Capital of Germany?", answer: "Berlin"},
      {question: "Capital of South Korea?", answer: "Seoul"},
      {question: "Capital of Italy?", answer: "Rome"}
    ]
  },
  {
    title: "SAT Vocab",
    author: "maya_g",
    tag: "Language",
    cards: [
      {question: "Loquacious", answer: "Talkative"},
      {question: "Ephemeral", answer: "Lasting a very short time"},
      {question: "Obfuscate", answer: "To make unclear"},
      {question: "Prosaic", answer: "Dull or unimaginative"},
      {question: "Austere", answer: "Severe or strict in manner"},
      {question: "Capricious", answer: "Impulsive or unpredictable"},
      {question: "Gregarious", answer: "Sociable"},
      {question: "Lethargic", answer: "Sluggish or apathetic"},
      {question: "Ostentatious", answer: "Flashy or showy"},
      {question: "Reticent", answer: "Reserved or quiet"}
    ]
  },
  {
    title: "Basic Algebra",
    author: "mathfan123",
    tag: "Math",
    cards: [
      {question: "Solve: x + 3 = 7", answer: "x = 4"},
      {question: "What is 2(x+1)?", answer: "2x + 2"},
      {question: "Slope of y = 3x + 2?", answer: "3"},
      {question: "What is the y-intercept of y = 2x + 5?", answer: "5"},
      {question: "Simplify: 2x + 3x", answer: "5x"},
      {question: "What is x if 5x = 20?", answer: "4"},
      {question: "Expand: (x + 2)(x - 2)", answer: "x^2 - 4"},
      {question: "What is the solution to x^2 = 9?", answer: "x = 3 or x = -3"},
      {question: "Factor: x^2 + 2x + 1", answer: "(x + 1)^2"},
      {question: "If f(x) = x^2, what is f(4)?", answer: "16"}
    ]
  },
  {
    title: "US Presidents",
    author: "historybuff",
    tag: "History",
    cards: [
      {question: "1st US President?", answer: "George Washington"},
      {question: "President during Civil War?", answer: "Abraham Lincoln"},
      {question: "32nd President?", answer: "Franklin D. Roosevelt"},
      {question: "Wrote the Declaration of Independence?", answer: "Thomas Jefferson"},
      {question: "Youngest President?", answer: "Theodore Roosevelt"},
      {question: "President after JFK?", answer: "Lyndon B. Johnson"},
      {question: "President during WWI?", answer: "Woodrow Wilson"},
      {question: "Only president to resign?", answer: "Richard Nixon"},
      {question: "Actor before president?", answer: "Ronald Reagan"},
      {question: "Tallest president?", answer: "Abraham Lincoln"}
    ]
  },
  {
    title: "Spanish Basics",
    author: "luna_lang",
    tag: "Language",
    cards: [
      {question: "Hola", answer: "Hello"},
      {question: "Gracias", answer: "Thank you"},
      {question: "Perro", answer: "Dog"},
      {question: "Gato", answer: "Cat"},
      {question: "Casa", answer: "House"},
      {question: "Libro", answer: "Book"},
      {question: "Agua", answer: "Water"},
      {question: "Escuela", answer: "School"},
      {question: "Comida", answer: "Food"},
      {question: "Rojo", answer: "Red"}
    ]
  }
]

function applyTheme() {
  document.body.classList.toggle("dark", theme.darkMode)
  document.body.style.fontFamily = theme.font || 'Segoe UI, Arial, sans-serif'
  document.documentElement.style.setProperty('--card-color', theme.cardColor || '#fff')
}

function saveTheme() {
  localStorage.setItem('theme', JSON.stringify(theme))
  applyTheme()
}

document.getElementById('dark-mode-toggle').checked = !!theme.darkMode
document.getElementById('dark-mode-toggle').onchange = e => {
  theme.darkMode = e.target.checked
  saveTheme()
}
document.getElementById('card-color-select').value = theme.cardColor || '#fff'
document.getElementById('card-color-select').onchange = e => {
  theme.cardColor = e.target.value
  saveTheme()
}
document.getElementById('font-select').value = theme.font || 'Segoe UI, Arial, sans-serif'
document.getElementById('font-select').onchange = e => {
  theme.font = e.target.value
  saveTheme()
}
applyTheme()

function saveUserDecks() {
  localStorage.setItem('userDecks', JSON.stringify(userDecks))
}
function saveAchievements() {
  localStorage.setItem('achievements', JSON.stringify(achievements))
}

function setCurrentDeck(idx) {
  selectedDeckIndex = idx
  currentDeck = userDecks[idx]
  currentCardIdx = 0
  renderCurrentDeckTitle()
  renderCard()
  renderUserMenu()
  renderFlashcardControls()
}

function renderCurrentDeckTitle() {
  let deck = currentDeck
  document.getElementById('current-deck-title').textContent =
    deck && deck.title ? `Deck: ${deck.title}` + (deck.tag ? ` [${deck.tag}]` : '') : ''
}

function renderCard() {
  const container = document.getElementById('flashcard-container')
  if (!currentDeck || !currentDeck.cards.length) {
    container.textContent = 'no flashcards yet.'
    document.getElementById('flashcard-controls').innerHTML = ''
    return
  }
  const card = currentDeck.cards[currentCardIdx]
  container.innerHTML = `<div id="card" style="font-family: ${theme.font || 'Segoe UI, Arial, sans-serif'};">
      <span>${card.showAnswer ? card.answer : card.question}</span>
    </div>`
  document.getElementById('card').onclick = function() {
    card.showAnswer = !card.showAnswer
    renderCard()
  }
  renderFlashcardControls()
}

function renderFlashcardControls() {
  let controls = ''
  if (!currentDeck || !currentDeck.cards.length) {
    document.getElementById('flashcard-controls').innerHTML = ''
    return
  }
  if (currentDeck.cards.length > 1) {
    controls += `<button class="flashcard-move-btn" id="move-up-btn" title="move card up">&#8593;</button>`
    controls += `<button class="flashcard-move-btn" id="move-down-btn" title="move card down">&#8595;</button>`
  }
  controls += `<button class="flashcard-move-btn" id="delete-card-btn" title="delete this card">&#128465;</button>`
  document.getElementById('flashcard-controls').innerHTML = controls

  if (document.getElementById('move-up-btn')) {
    document.getElementById('move-up-btn').onclick = function() {
      moveCard(-1)
    }
  }
  if (document.getElementById('move-down-btn')) {
    document.getElementById('move-down-btn').onclick = function() {
      moveCard(1)
    }
  }
  if (document.getElementById('delete-card-btn')) {
    document.getElementById('delete-card-btn').onclick = function() {
      if (confirm("delete this card?")) {
        currentDeck.cards.splice(currentCardIdx, 1)
        if (currentCardIdx >= currentDeck.cards.length) currentCardIdx = currentDeck.cards.length - 1
        userDecks[selectedDeckIndex] = currentDeck
        saveUserDecks()
        renderCard()
        renderUserMenu()
      }
    }
  }
}

function moveCard(direction) {
  const idx = currentCardIdx
  const cards = currentDeck.cards
  const newIdx = idx + direction
  if (newIdx < 0 || newIdx >= cards.length) return
  ;[cards[idx], cards[newIdx]] = [cards[newIdx], cards[idx]]
  currentCardIdx = newIdx
  userDecks[selectedDeckIndex] = currentDeck
  saveUserDecks()
  renderCard()
}

document.getElementById('flashcard-form').onsubmit = function(e) {
  e.preventDefault()
  if (!currentDeck) {
    alert('start a deck first!')
    return
  }
  const questionInput = document.getElementById('question')
  const answerInput = document.getElementById('answer')
  currentDeck.cards.push({question: questionInput.value, answer: answerInput.value, showAnswer: false})
  questionInput.value = ''
  answerInput.value = ''
  currentCardIdx = currentDeck.cards.length - 1
  userDecks[selectedDeckIndex] = currentDeck
  saveUserDecks()
  renderCard()
  renderUserMenu()
}

document.getElementById('prev').onclick = function() {
  if (!currentDeck || !currentDeck.cards.length) return
  currentCardIdx = (currentCardIdx - 1 + currentDeck.cards.length) % currentDeck.cards.length
  renderCard()
}
document.getElementById('next').onclick = function() {
  if (!currentDeck || !currentDeck.cards.length) return
  currentCardIdx = (currentCardIdx + 1) % currentDeck.cards.length
  renderCard()
}

document.getElementById('share-btn').onclick = function() {
  if (!currentDeck || !currentDeck.cards.length) return
  const card = currentDeck.cards[currentCardIdx]
  const shareText = `flashcard from deck "${currentDeck.title}"\nq: ${card.question}\na: ${card.answer}`
  navigator.clipboard.writeText(shareText).then(() => {
    alert('flashcard copied to clipboard! share it anywhere you like.')
  })
}

document.getElementById('deck-form').onsubmit = function(e) {
  e.preventDefault()
  const deckTitleInput = document.getElementById('deck-title-input')
  const deckTagInput = document.getElementById('deck-tag-input')
  const title = deckTitleInput.value.trim()
  const tag = deckTagInput.value.trim()
  if (!title) return
  if (currentDeck && currentDeck.title && currentDeck.cards.length) {
    userDecks[selectedDeckIndex] = currentDeck
    saveUserDecks()
  }
  const newDeck = { title, tag, cards: [] }
  userDecks.push(newDeck)
  if (!achievements.includes('created10') && userDecks.length >= 10) {
    achievements.push('created10')
    saveAchievements()
    showBadges()
    setTimeout(() => alert("achievement unlocked: created 10 decks!"), 250)
  }
  saveUserDecks()
  selectedDeckIndex = userDecks.length - 1
  currentDeck = newDeck
  currentCardIdx = 0
  renderCurrentDeckTitle()
  renderCard()
  renderUserMenu()
  deckTitleInput.value = ''
  deckTagInput.value = ''
}

function renderUserMenu() {
  const menuDiv = document.getElementById('user-menu')
  const searchVal = (document.getElementById('deck-search')?.value || '').toLowerCase()
  const filterVal = document.getElementById('deck-filter')?.value || ''
  let decksToShow = userDecks
  if (searchVal) {
    decksToShow = decksToShow.filter(deck =>
      deck.title.toLowerCase().includes(searchVal) ||
      (deck.tag && deck.tag.toLowerCase().includes(searchVal))
    )
  }
  if (filterVal) {
    decksToShow = decksToShow.filter(deck => deck.tag === filterVal)
  }
  if (!decksToShow.length) {
    menuDiv.innerHTML = `<div style="color:#b883a6;opacity:.7;font-size:1em;">no decks found.</div>`
    return
  }
  menuDiv.innerHTML = decksToShow.map((deck, i) => {
    const deckIdx = userDecks.findIndex(d => d === deck)
    let sel = (deckIdx === selectedDeckIndex) ? ' selected' : ''
    if (mergeMode && mergeSelection.includes(deckIdx)) sel += ' selected'
    return `
      <div class="user-deck${sel}" data-i="${deckIdx}">
        <button class="user-deck-delete" title="delete deck" data-del="${deckIdx}">&times;</button>
        <button class="user-deck-dup" title="duplicate deck" data-dup="${deckIdx}">&#x2398; copy</button>
        <button class="user-deck-merge" title="select deck for merge" data-merge="${deckIdx}" style="display:${mergeMode?'inline-block':'none'}">&#x271A; merge</button>
        <div class="user-deck-title">${deck.title}</div>
        <div class="user-deck-tag">${deck.tag ? `[${deck.tag}]` : ''}</div>
        <div class="user-deck-count">${deck.cards.length} cards</div>
      </div>
    `
  }).join('')
  menuDiv.querySelectorAll('.user-deck').forEach(deckDiv => {
    deckDiv.onclick = function(e) {
      if (e.target.classList.contains('user-deck-delete') || e.target.classList.contains('user-deck-dup') || e.target.classList.contains('user-deck-merge')) return
      const idx = parseInt(deckDiv.getAttribute('data-i'))
      setCurrentDeck(idx)
    }
  })
  menuDiv.querySelectorAll('.user-deck-delete').forEach(btn => {
    btn.onclick = function(e) {
      e.stopPropagation()
      const idx = parseInt(btn.getAttribute('data-del'))
      if (confirm(`delete deck "${userDecks[idx].title}"?`)) {
        userDecks.splice(idx, 1)
        if (userDecks.length === 0) {
          selectedDeckIndex = null
          currentDeck = { title: '', tag: '', cards: [] }
        } else if (selectedDeckIndex >= userDecks.length) {
          selectedDeckIndex = userDecks.length - 1
          currentDeck = userDecks[selectedDeckIndex]
        } else {
          currentDeck = userDecks[selectedDeckIndex]
        }
        saveUserDecks()
        renderCurrentDeckTitle()
        renderCard()
        renderUserMenu()
      }
    }
  })
  menuDiv.querySelectorAll('.user-deck-dup').forEach(btn => {
    btn.onclick = function(e) {
      e.stopPropagation()
      const idx = parseInt(btn.getAttribute('data-dup'))
      duplicateDeck(idx)
    }
  })
  if (mergeMode) {
    menuDiv.querySelectorAll('.user-deck-merge').forEach(btn => {
      btn.onclick = function(e) {
        e.stopPropagation()
        const idx = parseInt(btn.getAttribute('data-merge'))
        selectForMerge(idx)
      }
    })
  }
}
function duplicateDeck(idx) {
  let orig = userDecks[idx]
  let newTitle = orig.title.endsWith(" (Copy)") ? orig.title : orig.title + " (Copy)"
  let count = 1
  let tempTitle = newTitle
  while (userDecks.some(d => d.title === tempTitle)) {
    count++
    tempTitle = newTitle + " " + count
  }
  let newDeck = {
    title: tempTitle,
    tag: orig.tag,
    cards: orig.cards.map(card => ({...card}))
  }
  userDecks.push(newDeck)
  saveUserDecks()
  renderUserMenu()
  showBadges()
}
function selectForMerge(idx) {
  if (mergeSelection.includes(idx)) {
    mergeSelection = mergeSelection.filter(i => i !== idx)
  } else {
    if (mergeSelection.length === 2) mergeSelection.shift()
    mergeSelection.push(idx)
  }
  renderUserMenu()
  if (mergeSelection.length === 2) {
    setTimeout(doMerge, 300)
  }
}
function doMerge() {
  if (mergeSelection.length !== 2) return
  let [i1, i2] = mergeSelection
  let d1 = userDecks[i1], d2 = userDecks[i2]
  let merged = {
    title: `${d1.title} + ${d2.title}`,
    tag: d1.tag === d2.tag ? d1.tag : '',
    cards: [...d1.cards.map(card => ({...card})), ...d2.cards.map(card => ({...card}))]
  }
  userDecks.push(merged)
  saveUserDecks()
  mergeMode = false
  mergeSelection = []
  document.getElementById('merge-hint').style.display = "none"
  renderUserMenu()
  showBadges()
  alert("decks merged!")
}
document.getElementById('deck-search').oninput = renderUserMenu
document.getElementById('deck-filter').onchange = renderUserMenu

document.getElementById('merge-mode-btn').onclick = function() {
  mergeMode = !mergeMode
  mergeSelection = []
  document.getElementById('merge-hint').style.display = mergeMode ? "block" : "none"
  renderUserMenu()
}

function renderTrendingDecks() {
  const trendDiv = document.getElementById('trending-decks')
  trendDiv.innerHTML = trendingDecks.map((deck, i) => `
    <div class="trending-deck">
      <div class="trending-deck-title">${deck.title}</div>
      <div class="trending-deck-author">by ${deck.author}</div>
      <div class="trending-deck-count">${deck.cards.length} cards</div>
      <button class="trending-add-btn" data-i="${i}">
        add to my decks
      </button>
    </div>
  `).join('')
  trendDiv.querySelectorAll('.trending-add-btn').forEach(btn => {
    btn.onclick = function() {
      const idx = btn.getAttribute('data-i')
      addTrendingDeckToUserDecks(trendingDecks[idx])
    }
  })
}
function addTrendingDeckToUserDecks(deck) {
  if (userDecks.some(d => d.title === deck.title)) {
    alert('you already have a deck with this title!')
    return
  }
  userDecks.push({
    title: deck.title,
    tag: deck.tag || '',
    cards: deck.cards.map(card => ({...card}))
  })
  saveUserDecks()
  renderUserMenu()
  showBadges()
  alert(`added "${deck.title}" to your decks!`)
}

function showBadges() {
  let badgeArea = document.getElementById('badge-area')
  badgeArea.innerHTML = ''
  if (achievements.includes('created10'))
    badgeArea.innerHTML += `<span class="badge">&#11088; created 10 decks!</span>`
}

let quizMode = false, quizCards = [], quizIdx = 0, quizMistakes = [], quizState = {}
document.getElementById('quiz-mode-btn').onclick = function() {
  if (!currentDeck || !currentDeck.cards.length) {
    alert("please select a deck with at least one flashcard!")
    return
  }
  startQuizMode()
}
function startQuizMode() {
  quizMode = true
  quizCards = currentDeck.cards.map(card => ({
    ...card,
    correct: null,
    seenAnswer: false
  }))
  quizIdx = 0
  quizMistakes = []
  quizState = {}
  showQuizCard()
  document.getElementById('quiz-modal').style.display = "block"
  document.body.style.overflow = "hidden"
}
function showQuizCard() {
  let main = document.getElementById('quiz-main')
  if (quizIdx >= quizCards.length) {
    let nCorrect = quizCards.filter(c => c.correct === true).length
    let nTotal = quizCards.length
    let wrong = quizCards.filter(c => c.correct === false)
    main.innerHTML = `<div class="quiz-summary">
      <b>quiz complete!</b><br>
      score: ${nCorrect} / ${nTotal} correct<br>
      ${wrong.length ? `<div style="margin-top:10px; color:#d72660;">review your mistakes below:</div>
        <ul style="text-align:left;">${
          wrong.map(c => `<li><b>q:</b> ${c.question}<br/><b>a:</b> ${c.answer}</li>`).join('')
        }</ul>` : `<div style="margin-top:10px;color:green;">perfect score! 🎉</div>`}
      <button class="quiz-btn" onclick="closeQuizMode()">close</button>
    </div>`
    return
  }
  let card = quizCards[quizIdx]
  main.innerHTML = `
    <div class="quiz-card" style="font-family:${theme.font || 'Segoe UI, Arial, sans-serif'};">
      <div class="quiz-q">${card.question}</div>
      ${card.seenAnswer ? `
        <div class="quiz-a">${card.answer}</div>
        <div class="quiz-btn-row">
          <button class="quiz-btn" id="mark-correct-btn">&#10003; correct</button>
          <button class="quiz-btn" id="mark-wrong-btn">&#10007; incorrect</button>
        </div>
      ` : `<button class="quiz-btn" id="reveal-answer-btn" style="margin-bottom:24px;">show answer</button>`}
      <div class="quiz-flag">${quizIdx+1} / ${quizCards.length}</div>
      <div class="quiz-mistake">${card.correct === false ? "marked as incorrect" : ""}</div>
    </div>
  `
  if (!card.seenAnswer) {
    document.getElementById('reveal-answer-btn').onclick = function() {
      card.seenAnswer = true
      showQuizCard()
    }
  }
  if (card.seenAnswer) {
    document.getElementById('mark-correct-btn').onclick = function() {
      card.correct = true
      quizIdx++
      showQuizCard()
    }
    document.getElementById('mark-wrong-btn').onclick = function() {
      card.correct = false
      quizMistakes.push(card)
      quizIdx++
      showQuizCard()
    }
  }
}
window.closeQuizMode = function() {
  quizMode = false
  document.getElementById('quiz-modal').style.display = "none"
  document.body.style.overflow = ""
}
document.getElementById('close-quiz-btn').onclick = closeQuizMode

document.addEventListener('DOMContentLoaded', function() {
  var memoryBtn = document.getElementById('memory-mode-btn')
  if (memoryBtn) {
    memoryBtn.addEventListener('click', startMemoryMatch)
  }
})

let memoryTimerInterval = null
let memoryStartTime = null

document.addEventListener('DOMContentLoaded', function() {
  var memoryBtn = document.getElementById('memory-mode-btn')
  if (memoryBtn) {
    memoryBtn.addEventListener('click', startMemoryMatch)
  }
})

function startMemoryMatch() {
  if (!currentDeck || !currentDeck.cards.length) {
    alert('Please select a deck with cards')
    return
  }
  var pairs = []
  currentDeck.cards.forEach(function(card) {
    pairs.push({ value: card.question, match: card.answer, type: 'q' })
    pairs.push({ value: card.answer, match: card.question, type: 'a' })
  })
  var deck = shuffle(pairs)
  var board = document.getElementById('memory-board')
  board.innerHTML = ''
  let timerDiv = document.getElementById('memory-timer')
  timerDiv.textContent = "Time: 00:00.000"
  timerDiv.style.display = "block"

  var first = null, lock = false, matched = 0

  function formatTime(ms) {
    let total = ms
    let min = Math.floor(total / 60000)
    total = total % 60000
    let sec = Math.floor(total / 1000)
    let msStr = String(total % 1000).padStart(3, '0')
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}.${msStr}`
  }

  function updateTimer() {
    if (!memoryStartTime) return
    let ms = Date.now() - memoryStartTime
    timerDiv.textContent = "Time: " + formatTime(ms)
  }

  memoryStartTime = Date.now()
  updateTimer()
  if (memoryTimerInterval) clearInterval(memoryTimerInterval)
  memoryTimerInterval = setInterval(updateTimer, 31)

  deck.forEach(function(pair) {
    var card = document.createElement('div')
    card.className = 'memory-card'
    card.dataset.value = pair.value
    card.dataset.match = pair.match
    card.textContent = ''
    board.appendChild(card)

    card.onclick = function() {
      if (lock || card.classList.contains('flipped') || card.classList.contains('matched')) return
      card.classList.add('flipped')
      card.textContent = pair.value
      if (!first) {
        first = card
      } else {
        lock = true
        if (
          (first.dataset.value === card.dataset.match && card.dataset.value === first.dataset.match)
        ) {
          first.classList.add('matched')
          card.classList.add('matched')
          matched += 2
          first = null
          lock = false
          if (matched === deck.length) {
            if (memoryTimerInterval) clearInterval(memoryTimerInterval)
            let ms = Date.now() - memoryStartTime
            timerDiv.textContent = "Time: " + formatTime(ms)
            setTimeout(() => {
              alert("You finished! Time: " + formatTime(ms))
              timerDiv.style.display = "none"
              board.innerHTML = ""
            }, 600)
          }
        } else {
          setTimeout(function() {
            first.classList.remove('flipped')
            card.classList.remove('flipped')
            first.textContent = ''
            card.textContent = ''
            first = null
            lock = false
          }, 800)
        }
      }
    }
  })
}

function shuffle(array) {
  return array.sort(function() { return Math.random() - 0.5 })
}

// make sure you keep the rest of your original app.js logic below!



// initialize
renderCurrentDeckTitle()
renderCard()
renderUserMenu()
renderTrendingDecks()
showBadges()
