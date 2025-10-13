const { z } = require('zod');

const patterns = {
  sqlPattern: /\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|TRUNCATE|EXEC|UNION|--|;)\b/i,
  usernamePattern: /^[a-zA-Z0-9_.-]{3,30}$/,
  passwordPattern: /^(?=.*[A-Za-z])(?=.*\d).{8,}$/,
  textPattern: /^[\wÀ-ÿ0-9\s.,;:!?'"()\-]+$/i
};

 const authSchemas = {
  login: z.object({
    usuario: z.string()
       .max(30, "O nome de usuário não pode exceder 30 caracteres")
      .regex(patterns.usernamePattern, "O nome de usuário deve conter apenas letras, números, _, ., ou -")
      .refine(val => !patterns.sqlPattern.test(val), { message: "Formato de nome de usuário inválido" }),
    senha: z.string()
      .refine(val => !patterns.sqlPattern.test(val), { message: "Formato de nome de usuário inválido" }),
  }),
  cadastro: z.object({
    nome: z.string()
      .min(2, "O nome deve ter pelo menos 2 caracteres")
      .max(100, "O nome não pode exceder 100 caracteres")
      .regex(patterns.textPattern, "Formato de nome inválido")
      .refine(val => !patterns.sqlPattern.test(val), { message: "Formato de nome inválido" }),
    usuario: z.string()
      .max(30)
      .regex(patterns.usernamePattern, "O nome de usuário deve conter apenas letras, números, _, ., ou -")
      .refine(val => !patterns.sqlPattern.test(val), { message: "Formato de nome de usuário inválido" }),
    senha: z.string()
      .regex(patterns.passwordPattern, "A senha deve conter pelo menos 8 caracteres com letra maiúscula, minúscula, número e caracteres especiais " )
      .refine(val => !patterns.sqlPattern.test(val), { message: "Formato de senha inválido" }),
    email: z.string()
      .email("Formato de e-mail inválido")
      .refine(val => !patterns.sqlPattern.test(val), { message: "Formato de e-mail inválido" }),
    perfil: z.enum(['USUARIO', 'PROFESSOR'])
  })
};

 const questionSchemas = {
  register: z.object({
    id: z.string()
      .refine(val => !patterns.sqlPattern.test(val), { message: "Formato de título inválido" }),
    titulo: z.string()
      .max(200)
      .refine(val => !patterns.sqlPattern.test(val), { message: "Formato de título inválido" }),
    pergunta: z.string()
      .min(10, "A pergunta não pode ser vazia"),
    areaId: z.string()
      .refine(val => !patterns.sqlPattern.test(val), { message: "Formato de título inválido" }),
    correta: z.string()
      .length(1)
      .regex(/^[A-E]$/, "A resposta correta deve ser uma letra do A ao E"),
    topicosSelecionados: z.array(z.string()),
    respostasSelecionadas: z.string().min(1),
  }),
  edit: z.object({
    id: z.string()
      .refine(val => !patterns.sqlPattern.test(val), { message: "Formato de título inválido" }),
    titulo: z.string()
      .max(200)
      .refine(val => !patterns.sqlPattern.test(val), { message: "Formato de título inválido" }),
    pergunta: z.string(),
    areaId: z.string()
      .refine(val => !patterns.sqlPattern.test(val), { message: "Formato de título inválido" }),
    correta: z.string()
      .length(1)
      .regex(/^[A-E]$/, "A resposta correta deve ser uma letra do A ao E").optional(),
    topicosSelecionados: z.array(z.string()),
    respostasSelecionadas: z.string().min(1)
  })
};

 const simuladoSchemas = {
  register: z.object({
    titulo: z.string()
      .min(1, "O título não pode ser vazio")
      .max(200)
      .regex(patterns.textPattern, "Formato de título inválido")
      .refine(val => !patterns.sqlPattern.test(val), { message: "Formato de título inválido" }),
    descricao: z.string()
      .min(10, "A descrição deve ter pelo menos 10 caracteres")
      .max(1000)
      .regex(patterns.textPattern, "Formato da descrição inválido")
      .refine(val => !patterns.sqlPattern.test(val), { message: "Formato da descrição inválido" }),
    tipo: z.enum(['Objetivo', 'Dissertativo', 'Aleatorio']),
    selectedQuestionIds: z
      .array(z.string().regex(/^\d+$/, { message: 'O ID da questão deve ser um número válido.' }))
      .min(1, { message: 'Deve-se selecionar pelo menos uma questão.' }),
  }),
  edit: z.object({
    titulo: z.string()
      .max(200)
      .regex(patterns.textPattern, "Formato de título inválido")
      .refine(val => !patterns.sqlPattern.test(val), { message: "Formato de título inválido" }),
    descricao: z.string()
      .min(10)
      .max(1000)
      .regex(patterns.textPattern, "Formato da descrição inválido")
      .refine(val => !patterns.sqlPattern.test(val), { message: "Formato da descrição inválido" }),
    tipo: z.enum(['OBJETIVO', 'DISSERTATIVO', 'ALEATORIO'])
  }),
  submit: z.object({
    questoes: z.array(z.string()),
    respostas: z.array(
      z.string().refine(val => !patterns.sqlPattern.test(val), { message: "Formato de resposta inválido" })
    )
  }),
  removeQuestion: z.object({
        selectedQuestionIds: z
      .array(z.string().regex(/^\d+$/, { message: 'O ID da questão deve ser um número válido.' }))
      .min(1, { message: 'Deve-se selecionar pelo menos uma questão.' }),
  
}),
addQuestion: z.object({   
  selectedQuestionIds: z
    .array(z.string().regex(/^\d+$/, { message: 'O ID da questão deve ser um número válido.' }))
    .min(1, { message: 'Deve-se selecionar pelo menos uma questão.' }),
})
};

 const topicoSchemas = {
  register: z.object({
    topico: z.string()
      .max(100)
      .regex(patterns.textPattern, "Formato do tópico inválido")
      .refine(val => !patterns.sqlPattern.test(val), { message: "Formato do tópico inválido" }),
    areaIdTopico: z.string()
  }),
  edit: z.object({
    id: z.string(),
    nome: z.string()
      .max(100)
      .regex(patterns.textPattern, "Formato do tópico inválido")
      .refine(val => !patterns.sqlPattern.test(val), { message: "Formato do tópico inválido" })
  })
};

 const userSchemas = {
  edit: z.object({
    nome: z.string()
      .refine(val => !patterns.sqlPattern.test(val), { message: "Formato de nome inválido" })
      .optional(),
    usuario: z.string()
       .refine(val => !patterns.sqlPattern.test(val), { message: "Formato de nome de usuário inválido" })
      .optional(),
    email: z.string()
      .refine(val => !patterns.sqlPattern.test(val), { message: "Formato de e-mail inválido" })
      .optional(),
    senha: z.string()
      .refine(val => !patterns.sqlPattern.test(val), { message: "Formato de senha inválido" })
      .optional(),
    novasenha: z.string()
      .regex(patterns.passwordPattern, "A senha deve conter pelo menos 8 caracteres com letra maiúscula, minúscula, número e caracteres especiais")
      .optional()
  }).partial()
};
const contentSchemas = {
  register: z.object({
    titulo: z
      .string()
      .min(1, "O título não pode ser vazio")
      .max(200, "O título não pode exceder 200 caracteres")
      .regex(patterns.textPattern, "Formato de título inválido")
      .refine(val => !patterns.sqlPattern.test(val), { message: "Formato de título inválido" }),
    areaId: z
      .string()
      .regex(/^\d+$/, "O ID da área deve ser um número válido")
      .refine(val => !patterns.sqlPattern.test(val), { message: "Formato de ID da área inválido" }),
    topicoId: z
      .string()
      .regex(/^\d+$/, "O ID do tópico deve ser um número válido")
      .refine(val => !patterns.sqlPattern.test(val), { message: "Formato de ID do tópico inválido" }),
    palavrasChave: z
      .array(z.string().regex(patterns.textPattern, "Formato de palavra-chave inválido"))
      .min(1, "Deve haver pelo menos uma palavra-chave")
      .refine(
        arr => arr.every(val => !patterns.sqlPattern.test(val)),
        { message: "Formato de palavra-chave inválido" }
      ),
    conteudo: z
      .string()
      .min(10, "O conteúdo deve ter pelo menos 10 caracteres")
      .refine(val => !patterns.sqlPattern.test(val), { message: "Formato de conteúdo inválido" }),
    linksExternos: z
      .array(z.string().url("Formato de URL inválido"))
      .optional()
      .refine(
        arr => (arr ? arr.every(val => !patterns.sqlPattern.test(val)) : true),
        { message: "Formato de URL inválido" }
      ),
  }),
};

