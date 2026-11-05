const QUESTION_LIMIT = 160;
const ANSWER_LIMIT = 400;
const TITLE_LIMIT = 120;
const MIN_ITEMS = 5;
const MAX_ITEMS = 20;


const SITE_URL = "https://junta.e.aprende.nicolasjoffre.com.br";


const views = {
  home: document.getElementById("home-view"),
  create: document.getElementById("create-view"),
  edit: document.getElementById("edit-view"),
  editor: document.getElementById("editor-view")
};


const itemsContainer = document.getElementById("items");
const editItemsContainer = document.getElementById("edit-items");
const gameForm = document.getElementById("game-form");
const loadForm = document.getElementById("load-form");
const editGameForm = document.getElementById("edit-game-form");


const status = document.getElementById("status");
const loadStatus = document.getElementById("load-status");
const editorStatus = document.getElementById("editor-status");
const resetStatus = document.getElementById("reset-status");


const result = document.getElementById("result");
const roomCode = document.getElementById("room-code");
const openScreenButton = document.getElementById("open-screen");


const editorRoomCode = document.getElementById("editor-room-code");
const editorOpenScreenButton = document.getElementById("editor-open-screen");
const resetScoresButton = document.getElementById("reset-scores");


const savedGamesContainer = document.getElementById("saved-games");
const noSavedGames = document.getElementById("no-saved-games");


const SCREEN_COLORS = [
  "#2563eb", "#1d4ed8", "#1e40af", "#3b82f6", "#0ea5e9",
  "#0284c7", "#0369a1", "#06b6d4", "#0891b2", "#0e7490",
  "#14b8a6", "#0d9488", "#0f766e", "#10b981", "#059669",
  "#047857", "#22c55e", "#16a34a", "#15803d", "#84cc16",
  "#65a30d", "#4d7c0f", "#eab308", "#ca8a04", "#a16207",
  "#f59e0b", "#d97706", "#b45309", "#f97316", "#ea580c",
  "#c2410c", "#ef4444", "#dc2626", "#b91c1c", "#ec4899",
  "#db2777", "#be185d", "#a855f7", "#9333ea", "#7c3aed"
];


const SCREEN_THEMES = [
  {
    value: "none",
    label: "Sem tema",
    icon: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9"/>
        <path d="M5.5 5.5l13 13"/>
      </svg>
    `
  },
  {
    value: "natureza",
    label: "Natureza",
    icon: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M11 20A7 7 0 019.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
        <path d="M2 21c0-3 1.85-5.36 5.08-6"/>
      </svg>
    `
  },
  {
    value: "espaco",
    label: "Espaço",
    icon: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z"/>
        <path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"/>
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
      </svg>
    `
  },
  {
    value: "tecnologia",
    label: "Tecnologia",
    icon: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="4" y="4" width="16" height="16" rx="2"/>
        <rect x="9" y="9" width="6" height="6"/>
        <path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3"/>
      </svg>
    `
  },
  {
    value: "oceano",
    label: "Oceano",
    icon: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
        <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
        <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
      </svg>
    `
  },
  {
    value: "feminino",
    label: "Feminino",
    icon: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="8" r="5"/>
        <path d="M12 13v8"/>
        <path d="M9 18h6"/>
      </svg>
    `
  },
  {
    value: "estudo",
    label: "Estudo",
    icon: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M22 10L12 5 2 10l10 5 10-5z"/>
        <path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5"/>
        <path d="M22 10v6"/>
      </svg>
    `
  },
  {
    value: "trabalho",
    label: "Trabalho",
    icon: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="2" y="7" width="20" height="14" rx="2"/>
        <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
        <path d="M2 13h20"/>
      </svg>
    `
  },
  {
    value: "masculino",
    label: "Masculino",
    icon: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="10" cy="14" r="6"/>
        <path d="M20 4l-5.5 5.5"/>
        <path d="M15 4h5v5"/>
      </svg>
    `
  }
];


const SCREEN_MODES = [
  {
    value: "light",
    label: "Claro",
    icon: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="4"/>
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
      </svg>
    `
  },
  {
    value: "dark",
    label: "Escuro",
    icon: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"/>
      </svg>
    `
  }
];


let editingGameId = null;
let editingRoomCode = null;
let currentScreenUrl = "";


function showView(name) {
  Object.values(views).forEach(view => {
    view.hidden = true;
    view.removeAttribute("aria-current");
  });


  views[name].hidden = false;
  views[name].setAttribute("aria-current", "page");


  const firstHeading = views[name].querySelector("h2");


  if (firstHeading) {
    firstHeading.setAttribute("tabindex", "-1");
    firstHeading.focus({ preventScroll: true });
  }


  window.scrollTo({ top: 0, behavior: "smooth" });
}


function normalizeText(value) {
  return value.trim().toLocaleLowerCase("pt-BR");
}


function getCookie(name) {
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name}=([^;]*)`)
  );


  return match ? decodeURIComponent(match[1]) : null;
}


