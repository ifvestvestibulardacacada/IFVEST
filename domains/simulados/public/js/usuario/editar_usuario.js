document.getElementById('deleteAccountForm').addEventListener('submit', function (e) {
    let confirmDelete = document.getElementById('confirmDelete').value;
    if (confirmDelete !== 'DELETAR') {
        alert('Por favor, digite "DELETAR" no campo para confirmar a exclusão.');
        e.preventDefault();
    } else if (!confirm('Tem certeza de que deseja deletar sua conta? Esta ação não pode ser desfeita.')) {
        e.preventDefault();
    }
});


document.querySelector('#account-change-password form').addEventListener('submit', function(e) {
    const senhaAtual = document.getElementById('senhaAtual').value;
    const novaSenha = document.getElementById('novaSenha').value;
    const confirmacaoSenha = document.getElementById('confirmacaoSenha').value;

    if (novaSenha !== confirmacaoSenha) {
        alert('A nova senha e a confirmação da senha não coincidem!');
        e.preventDefault();
        return;
    }

    if (novaSenha === senhaAtual) {
        alert('A nova senha deve ser diferente da senha atual!');
        e.preventDefault();
        return;
    }

    if (!senhaAtual || !novaSenha || !confirmacaoSenha) {
        alert('Por favor, preencha todos os campos!');
        e.preventDefault();
        return;
    }
});