const flashcardsSchemas = {
  register: z.object({
    pergunta: z.string()
      .min(5, "A pergunta deve ter pelo menos 5 caracteres")
      .max(500, "A pergunta não pode exceder 500 caracteres")
      .regex(patterns.textPattern, "Formato de pergunta inválido")
      .refine(val => !patterns.sqlPattern.test(val), { message: "Formato de pergunta inválido" }),
    resposta: z.string()
      .min(1, "A resposta não pode ser vazia")
      .max(500, "A resposta não pode exceder 500 caracteres")
      .regex(patterns.textPattern, "Formato de resposta inválido")
      .refine(val => !patterns.sqlPattern.test(val), { message: "Formato de resposta inválido" }),
    id_area: z.string()
      .regex(/^\d+$/, "O id_area deve ser um número válido")
      .refine(val => !patterns.sqlPattern.test(val), { message: "Formato de id_area inválido" }),
    id_topico: z.string()
      .regex(/^\d+$/, "O id_topico deve ser um número válido")
      .refine(val => !patterns.sqlPattern.test(val), { message: "Formato de id_topico inválido" }),
    id_dificuldade: z.string()
      .regex(/^\d+$/, "O id_dificuldade deve ser um número válido")
      .refine(val => !patterns.sqlPattern.test(val), { message: "Formato de id_dificuldade inválido" })
  }),
  edit: z.object({
    pergunta: z.string()
      .min(5)
      .max(500)
      .regex(patterns.textPattern, "Formato de pergunta inválido")
      .refine(val => !patterns.sqlPattern.test(val), { message: "Formato de pergunta inválido" }),
    resposta: z.string()
      .min(1)
      .max(500)
      .regex(patterns.textPattern, "Formato de resposta inválido")
      .refine(val => !patterns.sqlPattern.test(val), { message: "Formato de resposta inválido" }),
    id_area: z.string()
      .regex(/^\d+$/)
      .refine(val => !patterns.sqlPattern.test(val), { message: "Formato de id_area inválido" }),
    id_topico: z.string()
      .regex(/^\d+$/)
      .refine(val => !patterns.sqlPattern.test(val), { message: "Formato de id_topico inválido" }),
    id_dificuldade: z.string()
      .regex(/^\d+$/)
      .refine(val => !patterns.sqlPattern.test(val), { message: "Formato de id_dificuldade inválido" })
  })
};


const dificuldadesSchemas = {
  register: z.object({
    nivel: z.string()
      .min(1, "O nível não pode ser vazio")
      .max(50, "O nível não pode exceder 50 caracteres")
      .regex(patterns.textPattern, "Formato de nível inválido")
      .refine(val => !patterns.sqlPattern.test(val), { message: "Formato de nível inválido" })
  }),
  edit: z.object({
    nivel: z.string()
      .min(1)
      .max(50)
      .regex(patterns.textPattern, "Formato de nível inválido")
      .refine(val => !patterns.sqlPattern.test(val), { message: "Formato de nível inválido" })
  })
};

module.exports = {
  patterns,
  authSchemas,
  questionSchemas,
  simuladoSchemas,
  topicoSchemas,
  userSchemas,
  contentSchemas,
  flashcardsSchemas,
  dificuldadesSchemas
};

