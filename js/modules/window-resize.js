import { navIcon, removeAddedClasses, setNavIconPosition } from './burger-menu.js';
import { formPopup } from './popup.js';
import { cartParrentBlock } from './toggle-cart-list.js';
import { X_LARGE_DESKTOP_WIDTH, LARGE_TOUCHSCREEN_WIDTH, RESIZER_DELAY } from './constants.js';
import { setCartListHeightOnResize } from './order.js';

let lockNavResize;
let lockPopupResize;

const windowResize = () => {
    window.addEventListener('resize', () => {
        // set cartList height on breakpoints
        setCartListHeightOnResize();

        // remove burger menu / set navIcon position
        if (
            window.innerWidth >= X_LARGE_DESKTOP_WIDTH &&
            navIcon.classList.contains('_active') &&
            !lockNavResize
        ) {
            removeAddedClasses();
            lockNavResize = true;
        } else if (window.innerWidth < X_LARGE_DESKTOP_WIDTH) {
            // set navIcon transition to none, so that the icon has a fixed position when resized
            navIcon.style.transition = 'none';

            setNavIconPosition();
            // return our transition for animation
            setTimeout(() => {
                navIcon.style.transition = null;
            }, RESIZER_DELAY);

            lockNavResize = false;
        }

        // set static/fixed position to parrent block of cartList
        if (
            window.innerWidth >= LARGE_TOUCHSCREEN_WIDTH &&
            formPopup.classList.contains('_active-popup') &&
            !lockPopupResize
        ) {
            cartParrentBlock.classList.remove('_show-cart');
            lockPopupResize = true;
        } else if (
            window.innerWidth >= LARGE_TOUCHSCREEN_WIDTH &&
            cartParrentBlock.classList.contains('_show-cart') &&
            !formPopup.classList.contains('_active-popup') &&
            !lockPopupResize
        ) {
            cartParrentBlock.classList.remove('_show-cart');
            document.body.classList.remove('_lock');
            lockPopupResize = true;
        } else if (
            window.innerWidth < LARGE_TOUCHSCREEN_WIDTH &&
            formPopup.classList.contains('_active-popup') &&
            lockPopupResize
        ) {
            cartParrentBlock.classList.add('_show-cart');
            lockPopupResize = false;
        } else if (
            window.innerWidth >= LARGE_TOUCHSCREEN_WIDTH &&
            cartParrentBlock.classList.contains('_show-cart') &&
            lockPopupResize
        ) {
            lockPopupResize = false;
        }
    });
};

export default windowResize;
