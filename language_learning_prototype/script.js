const questionBank = {
  beginner: [
    { q: 'What does “Hola” mean?', hint: 'A common Spanish greeting.', options: ['Hello', 'Goodbye', 'Please', 'Sorry'], answer: 0, explain: 'Hola means Hello.' },
    { q: 'What does “Gracias” mean?', hint: 'A polite expression.', options: ['Good morning', 'Thank you', 'Good night', 'Excuse me'], answer: 1, explain: 'Gracias means Thank you.' },
    { q: 'What does “Agua” mean?', hint: 'You drink it every day.', options: ['Food', 'House', 'Water', 'Book'], answer: 2, explain: 'Agua means Water.' },
    { q: 'What does “Adiós” mean?', hint: 'You say this when leaving.', options: ['Welcome', 'Goodbye', 'Friend', 'Yes'], answer: 1, explain: 'Adiós means Goodbye.' },
    { q: 'What does “Por favor” mean?', hint: 'Use this when making a polite request.', options: ['Please', 'Thank you', 'Excuse me', 'Tomorrow'], answer: 0, explain: 'Por favor means Please.' }
  ],
  intermediate: [
    { q: 'What does “¿Cómo estás?” mean?', hint: 'A question about someone.', options: ['Where are you?', 'How are you?', 'What is your name?', 'How old are you?'], answer: 1, explain: '¿Cómo estás? means How are you?' },
    { q: 'What does “Tengo hambre” mean?', hint: 'It describes a physical need.', options: ['I am tired', 'I am thirsty', 'I am hungry', 'I am happy'], answer: 2, explain: 'Tengo hambre means I am hungry.' },
    { q: 'Choose the meaning of “Biblioteca”.', hint: 'A place where you borrow books.', options: ['Bookstore', 'Library', 'Classroom', 'Hospital'], answer: 1, explain: 'Biblioteca means Library.' },
    { q: 'What does “Hasta mañana” mean?', hint: 'A farewell referring to the next day.', options: ['See you tomorrow', 'See you later', 'Good evening', 'Have a nice day'], answer: 0, explain: 'Hasta mañana means See you tomorrow.' },
    { q: 'What does “Estoy aprendiendo español” mean?', hint: 'A sentence about studying a language.', options: ['I speak Spanish', 'I am learning Spanish', 'I teach Spanish', 'I like Spanish'], answer: 1, explain: 'Estoy aprendiendo español means I am learning Spanish.' }
  ],
  advanced: [
    { q: 'What does “Aunque llueva, saldré” mean?', hint: 'Aunque means “although”.', options: ['Because it rains, I will leave', 'Although it rains, I will go out', 'I hope it rains today', 'It will stop raining soon'], answer: 1, explain: 'Aunque llueva, saldré means Although it rains, I will go out.' },
    { q: 'Choose the meaning of “Aprovechar”.', hint: 'It often means making good use of something.', options: ['To forget', 'To take advantage of / make use of', 'To explain', 'To postpone'], answer: 1, explain: 'Aprovechar means to make use of or take advantage of.' },
    { q: 'What does “Me habría gustado ir” mean?', hint: 'This expresses an unrealised past wish.', options: ['I would have liked to go', 'I like going there', 'I will go tomorrow', 'I went yesterday'], answer: 0, explain: 'Me habría gustado ir means I would have liked to go.' },
    { q: 'Choose the meaning of “Sin embargo”.', hint: 'This phrase connects contrasting ideas.', options: ['Therefore', 'For example', 'However', 'Meanwhile'], answer: 2, explain: 'Sin embargo means However.' },
    { q: 'What does “No doy abasto” mean?', hint: 'An idiomatic expression about having too much to do.', options: ['I do not understand', 'I cannot keep up / I am overwhelmed', 'I have plenty of time', 'I do not agree'], answer: 1, explain: 'No doy abasto means I cannot keep up or I am overwhelmed.' }
  ]
};

