/* ── STATE ──────────────────────────────────────────────── */
const S = {
  category: null, sessionId: null, questions: [],
  index: 0, answers: {}, timeTaken: {},
  timer: null, timeLeft: 60, retryCat: null
};

const CIRC = 163.4; // 2πr for r=26

/* ── SCREENS ────────────────────────────────────────────── */
function show(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}
function showHome()       { clearTimer(); show('screen-home'); S.retryCat = null; }
function showCategories() { show('screen-categories'); loadCategories(); }

/* ── LOAD CATEGORIES ────────────────────────────────────── */
async function loadCategories() {
  const grid = document.getElementById('categories-grid');
  grid.innerHTML = '';
  try {
    const { categories } = await fetch('/api/categories').then(r => r.json());
    categories.forEach(cat => {
      const card = document.createElement('div');
      card.className = 'cat-card';
      card.style.setProperty('--cc', cat.color);
      card.innerHTML = `
        <span class="cat-icon">${cat.icon}</span>
        <div class="cat-name">${cat.title}</div>
        <div class="cat-info">15 Questions &nbsp;·&nbsp; 60s each &nbsp;·&nbsp; Full Report</div>
        <div class="cat-cta">Start Quiz →</div>`;
      card.onclick = () => startQuiz(cat.id);
      grid.appendChild(card);
    });
  } catch {
    grid.innerHTML = '<p style="color:var(--muted);padding:20px">Could not connect to the server.<br>Run: <code>node server.js</code></p>';
  }
}

/* ── START QUIZ ─────────────────────────────────────────── */
async function startQuiz(categoryId) {
  show('screen-loading');
  Object.assign(S, { category: categoryId, answers: {}, timeTaken: {}, index: 0 });
  try {
    const data = await fetch(`/api/quiz/${categoryId}`).then(r => r.json());
    S.sessionId = data.session_id;
    S.questions = data.questions;

    const lbl = document.getElementById('quiz-cat-label');
    lbl.textContent = `${data.title} ${data.icon}`;
    lbl.style.color = data.color;
    S.retryCat = categoryId;

    setTimeout(() => { show('screen-quiz'); renderQ(0); }, 500);
  } catch {
    alert('Server not reachable. Make sure Node.js is running.');
    show('screen-categories');
  }
}

/* ── RENDER QUESTION ────────────────────────────────────── */
function renderQ(i) {
  clearTimer();
  const q = S.questions[i];
  const total = S.questions.length;

  document.getElementById('quiz-prog-label').textContent  = `Question ${i + 1} of ${total}`;
  document.getElementById('question-number').textContent  = String(i + 1).padStart(2, '0');
  document.getElementById('question-text').textContent    = q.question;
  document.getElementById('progress-bar').style.width     = `${(i / total) * 100}%`;

  const wrap = document.querySelector('.quiz-timer-wrap');
  wrap.classList.remove('tw', 'td');

  const opts = document.getElementById('options-container');
  opts.innerHTML = '';
  ['A','B','C','D'].forEach((ltr, idx) => {
    const btn = document.createElement('button');
    btn.className = 'opt';
    btn.dataset.val = q.options[idx];
    btn.innerHTML = `<span class="opt-ltr">${ltr}</span>${q.options[idx]}`;
    btn.onclick = () => pick(q.options[idx], btn);
    opts.appendChild(btn);
  });

  startTimer(60);
}

/* ── TIMER ──────────────────────────────────────────────── */
function startTimer(secs) {
  S.timeLeft = secs;
  const txt  = document.getElementById('timer-text');
  const ring = document.getElementById('timer-ring');
  const wrap = document.querySelector('.quiz-timer-wrap');

  (function tick() {
    txt.textContent = S.timeLeft;
    ring.style.strokeDashoffset = CIRC * (1 - S.timeLeft / 60);
    wrap.classList.toggle('tw', S.timeLeft <= 20 && S.timeLeft > 10);
    wrap.classList.toggle('td', S.timeLeft <= 10);

    if (S.timeLeft <= 0) { clearTimer(); advance('SKIPPED', 60); return; }
    S.timeLeft--;
    S.timer = setTimeout(tick, 1000);
  })();
}

