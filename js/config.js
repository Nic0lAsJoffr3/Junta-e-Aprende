const THEME_STORAGE_KEY = "junta_preferences";
const THEME_COOKIE_NAME = "junta_preferences";

const ACCENT_COLORS = {
  blue: {
    name: "Azul",
    light: "#2563eb",
    dark: "#3b82f6",
    accentDarkLight: "#1e40af",
    accentDarkDark: "#1d4ed8",
    softLight: "#dbeafe",
    softDark: "#1e3a8a"
  },
  green: {
    name: "Verde",
    light: "#16a34a",
    dark: "#22c55e",
    accentDarkLight: "#15803d",
    accentDarkDark: "#15803d",
    softLight: "#dcfce7",
    softDark: "#14532d"
  },
  purple: {
    name: "Roxo",
    light: "#7c3aed",
    dark: "#a78bfa",
    accentDarkLight: "#6d28d9",
    accentDarkDark: "#7c3aed",
    softLight: "#ede9fe",
    softDark: "#4c1d95"
  },
  orange: {
    name: "Laranja",
    light: "#ea580c",
    dark: "#fb923c",
    accentDarkLight: "#c2410c",
    accentDarkDark: "#ea580c",
    softLight: "#ffedd5",
    softDark: "#7c2d12"
  },
  red: {
    name: "Vermelho",
    light: "#dc2626",
    dark: "#ef4444",
    accentDarkLight: "#b91c1c",
    accentDarkDark: "#b91c1c",
    softLight: "#fee2e2",
    softDark: "#7f1d1d"
  },
  pink: {
    name: "Rosa",
    light: "#db2777",
    dark: "#f472b6",
    accentDarkLight: "#be185d",
    accentDarkDark: "#db2777",
    softLight: "#fce7f3",
    softDark: "#831843"
  },
  teal: {
    name: "Turquesa",
    light: "#0d9488",
    dark: "#2dd4bf",
    accentDarkLight: "#0f766e",
    accentDarkDark: "#0d9488",
    softLight: "#ccfbf1",
    softDark: "#134e4a"
  },
  cyan: {
    name: "Ciano",
    light: "#0891b2",
    dark: "#22d3ee",
    accentDarkLight: "#0e7490",
    accentDarkDark: "#0891b2",
    softLight: "#cffafe",
    softDark: "#164e63"
  },
  indigo: {
    name: "Índigo",
    light: "#4f46e5",
    dark: "#818cf8",
    accentDarkLight: "#4338ca",
    accentDarkDark: "#4f46e5",
    softLight: "#e0e7ff",
    softDark: "#312e81"
  },
  violet: {
    name: "Violeta",
    light: "#8b5cf6",
    dark: "#a78bfa",
    accentDarkLight: "#7c3aed",
    accentDarkDark: "#8b5cf6",
    softLight: "#ede9fe",
    softDark: "#4c1d95"
  },
  lime: {
    name: "Verde-limão",
    light: "#65a30d",
    dark: "#a3e635",
    accentDarkLight: "#4d7c0f",
    accentDarkDark: "#65a30d",
    softLight: "#ecfccb",
    softDark: "#365314"
  },
  amber: {
    name: "Âmbar",
    light: "#d97706",
    dark: "#fbbf24",
    accentDarkLight: "#b45309",
    accentDarkDark: "#d97706",
    softLight: "#fef3c7",
    softDark: "#78350f"
  },
  brown: {
    name: "Marrom",
    light: "#92400e",
    dark: "#d97706",
    accentDarkLight: "#78350f",
    accentDarkDark: "#92400e",
    softLight: "#fef3c7",
    softDark: "#451a03"
  },
  slate: {
    name: "Grafite",
    light: "#475569",
    dark: "#94a3b8",
    accentDarkLight: "#334155",
    accentDarkDark: "#64748b",
    softLight: "#e2e8f0",
    softDark: "#1e293b"
  }
};

function getPreferences() {
  try {
    const localValue = localStorage.getItem(THEME_STORAGE_KEY);

    if (localValue) {
      return JSON.parse(localValue);
    }

    const cookieValue = document.cookie.match(
      new RegExp(`(?:^|; )${THEME_COOKIE_NAME}=([^;]*)`)
    );

    if (cookieValue) {
      return JSON.parse(decodeURIComponent(cookieValue[1]));
    }
  } catch {
    return null;
  }

  return null;
}

function savePreferences(preferences) {
  const value = JSON.stringify(preferences);

  localStorage.setItem(THEME_STORAGE_KEY, value);

  document.cookie =
    `${THEME_COOKIE_NAME}=${encodeURIComponent(value)}; ` +
    `path=/; max-age=31536000; SameSite=Lax`;
}

function applyInterfacePreferences() {
  const preferences = getPreferences() || {
    theme: "light",
    color: "blue"
  };

  const theme = preferences.theme === "dark" ? "dark" : "light";
  const color = ACCENT_COLORS[preferences.color]
    ? preferences.color
    : "blue";

  const palette = ACCENT_COLORS[color];

  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.setAttribute("data-accent", color);

  document.documentElement.style.setProperty(
    "--theme-accent",
    theme === "dark" ? palette.dark : palette.light
  );

  document.documentElement.style.setProperty(
    "--theme-accent-dark",
    theme === "dark" ? palette.accentDarkDark : palette.accentDarkLight
  );

  document.documentElement.style.setProperty(
    "--theme-accent-soft",
    theme === "dark" ? palette.softDark : palette.softLight
  );

  document.querySelectorAll("[data-theme-choice]").forEach(button => {
    button.setAttribute(
      "aria-pressed",
      button.dataset.themeChoice === theme ? "true" : "false"
    );
  });

  document.querySelectorAll("[data-color-choice]").forEach(button => {
    button.setAttribute(
      "aria-pressed",
      button.dataset.colorChoice === color ? "true" : "false"
    );
  });
}

function createColorButtons() {
  const colorGrid = document.getElementById("color-grid");

  if (!colorGrid) return;

  colorGrid.innerHTML = "";

  Object.entries(ACCENT_COLORS).forEach(([colorKey, color]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "color-button";
    button.dataset.colorChoice = colorKey;
    button.style.setProperty("--swatch", color.light);
    button.setAttribute("aria-label", `Cor ${color.name}`);
    button.setAttribute("aria-pressed", "false");
    button.title = color.name;

    button.addEventListener("click", () => {
      const preferences = getPreferences() || {
        theme: "light"
      };

      savePreferences({
        theme: preferences.theme || "light",
        color: colorKey
      });

      applyInterfacePreferences();
    });

    colorGrid.appendChild(button);
  });
}

function bindInterfacePreferences() {
  document.querySelectorAll("[data-theme-choice]").forEach(button => {
    button.addEventListener("click", () => {
      const preferences = getPreferences() || {
        color: "blue"
      };

      savePreferences({
        theme: button.dataset.themeChoice,
        color: preferences.color || "blue"
      });

      applyInterfacePreferences();
    });
  });
}

applyInterfacePreferences();
createColorButtons();
bindInterfacePreferences();