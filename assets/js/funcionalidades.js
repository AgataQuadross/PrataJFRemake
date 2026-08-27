// Menu hamburguer - abre e fecha no mobile
function toggleMenu() {
    var menu = document.querySelector('.navegador');
    menu.classList.toggle('aberto');
}

// Fecha o menu quando clica em um link
var links = document.querySelectorAll('.navegador a');
for (var i = 0; i < links.length; i++) {
    links[i].addEventListener('click', function() {
        var menu = document.querySelector('.navegador');
        menu.classList.remove('aberto');
    });
}
