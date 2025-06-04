const questions = [
  {
    question: "What does CSS stand for? 🎨",
    hint: "It describes how HTML elements are displayed.",
    answers: [
      { text: "Creative Style Sheets", correct: false },
      { text: "Cascading Style Sheets", correct: true },
      { text: "Computer Style System", correct: false },
      { text: "Colorful Style Setup", correct: false },
    ]
  },
  {
    question: "Which HTML tag is used for a heading? 📜",
    hint: "It starts with 'h' and a number.",
    answers: [
      { text: "<p>", correct: false },
      { text: "<h1>", correct: true },
      { text: "<div>", correct: false },
      { text: "<span>", correct: false },
    ]
  },
  {
    question: "What is the purpose of Flexbox in CSS? 🧑‍💻",
    hint: "It helps with layout alignment.",
    answers: [
      { text: "To animate elements", correct: false },
      { text: "To style fonts", correct: false },
      { text: "To align and distribute space", correct: true },
      { text: "To create 3D effects", correct: false },
    ]
  },
  {
    question: "Which method adds an element to the DOM? 🌟",
    hint: "It involves 'adding' a child node.",
    answers: [
      { text: "removeChild()", correct: false },
      { text: "appendChild()", correct: true },
      { text: "replaceChild()", correct: false },
      { text: "deleteChild()", correct: false },
    ]
  },
  {
    question: "What does the 'alt' attribute do in an <img> tag? 🖼️",
    hint: "It’s for accessibility.",
    answers: [
      { text: "Sets the image size", correct: false },
      { text: "Provides alternative text", correct: true },
      { text: "Links to another page", correct: false },
      { text: "Changes the image color", correct: false },
    ]
  },
  {
    question: "Which CSS property controls text size? 📝",
    hint: "It includes the word 'size'.",
    answers: [
      { text: "text-align", correct: false },
      { text: "font-size", correct: true },
      { text: "line-height", correct: false },
      { text: "text-decoration", correct: false },
    ]
  },
  {
    question: "What is the default display value of a <div>? 🏗️",
    hint: "It takes up the full width.",
    answers: [
      { text: "inline", correct: false },
      { text: "block", correct: true },
      { text: "flex", correct: false },
      { text: "grid", correct: false },
    ]
  },
  {
    question: "Which event fires when a user clicks an element? 🖱️",
    hint: "It starts with 'on' and ends with 'click'.",
    answers: [
      { text: "onhover", correct: false },
      { text: "onclick", correct: true },
      { text: "onfocus", correct: false },
      { text: "onload", correct: false },
    ]
  },
  {
    question: "What does media query help with in CSS? 📱",
    hint: "It adjusts styles based on device characteristics.",
    answers: [
      { text: "Playing videos", correct: false },
      { text: "Adding audio", correct: false },
      { text: "Responsive design", correct: true },
      { text: "Changing colors", correct: false },
    ]
  },
  {
    question: "Which JavaScript method loops through an array? 🔄",
    hint: "It ends with 'Each'.",
    answers: [
      { text: "forEach()", correct: true },
      { text: "loop()", correct: false },
      { text: "while()", correct: false },
      { text: "iterate()", correct: false },
    ]
  }
];

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const startBtn = document.getElementById("start-btn");
const userNameInput = document.getElementById("user-name");
const difficultySelect = document.getElementById("difficulty-select");
const questionEl = document.getElementById("question");
const answerBtns = document.getElementById("answer-buttons");
const nextBtn = document.getElementById("next-btn");
const backBtn = document.getElementById("back-btn");
const skipBtn = document.getElementById("skip-btn");
const hintBtn = document.getElementById("hint-btn");
const scoreEl = document.getElementById("score");
const streakEl = document.getElementById("streak");
const timerEl = document.getElementById("timer");
const progressBar = document.getElementById("progress-bar");
const resultsEl = document.getElementById("results");
const notificationEl = document.getElementById("notification");
const themeToggle = document.getElementById("theme-toggle");

