const { ZodError } = require('zod');


 const validateRequest = (schema) => {
  return async (req, res, next) => {
    const referer = req.headers.referer || '';
    try {
      
      const validatedData = await schema.parseAsync(req.body);
      req.body = validatedData;
      next();
    } catch (error) {      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message
        }));
        const allMessages = formattedErrors.map(e => e.message).join('\n');
        console.log('Erros do Zod:', allMessages);

        return referer.includes('/simulados/criar-simulado')
        ? res.status(400).json({ error: allMessages })
        : res.redirect('back');
      } else {
        console.error('Erro de validação:', error);
        return res.status(400).json({ error: 'Dados inválidos na requisição' });
      }
    }
  };
};
module.exports = validateRequest; 
