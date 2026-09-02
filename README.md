# 🎓 QuizVerse – Interactive Quiz Platform

QuizVerse is a full-stack interactive quiz platform designed to help students test and improve their knowledge through engaging, timed quizzes.

Users can choose a quiz category, answer questions within a given time limit, submit their answers, and instantly receive their score and performance evaluation.

---

## 🎯 Project Objective

The main objective of QuizVerse is to provide a simple and interactive platform where students can:

*  Practice different subjects
*  Test their knowledge
*  Answer questions within a time limit
*  Receive their score automatically
*  Evaluate their quiz performance

---

## ✨ Features

*  Multiple quiz categories
*  Multiple-choice questions
*  Timed quizzes
*  Automatic score calculation
*  Instant performance evaluation
*  Quiz restart functionality
*  REST API-based backend
*  Responsive and user-friendly interface

### Available Categories

*  Science
*  History
*  Technology
*  Mathematics

Each category contains multiple quiz questions designed for practice and knowledge testing.

---

## 🏗️ Application Architecture

QuizVerse follows a simple client-server architecture:

```text
                  👤 User
                    │
                    ▼
             ┌──────────────┐
             │ Web Interface│
             │ HTML/CSS/JS  │
             └──────┬───────┘
                    │
                    ▼
             ┌──────────────┐
             │   REST API   │
             │   Node.js    │
             └──────┬───────┘
                    │
                    ▼
             ┌──────────────┐
             │ Quiz & Score │
             │    Logic     │
             └──────────────┘
```

---

## 🛠️ Tech Stack

### Frontend

* HTML5
* CSS3
* JavaScript

### Backend

* Node.js
* Express.js

### Development Tools

* Visual Studio Code
* Git
* GitHub
* npm

---

## 📂 Project Structure

```text
QuizVerse/
│
├── public/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── main.js
│
├── server.js
├── package.json
├── package-lock.json
└── README.md
```

---

## 🔌 API Endpoints

QuizVerse provides REST API endpoints for handling quiz data and score submission.

### Get Quiz Categories

```http
GET /api/categories
```

Returns the available quiz categories.

### Get Quiz Questions

```http
GET /api/quiz/:category
```

Returns questions for the selected category.

Example:

```http
GET /api/quiz/technology
```

### Submit Quiz

```http
POST /api/submit
```

Accepts the user's answers and calculates the final score.

---

## ⚙️ How to Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/mahiiarya0089-wq/QuizVerse.git
```

### 2. Open the project

```bash
cd QuizVerse
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the server

```bash
node server.js
```

### 5. Open the application

Open your browser and visit:

```text
http://localhost:3000
```

---


## 🚀 Future Improvements

The following features can be added in future versions:

*  User registration and login
*  Global leaderboard
*  Personal performance dashboard
*  Difficulty levels
*  Quiz history
*  Personalized quiz recommendations
*  Dark mode
*  Improved mobile experience
*  Database integration for storing user results

---

## 📚 Learning Outcomes

Through this project, I gained practical experience in:

* Frontend web development
* JavaScript programming
* Node.js and Express.js
* REST API development
* Client-server architecture
* Git and GitHub
* Handling user input and quiz data
* Implementing automatic score calculation

---

## 👩‍💻 Author

**Mahee**

BCA (AI & Data Science) Student

---

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub!
