"use strict";

var wrapper = document.querySelector(".wrapper");
function changeBackgroundColor(mediaQuery) {
  if (mediaQuery.matches) {
    wrapper.style.backgroundColor = 'red'; /* Change background color for screens matching the media query */
  } else {
    wrapper.style.backgroundColor = 'blue'; /* Reset background color for screens not matching the media query */
  }
}

var mediaQuery = window.matchMedia('(max-width: 319px)');
changeBackgroundColor(mediaQuery); // Initial check

mediaQuery.addEventListener('change', function (e) {
  changeBackgroundColor(e.matches);
});