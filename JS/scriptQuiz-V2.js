let selectedAnswers = [];

const allQuestions = {
  maths: [
        {
            question: "What is the value of 25 × 12 – 150 ÷ 5?",
            options: ["270", "270.5", "285", "285.5"],
            answer: "270",
            explanation: "25 × 12 = 300, 150 ÷ 5 = 30, So, 300 – 30 = 270"
        },
        {
            question: "Find the odd one and replace it : 1, 4, 16, 28, 49 ",
            options: ["12", "25", "36", "41"],
            answer: "25",
            explanation: "the sequence of perfect squares : 1, 4, 9, 16, 25, 36, 49,... here the 9 and 36 are missing but the odd one is 28 instead of 25."
        },
        {
            question: "If a train runs at 60 km/hr and covers 180 km, how long does it take?",
            options: ["2 hours", "3 hours", "4 hours", "5 hours"],
            answer: "3 hours",
            explanation: "Time = Distance ÷ Speed = 180 ÷ 60 = 3 hours"
        },
        {
            question: "What is the average of first five even numbers?",
            options: ["5", "6", "4", "8"],
            answer: "6",
            explanation: "Average = (2 + 4 + 6 + 8 + 10) ÷ 5 <br>= 30 ÷ 5 <br>= 6"
        },
        {
            question: "Who is the GOAT of Football?",
            options: ["Pele", "Diego Maradona", "Cristiano Ronaldo", "Lionel Messi"],
            answer: "Lionel Messi",
            explanation: "No need, because it’s a fact and we all know that."
        }
    ],

  science: [
    { question: "Which gas is used in fire extinguishers?", options: ["Oxygen", "Carbon Dioxide", "Hydrogen", "Nitrogen"], answer: "Carbon Dioxide", explanation: "Carbon dioxide is non-flammable and displaces oxygen, helping to suffocate fires and prevent them from spreading." },
    { question: "Which law explains motion?", options: ["Ohm's Law", "Newton's Laws", "Snell's Law", "Hooke's Law"], answer: "Newton's Laws", explanation: "Newton's Laws of Motion describe the relationship between a body and the forces acting on it, explaining how motion occurs." },
    { question: "Which part of plant does photosynthesis?", options: ["Root", "Stem", "Leaf", "Flower"], answer: "Leaf", explanation: "Leaves contain chloroplasts with chlorophyll, which capture sunlight to perform photosynthesis." },
    { question: "Which organ purifies blood?", options: ["Liver", "Kidney", "Heart", "Lungs"], answer: "Kidney", explanation: "Kidneys filter waste, excess water, and toxins from the blood to form urine, thus purifying the blood." },
    { question: "Who is the GOAT of Football?", options: ["Pele", "Diego Maradona", "Cristiano Ronaldo", "Lionel Messi"], answer: "Lionel Messi", explanation: "No need, because it’s a fact and we all know that." }
  ],

  geography: [
    { question: "What causes rainfall?", options: ["Evaporation", "Condensation", "Photosynthesis", "Sublimation"], answer: "Condensation", explanation: "Rainfall occurs when water vapor in the atmosphere cools, condenses into water droplets, and falls to the ground due to gravity." },
    { question: "Which is a landform?", options: ["River", "Ocean", "Valley", "Rain"], answer: "Valley", explanation: "A valley is a natural depression or low area between hills or mountains, typically formed by erosion or glacier movement." },
    { question: "Which is a water body?", options: ["Mountain", "Lake", "Volcano", "Canyon"], answer: "Lake", explanation: "A lake is a large, inland body of standing water surrounded by land, making it a natural water body." },
    { question: "Which is a natural disaster?", options: ["Rain", "Flood", "Cloud", "Wind"], answer: "Flood", explanation: "A flood is a natural disaster caused by overflowing water submerging normally dry land, often due to heavy rainfall or dam failure." },
    { question: "Who is the GOAT of Football?", options: ["Pele", "Diego Maradona", "Cristiano Ronaldo", "Lionel Messi"], answer: "Lionel Messi", explanation: "No need, because it’s a fact and we all know that." }
  ],

  general: [] // will be filled dynamically
};

let questions = [];
let currentIndex = 0;
let score = 0;
let timer;
let selectedCategory = "";

const questionEl = document.getElementById("question");
const questionNumEl = document.getElementById("questionNumber");
const answersEl = document.getElementById("answers");
const nextBtn = document.getElementById("nextBtn");
const timerEl = document.getElementById("timer");

