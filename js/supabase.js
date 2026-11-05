const SUPABASE_URL = "https://kupffquyjyhacochoqic.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_sOR4e5chT-y5--Tt14VkGA_li_wz0zB";

const juntaDB = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

function getPreference(name) {
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name}=([^;]*)`)
  );

  return match ? decodeURIComponent(match[1]) : null;
}

function setPreference(name, value) {
  document.cookie =
    `${name}=${encodeURIComponent(value)}; ` +
    `path=/; max-age=31536000; SameSite=Lax`;
}

function applyInterfacePreferences() {
  const theme = getPreference("theme") || "light";
  const color = getPreference("color") || "blue";

  document.documentElement.dataset.theme = theme;
  document.documentElement.dataset.color = color;

  const themeSelect = document.getElementById("theme");
  const colorSelect = document.getElementById("color");

  if (themeSelect) themeSelect.value = theme;
  if (colorSelect) colorSelect.value = color;
}

function bindInterfacePreferences() {
  const themeSelect = document.getElementById("theme");
  const colorSelect = document.getElementById("color");

  if (themeSelect) {
    themeSelect.addEventListener("change", event => {
      document.documentElement.dataset.theme = event.target.value;
      setPreference("theme", event.target.value);
    });
  }

  if (colorSelect) {
    colorSelect.addEventListener("change", event => {
      document.documentElement.dataset.color = event.target.value;
      setPreference("color", event.target.value);
    });
  }
}