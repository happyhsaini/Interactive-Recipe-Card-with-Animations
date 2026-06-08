const totalPrepSeconds = 35 * 60;
let activeStep = -1;
let remainingSeconds = totalPrepSeconds;
let timerId = null;

const steps = Array.from(document.querySelectorAll("#stepsList li"));
const progressFill = document.querySelector("#progressFill");
const currentStepText = document.querySelector("#currentStepText");
const timerDisplay = document.querySelector("#timerDisplay");
const startButton = document.querySelector("#startCooking");
const nextButton = document.querySelector("#nextStep");
const prevButton = document.querySelector("#prevStep");

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const secs = Math.max(0, seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${secs}`;
}

function renderStep() {
  steps.forEach((step, index) => {
    step.classList.toggle("active", index === activeStep);
  });

  const completedSteps = activeStep < 0 ? 0 : activeStep + 1;
  const percent = (completedSteps / steps.length) * 100;
  progressFill.style.width = `${percent}%`;

  if (activeStep < 0) {
    currentStepText.textContent = "Press Start Cooking to highlight the first step.";
    return;
  }

  currentStepText.textContent = `Step ${activeStep + 1} of ${steps.length}: ${steps[activeStep].textContent}`;
}

function startTimer() {
  clearInterval(timerId);
  remainingSeconds = totalPrepSeconds;
  timerDisplay.textContent = formatTime(remainingSeconds);

  timerId = setInterval(() => {
    remainingSeconds -= 1;
    timerDisplay.textContent = formatTime(remainingSeconds);

    if (remainingSeconds <= 0) {
      clearInterval(timerId);
      currentStepText.textContent = "Time is up. Your cake should be ready for the finishing touch.";
    }
  }, 1000);
}

function beginCooking() {
  activeStep = 0;
  renderStep();
  startTimer();
}

function moveStep(direction) {
  if (activeStep < 0) {
    activeStep = 0;
  } else {
    activeStep = Math.min(Math.max(activeStep + direction, 0), steps.length - 1);
  }
  renderStep();
}

function bindToggle(buttonId, listId) {
  const button = document.querySelector(buttonId);
  const list = document.querySelector(listId);

  button.addEventListener("click", () => {
    const isCollapsed = list.classList.toggle("is-collapsed");
    button.textContent = isCollapsed ? "Show" : "Hide";
    button.setAttribute("aria-expanded", String(!isCollapsed));
  });
}

bindToggle("#toggleIngredients", "#ingredientsList");
bindToggle("#toggleSteps", "#stepsList");

startButton.addEventListener("click", beginCooking);
nextButton.addEventListener("click", () => moveStep(1));
prevButton.addEventListener("click", () => moveStep(-1));
document.querySelector("#printRecipe").addEventListener("click", () => window.print());

renderStep();
timerDisplay.textContent = formatTime(totalPrepSeconds);
