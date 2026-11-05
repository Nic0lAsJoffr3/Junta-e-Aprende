const entryView = document.getElementById("entry-view");
const playedView = document.getElementById("played-view");
const gameView = document.getElementById("game-view");
const resultView = document.getElementById("result-view");


const entryForm = document.getElementById("entry-form");
const entryStatus = document.getElementById("entry-status");
const codeField = document.getElementById("code-field");
const codeInput = document.getElementById("room-code");
const nameInput = document.getElementById("player-name");


const playedMessage = document.getElementById("played-message");
const playedScore = document.getElementById("played-score");


const gameHeading = document.getElementById("game-heading");
const gameProgress = document.getElementById("game-progress");
const gameStatus = document.getElementById("game-status");


const gameLayout = document.getElementById("game-layout");
const connectionLayer = document.getElementById("connection-layer");
const questionsList = document.getElementById("questions-list");
const answersList = document.getElementById("answers-list");
const confirmButton = document.getElementById("confirm-button");


const questionSelectionHint =
  document.getElementById("question-selection-hint");
const answerSelectionHint =
  document.getElementById("answer-selection-hint");


const resultMessage = document.getElementById("result-message");
const resultScore = document.getElementById("result-score");
const resultList = document.getElementById("result-list");


const bodyElement = document.body;


const CONNECTION_COLORS = [
  "#2563eb",
  "#dc2626",
  "#16a34a",
  "#d97706",
  "#7c3aed",
  "#0891b2",
  "#db2777",
  "#65a30d",
  "#ea580c",
  "#4f46e5",
  "#0d9488",
  "#be123c",
  "#ca8a04",
  "#9333ea",
  "#0369a1",
  "#15803d",
  "#b91c1c",
  "#7e22ce",
  "#0f766e",
  "#a16207"
];


let currentGame = null;
let currentItems = [];
let selectedQuestionId = null;
let selectedAnswerId = null;
const selections = new Map();


function updateRotationLock() {
  const isGameVisible = !gameView.hidden;


  bodyElement.classList.toggle("game-active", isGameVisible);
}


function showView(view) {
  [entryView, playedView, gameView, resultView].forEach(section => {
    section.hidden = true;
    section.removeAttribute("aria-current");
  });


  view.hidden = false;
  view.setAttribute("aria-current", "page");


  const heading = view.querySelector("h2");


  if (heading) {
    heading.setAttribute("tabindex", "-1");
    heading.focus({ preventScroll: true });
  }


  updateRotationLock();
  window.scrollTo({ top: 0, behavior: "smooth" });
}


function showMessage(text, isError = false) {
  entryStatus.textContent = text;
  entryStatus.classList.toggle("error", isError);
}


function getCodeFromUrl() {
  const params = new URLSearchParams(location.search);
  return params.get("code");
}


function getPlayedGame(code) {
  try {
    const value = localStorage.getItem(`junta_played_${code}`);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}


function savePlayedGame(code, playerName, score, total, answers, resetVersion) {
  const record = {
    code,
    name: playerName,
    score,
    total,
    answers,
    reset_version: resetVersion,
    played_at: new Date().toISOString()
  };


  localStorage.setItem(`junta_played_${code}`, JSON.stringify(record));
}


function shuffle(array) {
  const copy = [...array];


  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }


  return copy;
}


function focusField(field) {
  if (!field) return;


  field.focus();
  field.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}


function getQuestionButton(questionId) {
  return questionsList.querySelector(
    `[data-question-id="${questionId}"]`
  );
}


function getAnswerButton(answerId) {
  return answersList.querySelector(
    `[data-answer-id="${answerId}"]`
  );
}


function updateSelectionHints() {
  if (selectedQuestionId) {
    const question = currentItems.find(
      item => item.id === selectedQuestionId
    );


    questionSelectionHint.textContent =
      `Pergunta selecionada: ${question.question}`;
    questionSelectionHint.style.color = "var(--theme-accent)";
  } else {
    questionSelectionHint.textContent =
      "Toque em uma pergunta para selecioná-la.";
    questionSelectionHint.style.color = "";
  }


  if (selectedAnswerId) {
    const answer = currentItems.find(
      item => item.id === selectedAnswerId
    );


    answerSelectionHint.textContent =
      `Resposta selecionada: ${answer.answer}`;
    answerSelectionHint.style.color = "var(--theme-accent)";
  } else {
    answerSelectionHint.textContent =
      "Toque em uma resposta para selecioná-la.";
    answerSelectionHint.style.color = "";
  }
}


