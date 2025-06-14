const { z } = require('zod');

// Common patterns
const patterns = {
  // Alphanumeric with spaces, dots and basic punctuation
  sqlPattern: /\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|TRUNCATE|EXEC|UNION|--|;)\b/i
 
};

// Auth schemas
const authSchemas = {
  login: z.object({
    usuario: z.string().regex(patterns.sqlPattern, "Invalid username format"),
    senha: z.string().regex(patterns.sqlPattern, "Password must be at least 8 characters with one number and one letter")
  }),

  cadastro: z.object({
    nome: z.string().regex(patterns.sqlPattern, "Invalid name format").min(3).max(100),
    usuario: z.string().regex(patterns.sqlPattern, "Invalid username format"),
    senha: z.string().regex(patterns.sqlPattern, "Password must be at least 8 characters with one number and one letter"),
    email: z.string().email().regex(patterns.sqlPattern, "Invalid email format"),
    perfil: z.enum(['ALUNO', 'PROFESSOR'])
  })
};

// Question schemas
const questionSchemas = {
  register: z.object({
    titulo: z.string().regex(patterns.sqlPattern, "Invalid title format").min(3).max(200),
    pergunta: z.string().regex(patterns.sqlPattern, "Invalid question format").min(10),
    areaId: z.number().int().positive(),
    correta: z.string().length(1).regex(/^[A-E]$/),
    topicosSelecionados: z.array(z.number().int().positive()),
    respostasSelecionadas: z.string().min(1) // JSON string that will be parsed
  }),

  edit: z.object({
    id: z.number().int().positive(),
    titulo: z.string().regex(patterns.sqlPattern, "Invalid title format").min(3).max(200),
    pergunta: z.string().regex(patterns.questionText, "Invalid question format").min(10),
    areaId: z.number().int().positive(),
    correta: z.string().length(1).regex(/^[A-E]$/),
    topicosSelecionados: z.array(z.number().int().positive()),
    respostasSelecionadas: z.string().min(1) // JSON string that will be parsed
  })
};

// Simulado schemas
const simuladoSchemas = {
  register: z.object({
    titulo: z.string().regex(patterns.sqlPattern, "Invalid title format").min(3).max(200),
    descricao: z.string().regex(patterns.sqlPattern, "Invalid description format").min(10).max(1000),
    tipo: z.enum(['OBJETIVO', 'DISSERTATIVO', 'ALEATORIO'])
  }),

  edit: z.object({
    simuladoId: z.number().int().positive(),
    titulo: z.string().regex(patterns.sqlPattern, "Invalid title format").min(3).max(200),
    descricao: z.string().regex(patterns.sqlPattern, "Invalid description format").min(10).max(1000),
    tipo: z.enum(['OBJETIVO', 'DISSERTATIVO', 'ALEATORIO'])
  }),

  submit: z.object({
    simuladoId: z.number().int().positive(),
    questoes: z.array(z.string().regex(/^\d+-\d+$/)), // Format: "questionId-optionId"
    respostas: z.record(z.string().regex(patterns.sqlPattern)) // For dissertative answers
  })
};

// Topico schemas
const topicoSchemas = {
  register: z.object({
    topico: z.string().regex(patterns.sqlPattern, "Invalid topic format").min(3).max(100),
    areaIdTopico: z.number().int().positive()
  }),

  edit: z.object({
    id: z.number().int().positive(),
    nome: z.string().regex(patterns.sqlPattern, "Invalid topic format").min(3).max(100)
  })
};

// User schemas
const userSchemas = {
  edit: z.object({
    nome: z.string().regex(patterns.sqlPattern, "Invalid name format").min(3).max(100).optional(),
    usuario: z.string().regex(patterns.sqlPattern, "Invalid username format").optional(),
    email: z.string().email().regex(patterns.sqlPattern, "Invalid email format").optional(),
    senha: z.string().regex(patterns.sqlPattern, "Password must be at least 8 characters with one number and one letter").optional(),
    novasenha: z.string().regex(patterns.sqlPattern, "Password must be at least 8 characters with one number and one letter").optional()
  }).refine(data => {
    // At least one field must be provided
    return Object.keys(data).some(key => data[key] !== undefined);
  }, "At least one field must be provided"),
  register: z.object({
    nome: z.string().regex(patterns.sqlPattern, "Invalid name format").min(3).max(100).optional(),
    usuario: z.string().regex(patterns.sqlPattern, "Invalid username format").optional(),
    email: z.string().email().regex(patterns.sqlPattern, "Invalid email format").optional(),
    senha: z.string().regex(patterns.password, "Password must be at least 8 characters with one number and one letter").optional(),
  })
};

module.exports = {
  patterns,
  authSchemas,
  questionSchemas,
  simuladoSchemas,
  topicoSchemas,
  userSchemas
}; 