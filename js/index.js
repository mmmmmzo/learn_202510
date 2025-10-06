import * as Todo from './modules/todo.js';
import * as Typing from './modules/typing.js';

const nav = document.getElementById('nav');
const cover = document.getElementById('cover');

const appNames = ['todo', 'typing', 'slide-puzzle', 'memory-card', 'life'];

appNames.forEach(appName => {
    const a = document.createElement('a');
    a.classList.add('nav-menu');
    a.textContent = appName.toUpperCase();
    a.addEventListener('click', e => {
        cover.classList.remove('active');
        const appEls = document.querySelectorAll('.app');
        appEls.forEach(appEl => {
            appEl.classList.remove('active');
        })
        const appEl = document.getElementById(appName);
        appEl.classList.add('active');
        const navMenus = document.querySelectorAll('.nav-menu');
        navMenus.forEach(menu => {
            menu.classList.remove('active');
        })
        e.target.classList.add('active');
    })
    nav.appendChild(a);
})