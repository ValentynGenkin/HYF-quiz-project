import {
  USER_INTERFACE_ID,
  START_QUIZ_BUTTON_ID,
  WELCOME_PAGE_INPUT,
} from '../constants.js';

import { createWelcomeElement } from '../views/welcomeView.js';
import { initQuestionPage } from './questionPage.js';
import { createWelcomePageCover } from '../views/welcomeView.js';
import { pointsSave } from './questionPage.js';
import { positionSave } from './questionPage.js';
import { answerSave } from './questionPage.js';

export const initWelcomePage = () => {
  const userInterface = document.getElementById(USER_INTERFACE_ID);
  userInterface.innerHTML = '';

  const welcomeElement = createWelcomeElement();
  userInterface.appendChild(welcomeElement);

  const welcomeCover = createWelcomePageCover();
  userInterface.appendChild(welcomeCover);

  const startQuizButton = document.getElementById(START_QUIZ_BUTTON_ID);

  startQuizButton.addEventListener('click', getName);

  startQuizButton.addEventListener('click', startQuiz);
};

export const playerName = [];

export const getName = () => {
  const inputValue = document.getElementById(WELCOME_PAGE_INPUT).value;
  if (inputValue) {
    return playerName.push(inputValue);
  }
};

const startQuiz = () => {
  const inputValue = document.getElementById(WELCOME_PAGE_INPUT).value;
  const inputAlert = document.getElementById(WELCOME_PAGE_INPUT);

  if (inputValue === '') {
    let alertMessage = document.createElement('div');
    alertMessage.textContent = 'Please enter your name!';
    alertMessage.style.color = 'red';
    inputAlert.insertAdjacentElement('afterend', alertMessage);
  } else {
    initQuestionPage();
    pointsSave();
    positionSave();
    answerSave();
  }
};
