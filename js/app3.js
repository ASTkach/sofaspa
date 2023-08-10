import { toggleCart } from './modules/toggle-cart-list.js';
import { initialSpoiler } from './modules/spoilers.js';
import slider from './modules/slider.js';
import windowResize from './modules/window-resize.js';
import { getLocalCartList } from './modules/local-storage.js';

toggleCart();
initialSpoiler();
slider();
windowResize();
getLocalCartList();

var im = new Inputmask("(999) 999-9999"),
	phones = document.querySelectorAll('input[type="tel"]');
	
	if(phones.length > 0){
		phones.forEach(phone => {
			im.mask(phone);
		});
	}
	
