import {
  ANSWERS_LIST_ID,
  NEXT_QUESTION_BUTTON_ID,
  TIMER_ID,
  POINTS_ID,
  SKIP_BUTTON_ID,
  ALERT_IF_ANSWERED,
  ALERT_IF_SKIP,
  RESTART,
} from '../constants.js';
import { playerName } from '../pages/welcomePage.js';
import { points } from '../pages/questionPage.js';
import { hideButton } from '../app.js';
import { hideTimer } from '../pages/questionPage.js';
import { answerSave } from '../pages/questionPage.js';
import { buttonDisable } from '../app.js';

/**
 * Create a full question element
 * @returns {Element}
 */

export const createQuestionElement = (question) => {
  const element = document.createElement('div');

  let timer = 10;

  element.innerHTML = String.raw`
    <div class='question-data'>
    <h1 class='question-header'>${question}</h1>
    <ul class='answers-container' id="${ANSWERS_LIST_ID}">
    </ul>
    <div class='timer-container'>
      <span id='${TIMER_ID}'>${timer}</span>
      <span class='alert-container'>
      <p id=${ALERT_IF_ANSWERED} style='display: none'>You already answered this question</p>
      <p id=${ALERT_IF_SKIP} style='display: none'>You already skip this question</p>
    </span>

    </div>

    <div class='navigation'>
      <button id="${NEXT_QUESTION_BUTTON_ID}">
        Next question
      </button>
      <button id="${SKIP_BUTTON_ID}">
        Show Answer
      </button>

    </div>
    <p class="user-score">${playerName[0]}, your score: <span id='${POINTS_ID}'>${points.points}</span></p>
    </div>

  `;

  const intervalID = setInterval(() => {
    if (timer === 1) {
      clearInterval(intervalID);
      hideButton();
      hideTimer();
      answerSave();
      buttonDisable();
    } else {
      timer--;
      document.getElementById('timer').textContent = timer;
    }
  }, 1000);

  element.intervalID = intervalID;
  return element;
};
