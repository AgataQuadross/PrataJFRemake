const formularioCadastro = document.querySelector('form[action="principal.html"]');

if (formularioCadastro && document.getElementById('confirma_senha')) {
    const nome = document.getElementById('nome');
    const email = document.getElementById('email');
    const senha = document.getElementById('senha');
    const confirmaSenha = document.getElementById('confirma_senha');

    function mostrarErro(campo, mensagem, idErro) {
        document.getElementById(idErro).textContent = mensagem;
        campo.setCustomValidity(mensagem);
    }

    function limparErro(campo, idErro) {
        document.getElementById(idErro).textContent = '';
        campo.setCustomValidity('');
    }

    nome.addEventListener('input', function() {
        if (nome.value.trim().length < 3) {
            mostrarErro(nome, 'Digite seu nome completo.', 'erro-nome');
        } else {
            limparErro(nome, 'erro-nome');
        }
    });

    email.addEventListener('input', function() {
        if (!email.validity.valid) {
            mostrarErro(email, 'Digite um e-mail válido.', 'erro-email');
        } else {
            limparErro(email, 'erro-email');
        }
    });

    senha.addEventListener('input', function() {
        if (senha.value.length < 6) {
            mostrarErro(senha, 'A senha deve ter pelo menos 6 caracteres.', 'erro-senha');
        } else {
            limparErro(senha, 'erro-senha');
        }
        confirmarSenha();
    });

    confirmaSenha.addEventListener('input', confirmarSenha);

    function confirmarSenha() {
        if (confirmaSenha.value !== senha.value) {
            mostrarErro(confirmaSenha, 'As senhas precisam ser iguais.', 'erro-confirma-senha');
        } else {
            limparErro(confirmaSenha, 'erro-confirma-senha');
        }
    }

    formularioCadastro.addEventListener('submit', function(evento) {
        nome.dispatchEvent(new Event('input'));
        email.dispatchEvent(new Event('input'));
        senha.dispatchEvent(new Event('input'));
        confirmaSenha.dispatchEvent(new Event('input'));

        if (!formularioCadastro.checkValidity()) {
            evento.preventDefault();
        }
    });
}