const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000; // hosting platforms assign their own PORT
const DATA_FILE = path.join(__dirname, 'data.json');

// Create data.json automatically if it doesn't exist (e.g. fresh deploy on Render)
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, '{}');
}

// ===== Middleware =====
app.use(cors());          // allows our frontend (different origin/file) to call this server
app.use(express.json());  // lets us read JSON sent in request bodies
app.use(express.static(__dirname)); // serve HTML/CSS/JS files sitting in this same folder

// ===== Helpers to read/write our "database" file =====
function readData() {
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
}
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// ===== ROUTES =====

// SIGN UP
app.post('/signup', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required.' });
  }

  const users = readData();
  if (users[username]) {
    return res.status(400).json({ error: 'Username already exists.' });
  }

  users[username] = { password, note: '' };
  writeData(users);

  res.json({ message: 'Account created successfully.' });
});

// LOGIN
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = readData();

  if (!users[username] || users[username].password !== password) {
    return res.status(401).json({ error: 'Invalid username or password.' });
  }

  res.json({ message: 'Login successful.', username });
});

// SAVE NOTE
app.post('/note', (req, res) => {
  const { username, note } = req.body;
  const users = readData();

  if (!users[username]) {
    return res.status(404).json({ error: 'User not found.' });
  }

  users[username].note = note;
  writeData(users);

  res.json({ message: 'Note saved.' });
});

// GET NOTE
app.get('/note/:username', (req, res) => {
  const { username } = req.params;
  const users = readData();

  if (!users[username]) {
    return res.status(404).json({ error: 'User not found.' });
  }

  res.json({ note: users[username].note });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});