function setCookie(name, value) {
  document.cookie =
    `${name}=${encodeURIComponent(value)}; ` +
    `path=/; max-age=31536000; SameSite=Lax`;
}


function getSavedGames() {
  try {
    const value = getCookie("junta_saved_games");
    return value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
}


function saveGameToDevice(game) {
  const games = getSavedGames().filter(item => item.code !== game.code);
  games.unshift(game);
  setCookie("junta_saved_games", JSON.stringify(games.slice(0, 20)));
  renderSavedGames();
}


function removeGameFromDevice(code) {
  const games = getSavedGames().filter(item => item.code !== code);
  setCookie("junta_saved_games", JSON.stringify(games));
  renderSavedGames();
}


function renderSavedGames() {
  const games = getSavedGames();
  savedGamesContainer.innerHTML = "";


  noSavedGames.hidden = games.length > 0;


  games.forEach(game => {
    const row = document.createElement("div");
    row.className = "saved-game";


    row.innerHTML = `
      <div>
        <strong>${game.code}</strong>
        <p class="hint">${game.title}</p>
      </div>


      <div class="saved-game-buttons">
        <button
          type="button"
          class="secondary open-saved"
          aria-label="Editar a partida ${game.title}"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M12 20h9"/>
            <path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4 12.5-12.5z"/>
          </svg>
          Editar
        </button>


        <button
          type="button"
          class="danger remove-saved"
          aria-label="Remover a partida ${game.title} deste dispositivo"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6"/>
          </svg>
          Remover
        </button>
      </div>
    `;


    row.querySelector(".open-saved").addEventListener("click", () => {
      openSavedGame(game);
    });


    row.querySelector(".remove-saved").addEventListener("click", () => {
      const confirmed = confirm(
        `Remover a partida "${game.title}" apenas deste dispositivo?`
      );


      if (!confirmed) return;


      row.classList.add("removing");


      setTimeout(() => {
        removeGameFromDevice(game.code);
      }, 180);
    });


    savedGamesContainer.appendChild(row);
  });
}


function createItem(container, question = "", answer = "") {
  if (container.children.length >= MAX_ITEMS) {
    return;
  }


  const row = document.createElement("div");
  row.className = "item";


  row.innerHTML = `
    <div>
      <label>Pergunta</label>
      <textarea
        class="question-input"
        required
        maxlength="${QUESTION_LIMIT}"
        placeholder="Digite a pergunta"
        aria-label="Pergunta"
      ></textarea>
      <span class="character-count" aria-live="polite">
        ${QUESTION_LIMIT} caracteres restantes
      </span>
    </div>


    <div>
      <label>Resposta</label>
      <textarea
        class="answer-input"
        required
        maxlength="${ANSWER_LIMIT}"
        placeholder="Digite a resposta"
        aria-label="Resposta"
      ></textarea>
      <span class="character-count" aria-live="polite">
        ${ANSWER_LIMIT} caracteres restantes
      </span>
    </div>


    <button
      type="button"
      class="danger remove-item"
      aria-label="Remover este par de pergunta e resposta"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6"/>
      </svg>
      Remover
    </button>
  `;


  const questionInput = row.querySelector(".question-input");
  const answerInput = row.querySelector(".answer-input");


  questionInput.value = question;
  answerInput.value = answer;


  updateCount(questionInput, QUESTION_LIMIT);
  updateCount(answerInput, ANSWER_LIMIT);


  questionInput.addEventListener("input", () => {
    updateCount(questionInput, QUESTION_LIMIT);
    questionInput.classList.remove("invalid");
  });


  answerInput.addEventListener("input", () => {
    updateCount(answerInput, ANSWER_LIMIT);
    answerInput.classList.remove("invalid");
  });


  row.querySelector(".remove-item").addEventListener("click", () => {
    row.remove();
  });


  container.appendChild(row);
}


function updateCount(input, limit) {
  const counter = input.parentElement.querySelector(".character-count");
  const remaining = limit - input.value.length;


  counter.textContent =
    remaining === 1
      ? "1 caractere restante"
      : `${remaining} caracteres restantes`;


  counter.classList.toggle("limit", remaining <= 20);
}


function focusField(field) {
  if (!field) return;


  field.focus();
  field.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });


  if (field.select) {
    field.select();
  }
}


