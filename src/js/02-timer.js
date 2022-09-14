import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  btnStart: document.querySelector('button[data-start]'),
  dataDays: document.querySelector('[data-days]'),
  dataHours: document.querySelector('[data-hours]'),
  dataMinutes: document.querySelector('[data-minutes]'),
  dataSeconds: document.querySelector('[data-seconds]'),
};

class Timer {
  constructor({ onTick }) {
    this.intervalId = null;
    this.isActive = false;
    this.onTick = onTick;
  }

  start(finishTime, currentTime) {
    if (this.isActive) {
      return;
    }
    this.isActive = true;
    const startTime = Date.now();

    this.intervalId = setInterval(() => {
      const currentTime = Date.now();
      const deltaTime = finishTime - currentTime;
      const time = convertMs(deltaTime);
      this.onTick(time);
      this.stop(deltaTime);
    }, 1000);
  }

  stop(e) {
    if (e > 1000) {
      return;
    }
    clearInterval(this.intervalId);
    this.isActive = true;
    Notify.failure('END OF TIME');
  }
}

const timer = new Timer({
  onTick: updateTimer,
});

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const finishDate = new Date(selectedDates[0]);
    onTimerStarts(finishDate);
  },
};

options.onClose([0]);

refs.btnStart.setAttribute('disabled', 'disabled');

flatpickr('#datetime-picker', options);

function onTimerStarts(finishDate) {
  const enterTime = finishDate.getTime();
  const currentTime = Date.now();

  if (currentTime - enterTime > 0) {
    return Notify.failure('Please choose a date in the future');
  }

  refs.btnStart.removeAttribute('disabled');
  refs.btnStart.addEventListener('click', () => timer.start(enterTime));
  console.log(enterTime);
  console.log(currentTime);
}

function pad(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = pad(Math.floor(ms / day));
  const hours = pad(Math.floor((ms % day) / hour));
  const minutes = pad(Math.floor(((ms % day) % hour) / minute));
  const seconds = pad(Math.floor((((ms % day) % hour) % minute) / second));

  return { days, hours, minutes, seconds };
}

function updateTimer({ days, hours, minutes, seconds }) {
  refs.dataDays.textContent = `${days}`;
  refs.dataHours.textContent = `${hours}`;
  refs.dataMinutes.textContent = `${minutes}`;
  refs.dataSeconds.textContent = `${seconds}`;
}
