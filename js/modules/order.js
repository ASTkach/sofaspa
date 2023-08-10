import { OPEN_FORM_BUTTON_MARGIN_TOP_BIG, LARGE_TOUCHSCREEN_WIDTH } from './constants.js';
import { saveLocalCartList } from './local-storage.js';
import { spoilers, firstSpoiler } from './spoilers.js';
import { cartParrentBlock, closeCartButton } from './toggle-cart-list.js';

const catalog = document.querySelector('.catalog');
const cartList = document.querySelector('.cart__list');
const cartText = document.querySelector('.cart__text');
const openFormButton = document.querySelector('.btn--open-form');
const sectionContainer = document.querySelector('.section__container--order');

const firstSpoilerContentHeight = firstSpoiler.nextElementSibling.scrollHeight;
const openFormButtonStyles = getComputedStyle(openFormButton);
const openFormButtonMarginTop = parseFloat(openFormButtonStyles.marginTop);

let catalogHeight = catalog.clientHeight + firstSpoilerContentHeight;
let localCartItems = [];
let cartListItemsCount = 0;
let cartListHeight = 0;

const getOpenSpoilersTotalHeight = () => {
    spoilers.forEach((spoiler) => {
        spoiler.addEventListener('click', ({ target }) => {
            const spoilerContent = target.nextElementSibling;
            const spoilerContentHeight = spoilerContent.scrollHeight;

            if (spoiler.classList.contains('_opend')) {
                catalogHeight += spoilerContentHeight;
            } else {
                catalogHeight -= spoilerContentHeight;
            }

            setCartListHeight();
        });
    });
};

getOpenSpoilersTotalHeight();

const setCartListHeightOnResize = () => {
    if (cartListItemsCount) {
        const cartItems = document.querySelectorAll('.cart__item');
        catalogHeight = catalog.clientHeight;
        cartListHeight = 0;

        cartItems.forEach((item) => {
            const cartListItemHeight = item.scrollHeight;
            cartListHeight += cartListItemHeight;
        });

        setCartListHeight();
    }
};

const setCartListHeight = () => {
    const sectionContainerStyles = getComputedStyle(sectionContainer);
    const sectionContainerGap = parseFloat(sectionContainerStyles.gap);

    const openFormButtonHeight = openFormButton.clientHeight;
    let cartHeight = 0;
    let cartHeightWithoutCartList = 0;

    if (window.innerWidth >= LARGE_TOUCHSCREEN_WIDTH) {
        cartHeightWithoutCartList = openFormButtonHeight + openFormButtonMarginTop;
        cartHeight = cartListHeight + cartHeightWithoutCartList;
    } else {
        const cartParrentBlockStyles = getComputedStyle(cartParrentBlock);
        const cartParrentBlockPadding = parseFloat(cartParrentBlockStyles.paddingBlock) * 2;
        const closeCartButtonStyles = getComputedStyle(closeCartButton);
        const closeCartButtonMarginBottom = parseFloat(closeCartButtonStyles.marginBottom);

        cartHeightWithoutCartList =
            cartParrentBlockPadding +
            openFormButtonHeight +
            openFormButtonMarginTop +
            closeCartButtonMarginBottom;

        cartHeight = cartListHeight + cartHeightWithoutCartList;
    }

    if (cartListItemsCount === 0) {
        cartList.style.height = null;
        cartList.style.paddingRight = null;
    } else if (window.innerWidth < LARGE_TOUCHSCREEN_WIDTH) {
        if (cartHeight > innerHeight) {
            cartList.style.height = `calc(100vh - ${cartHeightWithoutCartList + 'px'})`;
        } else {
            cartList.style.height = cartListHeight + 'px';
        }
        cartList.style.paddingRight = null;
    } else if (cartHeight < catalogHeight) {
        cartList.style.height = cartListHeight + 'px';
        openFormButton.style.marginTop = null;
        cartList.style.paddingRight = null;
    } else if (cartHeight > catalogHeight) {
        openFormButton.style.marginTop = OPEN_FORM_BUTTON_MARGIN_TOP_BIG + 'px';
        cartList.style.height =
            catalogHeight - openFormButtonHeight - OPEN_FORM_BUTTON_MARGIN_TOP_BIG + 'px';
        cartList.style.paddingRight = sectionContainerGap + 'px';
    }
};

