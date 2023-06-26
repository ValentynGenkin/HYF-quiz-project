import {
  ANSWERS_LIST_ID,
  NEXT_QUESTION_BUTTON_ID,
  USER_INTERFACE_ID,
  POINTS_ID,
  SKIP_BUTTON_ID,
} from '../constants.js';
import { createQuestionElement } from '../views/questionView.js';
import { createAnswerElement } from '../views/answerView.js';
import { createScoresPage } from './scoresPage.js';
import { quizData } from '../data.js';
import { SS } from '../app.js';

export const points = {
  points: 0,
};

let alreadyAnswered = false;

export const initQuestionPage = () => {
  const userInterface = document.getElementById(USER_INTERFACE_ID);
  userInterface.innerHTML = '';
  const currentQuestion = quizData.questions[quizData.currentQuestionIndex];

  const questionElement = createQuestionElement(
    currentQuestion.text,
    currentQuestion.correct
  );
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

    const questionButton = document.getElementById(ANSWERS_LIST_ID).children;

    for (let button of questionButton) {
      button.addEventListener('click', function () {
        if (quizData.currentQuestionIndex <= 9) {
          alreadyAnswered = true;
          answerSave();
        }
      });
    }

    answerElement.addEventListener('click', () => {
      const currentQuestionElement = document.getElementById(
        'question-element'
      );
      clearInterval(currentQuestionElement.intervalID);
      const buttonColor = document.getElementById(key);
      if (key == currentQuestion.correct) {
        buttonColor.style.backgroundColor = 'green';
        points.points++;
        document.getElementById(POINTS_ID).textContent = `${points.points}`;
      } else {
        buttonColor.style.backgroundColor = 'red';
        const correctAnswer = document.getElementById(currentQuestion.correct);
        correctAnswer.style.backgroundColor = 'green';
      }

      for (let item of answersListElement.children) {
        item.style.pointerEvents = 'none';
      }

      pointsSave();
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

    const currentQuestion = quizData.questions[quizData.currentQuestionIndex];
    const correctAnswer = document.getElementById(currentQuestion.correct);
    correctAnswer.style.backgroundColor = 'green';
    for (let item of answersListElement.children) {
      item.style.pointerEvents = 'none';
    }

    const currentQuestionElement = document.getElementById('question-element');
    clearInterval(currentQuestionElement.intervalID);
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
