// === Dados do quiz (20 perguntas) ===
const quizData = [
  { question: "Qual linguagem é usada para estruturar o conteúdo de páginas web?", options: ["Python","HTML","CSS","SQL"], correctIndex: 1 },
  { question: "Qual tecnologia é usada principalmente para estilizar páginas web?", options: ["CSS","C#","Bash","Assembly"], correctIndex: 0 },
  { question: "Qual linguagem roda no navegador e é usada para adicionar interatividade?", options: ["JavaScript","PHP","Go","Rust"], correctIndex: 0 },
  { question: "O que significa HTML?", options: ["HyperText Markup Language","HighText Machine Language","Hyperlinking Text Markup Level","Home Tool Markup Language"], correctIndex: 0 },
  { question: "Qual atributo define o texto alternativo de uma imagem em HTML?", options: ["title","alt","src","caption"], correctIndex: 1 },
  { question: "Qual tag HTML cria um link clicável?", options: ["<link>","<a>","<href>","<url>"], correctIndex: 1 },
  { question: "Em CSS, como você seleciona um elemento com id 'menu'?", options: ["#menu",".menu","menu","*menu"], correctIndex: 0 },
  { question: "Em CSS, como você aplica estilo a todas as tags <p>?", options: ["#p","p",".p","*p"], correctIndex: 1 },
  { question: "Qual meta tag define a viewport para responsividade?", options: ['<meta name="viewport" content="width=device-width, initial-scale=1">','<meta charset="utf-8">','<meta name="author">','<meta http-equiv="refresh">'], correctIndex: 0 },
  { question: "Qual propriedade CSS altera a cor do texto?", options: ["background-color","color","font-color","text-color"], correctIndex: 1 },
  { question: "Em JavaScript, qual comando mostra uma caixa de alerta ao usuário?", options: ["console.log()","alert()","print()","show()"], correctIndex: 1 },
  { question: "Como declarar uma variável em JavaScript (ES6)?", options: ["var idade = 20;","let idade = 20;","int idade = 20;","dim idade = 20;"], correctIndex: 1 },
  { question: "Qual método percorre cada item de um array em JavaScript?", options: ["map()","forEach()","filter()","slice()"], correctIndex: 1 },
  { question: "Qual é o propósito do atributo 'src' em uma tag <script>?", options: ["Definir tipo de script","Conectar arquivo JS externo","Incluir CSS","Executar função"], correctIndex: 1 },
  { question: "Em HTML semântico, qual tag é indicada para conteúdo principal da página?", options: ["<section>","<main>","<div>","<article>"], correctIndex: 1 },
  { question: "O que é responsividade em web design?", options: ["Design fixo","Página que se adapta a diferentes telas","Só funciona em mobile","Backup do site"], correctIndex: 1 },
  { question: "Qual protocolo é utilizado para carregar páginas web de modo seguro?", options: ["HTTP","FTP","SMTP","HTTPS"], correctIndex: 3 },
  { question: "Em formulários HTML, qual atributo define que um campo é obrigatório?", options: ["required","need","mandatory","validate"], correctIndex: 0 },
  { question: "O que faz o método fetch() no JavaScript moderno?", options: ["Cria elementos DOM","Faz requisições HTTP/HTTPS","Manipula CSS","Executa SQL"], correctIndex: 1 },
  { question: "Qual tag serve para incluir uma imagem em HTML?", options: ["<image>","<img>","<picture>","<media>"], correctIndex: 1 }
];

// === Embaralhar perguntas aleatoriamente ===
quizData.sort(() => Math.random() - 0.5);

// === Estado ===
let currentIndex = 0;
let selectedAnswers = Array(quizData.length).fill(null);
let username = "";

// === Elementos DOM ===
const startScreen = document.getElementById('start-screen');
const startBtn = document.getElementById('start-btn');
const usernameInput = document.getElementById('username');

const quizEl = document.getElementById('quiz');
const questionTitle = document.getElementById('question-title');
const optionsWrap = document.getElementById('options');
const currentSpan = document.getElementById('current');
const totalSpan = document.getElementById('total');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

