import { toggleCartListItem } from './order.js';

const getLocalCartList = () => {
    if (localStorage.getItem('cartList') === null) {
        localStorage.setItem('cartList', JSON.stringify([]));
    } else {
        let listLocal = JSON.parse(localStorage.getItem('cartList'));
        listLocal.forEach((item) => {
            const checkedItem = document.getElementById(`${item.id}`);
            const catalogItem = checkedItem.closest('[data-name="catalog-item"]');
            const cartItemCount = item.count;

            toggleCartListItem(catalogItem, cartItemCount);
        });
    }
};

const saveLocalCartList = (cartList) => {
    localStorage.setItem('cartList', JSON.stringify(cartList));
};

export { saveLocalCartList, getLocalCartList };
