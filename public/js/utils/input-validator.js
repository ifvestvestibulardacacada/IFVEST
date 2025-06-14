/**
 * Utility class for input validation and sanitization
 */
class InputValidator {
    constructor() {
        // Caracteres comumente usados em ataques SQL injection
        this.sqlInjectionPatterns = [
            /(\s*([\0\b\'\"\n\r\t\%\_\\]*\s*(((select\s*.+\s*from)|(insert\s*.+\s*into)|(update\s*.+\s*set)|(delete\s*.+\s*from)|(drop\s*.+)|(truncate\s*.+)|(alter\s*.+)|(exec\s*.+)|(\s*(all|any|not|and|between|in|like|or|some|contains|containsall|containskey)\s*.+))\s*)))|\-\-|;/gi,
            /\b(ALTER|CREATE|DELETE|DROP|EXEC(UTE)?|INSERT( +INTO)?|MERGE|SELECT|UPDATE|UNION( +ALL)?)\b/gi
        ];

        // Padrões para detectar possíveis ataques XSS
        this.xssPatterns = [
            /<script\b[^>]*>(.*?)<\/script>/gi,
            /javascript:/gi,
            /on\w+\s*=/gi,
            /<iframe\b[^>]*>(.*?)<\/iframe>/gi,
            /<[^>]*\b(?:href|src|action)\s*=\s*['"]?javascript:[^>]*>/gi
        ];
    }

    /**
     * Sanitiza uma string removendo caracteres potencialmente perigosos
     * @param {string} input - O texto a ser sanitizado
     * @returns {string} - O texto sanitizado
     */
    sanitizeInput(input) {
        if (typeof input !== 'string') {
            return input;
        }

        // Remove caracteres especiais e converte HTML entities
        let sanitized = input
            .replace(/[^\w\s@.,!?()-]/gi, '') // Remove caracteres especiais
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .trim();

        return sanitized;
    }

    /**
     * Verifica se uma string contém padrões de SQL injection
     * @param {string} input - O texto a ser verificado
     * @returns {boolean} - True se encontrar padrões suspeitos
     */
    hasSqlInjectionRisk(input) {
        if (typeof input !== 'string') {
            return false;
        }

        return this.sqlInjectionPatterns.some(pattern => pattern.test(input));
    }

    /**
     * Verifica se uma string contém padrões de XSS
     * @param {string} input - O texto a ser verificado
     * @returns {boolean} - True se encontrar padrões suspeitos
     */
    hasXssRisk(input) {
        if (typeof input !== 'string') {
            return false;
        }

        return this.xssPatterns.some(pattern => pattern.test(input));
    }

    /**
     * Valida um input quanto a riscos de segurança
     * @param {string} input - O texto a ser validado
     * @returns {Object} - Objeto com o resultado da validação
     */
    validateInput(input) {
        const result = {
            isValid: true,
            sanitizedValue: '',
            errors: []
        };

        if (typeof input !== 'string') {
            result.isValid = false;
            result.errors.push('Input inválido: deve ser uma string');
            return result;
        }

        // Verifica SQL Injection
        if (this.hasSqlInjectionRisk(input)) {
            result.isValid = false;
            result.errors.push('Input potencialmente perigoso: detectado risco de SQL injection');
        }

        // Verifica XSS
        if (this.hasXssRisk(input)) {
            result.isValid = false;
            result.errors.push('Input potencialmente perigoso: detectado risco de XSS');
        }

        // Sanitiza o input
        result.sanitizedValue = this.sanitizeInput(input);

        return result;
    }
}

// Cria uma instância global do validador
const inputValidator = new InputValidator();

// Função para aplicar validação automática em inputs
function setupInputValidation() {
    document.querySelectorAll('input[type="text"], input[type="password"], textarea').forEach(input => {
        input.addEventListener('input', function(e) {
            const result = inputValidator.validateInput(this.value);
            
            // Remove classes de validação anteriores
            this.classList.remove('is-invalid', 'is-valid');
            
            if (!result.isValid) {
                this.classList.add('is-invalid');
                
                // Cria ou atualiza mensagem de erro
                let errorDiv = this.parentElement.querySelector('.invalid-feedback');
                if (!errorDiv) {
                    errorDiv = document.createElement('div');
                    errorDiv.className = 'invalid-feedback';
                    this.parentElement.appendChild(errorDiv);
                }
                errorDiv.textContent = result.errors.join('. ');
                
                // Atualiza o valor sanitizado
                this.value = result.sanitizedValue;
            } else {
                this.classList.add('is-valid');
            }
        });
    });
}

// Aplica a validação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', setupInputValidation);

// Exporta o validador para uso global
window.inputValidator = inputValidator; 