const resultScreen = document.getElementById('result-screen');
const resultName = document.getElementById('result-name');
const scoreSummary = document.getElementById('score-summary');
const performanceMessage = document.getElementById('performance-message');
const restartBtn = document.getElementById('restart-btn');

const totalQuestions = quizData.length;
totalSpan.textContent = totalQuestions;

// === Inicialização ===
startBtn.addEventListener('click', () => {
  const nameVal = usernameInput.value.trim();
  username = nameVal !== "" ? nameVal : "Usuário";
  startScreen.classList.add('hidden');
  quizEl.classList.remove('hidden');
  renderQuestion();
});

function renderQuestion() {
  const q = quizData[currentIndex];
  currentSpan.textContent = currentIndex + 1;

  // Numeração dinâmica (1), (2), etc
  questionTitle.textContent = `${currentIndex + 1}) ${q.question}`;

  // limpar opções
  optionsWrap.innerHTML = "";

  q.options.forEach((optText, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'option-btn';
    btn.textContent = optText;
    btn.dataset.index = idx;
    btn.addEventListener('click', () => selectOption(idx, btn));
    optionsWrap.appendChild(btn);

    // se já havia seleção, marcar
    if (selectedAnswers[currentIndex] === idx) {
      btn.classList.add('selected');
      nextBtn.disabled = false;
    }
  });

  // controlar botões Anterior/Próxima
  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = selectedAnswers[currentIndex] === null;
}

// marca a seleção para a questão atual
function selectOption(idx, btnElement) {
  document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
  btnElement.classList.add('selected');

  selectedAnswers[currentIndex] = idx;
  nextBtn.disabled = false;
}

// Navegação
prevBtn.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    renderQuestion();
  }
});

nextBtn.addEventListener('click', () => {
  if (selectedAnswers[currentIndex] === null) {
    alert("Por favor, escolha uma alternativa antes de avançar.");
    return;
  }

  if (currentIndex === totalQuestions - 1) {
    finishQuiz();
  } else {
    currentIndex++;
    renderQuestion();
  }
});

// Calcula resultado e mostra tela
function finishQuiz() {
  const unanswered = selectedAnswers.some(ans => ans === null);
  if (unanswered) {
    const confirmar = confirm("Algumas questões não foram respondidas. Deseja finalizar mesmo assim?");
    if (!confirmar) return;
  }

  let correctCount = 0;
  for (let i = 0; i < quizData.length; i++) {
    if (selectedAnswers[i] === quizData[i].correctIndex) correctCount++;
  }

  const wrongCount = totalQuestions - correctCount;
  const percent = Math.round((correctCount / totalQuestions) * 100);

  quizEl.classList.add('hidden');
  resultScreen.classList.remove('hidden');

  resultName.textContent = username;
  scoreSummary.innerHTML = `Acertos: <strong>${correctCount}</strong> &nbsp; | &nbsp; Erros: <strong>${wrongCount}</strong> &nbsp; | &nbsp; Aproveitamento: <strong>${percent}%</strong>`;

  let message = "";
  if (percent >= 80) message = "Excelente!";
  else if (percent >= 50) message = "Bom desempenho";
  else message = "Precisa melhorar";
  performanceMessage.textContent = message;

  renderChart(correctCount, wrongCount);
}

let chartInstance = null;
function renderChart(correct, wrong) {
  const ctx = document.getElementById('result-chart').getContext('2d');
  if (chartInstance) chartInstance.destroy();
  chartInstance = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Acertos', 'Erros'],
      datasets: [{
        data: [correct, wrong],
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
        title: { display: true, text: 'Proporção de Acertos x Erros' }
      }
    }
  });
}

// Reiniciar
restartBtn.addEventListener('click', () => {
  selectedAnswers = Array(quizData.length).fill(null);
  currentIndex = 0;
  usernameInput.value = "";
  username = "";
  resultScreen.classList.add('hidden');
  startScreen.classList.remove('hidden');
});
