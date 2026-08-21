// ===== STEP 4: Real backend connection using fetch() =====
// Compare this to Step 2 — same UI logic, but instead of reading/writing localStorage,
// we now send HTTP requests to our Express server running at localhost:3000.

const API_URL = ''; // empty string = same origin. Works both locally (via server.js serving frontend) and when deployed.

const authScreen = document.getElementById('auth-screen');
const appScreen = document.getElementById('app-screen');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const authMessage = document.getElementById('auth-message');
const welcomeUser = document.getElementById('welcome-user');
const noteInput = document.getElementById('note-input');
const saveMessage = document.getElementById('save-message');

// ---- Sign Up ----
document.getElementById('signup-btn').addEventListener('click', async () => {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  if (!username || !password) {
    authMessage.textContent = 'Enter a username and password.';
    return;
  }

  try {
    const res = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();

    if (!res.ok) {
      authMessage.style.color = '#d9534f';
      authMessage.textContent = data.error;
      return;
    }

    authMessage.style.color = 'green';
    authMessage.textContent = 'Account created! Now click Login.';
  } catch (err) {
    authMessage.style.color = '#d9534f';
    authMessage.textContent = 'Could not reach server. Is the backend running?';
  }
});

// ---- Login ----
document.getElementById('login-btn').addEventListener('click', async () => {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  try {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();

    if (!res.ok) {
      authMessage.style.color = '#d9534f';
      authMessage.textContent = data.error;
      return;
    }

    // "Remember" who's logged in (this part stays localStorage —
    // it's just remembering identity in THIS browser, not app data)
    localStorage.setItem('currentUser', username);
    enterApp(username);
  } catch (err) {
    authMessage.style.color = '#d9534f';
    authMessage.textContent = 'Could not reach server. Is the backend running?';
  }
});

// ---- Logout ----
document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.removeItem('currentUser');
  appScreen.classList.add('hidden');
  authScreen.classList.remove('hidden');
  usernameInput.value = '';
  passwordInput.value = '';
  authMessage.textContent = '';
});

// ---- Save Note ----
document.getElementById('save-btn').addEventListener('click', async () => {
  const username = localStorage.getItem('currentUser');

  try {
    const res = await fetch(`${API_URL}/note`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, note: noteInput.value })
    });
    const data = await res.json();

    if (!res.ok) {
      saveMessage.style.color = '#d9534f';
      saveMessage.textContent = data.error;
      return;
    }

    saveMessage.style.color = 'green';
    saveMessage.textContent = 'Saved!';
  } catch (err) {
    saveMessage.style.color = '#d9534f';
    saveMessage.textContent = 'Could not reach server.';
  }
});

// ---- Enter app screen and load that user's saved note from the SERVER ----
async function enterApp(username) {
  authScreen.classList.add('hidden');
  appScreen.classList.remove('hidden');
  welcomeUser.textContent = username;

  try {
    const res = await fetch(`${API_URL}/note/${username}`);
    const data = await res.json();
    noteInput.value = data.note || '';
  } catch (err) {
    noteInput.value = '';
  }
}

// ---- On page load: if someone's already "logged in" on this browser, skip to app screen ----
window.addEventListener('DOMContentLoaded', () => {
  const currentUser = localStorage.getItem('currentUser');
  if (currentUser) {
    enterApp(currentUser);
  }
});