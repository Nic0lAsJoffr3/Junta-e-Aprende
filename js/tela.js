const SITE_URL = "https://junta.e.aprende.nicolasjoffre.com.br";
const REFRESH_INTERVAL = 5000;
const TOP_LEADERS = 10;

const screenTitle = document.getElementById("game-title");
const screenCode = document.getElementById("room-code");
const screenStatus = document.getElementById("screen-status");
const qrcodeContainer = document.getElementById("qrcode");
const leadersContainer = document.getElementById("leaders");
const themeArt = document.getElementById("theme-art");
const themeBackground = document.getElementById("theme-background");

const THEME_FILES = {
  none: "",
  natureza: "assets/svg/nature0.svg",
  espaco: "assets/svg/space0.svg",
  tecnologia: "assets/svg/tec0.svg",
  oceano: "assets/svg/ocean0.svg",
  feminino: "assets/svg/female0.svg",
  estudo: "assets/svg/study0.svg",
  trabalho: "assets/svg/work0.svg",
  masculino: "assets/svg/male0.svg"
};

const THEME_BACKGROUND_FILES = {
  none: "",
  natureza: "assets/svg/nature1.svg",
  espaco: "assets/svg/space1.svg",
  tecnologia: "assets/svg/tec1.svg",
  oceano: "assets/svg/ocean1.svg",
  feminino: "assets/svg/female1.svg",
  estudo: "assets/svg/study1.svg",
  trabalho: "assets/svg/work1.svg",
  masculino: "assets/svg/male1.svg"
};

const numberFormatter = new Intl.NumberFormat("pt-BR");

let currentGame = null;
let refreshTimer = null;
let currentThemeRequest = 0;
let refreshing = false;
let lastRankingSignature = null;

function formatNumber(value) {
  return numberFormatter.format(value);
}

function getCodeFromUrl() {
  return new URLSearchParams(location.search).get("code");
}

function showStatus(text, isError = false) {
  screenStatus.textContent = text;
  screenStatus.classList.toggle("error", isError);
}

function renderQrCode(playerUrl) {
  qrcodeContainer.replaceChildren();

  new QRCode(qrcodeContainer, {
    text: playerUrl,
    width: 260,
    height: 260,
    colorDark: "#111827",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.M
  });
}

function applyScreenMode(mode) {
  document.documentElement.dataset.theme =
    mode === "dark" ? "dark" : "light";
}

function applyScreenColor(color) {
  const accent = color || "#2563eb";
  const rootStyle = document.documentElement.style;

  rootStyle.setProperty("--theme-accent", accent);
  rootStyle.setProperty("--theme-accent-dark", accent);
  rootStyle.setProperty("--theme-accent-soft", accent);
}

function applyThemeBackground(theme) {
  if (!themeBackground) return;

  const file = THEME_BACKGROUND_FILES[theme] || "";

  themeBackground.style.maskImage = "";
  themeBackground.style.webkitMaskImage = "";
  themeBackground.hidden = !file;

  if (file) {
    themeBackground.style.maskImage = `url("${file}")`;
    themeBackground.style.webkitMaskImage = `url("${file}")`;
  }
}

async function applyGameTheme(theme) {
  const file = THEME_FILES[theme] || "";
  const request = ++currentThemeRequest;

  applyThemeBackground(theme);

  if (!themeArt) return;

  themeArt.replaceChildren();

  if (!file) return;

  try {
    const response = await fetch(file);

    if (!response.ok) {
      throw new Error("Não foi possível carregar o tema visual.");
    }

    const svgText = await response.text();

    if (request !== currentThemeRequest) return;

    themeArt.innerHTML = svgText;

    const svg = themeArt.querySelector("svg");

    if (svg) {
      svg.removeAttribute("width");
      svg.removeAttribute("height");
      svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
      svg.setAttribute("stroke", "currentColor");
      svg.setAttribute("fill", "none");
      svg.style.width = "100%";
      svg.style.height = "100%";
      svg.style.color = "var(--theme-accent)";
    }

    themeArt.querySelectorAll("[fill]").forEach(element => {
      element.setAttribute("fill", "none");
    });

    themeArt.querySelectorAll("[stroke]").forEach(element => {
      element.setAttribute("stroke", "currentColor");
    });
  } catch {
    if (request === currentThemeRequest) {
      themeArt.replaceChildren();
    }
  }
}

