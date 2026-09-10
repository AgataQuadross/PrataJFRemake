// Funcionalidades da Página de Minha Conta (Prata JF)
// Todas as funções e variáveis em Português (Brasil)

// Histórico de Compras Padrão inicial
const comprasIniciaisPadrao = [
    {
        numero: '#PJF-1089',
        data: '04/09/2026',
        status: 'Entregue',
        tipoStatus: 'entregue',
        total: 209.80,
        itens: [
            { nome: 'Anel Solitário Zircônia Prata 925', qtd: 1, preco: 119.90, img: 'assets/img/aneis/anel_1.webp' },
            { nome: 'Anel Falange Corações Prata 925', qtd: 1, preco: 89.90, img: 'assets/img/aneis/anel_2.webp' }
        ]
    },
    {
        numero: '#PJF-1042',
        data: '28/08/2026',
        status: 'A caminho',
        tipoStatus: 'caminho',
        total: 189.90,
        itens: [
            { nome: 'Pulseira Grumet Prata 925', qtd: 1, preco: 189.90, img: 'assets/img/pulseiras/pulseira_1.jpg' }
        ]
    },
    {
        numero: '#PJF-0995',
        data: '15/08/2026',
        status: 'Entregue',
        tipoStatus: 'entregue',
        total: 129.90,
        itens: [
            { nome: 'Colar Ponto de Luz Prata 925', qtd: 1, preco: 129.90, img: 'assets/img/colares/colar_1.webp' }
        ]
    }
];

// Obtém o histórico de compras do armazenamento local
function obterHistoricoCompras() {
    try {
        const historico = localStorage.getItem('historicoCompras');
        if (historico) {
            return JSON.parse(historico);
        }
        localStorage.setItem('historicoCompras', JSON.stringify(comprasIniciaisPadrao));
        return comprasIniciaisPadrao;
    } catch (erro) {
        console.error('Erro ao ler histórico de compras:', erro);
        return comprasIniciaisPadrao;
    }
}

// Renderiza o histórico de compras no card
function renderizarHistoricoCompras() {
    const listaComprasEl = document.getElementById('lista-historico-compras');
    if (!listaComprasEl) return;

    const compras = obterHistoricoCompras();

    if (compras.length === 0) {
        listaComprasEl.innerHTML = `
            <div class="historico-vazio">
                <i class="fa-solid fa-box-open"></i>
                <p>Nenhuma compra encontrada no histórico.</p>
            </div>
        `;
        return;
    }

    listaComprasEl.innerHTML = '';

    compras.forEach(compra => {
        const itemCompraEl = document.createElement('div');
        itemCompraEl.className = 'item-historico-compra';

        const totalFormatado = compra.total.toFixed(2).replace('.', ',');

        let itensHtml = '';
        compra.itens.forEach(item => {
            itensHtml += `
                <div class="linha-item-pedido">
                    <img src="${item.img || 'assets/img/PRATA_JF_LOGO_100px.png'}" alt="${item.nome}" class="mini-foto-produto">
                    <div class="info-item-pedido">
                        <span class="nome-item-pedido">${item.nome}</span>
                        <span class="detalhes-item-pedido">${item.qtd}x R$ ${item.preco.toFixed(2).replace('.', ',')}</span>
                    </div>
                </div>
            `;
        });

        itemCompraEl.innerHTML = `
            <div class="cabecalho-item-compra">
                <div class="identificacao-pedido">
                    <strong>${compra.numero}</strong>
                    <small class="data-pedido">${compra.data}</small>
                </div>
                <span class="emblema-status-compra status-${compra.tipoStatus || 'entregue'}">${compra.status}</span>
            </div>
            <div class="lista-itens-pedido">
                ${itensHtml}
            </div>
            <div class="rodape-item-compra">
                <span>Total:</span>
                <strong>R$ ${totalFormatado}</strong>
            </div>
        `;

        listaComprasEl.appendChild(itemCompraEl);
    });
}