function startQuiz(category) {
  selectedCategory = category;

  const startContainer = document.getElementById("startScreen");
  const quizContainer = document.getElementById("quizContainer");

  // Add fade-out animation to start screen
  startContainer.classList.add("fade-out");

  // After fade-out is done, hide start and show quiz with slide-in
  setTimeout(() => {
    startContainer.style.display = "none";
    quizContainer.style.display = "block";
    quizContainer.classList.add("animate-slide-in");

    // Remove animation class after it's done
    setTimeout(() => {
      quizContainer.classList.remove("animate-slide-in");
    }, 700);

    // Handle category logic
    if (category === "general") {
      const pool = [...allQuestions.maths, ...allQuestions.science, ...allQuestions.geography];
      const selected = [];
      const usedCategories = { maths: 0, science: 0, geography: 0 };

      while (selected.length < 4) {
        const rand = pool[Math.floor(Math.random() * pool.length)];
        for (let key in allQuestions) {
          if (key !== "general" && allQuestions[key].includes(rand)) {
            if (usedCategories[key] < 2 && !selected.includes(rand)) {
              usedCategories[key]++;
              selected.push(rand);
            }
          }
        }
      }

      selected.push({
        question: "Who is the GOAT of Football?",
        options: ["Pele", "Diego Maradona", "Cristiano Ronaldo", "Lionel Messi"],
        answer: "Lionel Messi",
        explanation: "No need, because it’s a fact and we all know that."
      });

      questions = selected;
    } 
    else {
      questions = allQuestions[category];
    }

    document.getElementById("startScreen").style.display = "none";
    showQuestion();
  }, 500); // Match with fade-out duration
}

function showQuestion() {
  clearInterval(timer);

  const questionBox = document.getElementById("questionBox");
  questionBox.classList.remove("slide-in-question"); // Reset

  // Add fade-out animation
  questionBox.classList.add("fade-out-question");

  // After fade-out completes, update question and slide in
  setTimeout(() => {
    questionBox.classList.remove("fade-out-question");

    // Start timer
    timerEl.innerText = "Time Left: 60s";
    let timeLeft = 60;
    timer = setInterval(() => {
      timeLeft--;
      timerEl.innerText = `Time Left: ${timeLeft}s`;
      if (timeLeft === 0) {
        clearInterval(timer);
        disableOptions();
        nextBtn.style.display = "block";
      }
    }, 1000);

    updateProgressBar();
    resetState();

    const q = questions[currentIndex];
    questionNumEl.innerText = `Q${currentIndex + 1} of ${questions.length}`;
    questionEl.innerText = q.question;

    q.options.forEach(opt => {
      const btn = document.createElement("button");
      btn.innerText = opt;
      btn.onclick = () => selectAnswer(btn, q.answer);
      answersEl.appendChild(btn);
    });

    // Add slide-in animation after updating question
    questionBox.classList.add("slide-in-question");

  }, 300); // This matches fade-out duration
}

function resetState() {
  nextBtn.style.display = "none";
  answersEl.innerHTML = "";
}

function updateProgressBar() {
  const progressPercent = ((currentIndex + 1) / questions.length) * 100;
  document.getElementById("progressBar").style.width = `${progressPercent}%`;
}

function selectAnswer(button, correct) {
  clearInterval(timer);
  const selected = button.innerText;

  selectedAnswers.push({
    question: questions[currentIndex].question,
    correctAnswer: correct,
    selectedAnswer: selected,
    explanation: questions[currentIndex].explanation
  });

  if (selected === correct) {
    score++;
    button.style.backgroundColor = "#28a745";
  } else {
    button.style.backgroundColor = "#dc3545";
  }

  disableOptions(correct);
  nextBtn.style.display = "block";
}

function disableOptions(correct = "") {
  Array.from(answersEl.children).forEach(btn => {
    btn.disabled = true;
    if (btn.innerText === correct) {
      btn.style.backgroundColor = "#28a745";
    }
  });
}

function nextQuestion() {
  currentIndex++;
  if (currentIndex < questions.length) {
    showQuestion();
  } else {
    showScore();
  }
}

function showScore() {
  resetState();
  document.getElementById("quizContainer").innerHTML = `
    <h2>Quiz Complete!</h2>
    <p>Your Score: ${score} / ${questions.length}</p>
    <h3>Review:</h3>
    <div id="review"></div>
    <button class="btn" onclick="location.reload()">Restart Quiz</button>
  `;

  const reviewDiv = document.getElementById("review");

  selectedAnswers.forEach((item, index) => {
    const isCorrect = item.correctAnswer === item.selectedAnswer;
    const block = document.createElement("div");
    block.style.margin = "15px 0";
    block.style.padding = "10px";
    block.style.border = "1px solid #ccc";
    block.style.borderRadius = "8px";
    block.style.backgroundColor = isCorrect ? "#d4edda" : "#f8d7da";

    block.innerHTML = `
      <strong>Q${index + 1}:</strong> ${item.question}<br/>
      <strong>Your Answer:</strong> ${item.selectedAnswer}<br/>
      <strong>Correct Answer:</strong> ${item.correctAnswer}<br/>
      <strong>Explanation:</strong> ${item.explanation}
    `;
    reviewDiv.appendChild(block);
  });
}