function updateProgress() {
  const total = currentItems.length;
  const answered = selections.size;


  gameProgress.textContent =
    answered === total
      ? `Todas as ${total} perguntas foram associadas.`
      : `${answered} de ${total} perguntas associadas.`;


  confirmButton.disabled = answered !== total;
}


function clearTemporarySelection() {
  selectedQuestionId = null;
  selectedAnswerId = null;


  questionsList
    .querySelectorAll(".option")
    .forEach(button => {
      button.classList.remove("selected");
      button.setAttribute("aria-pressed", "false");
    });


  answersList
    .querySelectorAll(".option")
    .forEach(button => {
      button.classList.remove("selected");
      button.setAttribute("aria-pressed", "false");
    });


  updateSelectionHints();
}


function getConnectionColorForQuestion(questionId) {
  const questionIndex = currentItems.findIndex(
    item => item.id === questionId
  );


  return CONNECTION_COLORS[
    questionIndex % CONNECTION_COLORS.length
  ];
}


function clearConnectionStyles() {
  questionsList
    .querySelectorAll(".option")
    .forEach(button => {
      button.classList.remove("linked");
      button.style.color = "";
    });


  answersList
    .querySelectorAll(".option")
    .forEach(button => {
      button.classList.remove("linked");
      button.style.color = "";
    });
}


function removeAssociationsForQuestion(questionId) {
  selections.delete(questionId);
}


function removeAssociationsForAnswer(answerId) {
  for (const [questionId, linkedAnswerId] of selections.entries()) {
    if (linkedAnswerId === answerId) {
      selections.delete(questionId);
    }
  }
}


function drawConnections() {
  connectionLayer.innerHTML = "";
  clearConnectionStyles();


  const layoutRect = gameLayout.getBoundingClientRect();


  connectionLayer.setAttribute(
    "viewBox",
    `0 0 ${layoutRect.width} ${layoutRect.height}`
  );


  const isHorizontalLayout =
    questionsList.getBoundingClientRect().right <
    answersList.getBoundingClientRect().left;


  selections.forEach((answerId, questionId) => {
    const questionButton = getQuestionButton(questionId);
    const answerButton = getAnswerButton(answerId);


    if (!questionButton || !answerButton) {
      return;
    }


    const questionRect = questionButton.getBoundingClientRect();
    const answerRect = answerButton.getBoundingClientRect();


    const color = getConnectionColorForQuestion(questionId);


    const path = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );


    let pathData;


    if (isHorizontalLayout) {
      const startX = questionRect.right - layoutRect.left;
      const startY =
        questionRect.top + questionRect.height / 2 - layoutRect.top;


      const endX = answerRect.left - layoutRect.left;
      const endY =
        answerRect.top + answerRect.height / 2 - layoutRect.top;


      const controlX = (startX + endX) / 2;
      const controlY = (startY + endY) / 2;


      pathData =
        `M ${startX} ${startY} ` +
        `Q ${controlX} ${controlY} ${endX} ${endY}`;
    } else {
      const startX =
        questionRect.left + questionRect.width / 2 - layoutRect.left;
      const startY = questionRect.bottom - layoutRect.top;


      const endX =
        answerRect.left + answerRect.width / 2 - layoutRect.left;
      const endY = answerRect.top - layoutRect.top;


      const distance = Math.max(30, (endY - startY) / 2);


      pathData =
        `M ${startX} ${startY} ` +
        `C ${startX} ${startY + distance}, ` +
        `${endX} ${endY - distance}, ` +
        `${endX} ${endY}`;
    }


    path.setAttribute("d", pathData);
    path.setAttribute("class", "connection-line");
    path.setAttribute("stroke", color);


    connectionLayer.appendChild(path);


    questionButton.style.color = color;
    questionButton.classList.add("linked");


    answerButton.style.color = color;
    answerButton.classList.add("linked");
  });
}


