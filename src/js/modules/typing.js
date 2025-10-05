const startPage = document.querySelector('#ty-start-page');
const typingGame = document.querySelector('#ty-game');
const titleTime = document.querySelector('#ty-title-time');
const timer = document.querySelector('#ty-timer');
const timeSelectEl = document.querySelector('.ty-time-select');
const typing = document.querySelector('#typing');
const backToStart = document.querySelector('#ty-back-to-start');
const resultContainer = document.querySelector('#ty-result-container');
const textarea = document.querySelector('#ty-textarea');
const quote = document.querySelector('#ty-quote');
// const author = document.querySelector('#ty-author-name'); 使わないやつ
const LPM = document.querySelector('#ty-LPM');
const quoteReview = document.querySelector('#ty-quote-review');

let timelimit = 30;
let remainingTime;
let isActive = false;
let isPlaying = false;
let intervalId = null;
let quotes;
let typedCount;
let LPMCount;

timeSelectEl.addEventListener('change', () => {
    timelimit = timeSelectEl.value;
})

window.addEventListener('keypress', e => {
    isActive = typing.classList.contains('active');

    if (e.key === 'Enter' && isActive && !isPlaying) {
        start();
        isPlaying = true;
    }
    return;
})

async function start() {
    startPage.classList.remove('show');
    typingGame.classList.add('show');

    titleTime.textContent = timelimit;
    remainingTime = timelimit;
    timer.textContent = remainingTime;

    await fetchAndRenderQuotes();
    textarea.disabled = false;
    textarea.focus();
    typedCount = 0;

    intervalId = setInterval(() => {
        remainingTime -= 1;
        timer.textContent = remainingTime;
        if (remainingTime <= 0) {
            showResult();
        }
    }, 1000)
}

backToStart.addEventListener('click', () => {
    typingGame.classList.remove('show');
    startPage.classList.add('show');
    resultContainer.classList.remove('show');
    isPlaying = false;
})

function showResult() {
    textarea.disabled = true;
    clearInterval(intervalId);

    // 得点計算してる
    LPMCount = remainingTime === 0 ? Math.floor(typedCount * 60 / timelimit) :
        Math.floor(typedCount * 60 / (timelimit - remainingTime));
    quoteReview.innerHTML = `Title_No.${quotes.no}<br>${quotes.quote}`;
    let count = 0;

    // ポイント発表のやつ
    setTimeout(() => {
        resultContainer.classList.add('show');
        const countup = setInterval(() => {
            LPM.textContent = count;
            count += 1;
            if (count >= LPMCount) {
                clearInterval(countup);
            }
        }, 20)
    }, 1000);
}

async function fetchAndRenderQuotes() {
    quote.innerHTML = '';
    textarea.value = '';
    const randam = Math.floor((Math.random() * (20 + 1))); // データランダムにしてるだけ
    const RANDOM_QUOTE_API_URL = `https://jsonplaceholder.typicode.com/todos/${randam}`;
    const response = await fetch(RANDOM_QUOTE_API_URL);
    const data = await response.json();
    console.log(data);
    quotes = {
        no: data.id,
        quote: data.title
    };

    quotes.quote.split('').forEach(letter => {
        const span = document.createElement('span');
        span.textContent = letter;
        quote.appendChild(span);
    })
}


textarea.addEventListener('input', () => {
    let inputArray = textarea.value.split('');
    let spans = quote.querySelectorAll('span');
    spans.forEach(span => {
        span.className = '';
    })
    typedCount = 0;

    inputArray.forEach((letter, index) => {
        // 入力テキストの正誤判定。テキストに色をつける。
        if (letter === spans[index].textContent) {
            console.log('OK')
            spans[index].classList.add('correct');
            if (spans[index].textContent !== ' ') {
                typedCount += 1;
            }
        } else {
            console.log('NG')
            spans[index].classList.add('wrong');
            if (spans[index].textContent === ' ') {
                spans[index].classList.add('bar');
            }

        }
    })

    // 入力全部クリアできたらリザルトへ
    if (spans.length === inputArray.length && [...spans].every(span => span.classList.contains('correct'))) {
        showResult();
    }
})