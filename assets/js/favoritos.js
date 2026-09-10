// Gerenciamento de Produtos Favoritos (Prata JF)
// Todas as variáveis e funções em Português (Brasil)

// Obtém a lista de produtos favoritados do armazenamento local
function obterFavoritos() {
    try {
        const favoritos = localStorage.getItem('favoritos');
        return favoritos ? JSON.parse(favoritos) : [];
    } catch (erro) {
        console.error('Erro ao ler favoritos:', erro);
        return [];
    }
}

// Salva a lista de favoritos no armazenamento local
function salvarFavoritos(favoritos) {
    try {
        localStorage.setItem('favoritos', JSON.stringify(favoritos));
        document.dispatchEvent(new CustomEvent('favoritosAtualizados', { detail: favoritos }));
    } catch (erro) {
        console.error('Erro ao salvar favoritos:', erro);
    }
}

// Verifica se um produto específico está favoritado
function produtoEstaFavoritado(nomeProduto) {
    const favoritos = obterFavoritos();
    return favoritos.some(item => item.nome === nomeProduto);
}

// Alterna o estado de favorito de um produto
function alternarFavorito(evento, elementoBotao, produtoDados) {
    if (evento) {
        evento.stopPropagation();
        evento.preventDefault();
    }

    let produto = produtoDados;

    // Se os dados não foram passados diretamente, busca no elemento pai mais próximo
    if (!produto && elementoBotao) {
        const cardProduto = elementoBotao.closest('.visualizar-produto') || elementoBotao.closest('[data-nome]');
        if (cardProduto) {
            const imgEl = cardProduto.querySelector('img');
            produto = {
                nome: cardProduto.dataset.nome || (imgEl ? imgEl.alt : ''),
                preco: parseFloat(cardProduto.dataset.preco) || 0,
                imagem: cardProduto.dataset.imagem || (imgEl ? imgEl.getAttribute('src') : ''),
                categoria: cardProduto.dataset.categoria || 'Prata 925',
                descricao: cardProduto.dataset.descricao || 'Joia em Prata 925 legítima.'
            };
        } else if (elementoBotao.dataset.nome) {
            produto = {
                nome: elementoBotao.dataset.nome,
                preco: parseFloat(elementoBotao.dataset.preco) || 0,
                imagem: elementoBotao.dataset.imagem || '',
                categoria: elementoBotao.dataset.categoria || 'Prata 925',
                descricao: elementoBotao.dataset.descricao || 'Joia em Prata 925 legítima.'
            };
        }
    }

    if (!produto || !produto.nome) return;

    let favoritos = obterFavoritos();
    const indice = favoritos.findIndex(item => item.nome === produto.nome);

    if (indice >= 0) {
        // Remove dos favoritos
        favoritos.splice(indice, 1);
    } else {
        // Adiciona aos favoritos
        favoritos.push(produto);
    }

    salvarFavoritos(favoritos);
    atualizarBotoesFavoritos();

    // Se estiver na página de favoritos, re-renderiza a lista
    if (document.getElementById('grade-favoritos')) {
        renderizarPaginaFavoritos();
    }
}

// Atualiza o estado visual de todos os botões de favoritos na página
function atualizarBotoesFavoritos() {
    const favoritos = obterFavoritos();
    const nomesFavoritados = new Set(favoritos.map(item => item.nome));

    const botoes = document.querySelectorAll('.botao-favorito, .botao-modal-favoritar');
    botoes.forEach(botao => {
        const cardProduto = botao.closest('.visualizar-produto') || botao.closest('[data-nome]');
        const nome = (cardProduto ? cardProduto.dataset.nome : botao.dataset.nome) || botao.getAttribute('data-nome-produto');

        if (nome && nomesFavoritados.has(nome)) {
            botao.classList.add('ativo');
            const icone = botao.querySelector('i');
            if (icone) {
                icone.classList.remove('fa-regular');
                icone.classList.add('fa-solid');
            }
            if (botao.classList.contains('botao-modal-favoritar')) {
                botao.innerHTML = '<i class="fa-solid fa-heart"></i> Favoritado';
            }
        } else if (nome) {
            botao.classList.remove('ativo');
            const icone = botao.querySelector('i');
            if (icone) {
                icone.classList.remove('fa-solid');
                icone.classList.add('fa-regular');
            }
            if (botao.classList.contains('botao-modal-favoritar')) {
                botao.innerHTML = '<i class="fa-regular fa-heart"></i> Favoritar';
            }
        }
    });
}

