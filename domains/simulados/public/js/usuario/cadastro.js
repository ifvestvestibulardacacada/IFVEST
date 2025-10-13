function checkPasswordStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
}

const senhaInput = document.getElementById('senha');
const btnCadastro = document.getElementById('btn-cadastro');
const strengthBar = document.getElementById('password-strength');

senhaInput.addEventListener('input', function () {
    const password = senhaInput.value;
    const strength = checkPasswordStrength(password);
    let width = '0%';
    let color = '#eee';

    if (strength <= 2) {
        width = '20%';
        color = '#ff4444';
        btnCadastro.disabled = true;
    } else if (strength === 3) {
        width = '40%';
        color = '#ffbb33';
        btnCadastro.disabled = true;
    } else if (strength === 4) {
        width = '60%';
        color = '#ffeb3b';
        btnCadastro.disabled = true;
    } else if (strength === 5) {
        width = '100%';
        color = '#00C851';
        btnCadastro.disabled = false;
    }

    strengthBar.style.width = width;
    strengthBar.style.backgroundColor = color;
});