// Alterna a exibição do card de histórico de compras abaixo do aside
function alternarHistoricoCompras() {
    const cardHistorico = document.getElementById('card-historico-compras');
    const botaoMinhasCompras = document.getElementById('botao-minhas-compras');
    if (!cardHistorico) return;

    const estaAberto = cardHistorico.classList.contains('ativo');

    if (estaAberto) {
        cardHistorico.classList.remove('ativo');
        if (botaoMinhasCompras) botaoMinhasCompras.classList.remove('ativo');
    } else {
        renderizarHistoricoCompras();
        cardHistorico.classList.add('ativo');
        if (botaoMinhasCompras) botaoMinhasCompras.classList.add('ativo');
        // Rola suavemente até o card se necessário
        cardHistorico.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// Cupons Padrão iniciais da loja
const cuponsIniciaisPadrao = [
    { codigo: 'PRATA10', descricao: '10% de desconto em qualquer joia', desconto: '10% OFF', ativo: true },
    { codigo: 'BEMVINDO', descricao: '15% de desconto na primeira compra', desconto: '15% OFF', ativo: true }
];

// Obtém cupons salvos pelo usuário
function obterCuponsUsuario() {
    try {
        const cupons = localStorage.getItem('cuponsUsuario');
        if (cupons) {
            return JSON.parse(cupons);
        }
        localStorage.setItem('cuponsUsuario', JSON.stringify(cuponsIniciaisPadrao));
        return cuponsIniciaisPadrao;
    } catch (erro) {
        console.error('Erro ao ler cupons:', erro);
        return cuponsIniciaisPadrao;
    }
}

// Salva a lista de cupons
function salvarCuponsUsuario(cupons) {
    try {
        localStorage.setItem('cuponsUsuario', JSON.stringify(cupons));
    } catch (erro) {
        console.error('Erro ao salvar cupons:', erro);
    }
}

// Renderiza a lista de cupons salvos no pop-up
function renderizarCuponsSalvos() {
    const listaCuponsEl = document.getElementById('lista-cupons-salvos');
    if (!listaCuponsEl) return;

    const cupons = obterCuponsUsuario();

    if (cupons.length === 0) {
        listaCuponsEl.innerHTML = '<p class="texto-sem-cupons">Nenhum cupom ativo no momento.</p>';
        return;
    }

    listaCuponsEl.innerHTML = '';
    cupons.forEach(cupom => {
        const cupomEl = document.createElement('div');
        cupomEl.className = 'item-cupom-salvo';
        cupomEl.innerHTML = `
            <div class="cupom-info">
                <span class="codigo-cupom-tag"><i class="fa-solid fa-ticket"></i> ${cupom.codigo}</span>
                <span class="descricao-cupom-texto">${cupom.descricao}</span>
            </div>
            <span class="desconto-cupom-badge">${cupom.desconto}</span>
        `;
        listaCuponsEl.appendChild(cupomEl);
    });
}

// Abre o pop-up modal de cupons
function abrirModalCupom() {
    const modalCupom = document.getElementById('modal-cupom');
    const inputCodigo = document.getElementById('campo-codigo-cupom');
    const mensagemEl = document.getElementById('mensagem-cupom');

    if (!modalCupom) return;

    if (mensagemEl) {
        mensagemEl.style.display = 'none';
        mensagemEl.textContent = '';
        mensagemEl.className = 'mensagem-cupom';
    }

    if (inputCodigo) {
        inputCodigo.value = '';
    }

    renderizarCuponsSalvos();
    modalCupom.classList.add('ativo');
    document.body.classList.add('modal-aberto');

    if (inputCodigo) {
        setTimeout(() => inputCodigo.focus(), 100);
    }
}

// Fecha o pop-up modal de cupons
function fecharModalCupom() {
    const modalCupom = document.getElementById('modal-cupom');
    if (!modalCupom) return;

    modalCupom.classList.remove('ativo');
    document.body.classList.remove('modal-aberto');
}

// Aplica e valida um cupom digitado pelo usuário
function aplicarCupom(evento) {
    if (evento) evento.preventDefault();

    const inputCodigo = document.getElementById('campo-codigo-cupom');
    const mensagemEl = document.getElementById('mensagem-cupom');
    if (!inputCodigo || !mensagemEl) return;

    const codigoDigitado = inputCodigo.value.trim().toUpperCase();

    if (!codigoDigitado) {
        mensagemEl.textContent = 'Por favor, digite um código de cupom.';
        mensagemEl.className = 'mensagem-cupom mensagem-erro';
        mensagemEl.style.display = 'block';
        return;
    }

    let cupons = obterCuponsUsuario();
    const cupomExistente = cupons.find(c => c.codigo.toUpperCase() === codigoDigitado);

    if (cupomExistente) {
        mensagemEl.textContent = `O cupom ${codigoDigitado} já está adicionado à sua conta!`;
        mensagemEl.className = 'mensagem-cupom mensagem-aviso';
        mensagemEl.style.display = 'block';
        return;
    }

    // Regras de validação para cupons físicos
    let descontoTexto = '10% OFF';
    let descricaoTexto = 'Cupom de desconto físico ativado';

    if (codigoDigitado.includes('20') || codigoDigitado.includes('OURO')) {
        descontoTexto = '20% OFF';
        descricaoTexto = '20% de desconto especial em compras';
    } else if (codigoDigitado.includes('15') || codigoDigitado.includes('PRATA')) {
        descontoTexto = '15% OFF';
        descricaoTexto = '15% de desconto exclusivo em Prata 925';
    } else if (codigoDigitado.includes('FRETE')) {
        descontoTexto = 'Frete Grátis';
        descricaoTexto = 'Frete grátis para todo o Brasil';
    } else if (codigoDigitado.includes('50')) {
        descontoTexto = 'R$ 50 OFF';
        descricaoTexto = 'R$ 50 de desconto em compras acima de R$ 200';
    }

    const novoCupom = {
        codigo: codigoDigitado,
        descricao: descricaoTexto,
        desconto: descontoTexto,
        ativo: true
    };

    cupons.unshift(novoCupom);
    salvarCuponsUsuario(cupons);
    renderizarCuponsSalvos();

    inputCodigo.value = '';
    mensagemEl.textContent = `Sucesso! Cupom "${codigoDigitado}" resgatado com ${descontoTexto}!`;
    mensagemEl.className = 'mensagem-cupom mensagem-sucesso';
    mensagemEl.style.display = 'block';
}

// Inicializa a página de conta ao carregar
document.addEventListener('DOMContentLoaded', () => {
    // Inicializa os dados
    obterHistoricoCompras();
    obterCuponsUsuario();

    // Fecha o modal ao clicar fora dele
    const modalCupom = document.getElementById('modal-cupom');
    if (modalCupom) {
        modalCupom.addEventListener('click', (e) => {
            if (e.target === modalCupom) {
                fecharModalCupom();
            }
        });
    }

    // Fecha o modal ao pressionar ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            fecharModalCupom();
        }
    });
});