function clearTimer() { clearTimeout(S.timer); S.timer = null; }

/* ── PICK OPTION ────────────────────────────────────────── */
function pick(value, btnEl) {
  const spent = 60 - S.timeLeft;
  clearTimer();
  document.querySelectorAll('.opt').forEach(b => { b.disabled = true; b.classList.remove('selected'); });
  btnEl.classList.add('selected');
  setTimeout(() => advance(value, spent), 650);
}

/* ── SKIP ───────────────────────────────────────────────── */
function skipQuestion() { clearTimer(); advance('SKIPPED', 60 - S.timeLeft); }

/* ── ADVANCE ────────────────────────────────────────────── */
function advance(answer, time) {
  const qId = String(S.questions[S.index].id);
  S.answers[qId]  = answer;
  S.timeTaken[qId] = time;
  const next = S.index + 1;
  if (next >= S.questions.length) submitQuiz();
  else { S.index = next; renderQ(next); }
}

/* ── SUBMIT ─────────────────────────────────────────────── */
async function submitQuiz() {
  clearTimer();
  show('screen-loading');
  try {
    const data = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: S.sessionId, category: S.category, answers: S.answers, time_taken: S.timeTaken })
    }).then(r => r.json());
    showReport(data);
  } catch {
    alert('Error submitting. Please retry.');
    showHome();
  }
}

/* ── REPORT ─────────────────────────────────────────────── */
function showReport(data) {
  const s = data.summary;
  document.getElementById('report-grade').textContent       = s.grade;
  document.getElementById('report-grade-label').textContent = s.gradeLabel;
  document.getElementById('report-category').textContent    = `${s.icon} ${s.category}`;
  document.getElementById('sc-correct').textContent         = s.correct;
  document.getElementById('sc-wrong').textContent           = s.wrong;
  document.getElementById('sc-skipped').textContent         = s.skipped;
  document.getElementById('sc-score').textContent           = s.score + '%';
  document.getElementById('avg-time').textContent           = s.avgTime + 's';

  const list = document.getElementById('question-breakdown');
  list.innerHTML = '';
  const badges = { correct: '✓ Correct', wrong: '✗ Wrong', skipped: '– Skipped' };

  data.results.forEach((r, i) => {
    const el = document.createElement('div');
    el.className = `bi ${r.status}`;
    const yourDisp  = !r.your_answer || r.your_answer === 'SKIPPED' ? 'Not answered' : r.your_answer;
    const yourClass = r.status === 'correct' ? 'ca' : r.status === 'wrong' ? 'wa' : '';

    el.innerHTML = `
      <div class="bi-top">
        <div class="bi-q">Q${i+1}. ${r.question}</div>
        <div class="bi-badge">${badges[r.status]}</div>
      </div>
      <div class="bi-time">⏱ ${r.time_taken}s used</div>
      <div class="bi-detail">
        <div class="ans-row"><span>Your answer</span><strong class="${yourClass}">${yourDisp}</strong></div>
        ${r.status !== 'correct' ? `<div class="ans-row"><span>Correct answer</span><strong class="ca">${r.correct_answer}</strong></div>` : ''}
        <div class="expl">${r.explanation}</div>
      </div>`;
    el.onclick = () => el.classList.toggle('open');
    list.appendChild(el);
  });

  show('screen-report');
  document.getElementById('screen-report').scrollTop = 0;
}

function retryQuiz() { S.retryCat ? startQuiz(S.retryCat) : showCategories(); }

/* ── QUIT MODAL ─────────────────────────────────────────── */
function confirmQuit() { document.getElementById('quit-modal').classList.remove('hidden'); }
function closeQuit()   { document.getElementById('quit-modal').classList.add('hidden'); }
function goHome()      { closeQuit(); clearTimer(); showHome(); }

/* ── BOOT ───────────────────────────────────────────────── */
show('screen-home');