function clearErrors(container) {
  container
    .querySelectorAll(".invalid")
    .forEach(field => field.classList.remove("invalid"));
}


function readPairs(container) {
  return [...container.querySelectorAll(".item")].map(row => ({
    question: row.querySelector(".question-input").value.trim(),
    answer: row.querySelector(".answer-input").value.trim(),
    questionField: row.querySelector(".question-input"),
    answerField: row.querySelector(".answer-input")
  }));
}


function validatePairs(container) {
  clearErrors(container);


  const pairs = readPairs(container);
  let firstErrorField = null;
  let errorMessage = "";


  if (pairs.length < MIN_ITEMS) {
    firstErrorField = pairs[pairs.length - 1]?.questionField;
    errorMessage = `A partida precisa ter pelo menos ${MIN_ITEMS} pares.`;
  } else if (pairs.length > MAX_ITEMS) {
    firstErrorField = pairs[0].questionField;
    errorMessage = `A partida pode ter no máximo ${MAX_ITEMS} pares.`;
  }


  if (errorMessage) {
    if (firstErrorField) firstErrorField.classList.add("invalid");
    focusField(firstErrorField);


    return {
      valid: false,
      message: errorMessage
    };
  }


  const questions = new Map();
  const answers = new Map();


  for (const pair of pairs) {
    if (!pair.question) {
      pair.questionField.classList.add("invalid");


      if (!firstErrorField) {
        firstErrorField = pair.questionField;
        errorMessage = "Preencha todas as perguntas.";
      }
    }


    if (!pair.answer) {
      pair.answerField.classList.add("invalid");


      if (!firstErrorField) {
        firstErrorField = pair.answerField;
        errorMessage = "Preencha todas as respostas.";
      }
    }
  }


  if (errorMessage) {
    focusField(firstErrorField);


    return {
      valid: false,
      message: errorMessage
    };
  }


  for (const pair of pairs) {
    const question = normalizeText(pair.question);
    const answer = normalizeText(pair.answer);


    if (question === answer) {
      pair.questionField.classList.add("invalid");
      pair.answerField.classList.add("invalid");


      if (!firstErrorField) {
        firstErrorField = pair.questionField;
        errorMessage = "Uma pergunta não pode ser igual à própria resposta.";
      }
    }


    if (questions.has(question)) {
      const previous = questions.get(question);


      previous.questionField.classList.add("invalid");
      pair.questionField.classList.add("invalid");


      if (!firstErrorField) {
        firstErrorField = previous.questionField;
        errorMessage = "Existem perguntas repetidas.";
      }
    } else {
      questions.set(question, pair);
    }


    if (answers.has(answer)) {
      const previous = answers.get(answer);


      previous.answerField.classList.add("invalid");
      pair.answerField.classList.add("invalid");


      if (!firstErrorField) {
        firstErrorField = previous.answerField;
        errorMessage = "Existem respostas repetidas.";
      }
    } else {
      answers.set(answer, pair);
    }
  }


  if (errorMessage) {
    focusField(firstErrorField);


    return {
      valid: false,
      message: errorMessage
    };
  }


  return {
    valid: true,
    pairs
  };
}


function generateCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";


  for (let i = 0; i < 6; i++) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }


  return code;
}


function showMessage(text, isError = false) {
  status.textContent = text;
  status.classList.toggle("error", isError);
  status.classList.toggle("success", !isError && text.length > 0);
}


function showLoadMessage(text, isError = false) {
  loadStatus.textContent = text;
  loadStatus.classList.toggle("error", isError);
}


function showEditorMessage(text, isError = false) {
  editorStatus.textContent = text;
  editorStatus.classList.toggle("error", isError);
  editorStatus.classList.toggle("success", !isError && text.length > 0);
}


