const { ZodError } = require('zod');

const validateRequest = (schema) => {
  return async (req, res, next) => {
    try {
      const validatedData = await schema.parseAsync(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message
        }));
        const allMessages = formattedErrors.map(e => e.message).join('\n');
        console.log('Erros do Zod:', allMessages);
   

        // Verifica se a requisição é AJAX (cabeçalho 'X-Requested-With' ou Accept)
        const isAjax = req.headers['x-requested-with'] === 'XMLHttpRequest' ||
          req.headers.accept?.includes('application/json');

        if (isAjax) {
          // Retorna JSON com os erros do Zod para requisições AJAX
          return res.status(400).json({
            error: 'Dados inválidos na requisição',
            details: formattedErrors
          });
        } else {
          req.session.errorMessage = allMessages
          await new Promise((resolve, reject) => {
            req.session.save(err => {
              if (err) reject(err);
              else resolve();
            });
          });
          return res.redirect(req.get('Referrer') || '/');
        }
      } else {
        console.error('Erro de validação:', error);
        // Retorna erro genérico para outros tipos de erros
        return res.redirect(req.get('Referrer') || '/');
      }
    }
  };
};


module.exports = validateRequest; 
