const spoilers = document.querySelectorAll("[data-name='spoiler']");
const firstSpoiler = document.querySelector("[data-name='spoiler']");

const collapseSpoiler = (spoiler) => (spoiler.nextElementSibling.style.maxHeight = '0px');

const expandSpoiler = (spoiler) => {
    const spoilerHeight = spoiler.nextElementSibling.scrollHeight;
    spoiler.nextElementSibling.style.maxHeight = spoilerHeight + 'px';
};

const initialSpoiler = () => {
    firstSpoiler.classList.add('_opend');
    expandSpoiler(firstSpoiler);
};

const spoilerClick = ({ target }) => {
    const spoiler = target.closest("[data-name='spoiler']");
    expandSpoiler(spoiler);

    if (target.classList.contains('_opend')) {
        target.classList.remove('_opend');
        collapseSpoiler(spoiler);
    } else {
        target.classList.add('_opend');
    }
};

spoilers.forEach((spoiler) => spoiler.addEventListener('click', spoilerClick));

export { spoilers, firstSpoiler, initialSpoiler };