function showResetMessage(text, isError = false) {
  resetStatus.textContent = text;
  resetStatus.classList.toggle("error", isError);
  resetStatus.classList.toggle("success", !isError && text.length > 0);
}


function getScreenUrl(code) {
  return `${SITE_URL}/tela.html?code=${encodeURIComponent(code)}`;
}


function showEditorGameSummary(code) {
  editingRoomCode = code;
  currentScreenUrl = getScreenUrl(code);


  if (editorRoomCode) {
    editorRoomCode.textContent = code;
  }
}


function createOptionButton({
  value,
  label,
  icon,
  attributeName,
  pressed
}) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "theme-button";
  button.setAttribute(attributeName, value);
  button.setAttribute("aria-pressed", pressed ? "true" : "false");
  button.innerHTML = `${icon}<span>${label}</span>`;


  return button;
}


function updateOptionButtons(container, attributeName, selectedValue) {
  container.querySelectorAll(`[${attributeName}]`).forEach(button => {
    button.setAttribute(
      "aria-pressed",
      button.getAttribute(attributeName) === selectedValue ? "true" : "false"
    );
  });
}


function renderThemeGrid(containerId, hiddenInputId, attributeName, selectedValue) {
  const container = document.getElementById(containerId);
  const hiddenInput = document.getElementById(hiddenInputId);


  if (!container || !hiddenInput) return;


  container.innerHTML = "";


  SCREEN_THEMES.forEach(theme => {
    const button = createOptionButton({
      value: theme.value,
      label: theme.label,
      icon: theme.icon,
      attributeName,
      pressed: theme.value === selectedValue
    });


    button.addEventListener("click", () => {
      hiddenInput.value = theme.value;
      updateOptionButtons(container, attributeName, theme.value);
    });


    container.appendChild(button);
  });
}


function renderScreenModeGrid(containerId, hiddenInputId, attributeName, selectedValue) {
  const container = document.getElementById(containerId);
  const hiddenInput = document.getElementById(hiddenInputId);


  if (!container || !hiddenInput) return;


  container.innerHTML = "";


  SCREEN_MODES.forEach(mode => {
    const button = createOptionButton({
      value: mode.value,
      label: mode.label,
      icon: mode.icon,
      attributeName,
      pressed: mode.value === selectedValue
    });


    button.addEventListener("click", () => {
      hiddenInput.value = mode.value;
      updateOptionButtons(container, attributeName, mode.value);
    });


    container.appendChild(button);
  });
}


function renderScreenColorGrid(containerId, hiddenInputId, attributeName, selectedValue) {
  const container = document.getElementById(containerId);
  const hiddenInput = document.getElementById(hiddenInputId);


  if (!container || !hiddenInput) return;


  container.innerHTML = "";


  SCREEN_COLORS.forEach(color => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "color-button";
    button.setAttribute(attributeName, color);
    button.style.setProperty("--swatch", color);
    button.setAttribute("aria-label", color);
    button.setAttribute(
      "aria-pressed",
      color === selectedValue ? "true" : "false"
    );


    button.addEventListener("click", () => {
      hiddenInput.value = color;
      updateOptionButtons(container, attributeName, color);
    });


    container.appendChild(button);
  });
}


function getSelectedScreenTheme() {
  return document.getElementById("theme").value || "none";
}


function getSelectedEditScreenTheme() {
  return document.getElementById("edit-theme-input").value || "none";
}


function getSelectedScreenMode() {
  return document.getElementById("screen-mode").value || "light";
}


function getSelectedEditScreenMode() {
  return document.getElementById("edit-screen-mode").value || "light";
}


function getSelectedScreenColor() {
  return document.getElementById("screen-color").value || "#2563eb";
}


function getSelectedEditScreenColor() {
  return document.getElementById("edit-screen-color").value || "#2563eb";
}


function setSelectedScreenOptions(theme, mode, color) {
  document.getElementById("theme").value = theme || "none";
  document.getElementById("screen-mode").value = mode || "light";
  document.getElementById("screen-color").value = color || "#2563eb";


  renderThemeGrid(
    "theme-grid",
    "theme",
    "data-screen-theme",
    document.getElementById("theme").value
  );


  renderScreenModeGrid(
    "screen-mode-grid",
    "screen-mode",
    "data-screen-mode",
    document.getElementById("screen-mode").value
  );


  renderScreenColorGrid(
    "screen-color-grid",
    "screen-color",
    "data-screen-color",
    document.getElementById("screen-color").value
  );
}


