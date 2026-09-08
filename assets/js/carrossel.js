// Carrossel de fotos do header que troca sozinho
let indiceAtual = 0;

function trocarFoto() {
  const fotos = document.querySelectorAll('.foto-carrossel');
  if (fotos.length === 0) return;

  // Remove a classe da foto atual
  fotos[indiceAtual].classList.remove('ativa');

  // Passa para a próxima foto (volta para a primeira no final)
  indiceAtual = (indiceAtual + 1) % fotos.length;

  // Adiciona a classe na nova foto
  fotos[indiceAtual].classList.add('ativa');
}

// Troca a imagem automaticamente a cada 4 segundos
setInterval(trocarFoto, 4);
