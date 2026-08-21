# learned-connecting-backend-to-frontend-



# Full-Stack Notes App with Authentication

This project was built to learn how a frontend and backend actually communicate in a real web application — from a static form to a live, deployed full-stack app.

## What it does

Users can sign up, log in, write a note, and log out. When they log back in — even after closing the browser — their note is still there, because it's stored server-side rather than just in the browser.

## Frontend

Built with plain HTML, CSS, and JavaScript (no frameworks), to focus on understanding the fundamentals rather than abstracting them away. It handles user input, toggles between the login/signup screen and the main app screen, and communicates with the backend using the Fetch API.

## Backend

A Node.js server built with Express, exposing four REST endpoints:

- `POST /signup` — creates a new user
- `POST /login` — verifies credentials
- `POST /note` — saves a user's note
- `GET /note/:username` — retrieves a user's saved note

User data is stored in a JSON file on the server, acting as a lightweight database.

## Key concepts learned

- How HTTP requests connect a frontend to a backend (`fetch()` → Express routes)
- The difference between client-side state (`localStorage`, used only to remember who's logged in on that browser) and real persistent storage (handled entirely by the backend)
- Setting up a Node.js/Express server from scratch, including middleware like CORS and JSON parsing
- Debugging real-world errors: broken `package.json`, corrupted `node_modules`, mismatched file extensions
- Deploying a live full-stack app to Render, including serving frontend files directly from the Express server to avoid cross-origin complexity

## Result

A working, deployed, publicly accessible app that demonstrates the complete request-response cycle of a web application, showing how the frontend and backend pieces of a real project fit together.

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express
- **Storage:** JSON file
- **Deployment:** Render

