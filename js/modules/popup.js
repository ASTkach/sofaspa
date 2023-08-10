import { BLOCK_POPUP_DELAY, LARGE_TOUCHSCREEN_WIDTH } from './constants.js';
import { removeCartListItem } from './order.js';

const body = document.body;
const popups = document.querySelectorAll('.popup');
const formPopup = document.querySelector('.popup--form');
const acceptPopup = document.querySelector('.popup--accept');
const thankPopup = document.querySelector('.popup--thank');
const formPopupContainer = document.querySelector('.popup__container--form');
const acceptPopupContainer = document.querySelector('.popup__container--accept');
const thankPopupContainer = document.querySelector('.popup__container--thank');
const openFormPopupButton = document.querySelector('.btn--open-form');
const openAcceptPopupButton = document.querySelector('.form__link');
const openThankPopupButton = document.querySelector('.btn--send-form');

let delay;
let blockPopup;
let scrollWidth = window.innerWidth - body.offsetWidth + 'px';

const toggleBlockEvent = () => {
    blockPopup = true;

    setTimeout(() => {
        blockPopup = false;
    }, BLOCK_POPUP_DELAY);
};

const closePopup = (popup, popupContainer) => {
    popupContainer.classList.remove('_active-popup');

    setTimeout(() => {
        popup.classList.remove('_active-popup');

        if (popup.classList.contains('popup--thank')) {
            formPopup.classList.remove('_active-popup');
        }
    }, delay);
};

const openPopup = (popup, containerPopup, delay) => {
    popup.classList.add('_active-popup');

    setTimeout(() => {
        containerPopup.classList.add('_active-popup');
    }, delay);
};

const removeBodyLock = () => {
    if (window.innerWidth >= LARGE_TOUCHSCREEN_WIDTH) {
        body.classList.remove('_lock');
        body.style.paddingRight = null;
    }
};

document.addEventListener('keydown', function (e) {
    // if (e.key === 'Escape') {
    if (e.key === 'Escape' && acceptPopup.classList.contains('_active-popup')) {
        delay = 0;
        closePopup(acceptPopup, acceptPopupContainer, delay);
    } else if (
        e.key === 'Escape' &&
        formPopup.classList.contains('_active-popup') &&
        thankPopup.classList.contains('_active-popup')
    ) {
        delay = 300;
        closePopup(thankPopup, thankPopupContainer, delay);
        removeBodyLock();
    } else if (e.key === 'Escape' && formPopup.classList.contains('_active-popup')) {
        delay = 300;
        closePopup(formPopup, formPopupContainer, delay);
        removeBodyLock();
        // }
    }
});

openFormPopupButton.addEventListener('click', () => {
    if (window.innerWidth >= LARGE_TOUCHSCREEN_WIDTH) {
        body.classList.add('_lock');
        body.style.paddingRight = scrollWidth;
    }

    delay = 300;
    openPopup(formPopup, formPopupContainer, delay);
    toggleBlockEvent();
});

openAcceptPopupButton.addEventListener('click', () => {
    delay = 0;
    openPopup(acceptPopup, acceptPopupContainer, delay);
    toggleBlockEvent();
});

openThankPopupButton.addEventListener('click', (event) => {
    var errors = document.querySelectorAll('.form__error--text');
    if (errors.length > 0) {
        errors.forEach((error) => {
            error.remove();
        });
    }
    var errors = document.querySelectorAll('.form__error');
    if (errors.length > 0) {
        errors.forEach((error) => {
            error.classList.remove('form__error');
        });
    }

    const cartList = document.querySelectorAll('.cart__list li');

    var form = event.target.closest('form'),
        data = new FormData(form);

    cartList.forEach((item) => {
        data.append(
            'products[]',
            item.querySelector('.input-hidden--cart').name +
                ' ' +
                item.querySelector('.input-hidden--cart:checked + .form__label--cart').innerHTML
        );
        data.append('counts[]', item.querySelector('.form__input--quantity').value);
    });

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/worker/', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
            var json = JSON.parse(xhr.response);
            if (json.errors) {
                for (var name in json.errors) {
                    var div = document.createElement('div');
                    div.innerHTML = json.errors[name];
                    div.classList.add('form__error--text');

                    if (name == 'accept') {
                        form.querySelector('.accept').classList.add('form__error');
                        form.querySelector('.accept').after(div);
                    } else {
                        form.querySelector('*[name="' + name + '"]').classList.add('form__error');
                        form.querySelector('*[name="' + name + '"]').after(div);
                    }
                }
            }
            if (json.success) {
                form.reset();

                cartList.forEach((item) => {
                    removeCartListItem(item);
                });

                delay = 300;
                openPopup(thankPopup, thankPopupContainer, delay);
                toggleBlockEvent();
            }
        }
    };
    xhr.send(new URLSearchParams(data).toString());
});

popups.forEach((popup) => {
    popup.addEventListener('click', ({ target }) => {
        if (!blockPopup) {
            const popupContainer = popup.firstElementChild;

            if (
                (!target.closest('.popup__container--thank') &&
                    popup.classList.contains('popup--thank')) ||
                target.closest('.btn--close-thank')
            ) {
                delay = 300;
                closePopup(popup, popupContainer, delay);
                removeBodyLock();
            } else if (
                (!target.closest('.popup__container--form') &&
                    !popup.classList.contains('popup--accept')) ||
                target.closest('.btn--close-form')
            ) {
                delay = 300;
                closePopup(popup, popupContainer, delay);
                removeBodyLock();
            } else if (
                (!target.closest('.popup__container--accept') &&
                    popup.classList.contains('popup--accept')) ||
                target.closest('.btn--close-accept')
            ) {
                delay = 0;
                closePopup(popup, popupContainer, delay);
            }
        }
    });
});

export { formPopup };