function setSelectedEditScreenOptions(theme, mode, color) {
  document.getElementById("edit-theme-input").value = theme || "none";
  document.getElementById("edit-screen-mode").value = mode || "light";
  document.getElementById("edit-screen-color").value = color || "#2563eb";


  renderThemeGrid(
    "edit-theme-grid",
    "edit-theme-input",
    "data-edit-screen-theme",
    document.getElementById("edit-theme-input").value
  );


  renderScreenModeGrid(
    "edit-screen-mode-grid",
    "edit-screen-mode",
    "data-edit-screen-mode",
    document.getElementById("edit-screen-mode").value
  );


  renderScreenColorGrid(
    "edit-screen-color-grid",
    "edit-screen-color",
    "data-edit-screen-color",
    document.getElementById("edit-screen-color").value
  );
}


function initializeScreenOptions() {
  setSelectedScreenOptions("none", "light", "#2563eb");
  setSelectedEditScreenOptions("none", "light", "#2563eb");
}


function clearCreateForm(keepResult = false) {
  gameForm.reset();
  itemsContainer.innerHTML = "";


  for (let i = 0; i < MIN_ITEMS; i++) {
    createItem(itemsContainer);
  }


  setSelectedScreenOptions("none", "light", "#2563eb");


  if (!keepResult) {
    result.hidden = true;
  }
}


async function openSavedGame(game) {
  try {
    const { data: foundGame, error } = await juntaDB
      .from("games")
      .select(
        "id, room_code, title, edit_password, reset_version, theme, screen_color, screen_mode"
      )
      .eq("room_code", game.code)
      .maybeSingle();


    if (error) throw error;


    if (!foundGame || foundGame.edit_password !== game.password) {
      showMessage(
        "Esta partida não pôde ser aberta. Use o código e a senha manualmente.",
        true
      );
      return;
    }


    const { data: items, error: itemsError } = await juntaDB
      .from("game_items")
      .select("id, question, answer")
      .eq("game_id", foundGame.id)
      .order("position");


    if (itemsError) throw itemsError;


    editingGameId = foundGame.id;


    document.getElementById("edit-title-input").value = foundGame.title;
    document.getElementById("edit-password-input").value =
      foundGame.edit_password;


    setSelectedEditScreenOptions(
      foundGame.theme || "none",
      foundGame.screen_mode || "light",
      foundGame.screen_color || "#2563eb"
    );


    editItemsContainer.innerHTML = "";


    if (items.length === 0) {
      for (let i = 0; i < MIN_ITEMS; i++) {
        createItem(editItemsContainer);
      }
    } else {
      items.forEach(item => {
        createItem(editItemsContainer, item.question, item.answer);
      });
    }


    showEditorGameSummary(foundGame.room_code);
    showResetMessage("");
    showEditorMessage("Partida carregada para edição.");
    showView("editor");
  } catch (error) {
    showMessage(error.message || "Erro ao abrir a partida.", true);
  }
}


document.getElementById("go-create").addEventListener("click", () => {
  clearCreateForm();
  showView("create");
});


document.getElementById("go-edit").addEventListener("click", () => {
  renderSavedGames();
  showView("edit");
});


document.getElementById("go-create-from-edit").addEventListener("click", () => {
  clearCreateForm();
  showView("create");
});


document.getElementById("back-from-create").addEventListener("click", () => {
  showView("home");
});


document.getElementById("back-from-edit").addEventListener("click", () => {
  showView("home");
});


document.getElementById("back-from-editor").addEventListener("click", () => {
  editingGameId = null;
  editingRoomCode = null;
  showView("edit");
});


document.getElementById("back-home-after-create").addEventListener("click", () => {
  result.hidden = true;
  showView("home");
});


if (openScreenButton) {
  openScreenButton.addEventListener("click", () => {
    if (currentScreenUrl) {
      window.open(currentScreenUrl, "_blank", "noopener");
    }
  });
}


if (editorOpenScreenButton) {
  editorOpenScreenButton.addEventListener("click", () => {
    if (currentScreenUrl) {
      window.open(currentScreenUrl, "_blank", "noopener");
    }
  });
}


