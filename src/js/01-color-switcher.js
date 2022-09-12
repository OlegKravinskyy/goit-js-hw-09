function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

const COLOR_DELAY = 1000;
let timerId = null;
const refs = {
  body: document.querySelector('body'),
  btnStart: document.querySelector('button[data-start]'),
  btnStop: document.querySelector('button[data-stop]'),
};

refs.btnStart.addEventListener('click', onButtonStart);

refs.btnStop.addEventListener('click', onButtonStop);

function onButtonStart() {
  timerId = setInterval(() => {
    refs.body.style.backgroundColor = getRandomHexColor();
  }, COLOR_DELAY);

  refs.btnStart.setAttribute('disabled', 'disabled');
}

function onButtonStop() {
  clearInterval(timerId);
  refs.btnStart.removeAttribute('disabled');
}
