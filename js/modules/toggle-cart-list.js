const openCartButton = document.querySelector('.btn--open-cart');
const closeCartButton = document.querySelector('.btn--close-cart');
const cartParrentBlock = document.querySelector('.section__block');

const toggleCart = () => {
    openCartButton.addEventListener('click', () => {
        document.body.classList.add('_lock');
        cartParrentBlock.classList.add('_show-cart');
    });

    document.body.addEventListener('click', ({ target }) => {
        if (target.classList.contains('_lock') || target.closest('.btn--close-cart')) {
            document.body.classList.remove('_lock');
            cartParrentBlock.classList.remove('_show-cart');
        } else {
            return;
        }
    });
};

export { toggleCart, cartParrentBlock, closeCartButton };