const homeScreen = document.getElementById('home-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const levelLabel = document.getElementById('level-label');
const timerElement = document.getElementById('timer');
const timerBox = document.querySelector('.timer-box');
const questionCount = document.getElementById('question-count');
const progressPercent = document.getElementById('progress-percent');
const progressFill = document.getElementById('progress-fill');
const questionText = document.getElementById('question-text');
const questionHint = document.getElementById('question-hint');
const optionsContainer = document.getElementById('options');
const feedback = document.getElementById('feedback');
const nextButton = document.getElementById('next-button');
const answeredCount = document.getElementById('answered-count');

let currentLevel = 'beginner';
let questions = [];
let currentIndex = 0;
let score = 0;
let correctCount = 0;
let selectedAnswer = null;
let timeLeft = 20;
let timerId = null;
let hasAnswered = false;

function showScreen(screen) {
  [homeScreen, quizScreen, resultScreen].forEach(item => item.classList.add('hidden'));
  screen.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function startQuiz(level) {
  currentLevel = level;
  questions = [...questionBank[level]];
  currentIndex = 0;
  score = 0;
  correctCount = 0;
  showScreen(quizScreen);
  renderQuestion();
}

function renderQuestion() {
  clearInterval(timerId);
  selectedAnswer = null;
  hasAnswered = false;
  timeLeft = 20;
  const question = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  levelLabel.textContent = currentLevel.toUpperCase();
  questionCount.textContent = `QUESTION ${currentIndex + 1} OF ${questions.length}`;
  progressPercent.textContent = `${Math.round(progress)}%`;
  progressFill.style.width = `${progress}%`;
  questionText.textContent = question.q;
  questionHint.textContent = question.hint;
  timerElement.textContent = `${timeLeft}s`;
  timerBox.classList.remove('urgent');
  feedback.className = 'feedback hidden';
  feedback.textContent = '';
  answeredCount.textContent = `${currentIndex} of ${questions.length} completed`;
  nextButton.disabled = true;
  nextButton.textContent = currentIndex === questions.length - 1 ? 'View results →' : 'Next question →';

  optionsContainer.innerHTML = '';
  question.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.className = 'option';
    button.type = 'button';
    button.textContent = `${String.fromCharCode(65 + index)}. ${option}`;
    button.addEventListener('click', () => chooseAnswer(index));
    optionsContainer.appendChild(button);
  });

  timerId = setInterval(() => {
    timeLeft -= 1;
    timerElement.textContent = `${timeLeft}s`;
    if (timeLeft <= 5) timerBox.classList.add('urgent');
    if (timeLeft <= 0) {
      clearInterval(timerId);
      if (!hasAnswered) chooseAnswer(null);
    }
  }, 1000);
}

function chooseAnswer(index) {
  if (hasAnswered) return;
  hasAnswered = true;
  selectedAnswer = index;
  clearInterval(timerId);

  const question = questions[currentIndex];
  const optionButtons = [...optionsContainer.querySelectorAll('.option')];
  optionButtons.forEach((button, i) => {
    button.disabled = true;
    if (i === question.answer) button.classList.add('correct');
    if (i === index && index !== question.answer) button.classList.add('wrong');
    if (i === index && index === question.answer) button.classList.add('selected');
  });

  if (index === question.answer) {
    score += 10;
    correctCount += 1;
    feedback.textContent = `Correct! ${question.explain}`;
    feedback.className = 'feedback good';
  } else if (index === null) {
    feedback.textContent = `Time is up! ${question.explain}`;
    feedback.className = 'feedback bad';
  } else {
    feedback.textContent = `Not quite. ${question.explain}`;
    feedback.className = 'feedback bad';
  }

  answeredCount.textContent = `${currentIndex + 1} of ${questions.length} completed`;
  nextButton.disabled = false;
}

function showResults() {
  clearInterval(timerId);
  const total = questions.length;
  const wrong = total - correctCount;
  const accuracy = Math.round((correctCount / total) * 100);

  document.getElementById('final-score').textContent = score;
  document.getElementById('correct-total').textContent = correctCount;
  document.getElementById('wrong-total').textContent = wrong;
  document.getElementById('accuracy-total').textContent = `${accuracy}%`;

  let title = 'Keep practising!';
  let message = 'Review the answers and give it another try.';
  let icon = '📚';
  if (accuracy === 100) {
    title = 'Perfect score!';
    message = 'Excellent work. You got every question right.';
    icon = '🏆';
  } else if (accuracy >= 60) {
    title = 'Great effort!';
    message = 'You are making progress. Keep building your vocabulary.';
    icon = '🎉';
  }

  document.getElementById('result-title').textContent = title;
  document.getElementById('result-message').textContent = message;
  document.getElementById('result-icon').textContent = icon;
  showScreen(resultScreen);
}

document.querySelectorAll('.level-card').forEach(card => {
  card.addEventListener('click', () => startQuiz(card.dataset.level));
});

nextButton.addEventListener('click', () => {
  if (!hasAnswered) return;
  if (currentIndex < questions.length - 1) {
    currentIndex += 1;
    renderQuestion();
  } else {
    showResults();
  }
});

document.getElementById('back-home').addEventListener('click', () => {
  clearInterval(timerId);
  showScreen(homeScreen);
});
document.getElementById('levels-button').addEventListener('click', () => showScreen(homeScreen));
document.getElementById('retry-button').addEventListener('click', () => startQuiz(currentLevel));
