const { ZodError } = require('zod');

const validateRequest = (schema) => {
  return async (req, res, next) => {
    try {
      // Validate request body against schema

      console.log(typeof req.body.questoes)
      console.log(typeof req.body.respostas)
      const validatedData = await schema.parseAsync(req.body);

      // Replace req.body with validated data
      req.body = validatedData;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Format Zod errors into a more user-friendly format
        const formattedErrors = error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message
        }));

        console.log("error", formattedErrors)
        console.error("error", formattedErrors[0].message)

        req.session.errorMessage = formattedErrors[0].message;

        await new Promise((resolve, reject) => {
          req.session.save(err => {
            if (err) reject(err);
            else resolve();
          });
        });

        return res.redirect(req.get('referer') || req.originalUrl);
      }

      // Handle other types of errors
      console.error('Validation error:', error);
      req.session.errorMessage = 'Invalid request data';
      return res.redirect(req.get('referer') || req.originalUrl);
    }
  };
};

module.exports = validateRequest; 