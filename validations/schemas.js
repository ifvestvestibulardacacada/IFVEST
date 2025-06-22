const { z } = require('zod');


const patterns = {

  sqlPattern: /\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|TRUNCATE|EXEC|UNION|--|;)\b/i,

  usernamePattern: /^[a-zA-Z0-9_.-]{3,30}$/,

  passwordPattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,

  textPattern: /^[\wÀ-ÿ0-9\s.,;:!?'"()\-]+$/i
};




const authSchemas = {
  login: z.object({
    usuario: z.string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be at most 30 characters")
      .regex(patterns.usernamePattern, "Username must contain only letters, numbers, _, . or -")
      .refine(val => !patterns.sqlPattern.test(val), { message: "Invalid username format" }),

    senha: z.string()
      .refine(val => !patterns.sqlPattern.test(val), { message: "Invalid username format" }),

  }),

  cadastro: z.object({
    nome: z.string()
      .min(3, "Name must be at least 3 characters")
      .max(100, "Name must be at most 100 characters")
      .regex(patterns.textPattern, "Invalid name format")
      .refine(val => !patterns.sqlPattern.test(val), { message: "Invalid name format" }),

    usuario: z.string()
      .min(3)
      .max(30)
      .regex(patterns.usernamePattern, "Username must contain only letters, numbers, _, . or -")
      .refine(val => !patterns.sqlPattern.test(val), { message: "Invalid username format" }),

    senha: z.string()
      .regex(patterns.passwordPattern, "Password must be at least 8 characters with one number and one letter"),

    email: z.string()
      .email("Invalid email format")
      .refine(val => !patterns.sqlPattern.test(val), { message: "Invalid email format" }),

    perfil: z.enum(['ALUNO', 'PROFESSOR'])
  })
};


const questionSchemas = {
  register: z.object({
    id: z.string()
      .refine(val => !patterns.sqlPattern.test(val), { message: "Invalid title format" }),
    titulo: z.string()
      .min(3)
      .max(200)
      .refine(val => !patterns.sqlPattern.test(val), { message: "Invalid title format" }),
    pergunta: z.string(),

    areaId: z.string()
      .refine(val => !patterns.sqlPattern.test(val), { message: "Invalid title format" }),
    correta: z.string()
      .length(1)
      .regex(/^[A-E]$/, "Correct answer must be a letter from A to E"),
    topicosSelecionados: z.array(z.string()),
    respostasSelecionadas: z.string().min(1),
  }),
  edit: z.object({
    id: z.string()
      .refine(val => !patterns.sqlPattern.test(val), { message: "Invalid title format" }),
    titulo: z.string()
      .min(3)
      .max(200)
      .refine(val => !patterns.sqlPattern.test(val), { message: "Invalid title format" }),
    pergunta: z.string(),

    areaId: z.string()
      .refine(val => !patterns.sqlPattern.test(val), { message: "Invalid title format" }),
    correta: z.string()
      .length(1)
      .regex(/^[A-E]$/, "Correct answer must be a letter from A to E").optional(),
    topicosSelecionados: z.array(z.string()),
    respostasSelecionadas: z.string().min(1)
  })
};


const simuladoSchemas = {
  register: z.object({
    titulo: z.string()
      .min(3)
      .max(200)
      .regex(patterns.textPattern, "Invalid title format")
      .refine(val => !patterns.sqlPattern.test(val), { message: "Invalid title format" }),

    descricao: z.string()
      .min(10)
      .max(1000)
      .regex(patterns.textPattern, "Invalid description format")
      .refine(val => !patterns.sqlPattern.test(val), { message: "Invalid description format" }),

    tipo: z.enum(['Objetivo', 'Dissertativo', 'Aleatorio']), 


    selectedQuestionIds: z
      .array(z.string().regex(/^\d+$/, { message: 'ID de questão deve ser um número válido.' }))
      .min(1, { message: 'Pelo menos uma questão deve ser selecionada.' }),
  }),


  edit: z.object({
    titulo: z.string()
      .min(3)
      .max(200)
      .regex(patterns.textPattern, "Invalid title format")
      .refine(val => !patterns.sqlPattern.test(val), { message: "Invalid title format" }),

    descricao: z.string()
      .min(10)
      .max(1000)
      .regex(patterns.textPattern, "Invalid description format")
      .refine(val => !patterns.sqlPattern.test(val), { message: "Invalid description format" }),

   tipo: z.enum(['OBJETIVO', 'DISSERTATIVO', 'ALEATORIO'])
  }),

  submit: z.object({
    questoes: z.array(z.string()),
    respostas: z.array(
      z.string().refine(val => !patterns.sqlPattern.test(val), { message: "Invalid answer format" })
    )
  })
};


const topicoSchemas = {
  register: z.object({
    topico: z.string()
      .min(3)
      .max(100)
      .regex(patterns.textPattern, "Invalid topic format")
      .refine(val => !patterns.sqlPattern.test(val), { message: "Invalid topic format" }),

    areaIdTopico: z.string()
  }),

  edit: z.object({
    id: z.string(),

    nome: z.string()
      .min(3)
      .max(100)
      .regex(patterns.textPattern, "Invalid topic format")
      .refine(val => !patterns.sqlPattern.test(val), { message: "Invalid topic format" })
  })
};


const userSchemas = {
  edit: z.object({
    nome: z.string()
      .min(3)
      .max(100)
      .regex(patterns.textPattern, "Invalid name format")
      .refine(val => !patterns.sqlPattern.test(val), { message: "Invalid name format" })
      .optional(),

    usuario: z.string()
      .min(3)
      .max(30)
      .regex(patterns.usernamePattern, "Invalid username format")
      .refine(val => !patterns.sqlPattern.test(val), { message: "Invalid username format" })
      .optional(),

    email: z.string()
      .email("Invalid email format")
      .refine(val => !patterns.sqlPattern.test(val), { message: "Invalid email format" })
      .optional(),

    senha: z.string()
      .optional(),

    novasenha: z.string()
      .regex(patterns.passwordPattern, "Password must be at least 8 characters with one number and one letter")
      .optional()
  }).refine(data => {

    return Object.keys(data).some(key => data[key] !== undefined);
  }, { message: "At least one field must be provided" }),


};

module.exports = {
  patterns,
  authSchemas,
  questionSchemas,
  simuladoSchemas,
  topicoSchemas,
  userSchemas
};
