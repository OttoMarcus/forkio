const burger = document.querySelector(".header__burger");
const burgerMenu = document.querySelector(".navi-list");

document.addEventListener("click", function(event) {
    if (event.target.closest(".header__burger")){
        burger.classList.toggle("active");
        burgerMenu.classList.toggle("active");
        document.body.classList.toggle("lock");
    }
})