function handleQuestionClick(questionId, button) {
  selectedQuestionId = questionId;


  questionsList
    .querySelectorAll(".option")
    .forEach(item => {
      item.classList.remove("selected");
      item.setAttribute("aria-pressed", "false");
    });


  button.classList.add("selected");
  button.setAttribute("aria-pressed", "true");


  if (selectedAnswerId) {
    removeAssociationsForQuestion(questionId);
    removeAssociationsForAnswer(selectedAnswerId);


    selections.set(questionId, selectedAnswerId);


    clearTemporarySelection();
    drawConnections();
  } else {
    removeAssociationsForQuestion(questionId);
    drawConnections();
    updateSelectionHints();
  }


  updateProgress();
}


function handleAnswerClick(answerId, button) {
  selectedAnswerId = answerId;


  answersList
    .querySelectorAll(".option")
    .forEach(item => {
      item.classList.remove("selected");
      item.setAttribute("aria-pressed", "false");
    });


  button.classList.add("selected");
  button.setAttribute("aria-pressed", "true");


  if (selectedQuestionId) {
    removeAssociationsForQuestion(selectedQuestionId);
    removeAssociationsForAnswer(answerId);


    selections.set(selectedQuestionId, answerId);


    clearTemporarySelection();
    drawConnections();
  } else {
    removeAssociationsForAnswer(answerId);
    drawConnections();
    updateSelectionHints();
  }


  updateProgress();
}


function renderGame() {
  gameHeading.textContent = currentGame.title;


  const questions = shuffle(currentItems);
  const answers = shuffle(currentItems);


  questionsList.innerHTML = "";
  answersList.innerHTML = "";
  clearTemporarySelection();
  selections.clear();
  connectionLayer.innerHTML = "";


  questions.forEach(item => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option";
    button.textContent = item.question;
    button.dataset.questionId = item.id;
    button.setAttribute("aria-pressed", "false");
    button.addEventListener("click", () => {
      handleQuestionClick(item.id, button);
    });


    questionsList.appendChild(button);
  });


  answers.forEach(item => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option";
    button.textContent = item.answer;
    button.dataset.answerId = item.id;
    button.setAttribute("aria-pressed", "false");
    button.addEventListener("click", () => {
      handleAnswerClick(item.id, button);
    });


    answersList.appendChild(button);
  });


  startScoring(currentItems.length);


  updateSelectionHints();
  updateProgress();
  gameStatus.textContent = "";
  showView(gameView);


  requestAnimationFrame(drawConnections);
}


function showPlayedGame(record) {
  playedMessage.textContent =
    `Você já concluiu esta partida como ${record.name}.`;


  playedScore.textContent = `${record.score} pontos`;
  showView(playedView);
}


function renderResult(finalScore, correctCount, total) {
  const percentage = Math.round((correctCount / total) * 100);


  resultMessage.textContent =
    percentage === 100
      ? "Excelente! Você associou todas as perguntas corretamente."
      : percentage >= 70
        ? "Muito bem! Você acertou a maior parte das associações."
        : "Continue praticando. Veja abaixo quais associações precisam de atenção.";


  resultScore.textContent = `${finalScore} pontos`;


  resultList.innerHTML = "";


  currentItems.forEach(item => {
    const selectedAnswerId = selections.get(item.id);
    const selectedAnswer = currentItems.find(
      answer => answer.id === selectedAnswerId
    );


    const isCorrect = selectedAnswerId === item.id;


    const listItem = document.createElement("li");
    listItem.className = `result-item ${isCorrect ? "correct" : "incorrect"}`;


    listItem.innerHTML = `
      <svg
        class="result-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        ${
          isCorrect
            ? '<path d="M20 6L9 17l-5-5"/>'
            : '<path d="M18 6L6 18M6 6l12 12"/>'
        }
      </svg>


      <div>
        <strong>${item.question}</strong>
        <p class="hint">
          Resposta correta: ${item.answer}.
          ${
            isCorrect
              ? "Você acertou."
              : `Você escolheu: ${
                  selectedAnswer ? selectedAnswer.answer : "nenhuma resposta"
                }.`
          }
        </p>
      </div>
    `;


    resultList.appendChild(listItem);
  });


  showView(resultView);
}


