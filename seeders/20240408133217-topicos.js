'use strict';

module.exports = {
 up: async (queryInterface, Sequelize) => {
    // Definindo os tópicos relacionados a cada área de estudo para o ENEM
    const topics = {
      Matemática: [
         { nome: 'Álgebra Linear', id_area: 1 },
         { nome: 'Geometria Analítica', id_area: 1 },
         { nome: 'Trigonometria', id_area: 1 },
         { nome: 'Cálculo Diferencial', id_area: 1 },
         { nome: 'Estatística', id_area: 1 }
      ],
      Português: [
         { nome: 'Gramática', id_area: 2 },
         { nome: 'Literatura', id_area: 2 },
         { nome: 'Redação', id_area: 2 },
         { nome: 'Interpretação de Texto', id_area: 2 }
      ],
      História: [
         { nome: 'Idade Antiga', id_area: 3 },
         { nome: 'Idade Média', id_area: 3 },
         { nome: 'Idade Moderna', id_area: 3 },
         { nome: 'Idade Contemporânea', id_area: 3 }
      ],
      Geografia: [
         { nome: 'Geografia Física', id_area: 4 },
         { nome: 'Geografia Humana', id_area: 4 },
         { nome: 'Geopolítica', id_area: 4 },
         { nome: 'Cartografia', id_area: 4 }
      ],
      Ciências: [
         { nome: 'Biologia', id_area: 5 },
         { nome: 'Física', id_area: 5 },
         { nome: 'Química', id_area: 5 },
         { nome: 'Astronomia', id_area: 5 }
      ],
      Artes: [
         { nome: 'Artes Visuais', id_area: 6 },
         { nome: 'Música', id_area: 6 },
         { nome: 'Teatro', id_area: 6 },
         { nome: 'Cinema', id_area: 6 }
      ],
      Informática: [
         { nome: 'Programação', id_area: 7 },
         { nome: 'Redes de Computadores', id_area: 7 },
         { nome: 'Banco de Dados', id_area: 7 },
         { nome: 'Segurança da Informação', id_area: 7 }
      ],
      Química: [
         { nome: 'Química Orgânica', id_area: 8 },
         { nome: 'Química Inorgânica', id_area: 8 },
         { nome: 'Química Analítica', id_area: 8 },
         { nome: 'Físico-Química', id_area: 8 }
      ],
      Física: [
         { nome: 'Mecânica Clássica', id_area: 9 },
         { nome: 'Termodinâmica', id_area: 9 },
         { nome: 'Óptica', id_area: 9 },
         { nome: 'Física Nuclear', id_area: 9 }
      ],
      Biologia: [
         { nome: 'Genética', id_area: 10 },
         { nome: 'Ecologia', id_area: 10 },
         { nome: 'Anatomia Humana', id_area: 10 },
         { nome: 'Evolução', id_area: 10 }
      ],
      Filosofia: [
         { nome: 'Ética', id_area: 11 },
         { nome: 'Lógica', id_area: 11 },
         { nome: 'Filosofia Política', id_area: 11 },
         { nome: 'Metafísica', id_area: 11 }
      ],
      Sociologia: [
         { nome: 'Sociedade e Cultura', id_area: 12 },
         { nome: 'Estratificação Social', id_area: 12 },
         { nome: 'Movimentos Sociais', id_area: 12 },
         { nome: 'Teoria Sociológica', id_area: 12 }
      ],
      'Educação Física': [
         { nome: 'Atividades Físicas', id_area: 13 },
         { nome: 'Fisiologia do Exercício', id_area: 13 },
         { nome: 'Esportes', id_area: 13 },
         { nome: 'Saúde e Bem-Estar', id_area: 13 }
      ],
      'Língua Estrangeira': [
         { nome: 'Gramática', id_area: 14 },
         { nome: 'Vocabulário', id_area: 14 },
         { nome: 'Conversação', id_area: 14 },
         { nome: 'Cultura Estrangeira', id_area: 14 }
      ]
     };
      // Adicione os tópicos para as outras áreas aqui, seguindo o mesmo formato


    // Inserindo os tópicos no banco de dados
    for (const area in topics) {
      for (const materia of topics[area]) {
        await queryInterface.sequelize.query(
          `INSERT INTO Topico (nome, id_area, id_usuario, createdAt, updatedAt) VALUES ('${materia.nome}', ${materia.id_area}, '${1}', NOW(), NOW())`
        );
      }
    }
 },

 down: async (queryInterface, Sequelize) => {
    // Removendo os tópicos inseridos pelo seed
    await queryInterface.sequelize.query(`DELETE FROM Topico`);
 }
};