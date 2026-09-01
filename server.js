const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─────────────────────────────────────────────────────────────────────────────
// QUIZ DATA  (all 60 questions, 4 categories × 15)
// ─────────────────────────────────────────────────────────────────────────────
const QUIZ_DATA = {
  science: {
    title: "Science", icon: "🔬", color: "#00d4aa",
    questions: [
      { id:1,  question:"What is the chemical symbol for Gold?",                    options:["Go","Gd","Au","Ag"],                                                           answer:"Au",                           explanation:"Au comes from the Latin word 'Aurum'." },
      { id:2,  question:"What planet is known as the Red Planet?",                  options:["Venus","Mars","Jupiter","Saturn"],                                             answer:"Mars",                         explanation:"Mars appears red due to iron oxide on its surface." },
      { id:3,  question:"What is the approximate speed of light?",                  options:["3×10⁸ m/s","3×10⁶ m/s","3×10¹⁰ m/s","3×10⁴ m/s"],                           answer:"3×10⁸ m/s",                    explanation:"Light travels at ~299,792,458 m/s in a vacuum." },
      { id:4,  question:"What is the powerhouse of the cell?",                      options:["Nucleus","Ribosome","Mitochondria","Golgi body"],                             answer:"Mitochondria",                 explanation:"Mitochondria produce ATP, the cell's energy currency." },
      { id:5,  question:"What gas do plants absorb from the atmosphere?",           options:["Oxygen","Nitrogen","Carbon Dioxide","Hydrogen"],                              answer:"Carbon Dioxide",               explanation:"Plants use CO₂ in photosynthesis to produce glucose." },
      { id:6,  question:"What is the atomic number of Carbon?",                     options:["6","8","12","14"],                                                             answer:"6",                            explanation:"Carbon has 6 protons, giving it atomic number 6." },
      { id:7,  question:"Which law states F = ma?",                                 options:["Newton's 1st Law","Newton's 2nd Law","Newton's 3rd Law","Hooke's Law"],       answer:"Newton's 2nd Law",             explanation:"Newton's Second Law: Force = mass × acceleration." },
      { id:8,  question:"What is the unit of electric current?",                    options:["Volt","Watt","Ampere","Ohm"],                                                  answer:"Ampere",                       explanation:"Electric current is measured in Amperes (A)." },
      { id:9,  question:"DNA stands for?",                                          options:["Deoxyribonucleic Acid","Deoxyribose Nitrogen Acid","Dinitrogen Acid","Dynamic Nucleic Acid"], answer:"Deoxyribonucleic Acid", explanation:"DNA carries genetic instructions for living organisms." },
      { id:10, question:"Which planet has the most moons?",                         options:["Jupiter","Saturn","Uranus","Neptune"],                                         answer:"Saturn",                       explanation:"Saturn has over 140 confirmed moons." },
      { id:11, question:"What is the pH of pure water?",                            options:["5","6","7","8"],                                                               answer:"7",                            explanation:"Pure water is neutral with a pH of exactly 7." },
      { id:12, question:"Which part of the brain controls balance?",                options:["Cerebrum","Medulla","Cerebellum","Hypothalamus"],                              answer:"Cerebellum",                   explanation:"The cerebellum coordinates movement and balance." },
      { id:13, question:"What is the hardest natural substance?",                   options:["Iron","Quartz","Diamond","Platinum"],                                          answer:"Diamond",                      explanation:"Diamond scores 10 on the Mohs hardness scale." },
      { id:14, question:"Which gas makes up most of Earth's atmosphere?",           options:["Oxygen","Carbon Dioxide","Argon","Nitrogen"],                                  answer:"Nitrogen",                     explanation:"Nitrogen makes up about 78% of Earth's atmosphere." },
      { id:15, question:"What is the boiling point of water at sea level?",         options:["90°C","95°C","100°C","105°C"],                                                 answer:"100°C",                        explanation:"Water boils at 100°C (212°F) at standard atmospheric pressure." }
    ]
  },
  history: {
    title: "History", icon: "📜", color: "#ff6b35",
    questions: [
      { id:1,  question:"In which year did World War II end?",                               options:["1943","1944","1945","1946"],                                                              answer:"1945",               explanation:"WWII ended in 1945 — Germany in May, Japan in September." },
      { id:2,  question:"Who was the first President of the United States?",                 options:["Abraham Lincoln","Thomas Jefferson","George Washington","John Adams"],                   answer:"George Washington",  explanation:"George Washington served as first U.S. President 1789–1797." },
      { id:3,  question:"The Great Wall of China was mainly built during which dynasty?",    options:["Han","Tang","Ming","Qing"],                                                               answer:"Ming",               explanation:"Most of the existing Great Wall was built during the Ming Dynasty." },
      { id:4,  question:"When did India gain independence?",                                  options:["1945","1947","1948","1950"],                                                              answer:"1947",               explanation:"India gained independence from Britain on August 15, 1947." },
      { id:5,  question:"Who is credited with discovering America in 1492?",                  options:["Vasco da Gama","Ferdinand Magellan","Christopher Columbus","Amerigo Vespucci"],          answer:"Christopher Columbus", explanation:"Columbus reached the Americas in 1492." },
      { id:6,  question:"The French Revolution began in which year?",                         options:["1776","1789","1799","1804"],                                                              answer:"1789",               explanation:"The French Revolution began with the storming of the Bastille." },
      { id:7,  question:"Which empire was ruled by Genghis Khan?",                            options:["Ottoman Empire","Mongol Empire","Roman Empire","Persian Empire"],                        answer:"Mongol Empire",      explanation:"Genghis Khan founded the Mongol Empire in the 13th century." },
      { id:8,  question:"Who wrote the Declaration of Independence?",                         options:["Benjamin Franklin","John Adams","Thomas Jefferson","James Madison"],                     answer:"Thomas Jefferson",   explanation:"Thomas Jefferson was the primary author of the Declaration." },
      { id:9,  question:"The Berlin Wall fell in which year?",                                options:["1987","1988","1989","1991"],                                                              answer:"1989",               explanation:"The Berlin Wall fell on November 9, 1989." },
      { id:10, question:"Which civilization built Machu Picchu?",                             options:["Aztec","Maya","Inca","Olmec"],                                                            answer:"Inca",               explanation:"Machu Picchu was built by the Inca Empire in the 15th century." },
      { id:11, question:"Who was the first person to walk on the Moon?",                      options:["Buzz Aldrin","Neil Armstrong","Yuri Gagarin","John Glenn"],                              answer:"Neil Armstrong",     explanation:"Neil Armstrong walked on the Moon on July 20, 1969." },
      { id:12, question:"The Renaissance originated in which country?",                       options:["France","Spain","England","Italy"],                                                       answer:"Italy",              explanation:"The Renaissance began in Italy in the 14th century." },
      { id:13, question:"Who was the last Pharaoh of ancient Egypt?",                         options:["Nefertiti","Cleopatra VII","Hatshepsut","Ramesses II"],                                   answer:"Cleopatra VII",      explanation:"Cleopatra VII was the last active ruler of ancient Egypt." },
      { id:14, question:"The Mughal Empire was founded by?",                                  options:["Akbar","Aurangzeb","Babur","Humayun"],                                                    answer:"Babur",              explanation:"Babur founded the Mughal Empire in 1526 at the Battle of Panipat." },
      { id:15, question:"What year did the Titanic sink?",                                    options:["1910","1911","1912","1913"],                                                              answer:"1912",               explanation:"RMS Titanic sank on April 15, 1912 after hitting an iceberg." }
    ]
  },
  technology: {
    title: "Technology", icon: "💻", color: "#7c3aed",
    questions: [
      { id:1,  question:"What does CPU stand for?",                                  options:["Central Processing Unit","Computer Personal Unit","Core Processing Unit","Central Peripheral Unit"], answer:"Central Processing Unit",    explanation:"CPU is the primary component executing instructions in a computer." },
      { id:2,  question:"Which language is primarily used for web styling?",         options:["HTML","JavaScript","CSS","PHP"],                                                                       answer:"CSS",                         explanation:"CSS (Cascading Style Sheets) styles and lays out web pages." },
      { id:3,  question:"What does HTTP stand for?",                                 options:["HyperText Transfer Protocol","HyperText Technical Protocol","High Transfer Text Protocol","Hyper Technical Transfer Path"], answer:"HyperText Transfer Protocol", explanation:"HTTP is the foundation of data communication on the Web." },
      { id:4,  question:"Who co-founded Microsoft?",                                 options:["Steve Jobs","Mark Zuckerberg","Bill Gates","Elon Musk"],                                             answer:"Bill Gates",                  explanation:"Bill Gates co-founded Microsoft with Paul Allen in 1975." },
      { id:5,  question:"What does RAM stand for?",                                  options:["Read Access Memory","Random Access Memory","Rapid Access Module","Read And Modify"],                 answer:"Random Access Memory",        explanation:"RAM is memory that can be read and changed in any order." },
      { id:6,  question:"Which company developed the Android OS?",                   options:["Apple","Microsoft","Google","Samsung"],                                                               answer:"Google",                      explanation:"Google acquired Android Inc. in 2005 and released it in 2007." },
      { id:7,  question:"What is the binary representation of 10?",                  options:["1001","1010","1100","0110"],                                                                           answer:"1010",                        explanation:"10 in binary is 1010 (8+0+2+0 = 10)." },
      { id:8,  question:"Python was created by?",                                    options:["Guido van Rossum","James Gosling","Brendan Eich","Linus Torvalds"],                                   answer:"Guido van Rossum",            explanation:"Guido van Rossum created Python, first released in 1991." },
      { id:9,  question:"What does AI stand for?",                                   options:["Automated Intelligence","Artificial Intelligence","Algorithmic Integration","Advanced Interface"],    answer:"Artificial Intelligence",     explanation:"AI refers to machines designed to simulate human intelligence." },
      { id:10, question:"What is the full form of URL?",                             options:["Unified Resource Locator","Universal Resource Link","Uniform Resource Locator","Universal Record Location"], answer:"Uniform Resource Locator", explanation:"URL is the address used to access resources on the internet." },
      { id:11, question:"Which data structure uses LIFO order?",                     options:["Queue","Stack","Array","Linked List"],                                                                 answer:"Stack",                       explanation:"Stack uses Last In, First Out (LIFO) principle." },
      { id:12, question:"What does SQL stand for?",                                  options:["Structured Query Language","Simple Query Language","System Query Logic","Structured Question Logic"], answer:"Structured Query Language",   explanation:"SQL is used to communicate with and manipulate databases." },
      { id:13, question:"Which protocol is used for secure web browsing?",           options:["FTP","HTTP","HTTPS","SMTP"],                                                                           answer:"HTTPS",                       explanation:"HTTPS uses SSL/TLS encryption to secure data transmission." },
      { id:14, question:"What is an IP address?",                                    options:["Internet Program Address","Internal Protocol Address","Internet Protocol Address","Internal Program Allocator"], answer:"Internet Protocol Address", explanation:"An IP address uniquely identifies a device on a network." },
      { id:15, question:"Which sorting algorithm has O(n log n) average complexity?",options:["Bubble Sort","Selection Sort","Merge Sort","Insertion Sort"],                                         answer:"Merge Sort",                  explanation:"Merge Sort consistently achieves O(n log n) time complexity." }
    ]
  },
  mathematics: {
    title: "Mathematics", icon: "🔢", color: "#f59e0b",
    questions: [
      { id:1,  question:"What is the value of π to 2 decimal places?",                      options:["3.12","3.14","3.16","3.18"],   answer:"3.14",  explanation:"π ≈ 3.14159… commonly rounded to 3.14." },
      { id:2,  question:"What is 12² (12 squared)?",                                        options:["124","134","144","154"],       answer:"144",   explanation:"12 × 12 = 144." },
      { id:3,  question:"Solve: 2x + 5 = 15. What is x?",                                   options:["3","4","5","6"],              answer:"5",     explanation:"2x = 10, so x = 5." },
      { id:4,  question:"What is the square root of 169?",                                   options:["11","12","13","14"],          answer:"13",    explanation:"13 × 13 = 169." },
      { id:5,  question:"What is the sum of angles in a triangle?",                          options:["90°","180°","270°","360°"],   answer:"180°",  explanation:"The interior angles of any triangle always sum to 180°." },
      { id:6,  question:"What is 15% of 200?",                                               options:["25","30","35","40"],          answer:"30",    explanation:"15/100 × 200 = 30." },
      { id:7,  question:"What is the next prime number after 7?",                            options:["8","9","10","11"],            answer:"11",    explanation:"11 is the next prime after 7 (8, 9, 10 are composite)." },
      { id:8,  question:"What is the formula for the area of a circle?",                     options:["2πr","πr²","πd","2πr²"],     answer:"πr²",   explanation:"Area of circle = π × radius²." },
      { id:9,  question:"What is log₁₀(1000)?",                                              options:["2","3","4","10"],             answer:"3",     explanation:"log₁₀(1000) = 3 because 10³ = 1000." },
      { id:10, question:"In a right triangle with legs 3 and 4, what is the hypotenuse?",    options:["5","6","7","8"],              answer:"5",     explanation:"By Pythagoras: √(9+16) = √25 = 5." },
      { id:11, question:"What is the factorial of 5 (5!)?",                                  options:["60","100","120","150"],       answer:"120",   explanation:"5! = 5×4×3×2×1 = 120." },
      { id:12, question:"What is the derivative of x²?",                                     options:["x","2x","x²","2x²"],         answer:"2x",    explanation:"d/dx(x²) = 2x by the power rule." },
      { id:13, question:"How many sides does a hexagon have?",                               options:["5","6","7","8"],              answer:"6",     explanation:"A hexagon has 6 sides (hexa = six in Greek)." },
      { id:14, question:"What is the LCM of 4 and 6?",                                      options:["8","10","12","16"],           answer:"12",    explanation:"LCM(4,6) = 12, the smallest number divisible by both." },
      { id:15, question:"What is the median of: 3, 7, 1, 9, 5?",                            options:["3","5","7","9"],              answer:"5",     explanation:"Sorted: 1,3,5,7,9 — the middle value is 5." }
    ]
  }
};

