'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const questoes = [
      {
        "titulo": "Questão 2",
        "pergunta": "{\"ops\":[{\"insert\":\"A água é um dos componentes mais importantes das células. A tabela abaixo mostra como a quantidade de água varia em seres humanos, dependendo do tipo de célula. Em média, a água corresponde a \"},{\"insert\":{\"mathjax\":\"<span id=\\\"equation-preview\\\">\\\\(70\\\\%\\\\)</span>\"}},{\"insert\":\" da composição química de um indivíduo normal. Durante uma biópsia, foi isolada uma amostra de tecido para análise em um laboratório. Enquanto intacta, essa amostra pesava \"},{\"insert\":{\"mathjax\":\"<span id=\\\"equation-preview\\\">\\\\(200mg\\\\)</span>\"}},{\"insert\":\" . Após secagem em estufa, quando se retirou toda a água do tecido, a amostra passou a pesar \"},{\"insert\":{\"mathjax\":\"<span id=\\\"equation-preview\\\">\\\\(80mg\\\\)</span>\"}},{\"insert\":\".\"},{\"insert\":\"\\n\\nBaseado na tabela pode-se afirmar que essa é uma amostra de:\\n\\n\"}]}",
        "tipo": "OBJETIVA",
        "createdAt": "2024-11-25 16:58:42.151-03",
        "updatedAt": "2024-11-25 16:58:42.151-03",
        "id_usuario": "1",
        "id_area": "1"
      },
      {
        "titulo": "Questão 1 Enem",
        "pergunta": "{\"ops\":[{\"insert\":\"O gás natural veicular (GNV) pode substituir a gasolina ou álcool nos veículos automotores. Nas grandes cidades, essa possibilidade tem sido explorada, principalmente, pelos táxis, que recuperam em um tempo relativamente curto o investimento feito com a conversão por meio da economia proporcionada pelo uso do gás natural. Atualmente, a conversão para gás natural do motor de um automóvel que utiliza a gasolina custa R$3.000,00. Um litro de gasolina permite percorrer cerca de 10 km e custa R$ 2,20, enquanto um metro cúbico de GNV permite percorrer cerca de 12 km e custa R$ 1,10. Desse modo, um taxista que percorra 6.000 km por mês recupera o investimento da conversão em aproximadamente:\\n\"}]}",
        "tipo": "OBJETIVA",
        "createdAt": "2024-11-18 22:05:07.87-03",
        "updatedAt": "2024-11-25 16:25:04.931-03",
        "id_usuario": "1",
        "id_area": "1"
      },
      {
        "titulo": "Questão 2",
        "pergunta": "{\"ops\":[{\"insert\":\"Em quase todo o Brasil existem restaurantes em que o cliente, após se servir, pesa o prato de comida e paga o valor correspondente, registrado na nota pela balança. Em um restaurante desse tipo, o preço do quilo era \"},{\"insert\":{\"mathjax\":\"<span id=\\\"equation-preview\\\">\\\\(R$ 12,80\\\\)</span>\"}},{\"insert\":\" . Certa vez a funcionária digitou por engano na balança eletrônica o valor \"},{\"insert\":{\"mathjax\":\"<span id=\\\"equation-preview\\\">\\\\(R$18,20\\\\)</span>\"}},{\"insert\":\"  e só percebeu o erro algum tempo depois, quando vários clientes já estavam almoçando. Ela fez alguns cálculos e verificou que o erro seria corrigido se o valor incorreto indicado na nota dos clientes fosse multiplicado por:\"},{\"attributes\":{\"align\":\"justify\"},\"insert\":\"\\n\"},{\"insert\":\"\\n\"}]}",
        "tipo": "OBJETIVA",
        "createdAt": "2024-11-25 18:50:59.613-03",
        "updatedAt": "2024-11-25 18:50:59.613-03",
        "id_usuario": "1",
        "id_area": "1"
      },
      {
        "titulo": "Questão 5 (Enem 2015)",
        "pergunta": "{\"ops\":[{\"insert\":\"O sindicato de trabalhadores de uma empresa sugere que o piso salarial da classe seja de \"},{\"insert\":{\"mathjax\":\"<span id=\\\"equation-preview\\\">\\\\(R$ 1800\\\\)</span>\"}},{\"insert\":\", propondo um aumento percentual fixo por cada ano dedicado ao trabalho. A expressão que corresponde à proposta salarial \"},{\"insert\":{\"mathjax\":\"<span id=\\\"equation-preview\\\">\\\\((s)\\\\)</span>\"}},{\"insert\":\", em função do tempo de serviço \"},{\"insert\":{\"mathjax\":\"<span id=\\\"equation-preview\\\">\\\\((t)\\\\)</span>\"}},{\"insert\":\", em anos, é \"},{\"insert\":{\"mathjax\":\"<span id=\\\"equation-preview\\\">\\\\(s(t) = 1800 (1,03)^t\\\\)</span>\"}},{\"insert\":\" .\"},{\"attributes\":{\"align\":\"justify\"},\"insert\":\"\\n\"},{\"insert\":\"De acordo com a proposta do sindicato, o salário de um profissional de empresa com \"},{\"insert\":{\"mathjax\":\"<span id=\\\"equation-preview\\\">\\\\(2\\\\)</span>\"}},{\"insert\":\" anos de tempo de serviço será, em reais,\"},{\"attributes\":{\"align\":\"justify\"},\"insert\":\"\\n\"},{\"insert\":\"\\n\"}]}",
        "tipo": "OBJETIVA",
        "createdAt": "2024-11-25 19:03:46.851-03",
        "updatedAt": "2024-11-25 19:03:46.851-03",
        "id_usuario": "1",
        "id_area": "1"
      },
      {
        "titulo": "Questão 6 (Enem 2019)",
        "pergunta": "{\"ops\":[{\"insert\":\"A \"},{\"attributes\":{\"italic\":true},\"insert\":\"Hydrangea macrophylla\"},{\"insert\":\" é uma planta com flor azul ou cor-de-rosa, dependendo do pH do solo no qual está plantada. Em solo ácido (ou seja, com \"},{\"insert\":{\"mathjax\":\"<span id=\\\"equation-preview\\\">\\\\(pH &lt; 7\\\\)</span>\"}},{\"insert\":\") a flor é azul, enquanto que em solo alcalino (ou seja, com \"},{\"insert\":{\"mathjax\":\"<span id=\\\"equation-preview\\\">\\\\(pH &gt; 7\\\\)</span>\"}},{\"insert\":\") a flor é rosa. Considere que a \"},{\"attributes\":{\"italic\":true},\"insert\":\"Hydrangea\"},{\"insert\":\" cor-de-rosa mais valorizada comercialmente numa determinada região seja aquela produzida em solo com pH inferior a 8. Sabe-se que \"},{\"insert\":{\"mathjax\":\"<span id=\\\"equation-preview\\\">\\\\(pH = – \\\\log_{10}{x} \\\\)</span>\"}},{\"insert\":\" , em que x é a concentração de íon hidrogênio (H+). \\nPara produzir a \"},{\"attributes\":{\"italic\":true},\"insert\":\"Hydrangea\"},{\"insert\":\" cor-de-rosa de maior valor comercial, deve-se preparar o solo de modo que x assuma \\n\\n\"}]}",
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
