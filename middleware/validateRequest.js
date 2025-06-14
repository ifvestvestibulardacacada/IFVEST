const { ZodError } = require('zod');

const validateRequest = (schema) => {
  return async (req, res, next) => {
    try {
      // Validate request body against schema
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
        
        req.session.errorMessage = formattedErrors[0].message;
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