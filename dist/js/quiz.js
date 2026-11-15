import { missions } from "./data.js";
import { Store, initPage, missionById, param, escapeHtml, $, $$ } from "./app.js";

const mission = missionById(param("id")) || missions[0];
let index = 0;
let score = 0;
let answered = false;
let shuffled = [];

function shuffle(values) {
  return values.map((value) => [Math.random(), value]).sort((a, b) => a[0] - b[0]).map(([, value]) => value);
}

function renderAttempts() {
  const attempts = Store.attempts(mission.id);
  $("#attempts").innerHTML = attempts.length ? attempts.map((attempt) => `<div class="result"><b>${attempt.score}/${attempt.total}</b><br>${new Date(attempt.date).toLocaleString()}</div>`).join("") : `<div class="result">No attempts yet.</div>`;
}

function renderQuestion() {
  answered = false;
  const [question, correct, ...wrong] = mission.quiz[index];
  shuffled = shuffle([{ text: correct, ok: true }, ...wrong.map((text) => ({ text, ok: false }))]);
  $("#quiz-progress span").style.width = `${(index / mission.quiz.length) * 100}%`;
  $("#question-count").textContent = `Question ${index + 1} of ${mission.quiz.length}`;
  $("#question").textContent = question;
  $("#answers").innerHTML = shuffled.map((answer, answerIndex) => `<button class="answer" type="button" data-index="${answerIndex}">${escapeHtml(answer.text)}</button>`).join("");
  $("#feedback").textContent = "Choose one answer.";
  $("#next").hidden = true;
  $$(".answer").forEach((button) => button.addEventListener("click", () => choose(button)));
}

function choose(button) {
  if (answered) return;
  answered = true;
  const answer = shuffled[Number(button.dataset.index)];
  if (answer.ok) {
    score += 1;
    button.classList.add("correct");
    $("#feedback").textContent = "Correct! This answer is in the mission story.";
  } else {
    button.classList.add("wrong");
    $$(".answer").find((item) => shuffled[Number(item.dataset.index)].ok)?.classList.add("correct");
    $("#feedback").textContent = `Not quite. Correct answer: ${answer && shuffled.find((item) => item.ok).text}.`;
  }
  $("#next").hidden = false;
  $("#next").textContent = index === mission.quiz.length - 1 ? "Finish quiz" : "Next question";
}

function finish() {
  Store.recordAttempt(mission.id, score, mission.quiz.length);
  $("#quiz-card").innerHTML = `<p class="eyebrow">Quiz complete</p><h2>${score}/${mission.quiz.length}</h2><p class="lede">You can retake the quiz as many times as you like. Every attempt is saved in this browser${Store.user ? " and on your account" : ""}.</p><div class="hero-actions"><button class="btn primary" id="retry" type="button">Try again</button><a class="btn" href="detail.html?id=${mission.id}">Review story</a><a class="btn ghost" href="info.html">All missions</a></div>`;
  $("#retry").addEventListener("click", () => location.reload());
  renderAttempts();
}

await initPage();
$("#mission-name").textContent = `${mission.name} quiz`;
$("#story-link").href = `detail.html?id=${mission.id}`;
$("#next").addEventListener("click", () => {
  index += 1;
  if (index >= mission.quiz.length) finish();
  else renderQuestion();
});
renderAttempts();
renderQuestion();