// Renderiza a lista de favoritos na página favoritos.html
function renderizarPaginaFavoritos() {
    const containerGrade = document.getElementById('grade-favoritos');
    const containerVazio = document.getElementById('favoritos-vazio');
    const contadorFavoritos = document.getElementById('contador-favoritos-total');

    if (!containerGrade) return;

    const favoritos = obterFavoritos();

    if (contadorFavoritos) {
        contadorFavoritos.textContent = favoritos.length === 1 ? '1 item salvo' : `${favoritos.length} itens salvos`;
    }

    if (favoritos.length === 0) {
        containerGrade.style.display = 'none';
        if (containerVazio) containerVazio.style.display = 'flex';
        return;
    }

    if (containerVazio) containerVazio.style.display = 'none';
    containerGrade.style.display = 'grid';
    containerGrade.innerHTML = '';

    favoritos.forEach(produto => {
        const cartao = document.createElement('div');
        cartao.className = 'cartao-favorito';

        const precoFormatado = produto.preco ? produto.preco.toFixed(2).replace('.', ',') : '0,00';

        cartao.innerHTML = `
            <div class="favorito-imagem-wrapper">
                <img src="${produto.imagem}" alt="${produto.nome}">
                <button type="button" class="botao-remover-favorito" title="Remover dos favoritos" onclick="removerFavorito('${produto.nome.replace(/'/g, "\\'")}')">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
            <div class="favorito-detalhes">
                <span class="favorito-categoria">${produto.categoria || 'Prata 925'}</span>
                <h3 class="favorito-titulo">${produto.nome}</h3>
                <div class="favorito-preco">R$ ${precoFormatado}</div>
                <div class="favorito-acoes">
                    <button type="button" class="botao-favorito-carrinho" onclick="adicionarFavoritoAoCarrinho('${produto.nome.replace(/'/g, "\\'")}')">
                        <i class="fa-solid fa-cart-shopping"></i> Adicionar
                    </button>
                </div>
            </div>
        `;

        containerGrade.appendChild(cartao);
    });
}

// Remove um produto diretamente pelo nome
function removerFavorito(nomeProduto) {
    let favoritos = obterFavoritos();
    favoritos = favoritos.filter(item => item.nome !== nomeProduto);
    salvarFavoritos(favoritos);
    renderizarPaginaFavoritos();
}

// Adiciona um item favoritado diretamente ao carrinho
function adicionarFavoritoAoCarrinho(nomeProduto) {
    const favoritos = obterFavoritos();
    const produto = favoritos.find(item => item.nome === nomeProduto);
    if (!produto) return;

    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const itemExistente = carrinho.find(item => item.nome === produto.nome);

    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({
            nome: produto.nome,
            preco: produto.preco,
            quantidade: 1
        });
    }

    localStorage.setItem('carrinho', JSON.stringify(carrinho));

    // Atualiza contador do carrinho se existir no DOM
    const contador = document.getElementById('cart-count');
    if (contador) {
        const total = carrinho.reduce((acc, i) => acc + (i.quantidade || 0), 0);
        contador.textContent = total;
        contador.style.display = total > 0 ? 'inline-flex' : 'none';
    }

    alert(`"${produto.nome}" foi adicionado ao seu carrinho!`);
}

// Inicializa os favoritos na carga do documento
document.addEventListener('DOMContentLoaded', () => {
    atualizarBotoesFavoritos();
    renderizarPaginaFavoritos();

    document.addEventListener('favoritosAtualizados', () => {
        atualizarBotoesFavoritos();
    });
});
