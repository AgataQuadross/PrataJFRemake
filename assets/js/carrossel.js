const imagens = document.querySelectorAll('.foto-carrossel');
const btnAnterior = document.getElementById('btnAnterior');
const btnProximo = document.getElementById('btnProximo');

let indiceAtual = 0;

function atualizarCarrossel(novoIndice) {
  imagens[indiceAtual].classList.remove('ativa');
  indiceAtual = (novoIndice + imagens.length) % imagens.length;
  imagens[indiceAtual].classList.add('ativa');
}

btnAnterior.addEventListener('click', () => {
  atualizarCarrossel(indiceAtual - 1);
});

btnProximo.addEventListener('click', () => {
  atualizarCarrossel(indiceAtual + 1);
});