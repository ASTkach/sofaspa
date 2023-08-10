const slider = () => {
    var swiperSlider = new Swiper('.slider__body', {
        slidesPerView: 1,
        spaceBetween: 10,
        // grabCursor: true,
        speed: 600,
        loop: true,

        navigation: {
            nextEl: '.slider__button-next',
            prevEl: '.slider__button-prev',
        },

        pagination: {
            el: '.slider__pagination',
            clickable: true,
        },
    });
};

export default slider;