if (resetScoresButton) {
  resetScoresButton.addEventListener("click", async () => {
    if (!editingGameId || !editingRoomCode) {
      showResetMessage("Abra uma partida antes de reiniciar as pontuações.", true);
      return;
    }


    const confirmed = confirm(
      "Reiniciar as pontuações desta partida? Os alunos poderão jogar novamente."
    );


    if (!confirmed) return;


    resetScoresButton.disabled = true;
    showResetMessage("Reiniciando pontuações...");


    try {
      const { data: currentGame, error: readError } = await juntaDB
        .from("games")
        .select("reset_version")
        .eq("id", editingGameId)
        .maybeSingle();


      if (readError) throw readError;


      const nextVersion = (currentGame?.reset_version || 0) + 1;


      const { data: updatedGame, error: updateError } = await juntaDB
        .from("games")
        .update({ reset_version: nextVersion })
        .eq("id", editingGameId)
        .select("id, room_code, reset_version")
        .maybeSingle();


      if (updateError) throw updateError;


      if (!updatedGame) {
        throw new Error(
          "A partida não pôde ser atualizada. Verifique as permissões de edição no Supabase."
        );
      }


      showResetMessage(
        "Pontuações reiniciadas. Os alunos já podem jogar novamente."
      );
    } catch (error) {
      showResetMessage(error.message || "Erro ao reiniciar as pontuações.", true);
    } finally {
      resetScoresButton.disabled = false;
    }
  });
}


document.getElementById("add-item").addEventListener("click", () => {
  if (itemsContainer.children.length >= MAX_ITEMS) {
    showMessage(`Limite de ${MAX_ITEMS} pares atingido.`, true);
    return;
  }


  createItem(itemsContainer);
  itemsContainer.lastElementChild.querySelector(".question-input").focus();
});


document.getElementById("add-edit-item").addEventListener("click", () => {
  if (editItemsContainer.children.length >= MAX_ITEMS) {
    showEditorMessage(`Limite de ${MAX_ITEMS} pares atingido.`, true);
    return;
  }


  createItem(editItemsContainer);
  editItemsContainer.lastElementChild.querySelector(".question-input").focus();
});


loadForm.addEventListener("submit", async event => {
  event.preventDefault();
  showLoadMessage("");


  const codeInput = document.getElementById("load-code");
  const passwordInput = document.getElementById("load-password");


  const code = codeInput.value.trim().toUpperCase();
  const password = passwordInput.value;


  if (!code) {
    showLoadMessage("Informe o código da partida.", true);
    focusField(codeInput);
    return;
  }


  if (!password) {
    showLoadMessage("Informe a senha de edição.", true);
    focusField(passwordInput);
    return;
  }


  try {
    const { data: game, error } = await juntaDB
      .from("games")
      .select(
        "id, room_code, title, edit_password, reset_version, theme, screen_color, screen_mode"
      )
      .eq("room_code", code)
      .maybeSingle();


    if (error) throw error;


    if (!game || game.edit_password !== password) {
      showLoadMessage("Código ou senha incorretos.", true);
      focusField(passwordInput);
      return;
    }


    await openSavedGame({
      code: game.room_code,
      password,
      title: game.title
    });


    showLoadMessage("Partida carregada para edição.");
  } catch (error) {
    showLoadMessage(error.message || "Erro ao abrir a partida.", true);
  }
});


