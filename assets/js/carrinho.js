// Pega os itens do carrinho salvos ou inicia vazio
var carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

// Atualiza a tela quando a página carrega
window.onload = function() {
    renderizarCarrinho();
};

// Mostra os produtos na tabela e calcula o total
function renderizarCarrinho() {
    var tabela = document.getElementById('itens-carrinho');
    var totalSpan = document.getElementById('valor-total');
    var carrinhoVazio = document.getElementById('carrinho-vazio');
    var carrinhoConteudo = document.getElementById('carrinho-conteudo');
    var total = 0;

    if (carrinho.length === 0) {
        carrinhoVazio.style.display = 'block';
        carrinhoConteudo.style.display = 'none';
        return;
    }

    carrinhoVazio.style.display = 'none';
    carrinhoConteudo.style.display = 'block';
    tabela.innerHTML = '';

    for (var i = 0; i < carrinho.length; i++) {
        var item = carrinho[i];
        var subtotal = item.preco * item.quantidade;
        total += subtotal;

        tabela.innerHTML += `
            <tr>
                <td>${item.nome}</td>
                <td>R$ ${item.preco.toFixed(2)}</td>
                <td>
                    <button onclick="mudarQtd(${i}, -1)">-</button>
                    <span>${item.quantidade}</span>
                    <button onclick="mudarQtd(${i}, 1)">+</button>
                </td>
                <td>R$ ${subtotal.toFixed(2)}</td>
                <td>
                    <button class="btn-remover" onclick="removerItem(${i})">X</button>
                </td>
            </tr>
        `;
    }

    totalSpan.textContent = 'R$ ' + total.toFixed(2);
}

// Aumenta ou diminui a quantidade
function mudarQtd(index, delta) {
    carrinho[index].quantidade += delta;
    if (carrinho[index].quantidade <= 0) {
        carrinho.splice(index, 1);
    }
    salvarCarrinho();
    renderizarCarrinho();
}

// Remove um produto
function removerItem(index) {
    carrinho.splice(index, 1);
    salvarCarrinho();
    renderizarCarrinho();
}

// Salva no navegador
function salvarCarrinho() {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

// Botão de finalizar compra
function finalizarCompra() {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }
    alert("Compra finalizada com sucesso!");
    carrinho = [];
    salvarCarrinho();
    renderizarCarrinho();
}
