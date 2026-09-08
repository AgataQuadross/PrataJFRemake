// Menu hamburguer - abre e fecha no mobile
function toggleMenu() {
    const menu = document.querySelector('.navegador');
    menu.classList.toggle('aberto');
}

// Fecha o menu quando clica em um link
const links = document.querySelectorAll('.navegador a');
for (let i = 0; i < links.length; i++) {
    links[i].addEventListener('click', function() {
        const menu = document.querySelector('.navegador');
        menu.classList.remove('aberto');
    });
}
