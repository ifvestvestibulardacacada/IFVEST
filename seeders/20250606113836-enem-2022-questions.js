'use strict';

const axios = require('axios').default;

// Função auxiliar para converter conteúdo simples ou <img> para Quill Delta
function contextToQuillDelta(content) {
  if (!content || typeof content !== 'string') {
    return [{ insert: '' }];
  }

  const parts = content.split(/(<img[^>]+>)/g);
  const ops = parts.map(part => {
    if (part.startsWith('<img')) {
      const match = part.match(/src="([^"]+)"/);
      return match ? { insert: { image: match[1] } } : { insert: part };
    }
    return { insert: part };
  });

  return ops.filter(op => op.insert !== '');
}

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      console.log('Fetching ENEM 2022 questions from API...');
      const response = await axios.get('https://api.enem.dev/v1/exams/2022/questions');
      const questions = response.data.questions;

      if (!questions || questions.length === 0) {
        console.log('No questions found in API response.');
        return;
      }

      const questoesToInsert = [];
      const opcoesToInsert = [];

      for (const question of questions) {
        // === Monta o Delta da pergunta ===
        const contextOps = contextToQuillDelta(question.context || '');
        const introText = question.alternativesIntroduction || 'Selecione a alternativa correta';

        const ops = [
          ...contextOps,
          { insert: `\n${introText}\n` },
        ];

        // Adiciona imagens da questão
        if (Array.isArray(question.files)) {
          question.files.forEach(imgUrl => {
            ops.push({ insert: { image: imgUrl } });
            ops.push({ insert: '\n' });
          });
        }

        const titulo = question.title || `Questão ${question.index || 'Sem título'}`;

        // Evita duplicatas por título
        const existing = await queryInterface.select(null, 'Questao', {
          where: { titulo },
        });

        if (existing && existing.length > 0) {
          console.log(`Questão já existe: ${titulo}`);
          continue;
        }

        const questaoData = {
          titulo,
          pergunta: JSON.stringify({ ops }),
          tipo: 'OBJETIVA',
          id_usuario: 1,
          id_area: 1, // Ajuste conforme sua tabela de áreas (ex: Matemática, Ciências, etc.)
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        questoesToInsert.push(questaoData);
      }

      if (questoesToInsert.length === 0) {
        console.log('Nenhuma nova questão para inserir.');
        return;
      }

      // === Inserir questões em lote ===
      await queryInterface.bulkInsert('Questao', questoesToInsert, {});

      // === Buscar IDs das questões inseridas ===
      const insertedQuestoes = await queryInterface.select(null, 'Questao', {
        where: {
          titulo: {
            [Sequelize.Op.in]: questoesToInsert.map(q => q.titulo),
          },
        },
      });

      const tituloToIdMap = {};
      insertedQuestoes.forEach(q => {
        tituloToIdMap[q.titulo] = q.id_questao;
      });

      // === Processar alternativas ===
      for (const question of questions) {
        const titulo = question.title || `Questão ${question.index || 'Sem título'}`;
        const questaoId = tituloToIdMap[titulo];

        if (!questaoId) continue;

        for (const alternative of question.alternatives || []) {
          let alternativeOps = contextToQuillDelta(alternative.text || '');

          if (alternative.file) {
            alternativeOps.push({ insert: { image: alternative.file } });
            alternativeOps.push({ insert: '\n' });
          }

          opcoesToInsert.push({
            id_questao: questaoId,
            descricao: JSON.stringify({ ops: alternativeOps }),
            alternativa: alternative.letter || 'A',
            correta: Boolean(alternative.isCorrect),
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }

      // === Inserir opções em lote ===
      if (opcoesToInsert.length > 0) {
        await queryInterface.bulkInsert('Opcao', opcoesToInsert, {});
      }

      console.log(`Inseridas ${questoesToInsert.length} questões e ${opcoesToInsert.length} opções com sucesso.`);

    } catch (error) {
      console.error('Erro ao inserir dados do ENEM 2022:', error.message);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    // Remove todas as questões do ENEM 2022 (baseado no título contendo "2022" ou "ENEM")
    await queryInterface.bulkDelete('Opcao', {
      id_questao: {
        [Sequelize.Op.in]: Sequelize.literal(
          `(SELECT id_questao FROM Questao WHERE titulo LIKE '%2022%' OR titulo LIKE '%ENEM%')`
        ),
      },
    });

    await queryInterface.bulkDelete('Questao', {
      [Sequelize.Op.or]: [
        { titulo: { [Sequelize.Op.like]: '%2022%' } },
        { titulo: { [Sequelize.Op.like]: '%ENEM%' } },
      ],
    });

    console.log('Seed do ENEM 2022 revertida com sucesso.');
  }
};