entryForm.addEventListener("submit", async event => {
  event.preventDefault();
  showMessage("");


  const code = codeInput.value.trim().toUpperCase();
  const playerName = nameInput.value.trim();


  if (!code) {
    showMessage("Informe o código da partida.", true);
    focusField(codeInput);
    return;
  }


  if (!playerName) {
    showMessage("Informe o seu nome.", true);
    focusField(nameInput);
    return;
  }


  const submitButton = entryForm.querySelector("button[type=submit]");
  submitButton.disabled = true;
  showMessage("Carregando partida...");


  try {
    const { data: game, error: gameError } = await juntaDB
      .from("games")
      .select("id, room_code, title, reset_version")
      .eq("room_code", code)
      .maybeSingle();


    if (gameError) throw gameError;


    if (!game) {
      showMessage("Código de partida não encontrado.", true);
      focusField(codeInput);
      return;
    }


    const playedRecord = getPlayedGame(code);
    const currentResetVersion = game.reset_version || 0;
    const playedResetVersion = playedRecord?.reset_version || 0;


    if (playedRecord && playedResetVersion >= currentResetVersion) {
      showPlayedGame(playedRecord);
      return;
    }


    if (playedRecord && playedResetVersion < currentResetVersion) {
      localStorage.removeItem(`junta_played_${code}`);
    }


    const { data: items, error: itemsError } = await juntaDB
      .from("game_items")
      .select("id, question, answer")
      .eq("game_id", game.id)
      .order("position");


    if (itemsError) throw itemsError;


    if (!items || items.length < 2) {
      showMessage("Esta partida ainda não possui perguntas suficientes.", true);
      return;
    }


    currentGame = game;
    currentItems = items;
    currentGame.playerName = playerName;


    renderGame();
  } catch (error) {
    showMessage(error.message || "Erro ao carregar a partida.", true);
  } finally {
    submitButton.disabled = false;
  }
});


confirmButton.addEventListener("click", async () => {
  if (!currentGame || selections.size !== currentItems.length) {
    gameStatus.textContent =
      "Associe todas as perguntas antes de confirmar.";
    gameStatus.classList.add("error");
    return;
  }


  const correctCount = currentItems.filter(item => {
    return selections.get(item.id) === item.id;
  }).length;


  for (let i = 0; i < correctCount; i++) {
    registerCorrectAnswer();
  }


  const finalScore = calculateFinalScore();
  const answers = Object.fromEntries(selections);


  savePlayedGame(
    currentGame.room_code,
    currentGame.playerName,
    finalScore,
    currentItems.length,
    answers,
    currentGame.reset_version || 0
  );


  try {
    await juntaDB
      .from("game_scores")
      .insert({
        game_id: currentGame.id,
        player_name: currentGame.playerName,
        score: finalScore,
        total: currentItems.length,
        reset_version: currentGame.reset_version || 0
      });
  } catch (error) {
    gameStatus.textContent =
      "Sua pontuação foi calculada, mas não pôde ser enviada ao placar.";
    gameStatus.classList.add("error");
  }


  renderResult(finalScore, correctCount, currentItems.length);
});


document.getElementById("back-to-entry").addEventListener("click", () => {
  entryForm.reset();
  showMessage("");
  showView(entryView);
});


window.addEventListener("resize", () => {
  if (!gameView.hidden) {
    drawConnections();
  }
});


window.addEventListener("scroll", () => {
  if (!gameView.hidden) {
    drawConnections();
  }
}, {
  passive: true
});


function prepareEntryByCode(code) {
  codeInput.value = code;
  codeField.hidden = true;
  codeInput.required = false;
  nameInput.focus();
}


applyInterfacePreferences();
showView(entryView);


const urlCode = getCodeFromUrl();


if (urlCode) {
  prepareEntryByCode(urlCode.toUpperCase());
}