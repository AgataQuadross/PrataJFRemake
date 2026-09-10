// Gerenciamento do Modal de Produto e Integração com o Carrinho

document.addEventListener('DOMContentLoaded', () => {
    // Elementos do Modal
    const modal = document.getElementById('modal-produto');
    if (!modal) return;

    const modalImg = document.getElementById('modal-img');
    const modalCategoria = document.getElementById('modal-categoria');
    const modalTitulo = document.getElementById('modal-titulo');
    const modalPreco = document.getElementById('modal-preco');
    const modalParcela = document.getElementById('modal-parcela');
    const modalDescricao = document.getElementById('modal-descricao');
    const inputQtd = document.getElementById('modal-qtd');
    const btnMenos = document.getElementById('btn-modal-menos');
    const btnMais = document.getElementById('btn-modal-mais');
    const btnAddCarrinho = document.getElementById('btn-modal-add-carrinho');
    const btnModalFavoritar = document.getElementById('btn-modal-favoritar');
    const btnContinuar = document.getElementById('btn-modal-continuar');
    const btnFechar = document.getElementById('btn-modal-fechar');
    const toast = document.getElementById('modal-toast');
    const cartCountEl = document.getElementById('cart-count');

    // Produto ativo no modal
    let produtoAtivo = null;

    // Atualiza o contador de itens no ícone do carrinho
    function atualizarContadorCarrinho() {
        if (!cartCountEl) return;
        const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        const totalItens = carrinho.reduce((acc, item) => acc + (item.quantidade || 0), 0);
        
        if (totalItens > 0) {
            cartCountEl.textContent = totalItens;
            cartCountEl.style.display = 'inline-flex';
        } else {
            cartCountEl.style.display = 'none';
        }
    }

    atualizarContadorCarrinho();

    // Abrir modal com as informações do produto
    function abrirModal(card) {
        const imgEl = card.querySelector('img');
        const imagem = card.dataset.imagem || (imgEl ? imgEl.getAttribute('src') : '');
        const nome = card.dataset.nome || (imgEl ? imgEl.alt : 'Joia em Prata 925');
        const preco = parseFloat(card.dataset.preco) || 99.90;
        const categoria = card.dataset.categoria || 'Prata 925';
        const descricao = card.dataset.descricao || 'Peça confeccionada em Prata 925 legítima, acabamento premium e certificado de garantia vitalícia da prata.';

        produtoAtivo = { nome, preco, imagem };

        // Preenche as informações no modal
        modalImg.src = imagem;
        modalImg.alt = nome;
        modalCategoria.textContent = categoria;
        modalTitulo.textContent = nome;
        modalPreco.textContent = `R$ ${preco.toFixed(2).replace('.', ',')}`;

        // Cálculo de parcelamento em 3x sem juros
        const valorParcela = (preco / 3).toFixed(2).replace('.', ',');
        modalParcela.textContent = `ou até 3x de R$ ${valorParcela} sem juros`;

        modalDescricao.textContent = descricao;
        inputQtd.value = 1;

        // Atualiza o estado do botão de favorito no modal
        if (btnModalFavoritar && typeof produtoEstaFavoritado === 'function') {
            btnModalFavoritar.setAttribute('data-nome-produto', nome);
            if (produtoEstaFavoritado(nome)) {
                btnModalFavoritar.classList.add('ativo');
                btnModalFavoritar.innerHTML = '<i class="fa-solid fa-heart"></i> Favoritado';
            } else {
                btnModalFavoritar.classList.remove('ativo');
                btnModalFavoritar.innerHTML = '<i class="fa-regular fa-heart"></i> Favoritar';
            }
        }

        // Esconde toast caso estivesse aberto
        if (toast) toast.classList.remove('visivel');

        // Mostra o modal
        modal.classList.add('ativo');
        document.body.classList.add('modal-aberto');
    }

    // Fechar modal
    function fecharModal() {
        modal.classList.remove('ativo');
        document.body.classList.remove('modal-aberto');
        if (toast) toast.classList.remove('visivel');
        produtoAtivo = null;
    }

    // Vincular clique aos cards de produto do grid
    const produtos = document.querySelectorAll('.grade-produtos .visualizar-produto');
    produtos.forEach((prod) => {
        prod.addEventListener('click', (e) => {
            e.preventDefault();
            abrirModal(prod);
        });
    });

    // Controles de quantidade
    if (btnMenos) {
        btnMenos.addEventListener('click', () => {
            let qtd = parseInt(inputQtd.value, 10) || 1;
            if (qtd > 1) {
                inputQtd.value = qtd - 1;
            }
        });
    }

    if (btnMais) {
        btnMais.addEventListener('click', () => {
            let qtd = parseInt(inputQtd.value, 10) || 1;
            if (qtd < 99) {
                inputQtd.value = qtd + 1;
            }
        });
    }

    // Adicionar produto ao carrinho
    function adicionarAoCarrinho() {
        if (!produtoAtivo) return;

        const quantidade = parseInt(inputQtd.value, 10) || 1;
        let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

        // Verifica se o item já existe no carrinho
        const indexExistente = carrinho.findIndex(item => item.nome === produtoAtivo.nome);

        if (indexExistente !== -1) {
            carrinho[indexExistente].quantidade += quantidade;
        } else {
            carrinho.push({
                nome: produtoAtivo.nome,
                preco: produtoAtivo.preco,
                quantidade: quantidade
            });
        }

        // Salva no localStorage (compatível com carrinho.js)
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        atualizarContadorCarrinho();

        // Feedback visual (Toast dentro do modal com opções)
        if (toast) {
            toast.classList.add('visivel');
        } else {
            alert(`"${produtoAtivo.nome}" foi adicionado ao seu carrinho!`);
        }
    }

    if (btnAddCarrinho) {
        btnAddCarrinho.addEventListener('click', adicionarAoCarrinho);
    }

    if (btnModalFavoritar) {
        btnModalFavoritar.addEventListener('click', () => {
            if (!produtoAtivo || typeof alternarFavorito !== 'function') return;
            alternarFavorito(null, btnModalFavoritar, {
                nome: produtoAtivo.nome,
                preco: produtoAtivo.preco,
                imagem: produtoAtivo.imagem,
                categoria: modalCategoria ? modalCategoria.textContent : 'Prata 925',
                descricao: modalDescricao ? modalDescricao.textContent : ''
            });
            if (typeof produtoEstaFavoritado === 'function') {
                if (produtoEstaFavoritado(produtoAtivo.nome)) {
                    btnModalFavoritar.classList.add('ativo');
                    btnModalFavoritar.innerHTML = '<i class="fa-solid fa-heart"></i> Favoritado';
                } else {
                    btnModalFavoritar.classList.remove('ativo');
                    btnModalFavoritar.innerHTML = '<i class="fa-regular fa-heart"></i> Favoritar';
                }
            }
        });
    }

    // Botão Continuar Comprando (fecha o modal)
    if (btnContinuar) {
        btnContinuar.addEventListener('click', fecharModal);
    }

    // Botão fechar (X)
    if (btnFechar) {
        btnFechar.addEventListener('click', fecharModal);
    }

    // Fechar ao clicar no backdrop (fora do container)
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            fecharModal();
        }
    });

    // Fechar com tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('ativo')) {
            fecharModal();
        }
    });
});