let currentQuestionIndex = 0;
let score = 0;
let streak = 0;
let timer;
let timeLeft;
let userName = "";
let answersLog = [];
let shuffledQuestions = [];
let backgroundColors = [
  "linear-gradient(135deg, #6b7280, #1e3a8a)",
  "linear-gradient(135deg, #e11d48, #be123c)",
  "linear-gradient(135deg, #15803d, #4ade80)",
  "linear-gradient(135deg, #7e22ce, #c084fc)",
  "linear-gradient(135deg, #d97706, #facc15)"
];

const correctSound = new Audio("https://www.myinstants.com/media/sounds/success_1.mp3");
const wrongSound = new Audio("https://www.myinstants.com/media/sounds/wrong_1.mp3");

// Theme Toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  themeToggle.innerText = document.body.classList.contains("dark-mode") ? "☀️ Light Mode" : "🌙 Dark Mode";
});

// Shuffle array function
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

startBtn.addEventListener("click", () => {
  userName = userNameInput.value.trim();
  if (!userName) {
    alert("Please enter your name!");
    return;
  }
  const difficulty = difficultySelect.value;
  timeLeft = difficulty === "easy" ? 40 : difficulty === "medium" ? 30 : 20;
  startScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");
  startQuiz();
});

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  streak = 0;
  answersLog = [];
  // Shuffle questions and answers
  shuffledQuestions = shuffle([...questions]);
  shuffledQuestions.forEach(question => {
    question.answers = shuffle([...question.answers]);
  });
  scoreEl.innerText = `Score: ${score}`;
  streakEl.innerText = `Streak: ${streak}`;
  updateProgressBar();
  changeBackground();
  showQuestion();
  startTimer();
}

function showQuestion() {
  resetState();
  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  questionEl.innerText = `${currentQuestionIndex + 1}. ${currentQuestion.question}`;
  backBtn.style.display = currentQuestionIndex > 0 ? "inline-block" : "none";

  currentQuestion.answers.forEach(answer => {
    const li = document.createElement("li");
    li.innerText = answer.text;
    li.addEventListener("click", () => selectAnswer(li, answer.correct, answer.text));
    answerBtns.appendChild(li);
  });
}

