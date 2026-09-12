// Menu hamburguer - abre e fecha no mobile
function toggleMenu() {
    const menu = document.querySelector('.navegador');
    const botao = document.querySelector('.botao-hamburguer');
    if (!menu) return;
    menu.classList.toggle('aberto');

    if (botao) {
        botao.setAttribute('aria-expanded', menu.classList.contains('aberto'));
    }
}

function mostrarAviso(titulo, mensagem, icone) {
    let aviso = document.getElementById('aviso-site');

    if (!aviso) {
        aviso = document.createElement('div');
        aviso.id = 'aviso-site';
        aviso.className = 'aviso-site-sobreposicao';
        document.body.appendChild(aviso);
    }

    aviso.innerHTML = `
        <div class="aviso-site-cartao" role="dialog" aria-modal="true">
            <button type="button" class="aviso-site-fechar" onclick="fecharAviso()" title="Fechar aviso">&times;</button>
            <i class="${icone || 'fa-solid fa-circle-check'}"></i>
            <h2>${titulo}</h2>
            <p>${mensagem}</p>
            <button type="button" class="aviso-site-botao" onclick="fecharAviso()">Continuar</button>
        </div>
    `;
    aviso.classList.add('ativo');
}

function fecharAviso() {
    const aviso = document.getElementById('aviso-site');
    if (aviso) {
        aviso.classList.remove('ativo');
    }
}

// Esconde o link da página atual no menu
const nomePagina = window.location.pathname.split('/').pop() || 'index.html';
const linksMenu = document.querySelectorAll('.navegador a');
const botaoMenu = document.querySelector('.botao-hamburguer');

if (botaoMenu) {
    botaoMenu.setAttribute('aria-label', 'Abrir menu de navegação');
    botaoMenu.setAttribute('aria-expanded', 'false');
}

for (let i = 0; i < linksMenu.length; i++) {
    const endereco = linksMenu[i].getAttribute('href');
    if (endereco && endereco.split('#')[0] === nomePagina) {
        linksMenu[i].parentElement.style.display = 'none';
        linksMenu[i].setAttribute('aria-current', 'page');
    }
}

// Fecha o menu quando clica em um link
for (let i = 0; i < linksMenu.length; i++) {
    linksMenu[i].addEventListener('click', function() {
        const menu = document.querySelector('.navegador');
        const botao = document.querySelector('.botao-hamburguer');
        if (menu) {
            menu.classList.remove('aberto');
        }

        if (botao) {
            botao.setAttribute('aria-expanded', 'false');
        }
    });
}

document.addEventListener('keydown', function(evento) {
    if (evento.key === 'Escape') {
        const menu = document.querySelector('.navegador');
        const botao = document.querySelector('.botao-hamburguer');
        const aviso = document.getElementById('aviso-site');

        if (menu) menu.classList.remove('aberto');
        if (botao) botao.setAttribute('aria-expanded', 'false');
        if (aviso) fecharAviso();
    }
});
