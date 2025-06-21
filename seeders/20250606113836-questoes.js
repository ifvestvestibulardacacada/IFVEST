'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const questoes = [
      {
        "titulo": "Questão 5 (Enem 2015)",
        "pergunta": "{\"ops\":[{\"insert\":\"O sindicato de trabalhadores de uma empresa sugere que o piso salarial da classe seja de \"},{\"insert\":\", propondo um aumento percentual fixo por cada ano dedicado ao trabalho. A expressão que corresponde à proposta salarial \"},{\"insert\":\", em função do tempo de serviço \"},{\"insert\":\" .\"},{\"attributes\":{\"align\":\"justify\"},\"insert\":\"\\n\"},{\"insert\":\"De acordo com a proposta do sindicato, o salário de um profissional de empresa com \"},{\"insert\":\" anos de tempo de serviço será, em reais,\"},{\"attributes\":{\"align\":\"justify\"},\"insert\":\"\\n\"},{\"insert\":\"\\n\"}]}",
        "tipo": "OBJETIVA",
        "createdAt": "2024-11-25 19:03:46.851-03",
        "updatedAt": "2024-11-25 19:03:46.851-03",
        "id_usuario": "1",
        "id_area": "1"
      },
      {
        "titulo": "Questão 6 (Enem 2019)",
        "pergunta": "{\"ops\":[{\"insert\":\"A \"},{\"attributes\":{\"italic\":true},\"insert\":\"Hydrangea macrophylla\"},{\"insert\":\" é uma planta com flor azul ou cor-de-rosa, dependendo do pH do solo no qual está plantada. Em solo ácido (ou seja, com \"},{\"insert\":\") a flor é azul, enquanto que em solo alcalino (ou seja, com \"},{\"insert\":\") a flor é rosa. Considere que a \"},{\"attributes\":{\"italic\":true},\"insert\":\"Hydrangea\"},{\"insert\":\" cor-de-rosa mais valorizada comercialmente numa determinada região seja aquela produzida em solo com pH inferior a 8. Sabe-se que \"},{\"insert\":\" , em que x é a concentração de íon hidrogênio (H+). \\nPara produzir a \"},{\"attributes\":{\"italic\":true},\"insert\":\"Hydrangea\"},{\"insert\":\" cor-de-rosa de maior valor comercial, deve-se preparar o solo de modo que x assuma \\n\\n\"}]}",
        "tipo": "OBJETIVA",
        "createdAt": "2024-11-25 19:15:06.12-03",
        "updatedAt": "2024-11-25 19:15:06.12-03",
        "id_usuario": "1",
        "id_area": "1"
      },

    ];

    for (const questao of questoes) {
  
      await queryInterface.sequelize.query(
        "INSERT INTO `Questao` (`titulo`, `pergunta`, `tipo`, `id_usuario`, `id_area`, `createdAt`, `updatedAt`) VALUES (?, ?, ?, ?, ?, NOW(), NOW())",
        { replacements: [questao.titulo, questao.pergunta, questao.tipo, questao.id_usuario, questao.id_area] }
      );

    
  }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query("DELETE FROM `Questao`");
  }
};