function createLeaderRow(score, position, highestScore) {
  const rawPoints = Number(score.score);
  const points = Number.isFinite(rawPoints)
    ? Math.max(0, rawPoints)
    : 0;

  const progress = highestScore > 0
    ? Math.min(100, Math.max(0, (points / highestScore) * 100))
    : 0;

  const positionClasses = {
    1: "first",
    2: "second",
    3: "third"
  };

  const row = document.createElement("div");
  row.className = "leader";

  if (positionClasses[position]) {
    row.classList.add(positionClasses[position]);
  }

  const positionElement = document.createElement("span");
  positionElement.className = "leader-position";
  positionElement.textContent = String(position);

  const info = document.createElement("div");
  info.className = "leader-info";

  const name = document.createElement("span");
  name.className = "leader-name";
  name.textContent = score.player_name || "Sem nome";
  name.title = name.textContent;

  const bar = document.createElement("div");
  bar.className = "leader-bar";
  bar.setAttribute("aria-hidden", "true");

  const fill = document.createElement("span");
  fill.className = "leader-bar-fill";
  fill.style.width = `${progress}%`;

  bar.appendChild(fill);
  info.append(name, bar);

  const scoreElement = document.createElement("span");
  scoreElement.className = "leader-score";

  const pointsElement = document.createElement("span");
  pointsElement.textContent = formatNumber(points);

  const unit = document.createElement("small");
  unit.textContent = "pontos";

  scoreElement.append(pointsElement, unit);
  row.append(positionElement, info, scoreElement);

  return row;
}

function renderLeaders(scores) {
  leadersContainer.replaceChildren();

  if (scores.length === 0) {
    const emptyState = document.createElement("div");
    emptyState.className = "empty-state";

    const message = document.createElement("p");
    message.textContent = "Nenhum aluno concluiu a partida ainda.";

    emptyState.appendChild(message);
    leadersContainer.appendChild(emptyState);
    return;
  }

  const topScores = scores.slice(0, TOP_LEADERS);

  const highestScore = topScores.reduce((highest, score) => {
    const points = Number(score.score);
    return Number.isFinite(points)
      ? Math.max(highest, points)
      : highest;
  }, 0);

  const fragment = document.createDocumentFragment();

  topScores.forEach((score, index) => {
    fragment.appendChild(
      createLeaderRow(score, index + 1, highestScore)
    );
  });

  leadersContainer.appendChild(fragment);
}

async function refreshScores() {
  if (!currentGame || refreshing) return;

  refreshing = true;

  try {
    const { data: scores, error } = await juntaDB
      .from("game_scores")
      .select("player_name, score, reset_version, created_at")
      .eq("game_id", currentGame.id)
      .eq("reset_version", currentGame.reset_version || 0)
      .order("score", { ascending: false })
      .order("created_at", { ascending: true })
      .limit(TOP_LEADERS);

    if (error) throw error;

    const orderedScores = scores || [];
    const signature = JSON.stringify(orderedScores);

    if (signature !== lastRankingSignature) {
      renderLeaders(orderedScores);
      lastRankingSignature = signature;
    }

    showStatus(
      orderedScores.length > 0
        ? "Placar atualizado automaticamente."
        : "Aguardando os alunos jogarem..."
    );
  } catch (error) {
    showStatus(
      error.message || "Erro ao atualizar o placar.",
      true
    );
  } finally {
    refreshing = false;
  }
}

async function loadGame() {
  const code = getCodeFromUrl();
  const normalizedCode = code?.trim().toUpperCase();

  if (!normalizedCode) {
    screenTitle.textContent = "Código não informado";
    screenCode.textContent = "------";

    showStatus(
      "Abra esta tela pelo botão “Abrir tela de apresentação” no painel do professor.",
      true
    );

    return;
  }

  screenCode.textContent = normalizedCode;
  showStatus("Carregando informações da partida...");

  try {
    const { data: game, error } = await juntaDB
      .from("games")
      .select(
        "id, room_code, title, reset_version, theme, screen_color, screen_mode"
      )
      .eq("room_code", normalizedCode)
      .maybeSingle();

    if (error) throw error;

    if (!game) {
      screenTitle.textContent = "Partida não encontrada";
      showStatus("Verifique se o código está correto.", true);
      return;
    }

    currentGame = game;
    lastRankingSignature = null;

    screenTitle.textContent = game.title;
    screenCode.textContent = game.room_code;

    applyScreenMode(game.screen_mode);
    applyScreenColor(game.screen_color);
    applyGameTheme(game.theme);

    const playerUrl =
      `${SITE_URL}/index.html?code=${encodeURIComponent(game.room_code)}`;

    renderQrCode(playerUrl);

    await refreshScores();

    clearInterval(refreshTimer);
    refreshTimer = setInterval(refreshScores, REFRESH_INTERVAL);
  } catch (error) {
    screenTitle.textContent = "Erro ao carregar";

    showStatus(
      error.message || "Não foi possível carregar a partida.",
      true
    );
  }
}

document.addEventListener("keydown", async event => {
  const target = event.target;

  if (
    event.key.toLowerCase() !== "f" ||
    event.ctrlKey ||
    event.metaKey ||
    event.altKey ||
    event.repeat ||
    target?.isContentEditable ||
    target?.closest?.("input, textarea, select, button, a")
  ) {
    return;
  }

  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  } catch {
    showStatus(
      "Não foi possível alterar o modo de tela cheia.",
      true
    );
  }
});

window.addEventListener("pagehide", () => {
  clearInterval(refreshTimer);
});

loadGame();