const sessions = {};

// ── API ──────────────────────────────────────────────────────────────────────

app.get('/api/categories', (req, res) => {
  const cats = Object.entries(QUIZ_DATA).map(([key, val]) => ({
    id: key, title: val.title, icon: val.icon, color: val.color, total: val.questions.length
  }));
  res.json({ categories: cats });
});

app.get('/api/quiz/:category', (req, res) => {
  const { category } = req.params;
  if (!QUIZ_DATA[category]) return res.status(404).json({ error: 'Category not found' });
  const cat = QUIZ_DATA[category];
  const sessionId = uuidv4();
  sessions[sessionId] = { category, startedAt: new Date().toISOString() };
  res.json({
    session_id: sessionId, category, title: cat.title, icon: cat.icon, color: cat.color,
    time_per_question: 60,
    questions: cat.questions.map(q => ({ id: q.id, question: q.question, options: q.options }))
  });
});

app.post('/api/submit', (req, res) => {
  const { category, answers = {}, time_taken = {} } = req.body;
  if (!QUIZ_DATA[category]) return res.status(400).json({ error: 'Invalid category' });
  const cat = QUIZ_DATA[category];
  let correct = 0, wrong = 0, skipped = 0, totalTime = 0;
  const results = cat.questions.map(q => {
    const qId = String(q.id);
    const userAns = answers[qId];
    const t = time_taken[qId] ?? 60;
    totalTime += t;
    let status;
    if (!userAns || userAns === 'SKIPPED') { status = 'skipped'; skipped++; }
    else if (userAns === q.answer)          { status = 'correct'; correct++; }
    else                                    { status = 'wrong';   wrong++;   }
    return { id: q.id, question: q.question, your_answer: userAns || null,
             correct_answer: q.answer, options: q.options, status, time_taken: t, explanation: q.explanation };
  });
  const total = cat.questions.length;
  const score = parseFloat(((correct / total) * 100).toFixed(1));
  const avgTime = parseFloat((totalTime / total).toFixed(1));
  const grade      = score >= 80 ? 'A' : score >= 60 ? 'B' : score >= 40 ? 'C' : 'D';
  const gradeLabel = score >= 80 ? 'Excellent!' : score >= 60 ? 'Good Job!' : score >= 40 ? 'Keep Practicing!' : 'Needs Improvement';
  res.json({ summary: { total, correct, wrong, skipped, score, grade, gradeLabel, avgTime, category: cat.title, icon: cat.icon, color: cat.color }, results });
});

app.get('*', (_, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, () => console.log(`\n✅  QuizVerse → http://localhost:${PORT}\n`));
