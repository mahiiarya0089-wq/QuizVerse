# 🎓 QuizVerse — Node.js Edition (No Python)

Full-stack quiz platform using **only HTML + CSS + JavaScript + Node.js**.  
Zero external dependencies — runs on Node.js built-in `http` module.

---

## 📁 Project Structure

```
quizverse-node/
├── server.js           ← Node.js backend (API + static file server)
├── package.json
├── README.md
└── public/
    ├── index.html      ← Single-page app (5 screens)
    ├── css/
    │   └── style.css   ← Full design system
    └── js/
        └── main.js     ← All frontend logic
```

---

## ⚙️ Setup & Run

### Requirements
- Node.js v16 or higher (no npm install needed — zero dependencies!)

### Start the server
```bash
node server.js
```

### Open in browser
```
http://localhost:3000
```

That's it. No `npm install`, no Python, no virtual environments.

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | List all 4 quiz categories |
| GET | `/api/quiz/:category` | Get 15 questions for a category |
| POST | `/api/submit` | Submit answers, receive scored report |

---

## 🧠 Quiz Content

| Category | Questions | Timer |
|----------|-----------|-------|
| 🔬 Science | 15 | 60s each |
| 📜 History | 15 | 60s each |
| 💻 Technology | 15 | 60s each |
| 🔢 Mathematics | 15 | 60s each |

---

## 📊 Grading

| Score | Grade |
|-------|-------|
| 80–100% | A — Excellent! |
| 60–79%  | B — Good Job! |
| 40–59%  | C — Keep Practicing! |
| 0–39%   | D — Needs Improvement |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JS (ES6+) |
| Backend | Node.js built-in `http` module |
| Fonts | Syne + DM Sans (Google Fonts) |
| Dependencies | **None** |
