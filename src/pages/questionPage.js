import {
  ANSWERS_LIST_ID,
  NEXT_QUESTION_BUTTON_ID,
  USER_INTERFACE_ID,
  POINTS_ID,
  SKIP_BUTTON_ID,
  RESTART,
} from '../constants.js';
import { createQuestionElement } from '../views/questionView.js';
import { createAnswerElement } from '../views/answerView.js';
import { createScoresPage } from './scoresPage.js';
import { quizData } from '../data.js';
import { SS } from '../app.js';
import { hideButton } from '../app.js';
export const points = {
  points: 0,
};

export let alreadyAnswered = false;

export const initQuestionPage = () => {
  const userInterface = document.getElementById(USER_INTERFACE_ID);
  userInterface.innerHTML = '';
  const currentQuestion = quizData.questions[quizData.currentQuestionIndex];

  let timer = 0;

  const timeLimit = setInterval(() => {
    timer++;
    if (timer === 10) {
      alreadyAnswered = true;
      clearInterval(timeLimit);
    }
  }, 1000);

  const questionElement = createQuestionElement(currentQuestion.text);

  questionElement.id = 'question-element';

  const currentImage = quizData.questions[quizData.currentQuestionIndex].image;

  const imageElement = document.createElement('img');
  imageElement.setAttribute('src', currentImage);
  imageElement.classList.add('question-image');

  questionElement.appendChild(imageElement);

  userInterface.appendChild(questionElement);

  const answersListElement = document.getElementById(ANSWERS_LIST_ID);

  for (const [key, answerText] of Object.entries(currentQuestion.answers)) {
    const answerElement = createAnswerElement(key, answerText);
    answersListElement.appendChild(answerElement);

    const currentQuestionElement = document.getElementById('question-element');

    answerElement.addEventListener('click', () => {
      clearInterval(currentQuestionElement.intervalID);
      const buttonColor = document.getElementById(key);

      if (key == currentQuestion.correct) {
        buttonColor.style.backgroundColor = 'rgb(33, 217, 128)';
        points.points++;
        document.getElementById(POINTS_ID).textContent = `${points.points}`;
      } else {
        buttonColor.style.backgroundColor = 'rgb(227, 120, 120)';
        const correctAnswer = document.getElementById(currentQuestion.correct);
        correctAnswer.style.backgroundColor = 'rgb(33, 217, 128)';
      }

      for (let item of answersListElement.children) {
        item.style.pointerEvents = 'none';
      }
      hideTimer();
      hideButton();
      pointsSave();
    });
  }

  const questionButton = document.getElementById(ANSWERS_LIST_ID).children;

  for (let button of questionButton) {
    button.addEventListener('click', function () {
      if (quizData.currentQuestionIndex <= 9) {
        alreadyAnswered = true;
        answerSave();
      }
    });
  }

  const nextQuestionButton = document.getElementById(NEXT_QUESTION_BUTTON_ID);

  nextQuestionButton.addEventListener('click', function () {
    alreadyAnswered = false;
    answerSave();

    if (quizData.currentQuestionIndex === 9) {
      createScoresPage();
    }
  });

  if (quizData.currentQuestionIndex < 9) {
    nextQuestionButton.addEventListener('click', nextQuestion);
  }

  document.getElementById(SKIP_BUTTON_ID).addEventListener('click', () => {
    alreadyAnswered = 'skip';
    answerSave();
    hideButton();
    hideTimer();

    const currentQuestion = quizData.questions[quizData.currentQuestionIndex];
    const correctAnswer = document.getElementById(currentQuestion.correct);
    correctAnswer.style.backgroundColor = 'rgb(33, 217, 128)';
    for (let item of answersListElement.children) {
      item.style.pointerEvents = 'none';
    }

    const currentQuestionElement = document.getElementById('question-element');
    clearInterval(currentQuestionElement.intervalID);
  });

  const restartButton = document.getElementById(RESTART);
  restartButton.style.display = 'block';
  restartButton.addEventListener('click', () => {
    SS.clear();
    location.reload();
  });
};

const nextQuestion = () => {
  // Reset the timer
  const currentQuestionElement = document.getElementById('question-element');
  clearInterval(currentQuestionElement.intervalID);

  if (quizData.currentQuestionIndex < 9) {
    quizData.currentQuestionIndex = quizData.currentQuestionIndex + 1;
  }
  positionSave();
  initQuestionPage();
};

export function pointsSave() {
  SS.setItem('userPoints', points.points);
}
export function positionSave() {
  SS.setItem(
    'userCurrentQuestion',
    JSON.stringify(quizData.currentQuestionIndex)
  );
}
export function answerSave() {
  SS.setItem('alreadyAnswered', alreadyAnswered);
}
export const hideTimer = () => {
  document.getElementById('timer').style.color = 'transparent';
};
