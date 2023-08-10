import { X_LARGE_DESKTOP_WIDTH } from './constants.js';

const navIcon = document.querySelector('.nav__icon');
const navigation = document.querySelector('.nav__body');
const container = document.querySelector('.container');
const containerStyles = window.getComputedStyle(container);
const containerPadding = parseInt(containerStyles.getPropertyValue('padding-inline'));

const removeAddedClasses = () => {
    document.body.classList.remove('_lock');
    navIcon.classList.remove('_active');
    navigation.classList.remove('_active');
    navIcon.style.right = null;
};

const toggleClasses = () => {
    document.body.classList.toggle('_lock');
    navIcon.classList.toggle('_active');
    navigation.classList.toggle('_active');
};

const setNavIconPosition = () => {
    const navigationWidth = navigation.clientWidth;
    const containerWidth = container.clientWidth;

    if (navIcon.classList.contains('_active')) {
        navIcon.style.right =
            navigationWidth -
            (window.innerWidth - containerWidth + containerPadding / 2) / 2 +
            'px';
    } else {
        navIcon.style.right = null;
    }
};

navIcon.addEventListener('click', () => {
    toggleClasses();
    setNavIconPosition();
});

navigation.addEventListener('click', ({ target }) => {
    if (window.innerWidth < X_LARGE_DESKTOP_WIDTH) {
        if (target.closest('.nav__link')) {
            removeAddedClasses();
        } else {
            return;
        }
    } else {
        return;
    }
});

export { navIcon, removeAddedClasses, setNavIconPosition };