const checkNumsOfCartItems = () => {
    if (cartListItemsCount === 0) {
        openFormButton.style.display = 'none';
        cartText.style.display = 'flex';
    } else {
        openFormButton.style.display = 'block';
        cartText.style.display = 'none';
    }
};

const cartCounter = (cart) => {
    cart.addEventListener('click', function ({ target }) {
        const countInput = cart.querySelector('.form__count input');

        if (target.classList.contains('form__button--more')) {
            countInput.value++;
        } else if (target.classList.contains('form__button--less')) {
            if (countInput.value <= 1) {
                return;
            } else {
                countInput.value--;
            }
        } else {
            countInput.addEventListener('change', ({ target }) => {
                if (isNaN(target.value)) {
                    target.value = 1;
                } else {
                    target.value = target.value.trim();
                    addCartItemCountToLocalStorage(cart, target.value);
                }
            });
        }

        addCartItemCountToLocalStorage(cart, countInput.value);
    });
};

const removeFromCartList = (dataName) => {
    const removedCartItem = document.querySelector(`[data-name="${dataName}"]`);
    removedCartItem.remove();
};

const addToCartList = (name, dataName, img, count) => {
    const cartListItem = document.createElement('li');
    cartListItem.classList.add('cart__item');
    cartListItem.setAttribute('data-name', `${dataName}`);

    name = name.split('-');

    const [title, subTitle] = name;

    cartListItem.innerHTML = `
        <div class="cart__item-title-wrap">
            <h3 class="cart__item-title">${title}<span class="cart__item-sub-title">/${subTitle}</span></h3>
            <button class="btn btn--close btn--delete-cart-item" type="button" tabindex="2">
                <span class="btn__icon"></span>
            </button>
        </div>
        <div class="cart__item-body">
            <div action="#" class="form form--cart">
                <div class="form__item form__item--count">
                    <div class="form__img-wrap">
                        <img
                            class="form__img"
                            src="${img.src}"
                            alt="#"
                            width="${img.width}"
                            height="${img.height}"
                        />
                    </div>
                    <div class="form__count-wrap">
                        <h4 class="form__item-title form__item-title--cart">Count</h4>
                        <div class="form__count" data-name="${dataName + 'Count'}">
                            <button class="form__button form__button--less">-</button>
                            <label class="form__label">
                                <input
                                    class="form__input form__input--quantity"
                                    type="text"
                                    value="${count}"
                                />
                            </label>
                            <button class="form__button form__button--more">+</button>
                        </div>
                    </div>
                </div>
                <div class="form__item form__item--fees">
                    <h4 class="form__item-title form__item-title--cart">
                        Additional fees
                    </h4>
                    <div class="form__bar">
                        <input
                            class="form__input form__input--cart input-hidden input-hidden--cart"
                            type="radio"
                            name="${title + subTitle}"
                            id="${title + subTitle + 'Standart'}"
                            value="Standart"
                            checked
                            tabindex="2"
                        />
                        <label
                            class="form__label form__label--cart"
                            for="${title + subTitle + 'Standart'}"
                        >
                            Standart
                        </label>
                        <input
                            class="form__input form__input--cart input-hidden input-hidden--cart"
                            type="radio"
                            name="${title + subTitle}"
                            id="${title + subTitle + 'Intensive'}"
                            value="Intensive"
                            tabindex="2"
                        />
                        <label
                            class="form__label form__label--cart"
                            for="${title + subTitle + 'Intensive'}"
                        >
                            Intensive
                        </label>
                        <input
                            class="form__input form__input--cart input-hidden input-hidden--cart"
                            type="radio"
                            name="${title + subTitle}"
                            id="${title + subTitle + 'Delicate'}"
                            value="Delicate"
                            tabindex="2"
                        />
                        <label
                            class="form__label form__label--cart"
                            for="${title + subTitle + 'Delicate'}"
                        >
                            Delicate
                        </label>
                    </div>
                </div>
            </div>
        </div>
        `;

    return cartListItem;
};