function resetState() {
  nextBtn.style.display = "none";
  hintBtn.style.display = "inline-block";
  notificationEl.classList.add("hidden");
  resultsEl.classList.add("hidden");
  while (answerBtns.firstChild) {
    answerBtns.removeChild(answerBtns.firstChild);
  }
  clearInterval(timer);
  const difficulty = difficultySelect.value;
  timeLeft = difficulty === "easy" ? 40 : difficulty === "medium" ? 30 : 20;
  timerEl.innerText = `Time: ${timeLeft}s`;
  startTimer();
}

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    timerEl.innerText = `Time: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      selectAnswer(null, false, null);
    }
  }, 1000);
}

async function fetchQuote() {
  try {
    const response = await fetch("https://api.quotable.io/random?tags=motivational");
    const data = await response.json();
    return data.content || "Almost correct, stay positive!";
  } catch (error) {
    return "Almost correct, stay positive!";
  }
}

async function selectAnswer(button, isCorrect, answerText) {
  clearInterval(timer);
  hintBtn.style.display = "none";
  if (button) {
    if (isCorrect) {
      button.classList.add("correct");
      score++;
      streak++;
      scoreEl.innerText = `Score: ${score}`;
      streakEl.innerText = `Streak: ${streak}`;
      correctSound.play();
    } else {
      button.classList.add("wrong");
      streak = 0;
      streakEl.innerText = `Streak: ${streak}`;
      wrongSound.play();
      const quote = await fetchQuote();
      notificationEl.innerText = quote;
      notificationEl.classList.remove("hidden");
    }
  } else {
    streak = 0;
    streakEl.innerText = `Streak: ${streak}`;
    wrongSound.play();
    const quote = await fetchQuote();
    notificationEl.innerText = quote;
    notificationEl.classList.remove("hidden");
  }
  answersLog.push({
    question: shuffledQuestions[currentQuestionIndex].question,
    selected: answerText || "Time's up",
    correct: shuffledQuestions[currentQuestionIndex].answers.find(a => a.correct).text,
    isCorrect
  });

  Array.from(answerBtns.children).forEach(btn => {
    btn.style.pointerEvents = "none";
    if (shuffledQuestions[currentQuestionIndex].answers.find(a => a.text === btn.innerText).correct) {
      btn.classList.add("correct");
    }
  });
  nextBtn.style.display = "block";
}

hintBtn.addEventListener("click", () => {
  score = Math.max(0, score - 1);
  scoreEl.innerText = `Score: ${score}`;
  notificationEl.innerText = `Hint: ${shuffledQuestions[currentQuestionIndex].hint}`;
  notificationEl.classList.remove("hidden");
  hintBtn.style.display = "none";
});

function updateProgressBar() {
  const progress = ((currentQuestionIndex + 1) / shuffledQuestions.length) * 100;
  progressBar.style.width = `${progress}%`;
}

function changeBackground() {
  const colorIndex = currentQuestionIndex % backgroundColors.length;
  document.body.style.background = backgroundColors[colorIndex];
}

function showScore() {
  resetState();
  hintBtn.style.display = "none";
  questionEl.innerText = `🎉 ${userName}, you scored ${score} out of ${shuffledQuestions.length}!`;
  backBtn.style.display = "none";
  skipBtn.style.display = "none";
  nextBtn.innerText = "Play Again";
  nextBtn.style.display = "block";
  nextBtn.onclick = () => {
    startScreen.classList.remove("hidden");
    quizScreen.classList.add("hidden");
  };

  const correctCount = answersLog.filter(log => log.isCorrect).length;
  const incorrectCount = answersLog.length - correctCount;
  resultsEl.innerHTML = `
    <h3>Results Summary 📊</h3>
    <p>Correct: <span style="color: #065f46; font-weight: bold;">${correctCount}</span></p>
    <p>Incorrect: <span style="color: #991b1b; font-weight: bold;">${incorrectCount}</span></p>
  `;
  answersLog.forEach((log, index) => {
    resultsEl.innerHTML += `
      <p><strong>Q${index + 1}: ${log.question}</strongifornbr>
      Your Answer: ${log.selected}<br>
      Correct Answer: ${log.correct}<br>
      <span style="color: ${log.isCorrect ? '#065f46' : '#991b1b'}">
        ${log.isCorrect ? 'Correct ✅' : 'Incorrect ❌'}
      </span></p>
    `;
  });
  resultsEl.classList.remove("hidden");

  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
}

nextBtn.addEventListener("click", () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < shuffledQuestions.length) {
    changeBackground();
    showQuestion();
    updateProgressBar();
  } else {
    showScore();
  }
});

backBtn.addEventListener("click", () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    answersLog.pop();
    const difficulty = difficultySelect.value;
    timeLeft = difficulty === "easy" ? 40 : difficulty === "medium" ? 30 : 20;
    changeBackground();
    showQuestion();
    updateProgressBar();
  }
});

skipBtn.addEventListener("click", () => {
  answersLog.push({
    question: shuffledQuestions[currentQuestionIndex].question,
    selected: "Skipped",
    correct: shuffledQuestions[currentQuestionIndex].answers.find(a => a.correct).text,
    isCorrect: false
  });
  currentQuestionIndex++;
  const difficulty = difficultySelect.value;
  timeLeft = difficulty === "easy" ? 40 : difficulty === "medium" ? 30 : 20;
  if (currentQuestionIndex < shuffledQuestions.length) {
    changeBackground();
    showQuestion();
    updateProgressBar();
  } else {
    showScore();
  }
});