gameForm.addEventListener("submit", async event => {
  event.preventDefault();
  showMessage("");


  const titleInput = document.getElementById("title");
  const passwordInput = document.getElementById("edit-password");


  const title = titleInput.value.trim();
  const password = passwordInput.value;
  const validation = validatePairs(itemsContainer);


  if (!title) {
    showMessage("Informe o título da partida.", true);
    focusField(titleInput);
    return;
  }


  if (!password) {
    showMessage("Defina uma senha para edição.", true);
    focusField(passwordInput);
    return;
  }


  if (!validation.valid) {
    showMessage(validation.message, true);
    return;
  }


  const pairs = validation.pairs;
  const createButton = document.getElementById("save-button");
  createButton.disabled = true;
  showMessage("Criando partida...");


  try {
    let created = null;


    for (let attempt = 0; attempt < 5; attempt++) {
      const code = generateCode();


      const { data, error } = await juntaDB
        .from("games")
        .insert({
          room_code: code,
          title,
          edit_password: password,
          theme: getSelectedScreenTheme(),
          screen_mode: getSelectedScreenMode(),
          screen_color: getSelectedScreenColor()
        })
        .select("id, room_code")
        .single();


      if (!error) {
        created = data;
        break;
      }


      if (error.code !== "23505") throw error;
    }


    if (!created) {
      throw new Error("Não foi possível gerar um código único.");
    }


    const items = pairs.map((pair, index) => ({
      game_id: created.id,
      question: pair.question,
      answer: pair.answer,
      position: index
    }));


    const { error: itemsError } = await juntaDB
      .from("game_items")
      .insert(items);


    if (itemsError) throw itemsError;


    saveGameToDevice({
      code: created.room_code,
      title,
      password
    });


    currentScreenUrl = getScreenUrl(created.room_code);
    roomCode.textContent = created.room_code;


    if (openScreenButton) {
      openScreenButton.hidden = false;
    }


    result.hidden = false;
    result.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });


    showMessage("Partida criada com sucesso.");
    clearCreateForm(true);
  } catch (error) {
    showMessage(error.message || "Erro ao criar a partida.", true);
  } finally {
    createButton.disabled = false;
  }
});


editGameForm.addEventListener("submit", async event => {
  event.preventDefault();
  showEditorMessage("");


  if (!editingGameId) {
    showEditorMessage(
      "Nenhuma partida está aberta para edição. Abra uma partida antes de salvar.",
      true
    );
    return;
  }


  const titleInput = document.getElementById("edit-title-input");
  const passwordInput = document.getElementById("edit-password-input");


  const title = titleInput.value.trim();
  const password = passwordInput.value;
  const validation = validatePairs(editItemsContainer);


  if (!title) {
    showEditorMessage("Informe o título da partida.", true);
    focusField(titleInput);
    return;
  }


  if (!password) {
    showEditorMessage("Informe a senha de edição.", true);
    focusField(passwordInput);
    return;
  }


  if (!validation.valid) {
    showEditorMessage(validation.message, true);
    return;
  }


  const updateButton = document.getElementById("update-button");
  updateButton.disabled = true;
  showEditorMessage("Salvando alterações...");


  try {
    const { data: updatedGame, error: updateError } = await juntaDB
      .from("games")
      .update({
        title,
        edit_password: password,
        theme: getSelectedEditScreenTheme(),
        screen_mode: getSelectedEditScreenMode(),
        screen_color: getSelectedEditScreenColor()
      })
      .eq("id", editingGameId)
      .select("id, room_code")
      .maybeSingle();


    if (updateError) throw updateError;


    if (!updatedGame) {
      throw new Error(
        "A partida não pôde ser atualizada. Verifique as permissões de edição no Supabase."
      );
    }


    const { error: deleteError } = await juntaDB
      .from("game_items")
      .delete()
      .eq("game_id", editingGameId);


    if (deleteError) throw deleteError;


    const items = validation.pairs.map((pair, index) => ({
      game_id: editingGameId,
      question: pair.question,
      answer: pair.answer,
      position: index
    }));


    const { error: itemsError } = await juntaDB
      .from("game_items")
      .insert(items);


    if (itemsError) throw itemsError;


    saveGameToDevice({
      code: editingRoomCode,
      title,
      password
    });


    showEditorGameSummary(updatedGame.room_code);
    showEditorMessage("Alterações salvas com sucesso.");
  } catch (error) {
    showEditorMessage(error.message || "Erro ao salvar alterações.", true);
  } finally {
    updateButton.disabled = false;
  }
});


function bindTitleCounter(inputId, limit) {
  const input = document.getElementById(inputId);
  const counter = document.querySelector(`[data-count-for="${inputId}"]`);


  input.addEventListener("input", () => {
    const remaining = limit - input.value.length;


    counter.textContent =
      remaining === 1
        ? "1 caractere restante"
        : `${remaining} caracteres restantes`;


    counter.classList.toggle("limit", remaining <= 20);
  });
}


bindTitleCounter("title", TITLE_LIMIT);
bindTitleCounter("edit-title-input", TITLE_LIMIT);


initializeScreenOptions();
applyInterfacePreferences();
showView("home");
clearCreateForm();