const addCartItemCountToLocalStorage = (cart, value) => {
    localCartItems = localCartItems.map((item) => {
        let id = cart.getAttribute('data-name');
        if (item.id + 'Count' === id) {
            item.count = value;
        }
        return item;
    });

    saveLocalCartList(localCartItems);
};

const addCartItemToLocalStorage = (catalogItemId, count) => {
    localCartItems.push({
        id: catalogItemId,
        count,
    });
    saveLocalCartList(localCartItems);
};

const removeCartItemFromLocalStorage = (catalogItemId) => {
    localCartItems = localCartItems.filter((item) => item.id !== catalogItemId);
    saveLocalCartList(localCartItems);
};

const toggleCartListItem = (catalogItem, catalogItemCount = 1) => {
    if (catalogItem) {
        const catalogItemInput = catalogItem.firstElementChild;
        const catalogItemImg = catalogItem.lastElementChild;
        const catalogItemId = catalogItemInput.id;
        const catalogItemName = catalogItemInput.name;

        if (catalogItem.classList.contains('_checked')) {
            catalogItem.classList.remove('_checked');
            catalogItemInput.checked = false;

            cartListItemsCount--;

            const cartItem = document.querySelector(`[data-name="${catalogItemId}"]`);
            cartListHeight -= cartItem.clientHeight;

            removeFromCartList(catalogItemId);
            checkNumsOfCartItems();
            removeCartItemFromLocalStorage(catalogItemId);
        } else {
            catalogItem.classList.add('_checked');
            catalogItemInput.checked = true;

            cartListItemsCount++;

            cartList.append(
                addToCartList(catalogItemName, catalogItemId, catalogItemImg, catalogItemCount)
            );
            checkNumsOfCartItems();

            const cartCount = document.querySelector(`[data-name="${catalogItemId + 'Count'}"]`);
            cartCounter(cartCount);

            const cartItem = document.querySelector(`[data-name="${catalogItemId}"]`);
            cartListHeight += cartItem.clientHeight;

            addCartItemToLocalStorage(catalogItemId, catalogItemCount);
        }
    } else {
        return;
    }

    setCartListHeight();
};

catalog.addEventListener('click', ({ target }) => {
    const catalogItem = target.closest('[data-name="catalog-item"]');

    let catalogItemCount;

    toggleCartListItem(catalogItem, catalogItemCount);
});

const removeCartListItem = (currentCartItem) => {
	const currentCartItemId = currentCartItem.getAttribute('data-name');
	const currentCatalogItem = document.getElementById(currentCartItemId);
	const currentCatalogItemWrap = currentCatalogItem.closest('[data-name="catalog-item"]');

	currentCatalogItem.checked = false;
	currentCatalogItemWrap.classList.remove('_checked');

	cartListHeight -= currentCartItem.clientHeight;

	cartListItemsCount--;

	checkNumsOfCartItems();
	setCartListHeight();
	removeFromCartList(currentCartItemId);
	removeCartItemFromLocalStorage(currentCartItemId);
}

cartList.addEventListener('click', ({ target }) => {
    if (target.classList.contains('btn--delete-cart-item')) {
        const currentCartItem = target.closest('.cart__item');
        const currentCartItemId = currentCartItem.getAttribute('data-name');
        const currentCatalogItem = document.getElementById(currentCartItemId);
        const currentCatalogItemWrap = currentCatalogItem.closest('[data-name="catalog-item"]');

        currentCatalogItem.checked = false;
        currentCatalogItemWrap.classList.remove('_checked');

        cartListHeight -= currentCartItem.clientHeight;

        cartListItemsCount--;

        checkNumsOfCartItems();
        setCartListHeight();
        removeFromCartList(currentCartItemId);
        removeCartItemFromLocalStorage(currentCartItemId);
    }
});

export { setCartListHeight, toggleCartListItem, setCartListHeightOnResize, removeCartListItem };
