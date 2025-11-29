'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const flashcards = [
      // --- Área 1: Matemática (id_area: 1) ---
      // Tópico 1: Álgebra Linear
      { pergunta: 'O que é um vetor em Álgebra Linear?', resposta: 'Um objeto matemático que possui magnitude (ou comprimento) e direção.', id_area: 1, id_topico: 1, id_dificuldade: 1 },
      { pergunta: 'Qual a condição para que uma matriz seja invertível?', resposta: 'Uma matriz quadrada é invertível se, e somente se, seu determinante for diferente de zero.', id_area: 1, id_topico: 1, id_dificuldade: 2 },
      { pergunta: 'Explique o Teorema do Núcleo e da Imagem para transformações lineares.', resposta: 'Afirma que a dimensão do domínio de uma transformação linear é a soma da dimensão do seu núcleo (nulidade) e da dimensão de sua imagem (posto).', id_area: 1, id_topico: 1, id_dificuldade: 3 },
      // Tópico 2: Geometria Analítica
      { pergunta: 'O que é o plano cartesiano em Geometria Analítica?', resposta: 'Um sistema de coordenadas de duas dimensões (eixos x e y) usado para determinar a posição de pontos.', id_area: 1, id_topico: 2, id_dificuldade: 1 },
      { pergunta: 'Como se calcula a distância entre dois pontos no plano cartesiano?', resposta: 'Usando a fórmula d = √((x₂ - x₁)² + (y₂ - y₁)²), que é uma aplicação do Teorema de Pitágoras.', id_area: 1, id_topico: 2, id_dificuldade: 2 },
      { pergunta: 'Diferencie as equações gerais de uma elipse e de uma hipérbole.', resposta: 'A equação de uma elipse tem os termos x² e y² com o mesmo sinal (soma), enquanto na hipérbole eles têm sinais opostos (subtração).', id_area: 1, id_topico: 2, id_dificuldade: 3 },
      // Tópico 3: Trigonometria
      { pergunta: 'Quais são as três principais razões trigonométricas em um triângulo retângulo?', resposta: 'Seno (cateto oposto / hipotenusa), Cosseno (cateto adjacente / hipotenusa) e Tangente (cateto oposto / cateto adjacente).', id_area: 1, id_topico: 3, id_dificuldade: 1 },
      { pergunta: 'Qual é a Relação Fundamental da Trigonometria?', resposta: 'sen²(x) + cos²(x) = 1, válida para qualquer ângulo x.', id_area: 1, id_topico: 3, id_dificuldade: 2 },
      { pergunta: 'Explique a Lei dos Cossenos e quando ela é aplicada.', resposta: 'a² = b² + c² - 2bc*cos(A). É usada para encontrar um lado de um triângulo quando se conhecem dois lados e o ângulo entre eles, ou um ângulo quando se conhecem os três lados.', id_area: 1, id_topico: 3, id_dificuldade: 3 },
      // Tópico 4: Cálculo Diferencial
      { pergunta: 'O que é a derivada de uma função em Cálculo Diferencial?', resposta: 'A derivada representa a taxa de variação instantânea de uma função ou a inclinação da reta tangente ao gráfico da função em um ponto.', id_area: 1, id_topico: 4, id_dificuldade: 1 },
      { pergunta: 'Qual a diferença entre um ponto de máximo local e um ponto de máximo global?', resposta: 'Um máximo local é o maior valor da função em uma vizinhança, enquanto o máximo global é o maior valor em todo o seu domínio.', id_area: 1, id_topico: 4, id_dificuldade: 2 },
      { pergunta: 'Explique a Regra da Cadeia para derivação.', resposta: 'É usada para derivar funções compostas. Se h(x) = f(g(x)), então h\'(x) = f\'(g(x)) * g\'(x).', id_area: 1, id_topico: 4, id_dificuldade: 3 },
      // Tópico 5: Estatística
      { pergunta: 'O que são média, mediana e moda em Estatística?', resposta: 'Média é a soma dos valores dividida pelo número de valores. Mediana é o valor central de um conjunto ordenado. Moda é o valor que aparece com mais frequência.', id_area: 1, id_topico: 5, id_dificuldade: 1 },
      { pergunta: 'O que o desvio padrão indica sobre um conjunto de dados?', resposta: 'Indica o grau de dispersão ou variabilidade dos dados em relação à média. Um desvio padrão baixo significa que os dados estão próximos da média.', id_area: 1, id_topico: 5, id_dificuldade: 2 },
      { pergunta: 'Explique o que é uma distribuição normal (ou gaussiana).', resposta: 'É uma distribuição de probabilidade simétrica em torno da média, mostrando que os dados próximos da média são mais frequentes. Seu gráfico tem a forma de um sino.', id_area: 1, id_topico: 5, id_dificuldade: 3 },

      // --- Área 2: Português (id_area: 2) ---
      // Tópico 6: Gramática
      { pergunta: 'O que é um substantivo?', resposta: 'É a classe de palavras que nomeia seres, coisas, lugares, sentimentos, etc.', id_area: 2, id_topico: 6, id_dificuldade: 1 },
      { pergunta: 'Diferencie adjunto adnominal de complemento nominal.', resposta: 'Adjunto adnominal modifica um substantivo. Complemento nominal completa o sentido de substantivos abstratos, adjetivos ou advérbios.', id_area: 2, id_topico: 6, id_dificuldade: 2 },
      { pergunta: 'O que caracteriza uma oração subordinada substantiva subjetiva?', resposta: 'É uma oração que exerce a função de sujeito da oração principal.', id_area: 2, id_topico: 6, id_dificuldade: 3 },
      // Tópico 7: Literatura
      { pergunta: 'O que foi o Modernismo no Brasil?', resposta: 'Um movimento artístico e literário do início do século XX que buscava romper com o tradicionalismo e criar uma identidade cultural brasileira.', id_area: 2, id_topico: 7, id_dificuldade: 1 },
      { pergunta: 'Quais são as três fases do Modernismo brasileiro?', resposta: 'Primeira Fase (Heroica), Segunda Fase (Geração de 30) e Terceira Fase (Geração de 45).', id_area: 2, id_topico: 7, id_dificuldade: 2 },
      { pergunta: 'Cite duas características da obra de Clarice Lispector.', resposta: 'Fluxo de consciência (monólogo interior) e a epifania (revelação súbita a partir de eventos cotidianos).', id_area: 2, id_topico: 7, id_dificuldade: 3 },
      // Tópico 8: Redação
      { pergunta: 'Quais são as três partes essenciais de uma redação dissertativo-argumentativa?', resposta: 'Introdução, Desenvolvimento e Conclusão.', id_area: 2, id_topico: 8, id_dificuldade: 1 },
      { pergunta: 'O que deve conter o parágrafo de introdução de uma redação do ENEM?', resposta: 'A apresentação do tema e a tese, que é o ponto de vista a ser defendido ao longo do texto.', id_area: 2, id_topico: 8, id_dificuldade: 2 },
      { pergunta: 'Explique o que é um argumento de autoridade.', resposta: 'É um tipo de argumento que utiliza a citação de um especialista ou instituição renomada na área para dar credibilidade à tese defendida.', id_area: 2, id_topico: 8, id_dificuldade: 3 },
      // Tópico 9: Interpretação de Texto
      { pergunta: 'O que é inferência em interpretação de texto?', resposta: 'É a capacidade de deduzir informações que não estão explicitamente escritas no texto, com base nas pistas fornecidas pelo autor.', id_area: 2, id_topico: 9, id_dificuldade: 1 },
      { pergunta: 'Diferencie denotação e conotação.', resposta: 'Denotação é o sentido literal da palavra. Conotação é o sentido figurado, dependente do contexto.', id_area: 2, id_topico: 9, id_dificuldade: 2 },
      { pergunta: 'O que são pressupostos e subentendidos em um texto?', resposta: 'Pressupostos são informações implícitas marcadas por palavras no texto. Subentendidos são insinuações não marcadas, dependendo da interpretação do leitor.', id_area: 2, id_topico: 9, id_dificuldade: 3 },
      
      // --- Área 3: História (id_area: 3) ---
      // Tópico 10: Idade Antiga
      { pergunta: 'Qual civilização antiga desenvolveu a escrita cuneiforme?', resposta: 'Os Sumérios, na Mesopotâmia.', id_area: 3, id_topico: 10, id_dificuldade: 1 },
      { pergunta: 'O que foi a democracia ateniense?', resposta: 'Um sistema de governo em Atenas onde os cidadãos (homens, livres, atenienses) participavam diretamente das decisões políticas.', id_area: 3, id_topico: 10, id_dificuldade: 2 },
      { pergunta: 'Discorra sobre as causas da queda do Império Romano do Ocidente.', resposta: 'Crises econômicas, instabilidade política, corrupção, pressão dos povos bárbaros nas fronteiras e a divisão do império.', id_area: 3, id_topico: 10, id_dificuldade: 3 },
      // Tópico 11: Idade Média
      { pergunta: 'O que foi o feudalismo?', resposta: 'Um sistema social, político e econômico baseado na posse de terras (feudos) e em relações de suserania e vassalagem.', id_area: 3, id_topico: 11, id_dificuldade: 1 },
      { pergunta: 'Qual o papel da Igreja Católica na Idade Média?', resposta: 'Era a instituição mais poderosa, detendo grande poder espiritual, político, econômico e cultural, influenciando toda a sociedade.', id_area: 3, id_topico: 11, id_dificuldade: 2 },
      { pergunta: 'O que foram as Cruzadas e quais suas principais consequências?', resposta: 'Expedições militares de cristãos europeus para reconquistar a Terra Santa. Consequências incluem a reabertura do comércio com o Oriente e o enfraquecimento do poder feudal.', id_area: 3, id_topico: 11, id_dificuldade: 3 },
      // Tópico 12: Idade Moderna
      { pergunta: 'O que foi o Renascimento?', resposta: 'Um movimento cultural, artístico e científico que marcou a transição da Idade Média para a Moderna, valorizando o humanismo e o racionalismo.', id_area: 3, id_topico: 12, id_dificuldade: 1 },
      { pergunta: 'O que foi a Reforma Protestante?', resposta: 'Um movimento religioso liderado por Martinho Lutero que questionou dogmas da Igreja Católica e deu origem a novas denominações cristãs.', id_area: 3, id_topico: 12, id_dificuldade: 2 },
      { pergunta: 'Explique o conceito de Absolutismo Monárquico.', resposta: 'Um sistema de governo onde o poder estava concentrado nas mãos do rei, que o exercia sem limitações constitucionais.', id_area: 3, id_topico: 12, id_dificuldade: 3 },
      // Tópico 13: Idade Contemporânea
      { pergunta: 'O que foi a Revolução Francesa?', resposta: 'Um movimento que derrubou a monarquia absolutista na França e disseminou os ideais de Liberdade, Igualdade e Fraternidade.', id_area: 3, id_topico: 13, id_dificuldade: 1 },
      { pergunta: 'Quais foram os principais motivos que levaram à Primeira Guerra Mundial?', resposta: 'Disputas imperialistas, nacionalismos exacerbados, corrida armamentista e a política de alianças militares.', id_area: 3, id_topico: 13, id_dificuldade: 2 },
      { pergunta: 'Discorra sobre o conceito de "Globalização" no final do século XX.', resposta: 'É o processo de intensificação das interconexões globais nos âmbitos econômico, cultural, social e político, impulsionado pela tecnologia.', id_area: 3, id_topico: 13, id_dificuldade: 3 },
      
      // --- Área 4: Geografia (id_area: 4) ---
      // Tópico 14: Geografia Física
      { pergunta: 'O que são placas tectônicas?', resposta: 'Grandes blocos da crosta terrestre que se movem lentamente sobre o manto, causando terremotos e vulcanismo.', id_area: 4, id_topico: 14, id_dificuldade: 1 },
      { pergunta: 'Qual a diferença entre tempo e clima?', resposta: 'Tempo é o estado momentâneo da atmosfera. Clima é o padrão de comportamento do tempo observado ao longo de um longo período.', id_area: 4, id_topico: 14, id_dificuldade: 2 },
      { pergunta: 'Explique o processo de formação do relevo cárstico.', resposta: 'É formado pela dissolução de rochas solúveis, como o calcário, pela ação da água, criando feições como cavernas e dolinas.', id_area: 4, id_topico: 14, id_dificuldade: 3 },
      // Tópico 15: Geografia Humana
      { pergunta: 'O que é densidade demográfica?', resposta: 'É a relação entre o número de habitantes de uma área e a sua superfície, geralmente expressa em habitantes por km².', id_area: 4, id_topico: 15, id_dificuldade: 1 },
      { pergunta: 'Diferencie migração pendular de êxodo rural.', resposta: 'Migração pendular é o deslocamento diário entre cidades para trabalho/estudo. Êxodo rural é a migração definitiva do campo para a cidade.', id_area: 4, id_topico: 15, id_dificuldade: 2 },
      { pergunta: 'O que é o Índice de Desenvolvimento Humano (IDH)?', resposta: 'É uma medida comparativa que avalia a qualidade de vida de um país com base na expectativa de vida, educação e renda per capita.', id_area: 4, id_topico: 15, id_dificuldade: 3 },
      // Tópico 16: Geopolítica
      { pergunta: 'O que foi a Guerra Fria?', resposta: 'Um período de disputa geopolítica entre os Estados Unidos (capitalista) e a União Soviética (socialista) após a Segunda Guerra Mundial.', id_area: 4, id_topico: 16, id_dificuldade: 1 },
      { pergunta: 'O que são os BRICS?', resposta: 'Um agrupamento de economias emergentes (Brasil, Rússia, Índia, China e África do Sul) que busca maior protagonismo no cenário global.', id_area: 4, id_topico: 16, id_dificuldade: 2 },
      { pergunta: 'Explique o que é a Nova Rota da Seda (Belt and Road Initiative).', resposta: 'É uma estratégia de desenvolvimento de infraestrutura global da China para conectar a Ásia com a África e a Europa, aumentando sua influência geopolítica.', id_area: 4, id_topico: 16, id_dificuldade: 3 },
      // Tópico 17: Cartografia
      { pergunta: 'O que é a escala de um mapa?', resposta: 'É a relação matemática entre a distância no mapa e a distância correspondente na realidade.', id_area: 4, id_topico: 17, id_dificuldade: 1 },
      { pergunta: 'Diferencie latitude de longitude.', resposta: 'Latitude mede a distância em graus ao norte ou sul da linha do Equador. Longitude mede a distância a leste ou oeste do Meridiano de Greenwich.', id_area: 4, id_topico: 17, id_dificuldade: 2 },
      { pergunta: 'Explique a diferença entre a Projeção de Mercator e a Projeção de Peters.', resposta: 'Mercator (conforme) preserva a forma dos continentes mas distorce suas áreas. Peters (equivalente) preserva as áreas mas distorce as formas.', id_area: 4, id_topico: 17, id_dificuldade: 3 },

      // --- Área 5: Ciências (id_area: 5) ---
      // Tópico 18: Biologia
      { pergunta: 'O que é fotossíntese?', resposta: 'Processo realizado por plantas e algas que converte luz solar, água e dióxido de carbono em energia (glicose) e oxigênio.', id_area: 5, id_topico: 18, id_dificuldade: 1 },
      { pergunta: 'Qual a função das mitocôndrias na célula?', resposta: 'São responsáveis pela respiração celular, processo que gera a maior parte da energia (ATP) da célula.', id_area: 5, id_topico: 18, id_dificuldade: 2 },
      { pergunta: 'Diferencie seres procariontes de eucariontes.', resposta: 'Procariontes (bactérias) não possuem núcleo definido nem organelas membranosas. Eucariontes (animais, plantas) possuem.', id_area: 5, id_topico: 18, id_dificuldade: 3 },
      // Tópico 19: Física
      { pergunta: 'Enuncie a Primeira Lei de Newton (Lei da Inércia).', resposta: 'Um corpo tende a permanecer em seu estado de repouso ou movimento retilíneo uniforme, a menos que uma força externa atue sobre ele.', id_area: 5, id_topico: 19, id_dificuldade: 1 },
      { pergunta: 'Qual a diferença entre calor e temperatura?', resposta: 'Temperatura é a medida da agitação média das partículas de um corpo. Calor é a energia térmica em trânsito entre corpos com diferentes temperaturas.', id_area: 5, id_topico: 19, id_dificuldade: 2 },
      { pergunta: 'O que é o efeito Doppler?', resposta: 'É a mudança na frequência percebida de uma onda (sonora ou luminosa) devido ao movimento relativo entre a fonte e o observador.', id_area: 5, id_topico: 19, id_dificuldade: 3 },
      // Tópico 20: Química
      { pergunta: 'Qual a diferença entre uma substância simples e uma composta?', resposta: 'Simples é formada por átomos de um único elemento químico (ex: O₂). Composta é formada por átomos de mais de um elemento (ex: H₂O).', id_area: 5, id_topico: 20, id_dificuldade: 1 },
      { pergunta: 'O que é uma ligação iônica?', resposta: 'É uma ligação química formada pela atração eletrostática entre íons de cargas opostas, geralmente entre um metal e um não-metal.', id_area: 5, id_topico: 20, id_dificuldade: 2 },
      { pergunta: 'O que é o balanceamento de uma equação química e qual princípio ele segue?', resposta: 'É o ajuste dos coeficientes para que o número de átomos de cada elemento seja igual nos reagentes e produtos, seguindo a Lei de Lavoisier (conservação das massas).', id_area: 5, id_topico: 20, id_dificuldade: 3 },
      // Tópico 21: Astronomia
      { pergunta: 'Qual é a estrela mais próxima da Terra?', resposta: 'O Sol.', id_area: 5, id_topico: 21, id_dificuldade: 1 },
      { pergunta: 'Por que Plutão não é mais considerado um planeta principal?', resposta: 'Porque não atende a um dos três critérios da UAI: ele não "limpou a vizinhança" de sua órbita, compartilhando-a com outros objetos.', id_area: 5, id_topico: 21, id_dificuldade: 2 },
      { pergunta: 'O que é um buraco negro?', resposta: 'É uma região do espaço com um campo gravitacional tão intenso que nada, nem mesmo a luz, pode escapar de dentro dele.', id_area: 5, id_topico: 21, id_dificuldade: 3 },
      
      // --- Área 6: Artes (id_area: 6) ---
      // Tópico 22: Artes Visuais
      { pergunta: 'O que são cores primárias?', resposta: 'São cores que não podem ser obtidas pela mistura de outras cores, como vermelho, amarelo e azul.', id_area: 6, id_topico: 22, id_dificuldade: 1 },
      { pergunta: 'Diferencie a arte abstrata da arte figurativa.', resposta: 'A arte figurativa representa a realidade visível. A arte abstrata não tem compromisso com a representação da realidade, focando em formas, cores e linhas.', id_area: 6, id_topico: 22, id_dificuldade: 2 },
      { pergunta: 'O que foi o movimento cubista e quem foi seu principal artista?', resposta: 'Um movimento de vanguarda que representava objetos a partir de múltiplos pontos de vista simultaneamente, em formas geométricas. Pablo Picasso foi seu principal expoente.', id_area: 6, id_topico: 22, id_dificuldade: 3 },
      // Tópico 23: Música
      { pergunta: 'O que é uma escala musical?', resposta: 'Uma sequência ordenada de notas musicais, como a escala de Dó Maior (Dó, Ré, Mi, Fá, Sol, Lá, Si).', id_area: 6, id_topico: 23, id_dificuldade: 1 },
      { pergunta: 'Qual a diferença entre música erudita e música popular?', resposta: 'Música erudita (ou clássica) é geralmente mais complexa e instrumental. Música popular é mais acessível, focada em canções e ritmos dançantes.', id_area: 6, id_topico: 23, id_dificuldade: 2 },
      { pergunta: 'Explique o que foi a Bossa Nova no Brasil.', resposta: 'Um movimento musical que surgiu no Rio de Janeiro no final da década de 1950, caracterizado pela sofisticação harmônica e ritmo sincopado, com influências do samba e do jazz.', id_area: 6, id_topico: 23, id_dificuldade: 3 },
      // Tópico 24: Teatro
      { pergunta: 'O que é um monólogo no teatro?', resposta: 'É uma fala longa de um único personagem, expressando seus pensamentos em voz alta.', id_area: 6, id_topico: 24, id_dificuldade: 1 },
      { pergunta: 'Qual é a origem do teatro no Ocidente?', resposta: 'Na Grécia Antiga, a partir dos festivais em honra ao deus Dionísio, onde surgiram a tragédia e a comédia.', id_area: 6, id_topico: 24, id_dificuldade: 2 },
      { pergunta: 'O que é a "quarta parede" no teatro?', resposta: 'Uma parede imaginária que existe entre os atores no palco e o público, criando a ilusão de que a cena é um ambiente real e o público não está lá.', id_area: 6, id_topico: 24, id_dificuldade: 3 },
      // Tópico 25: Cinema
      { pergunta: 'O que é um "plano-sequência" no cinema?', resposta: 'Uma cena longa filmada sem cortes, com a câmera se movendo para seguir a ação.', id_area: 6, id_topico: 25, id_dificuldade: 1 },
      { pergunta: 'O que foi o movimento Neorrealismo Italiano no cinema?', resposta: 'Um movimento do pós-Segunda Guerra que se caracterizava por filmar em locações reais, usar atores não-profissionais e retratar a vida da classe trabalhadora.', id_area: 6, id_topico: 25, id_dificuldade: 2 },
      { pergunta: 'Explique a importância do filme "Cidadão Kane" para a história do cinema.', resposta: 'Dirigido por Orson Welles, é considerado um marco por suas inovações narrativas (como o uso de flashbacks) e técnicas (como a profundidade de campo).', id_area: 6, id_topico: 25, id_dificuldade: 3 },

      // --- Área 7: Informática (id_area: 7) ---
      // Tópico 26: Programação
      { pergunta: 'O que é uma variável em programação?', resposta: 'Um espaço na memória do computador destinado a armazenar um valor que pode ser modificado durante a execução do programa.', id_area: 7, id_topico: 26, id_dificuldade: 1 },
      { pergunta: 'Qual a diferença entre uma linguagem compilada e uma interpretada?', resposta: 'Compilada: o código é traduzido para linguagem de máquina de uma vez (ex: C++). Interpretada: o código é traduzido linha por linha durante a execução (ex: Python).', id_area: 7, id_topico: 26, id_dificuldade: 2 },
      { pergunta: 'O que é recursividade em programação?', resposta: 'É a capacidade de uma função chamar a si mesma. É usada para resolver problemas que podem ser divididos em subproblemas menores e idênticos.', id_area: 7, id_topico: 26, id_dificuldade: 3 },
      // Tópico 27: Redes de Computadores
      { pergunta: 'O que é um endereço IP?', resposta: 'É um rótulo numérico único atribuído a cada dispositivo conectado a uma rede de computadores que utiliza o Protocolo de Internet para comunicação.', id_area: 7, id_topico: 27, id_dificuldade: 1 },
      { pergunta: 'Qual a função de um roteador em uma rede?', resposta: 'Encaminhar pacotes de dados entre diferentes redes de computadores, permitindo a comunicação entre elas, como a conexão da sua casa com a Internet.', id_area: 7, id_topico: 27, id_dificuldade: 2 },
      { pergunta: 'Explique o que é o modelo OSI e cite duas de suas camadas.', resposta: 'É um modelo conceitual que padroniza as funções de uma rede em 7 camadas. Exemplos: Camada Física (cabos), Camada de Aplicação (HTTP).', id_area: 7, id_topico: 27, id_dificuldade: 3 },
      // Tópico 28: Banco de Dados
      { pergunta: 'O que é SQL?', resposta: 'Structured Query Language (Linguagem de Consulta Estruturada), é a linguagem padrão para gerenciar e manipular bancos de dados relacionais.', id_area: 7, id_topico: 28, id_dificuldade: 1 },
      { pergunta: 'Qual a diferença entre um banco de dados relacional (SQL) e um não-relacional (NoSQL)?', resposta: 'Relacional organiza dados em tabelas com esquemas rígidos (ex: MySQL). Não-relacional usa modelos flexíveis como documentos ou grafos (ex: MongoDB).', id_area: 7, id_topico: 28, id_dificuldade: 2 },
      { pergunta: 'O que é uma chave primária (primary key) em um banco de dados relacional?', resposta: 'É uma coluna (ou conjunto de colunas) que identifica unicamente cada linha em uma tabela. Não pode conter valores nulos ou duplicados.', id_area: 7, id_topico: 28, id_dificuldade: 3 },
      // Tópico 29: Segurança da Informação
      { pergunta: 'O que é um firewall?', resposta: 'Um dispositivo de segurança de rede que monitora e controla o tráfego de rede, decidindo se permite ou bloqueia tráfegos específicos com base em um conjunto de regras.', id_area: 7, id_topico: 29, id_dificuldade: 1 },
      { pergunta: 'O que é phishing?', resposta: 'Uma tentativa de fraude online onde criminosos se passam por entidades confiáveis para obter informações sensíveis, como senhas e dados de cartão de crédito.', id_area: 7, id_topico: 29, id_dificuldade: 2 },
      { pergunta: 'Explique a diferença entre criptografia simétrica e assimétrica.', resposta: 'Simétrica usa a mesma chave para criptografar e descriptografar. Assimétrica usa um par de chaves (pública e privada), onde uma criptografa e a outra descriptografa.', id_area: 7, id_topico: 29, id_dificuldade: 3 },
      
      // --- Área 8: Química (id_area: 8) ---
      // Tópico 30: Química Orgânica
      { pergunta: 'Qual elemento é a base da química orgânica?', resposta: 'O Carbono.', id_area: 8, id_topico: 30, id_dificuldade: 1 },
      { pergunta: 'Diferencie alcanos, alcenos e alcinos.', resposta: 'Alcanos possuem apenas ligações simples entre carbonos. Alcenos possuem pelo menos uma ligação dupla. Alcinos possuem pelo menos uma ligação tripla.', id_area: 8, id_topico: 30, id_dificuldade: 2 },
      { pergunta: 'O que são isômeros?', resposta: 'Compostos que possuem a mesma fórmula molecular, mas estruturas diferentes, resultando em propriedades distintas.', id_area: 8, id_topico: 30, id_dificuldade: 3 },
      // Tópico 31: Química Inorgânica
      { pergunta: 'O que é um ácido segundo a teoria de Arrhenius?', resposta: 'Toda substância que, em solução aquosa, se ioniza, produzindo como cátion exclusivamente o H+.', id_area: 8, id_topico: 31, id_dificuldade: 1 },
      { pergunta: 'O que é uma reação de neutralização?', resposta: 'Uma reação entre um ácido e uma base, que resulta na formação de um sal e água.', id_area: 8, id_topico: 31, id_dificuldade: 2 },
      { pergunta: 'Explique o conceito de ácido e base segundo a teoria de Brønsted-Lowry.', resposta: 'Ácido é uma espécie doadora de prótons (H+). Base é uma espécie receptora de prótons.', id_area: 8, id_topico: 31, id_dificuldade: 3 },
      // Tópico 32: Química Analítica
      { pergunta: 'O que é uma titulação?', resposta: 'Um método de análise quantitativa usado para determinar a concentração de uma substância em uma solução.', id_area: 8, id_topico: 32, id_dificuldade: 1 },
      { pergunta: 'Qual a função de um indicador ácido-base?', resposta: 'É uma substância que muda de cor em uma faixa específica de pH, indicando o ponto final de uma titulação de neutralização.', id_area: 8, id_topico: 32, id_dificuldade: 2 },
      { pergunta: 'O que é cromatografia?', resposta: 'É uma técnica de separação de misturas baseada na diferença de afinidade dos componentes por uma fase estacionária e uma fase móvel.', id_area: 8, id_topico: 32, id_dificuldade: 3 },
      // Tópico 33: Físico-Química
      { pergunta: 'O que é entalpia?', resposta: 'É a medida da energia térmica de um sistema, geralmente relacionada ao calor liberado ou absorvido em uma reação a pressão constante.', id_area: 8, id_topico: 33, id_dificuldade: 1 },
      { pergunta: 'O que afeta a velocidade de uma reação química?', resposta: 'Concentração dos reagentes, temperatura, pressão, superfície de contato e presença de catalisadores.', id_area: 8, id_topico: 33, id_dificuldade: 2 },
      { pergunta: 'Enuncie a Lei de Hess.', resposta: 'A variação de entalpia de uma reação química depende apenas dos estados inicial e final, não importando o caminho ou as etapas intermediárias da reação.', id_area: 8, id_topico: 33, id_dificuldade: 3 },

      // --- Área 9: Física (id_area: 9) ---
      // Tópico 34: Mecânica Clássica
      { pergunta: 'O que é inércia?', resposta: 'A tendência de um corpo de resistir a mudanças em seu estado de movimento.', id_area: 9, id_topico: 34, id_dificuldade: 1 },
      { pergunta: 'Diferencie energia cinética de energia potencial.', resposta: 'Energia cinética está relacionada ao movimento (velocidade) de um corpo. Energia potencial está relacionada à posição de um corpo em um campo de força (gravitacional, elástico).', id_area: 9, id_topico: 34, id_dificuldade: 2 },
      { pergunta: 'O que é o princípio da conservação do momento linear?', resposta: 'Em um sistema isolado (livre de forças externas), o momento linear total do sistema permanece constante.', id_area: 9, id_topico: 34, id_dificuldade: 3 },
      // Tópico 35: Termodinâmica
      { pergunta: 'O que é o zero absoluto?', resposta: 'É a menor temperatura teoricamente possível, onde a agitação das partículas de um sistema cessaria. Corresponde a 0 Kelvin ou -273,15 °C.', id_area: 9, id_topico: 35, id_dificuldade: 1 },
      { pergunta: 'Enuncie a Segunda Lei da Termodinâmica.', resposta: 'Afirma que o calor não flui espontaneamente de um corpo frio para um corpo quente, e que a entropia (desordem) do universo tende a aumentar.', id_area: 9, id_topico: 35, id_dificuldade: 2 },
      { pergunta: 'Explique o funcionamento de um motor de Carnot.', resposta: 'É um motor térmico teórico que opera em um ciclo reversível (Ciclo de Carnot), atingindo a máxima eficiência possível entre duas temperaturas.', id_area: 9, id_topico: 35, id_dificuldade: 3 },
      // Tópico 36: Óptica
      { pergunta: 'O que é refração da luz?', resposta: 'É a mudança na velocidade e na direção de propagação da luz ao passar de um meio para outro com índice de refração diferente.', id_area: 9, id_topico: 36, id_dificuldade: 1 },
      { pergunta: 'Diferencie um espelho côncavo de um convexo.', resposta: 'Côncavo: a superfície refletora é a parte interna de uma calota esférica. Convexo: a superfície refletora é a parte externa.', id_area: 9, id_topico: 36, id_dificuldade: 2 },
      { pergunta: 'O que é a difração da luz?', resposta: 'É o fenômeno em que a luz se desvia ao contornar obstáculos ou passar por fendas, espalhando-se e demonstrando seu caráter ondulatório.', id_area: 9, id_topico: 36, id_dificuldade: 3 },
      // Tópico 37: Física Nuclear
      { pergunta: 'O que são isótopos?', resposta: 'São átomos de um mesmo elemento químico que possuem o mesmo número de prótons, mas diferente número de nêutrons.', id_area: 9, id_topico: 37, id_dificuldade: 1 },
      { pergunta: 'Diferencie fissão nuclear de fusão nuclear.', resposta: 'Fissão é a quebra de um núcleo atômico pesado em núcleos menores, liberando energia. Fusão é a união de núcleos leves para formar um mais pesado, liberando ainda mais energia.', id_area: 9, id_topico: 37, id_dificuldade: 2 },
      { pergunta: 'O que é meia-vida radioativa?', resposta: 'É o tempo necessário para que metade dos átomos de uma amostra de um isótopo radioativo se desintegre.', id_area: 9, id_topico: 37, id_dificuldade: 3 },

      // --- Área 10: Biologia (id_area: 10) ---
      // Tópico 38: Genética
      { pergunta: 'O que é um gene?', resposta: 'Um segmento de DNA que contém a informação para a produção de uma proteína ou uma molécula de RNA funcional.', id_area: 10, id_topico: 38, id_dificuldade: 1 },
      { pergunta: 'Diferencie genótipo de fenótipo.', resposta: 'Genótipo é o conjunto de genes de um indivíduo. Fenótipo são as características observáveis, resultantes da interação do genótipo com o ambiente.', id_area: 10, id_topico: 38, id_dificuldade: 2 },
      { pergunta: 'Explique a Segunda Lei de Mendel (Lei da Segregação Independente).', resposta: 'Afirma que os fatores (genes) para duas ou mais características se segregam independentemente durante a formação dos gametas.', id_area: 10, id_topico: 38, id_dificuldade: 3 },
      // Tópico 39: Ecologia
      { pergunta: 'O que é um ecossistema?', resposta: 'O conjunto formado pelas interações entre os componentes bióticos (seres vivos) e abióticos (fatores físico-químicos) de um ambiente.', id_area: 10, id_topico: 39, id_dificuldade: 1 },
      { pergunta: 'Diferencie mutualismo de comensalismo.', resposta: 'Ambos são relações harmônicas. No mutualismo, ambas as espécies se beneficiam. No comensalismo, uma se beneficia e a outra é indiferente.', id_area: 10, id_topico: 39, id_dificuldade: 2 },
      { pergunta: 'O que é magnificação trófica?', resposta: 'É o processo de acúmulo de compostos tóxicos não biodegradáveis nos níveis mais altos de uma cadeia alimentar.', id_area: 10, id_topico: 39, id_dificuldade: 3 },
      // Tópico 40: Anatomia Humana
      { pergunta: 'Qual é o maior órgão do corpo humano?', resposta: 'A pele.', id_area: 10, id_topico: 40, id_dificuldade: 1 },
      { pergunta: 'Descreva o caminho do sangue na pequena circulação (pulmonar).', resposta: 'Ventrículo direito -> artéria pulmonar -> pulmões (ocorre a hematose) -> veias pulmonares -> átrio esquerdo.', id_area: 10, id_topico: 40, id_dificuldade: 2 },
      { pergunta: 'Qual a função do néfron?', resposta: 'É a unidade funcional dos rins, responsável pela filtração do sangue e formação da urina.', id_area: 10, id_topico: 40, id_dificuldade: 3 },
      // Tópico 41: Evolução
      { pergunta: 'O que é seleção natural?', resposta: 'O processo pelo qual indivíduos com características mais favoráveis a um determinado ambiente têm mais chances de sobreviver e se reproduzir.', id_area: 10, id_topico: 41, id_dificuldade: 1 },
      { pergunta: 'Diferencie órgãos homólogos de análogos.', resposta: 'Homólogos têm a mesma origem embrionária, mas funções diferentes (ex: braço humano e asa de morcego). Análogos têm origens diferentes, mas a mesma função (ex: asa de inseto e asa de ave).', id_area: 10, id_topico: 41, id_dificuldade: 2 },
      { pergunta: 'O que é especiação?', resposta: 'O processo evolutivo pelo qual novas espécies biológicas surgem, geralmente a partir de um isolamento reprodutivo entre populações.', id_area: 10, id_topico: 41, id_dificuldade: 3 },

      // --- Área 11: Filosofia (id_area: 11) ---
      // Tópico 42: Ética
      { pergunta: 'Qual a diferença entre ética e moral?', resposta: 'Moral é o conjunto de regras e costumes de uma sociedade. Ética é a reflexão filosófica sobre esses princípios morais.', id_area: 11, id_topico: 42, id_dificuldade: 1 },
      { pergunta: 'O que é o Imperativo Categórico de Kant?', resposta: 'É o princípio ético que afirma que uma ação é moralmente correta se sua máxima puder ser universalizada, tornando-se uma lei para todos.', id_area: 11, id_topico: 42, id_dificuldade: 2 },
      { pergunta: 'Explique a ética utilitarista de Jeremy Bentham e John Stuart Mill.', resposta: 'É uma ética consequencialista que defende que a ação moralmente correta é aquela que maximiza a felicidade e o bem-estar para o maior número de pessoas.', id_area: 11, id_topico: 42, id_dificuldade: 3 },
      // Tópico 43: Lógica
      { pergunta: 'O que é uma falácia?', resposta: 'Um argumento que parece válido, mas que contém um erro de raciocínio lógico.', id_area: 11, id_topico: 43, id_dificuldade: 1 },
      { pergunta: 'Diferencie raciocínio dedutivo de indutivo.', resposta: 'Dedutivo parte de premissas gerais para uma conclusão específica (se as premissas são verdadeiras, a conclusão é certa). Indutivo parte de observações específicas para uma conclusão geral (a conclusão é provável, mas não certa).', id_area: 11, id_topico: 43, id_dificuldade: 2 },
      { pergunta: 'O que é o "argumento do espantalho" (straw man)?', resposta: 'Uma falácia que consiste em distorcer ou caricaturar o argumento de outra pessoa para torná-lo mais fácil de atacar.', id_area: 11, id_topico: 43, id_dificuldade: 3 },
      // Tópico 44: Filosofia Política
      { pergunta: 'O que é o "contrato social"?', resposta: 'Uma teoria que sugere que os indivíduos abrem mão de certas liberdades em troca da proteção e organização fornecidas pelo Estado.', id_area: 11, id_topico: 44, id_dificuldade: 1 },
      { pergunta: 'Qual a principal diferença entre o pensamento político de Hobbes e o de Locke?', resposta: 'Hobbes defendia um soberano absoluto para evitar o caos. Locke defendia um governo limitado para proteger os direitos naturais (vida, liberdade, propriedade).', id_area: 11, id_topico: 44, id_dificuldade: 2 },
      { pergunta: 'O que é a "vontade geral" em Rousseau?', resposta: 'Não é a soma das vontades individuais, mas a vontade do corpo político como um todo, visando sempre o bem comum.', id_area: 11, id_topico: 44, id_dificuldade: 3 },
      // Tópico 45: Metafísica
      { pergunta: 'O que a metafísica estuda?', resposta: 'Os princípios fundamentais da realidade, a natureza do ser, da existência, do tempo, do espaço e da causalidade.', id_area: 11, id_topico: 45, id_dificuldade: 1 },
      { pergunta: 'Diferencie a visão de Platão e Aristóteles sobre a realidade.', resposta: 'Platão acreditava que a verdadeira realidade estava no mundo das Ideias (abstrato). Aristóteles acreditava que a realidade estava no mundo sensível (concreto), nas substâncias que podemos perceber.', id_area: 11, id_topico: 45, id_dificuldade: 2 },
      { pergunta: 'Explique o conceito de "devir" (vir-a-ser) em Heráclito.', resposta: 'A ideia de que a realidade está em constante mudança e transformação, resumida na frase "Ninguém se banha no mesmo rio duas vezes".', id_area: 11, id_topico: 45, id_dificuldade: 3 },

      // --- Área 12: Sociologia (id_area: 12) ---
      // Tópico 46: Sociedade e Cultura
      { pergunta: 'O que é socialização?', resposta: 'O processo pelo qual os indivíduos aprendem e internalizam as normas, valores e costumes de sua sociedade.', id_area: 12, id_topico: 46, id_dificuldade: 1 },
      { pergunta: 'Diferencie cultura material de imaterial.', resposta: 'Cultura material são os objetos físicos (ferramentas, roupas). Cultura imaterial são as criações abstratas (crenças, valores, linguagem).', id_area: 12, id_topico: 46, id_dificuldade: 2 },
      { pergunta: 'O que é etnocentrismo?', resposta: 'A tendência de julgar outras culturas a partir dos padrões e valores da sua própria, considerando-a como superior.', id_area: 12, id_topico: 46, id_dificuldade: 3 },
      // Tópico 47: Estratificação Social
      { pergunta: 'O que é estratificação social?', resposta: 'A divisão da sociedade em camadas ou estratos hierárquicos, com acesso desigual a recursos, poder e prestígio.', id_area: 12, id_topico: 47, id_dificuldade: 1 },
      { pergunta: 'Diferencie os sistemas de castas e de classes sociais.', resposta: 'Castas são estratificações rígidas, baseadas no nascimento e sem mobilidade social. Classes são baseadas na posição econômica e permitem mobilidade.', id_area: 12, id_topico: 47, id_dificuldade: 2 },
      { pergunta: 'O que é o conceito de "habitus" em Pierre Bourdieu?', resposta: 'Um sistema de disposições duráveis e transponíveis que os indivíduos internalizam a partir de sua posição social e que molda suas percepções e ações.', id_area: 12, id_topico: 47, id_dificuldade: 3 },
      // Tópico 48: Movimentos Sociais
      { pergunta: 'O que é um movimento social?', resposta: 'Uma ação coletiva organizada que visa promover ou resistir a mudanças na sociedade.', id_area: 12, id_topico: 48, id_dificuldade: 1 },
      { pergunta: 'Cite dois exemplos de movimentos sociais no Brasil.', resposta: 'Movimento dos Trabalhadores Rurais Sem Terra (MST), Movimento Feminista, Movimento Negro, Movimentos Ambientais.', id_area: 12, id_topico: 48, id_dificuldade: 2 },
      { pergunta: 'Qual a importância dos novos movimentos sociais a partir da década de 1960?', resposta: 'Eles trouxeram para o debate público novas pautas, como as questões de identidade, gênero, etnia, orientação sexual e meio ambiente.', id_area: 12, id_topico: 48, id_dificuldade: 3 },
      // Tópico 49: Teoria Sociológica
      { pergunta: 'Quem são considerados os três "pais" da Sociologia?', resposta: 'Émile Durkheim, Karl Marx e Max Weber.', id_area: 12, id_topico: 49, id_dificuldade: 1 },
      { pergunta: 'O que é o "fato social" segundo Durkheim?', resposta: 'São maneiras de agir, pensar e sentir exteriores ao indivíduo, que exercem sobre ele um poder coercitivo.', id_area: 12, id_topico: 49, id_dificuldade: 2 },
      { pergunta: 'Explique o conceito de "mais-valia" em Karl Marx.', resposta: 'É a diferença entre o valor do que o trabalhador produz e o valor do seu salário, que é apropriada pelo capitalista e constitui a base da exploração.', id_area: 12, id_topico: 49, id_dificuldade: 3 },

      // --- Área 13: Educação Física (id_area: 13) ---
      // Tópico 50: Atividades Físicas
      { pergunta: 'Diferencie atividade física de exercício físico.', resposta: 'Atividade física é qualquer movimento corporal. Exercício físico é uma atividade planejada, estruturada e repetitiva com o objetivo de melhorar a aptidão física.', id_area: 13, id_topico: 50, id_dificuldade: 1 },
      { pergunta: 'O que é o IMC (Índice de Massa Corporal)?', resposta: 'Uma medida internacional usada para avaliar se uma pessoa está em seu peso ideal, calculada dividindo-se o peso (kg) pela altura ao quadrado (m²).', id_area: 13, id_topico: 50, id_dificuldade: 2 },
      { pergunta: 'Quais são os cinco componentes da aptidão física relacionada à saúde?', resposta: 'Resistência cardiorrespiratória, força muscular, resistência muscular, flexibilidade e composição corporal.', id_area: 13, id_topico: 50, id_dificuldade: 3 },
      // Tópico 51: Fisiologia do Exercício
      { pergunta: 'Qual a principal molécula de energia utilizada pelas células do corpo?', resposta: 'ATP (Adenosina Trifosfato).', id_area: 13, id_topico: 51, id_dificuldade: 1 },
      { pergunta: 'Diferencie exercício aeróbico de anaeróbico.', resposta: 'Aeróbico utiliza oxigênio para produzir energia, é de longa duração e baixa intensidade. Anaeróbico não utiliza oxigênio, é de curta duração e alta intensidade.', id_area: 13, id_topico: 51, id_dificuldade: 2 },
      { pergunta: 'O que é o limiar de lactato?', resposta: 'A intensidade de exercício em que o lactato começa a se acumular no sangue a uma taxa mais rápida do que pode ser removido, associada à fadiga.', id_area: 13, id_topico: 51, id_dificuldade: 3 },
      // Tópico 52: Esportes
      { pergunta: 'Quantos jogadores por time atuam em uma partida oficial de basquete?', resposta: 'Cinco jogadores.', id_area: 13, id_topico: 52, id_dificuldade: 1 },
      { pergunta: 'O que é um "tie-break" no tênis?', resposta: 'Um game especial jogado quando o set está empatado em 6-6 para decidir o vencedor do set.', id_area: 13, id_topico: 52, id_dificuldade: 2 },
      { pergunta: 'Explique a origem do voleibol.', resposta: 'Foi criado em 1895 por William G. Morgan nos Estados Unidos, como um esporte com menos contato físico que o basquete, para ser praticado em ambientes fechados.', id_area: 13, id_topico: 52, id_dificuldade: 3 },
      // Tópico 53: Saúde e Bem-Estar
      { pergunta: 'O que é considerado um estilo de vida sedentário?', resposta: 'Um estilo de vida com pouca ou nenhuma atividade física regular.', id_area: 13, id_topico: 53, id_dificuldade: 1 },
      { pergunta: 'Qual a importância do aquecimento antes do exercício e do desaquecimento após?', resposta: 'O aquecimento prepara o corpo para o esforço, aumentando a temperatura e o fluxo sanguíneo. O desaquecimento ajuda o corpo a retornar gradualmente ao estado de repouso.', id_area: 13, id_topico: 53, id_dificuldade: 2 },
      { pergunta: 'O que é o princípio da sobrecarga no treinamento físico?', resposta: 'Para que haja melhora na aptidão física, o corpo deve ser submetido a um estresse ou carga maior do que está acostumado.', id_area: 13, id_topico: 53, id_dificuldade: 3 },
      
      // --- Área 14: Língua Estrangeira (id_area: 14) ---
      // Tópico 54: Gramática
      { pergunta: 'Complete a frase em inglês: "She ___ a doctor."', resposta: 'is', id_area: 14, id_topico: 54, id_dificuldade: 1 },
      { pergunta: 'Qual a diferença entre "much" e "many" em inglês?', resposta: '"Much" é usado para substantivos incontáveis (ex: much water). "Many" é usado para substantivos contáveis (ex: many books).', id_area: 14, id_topico: 54, id_dificuldade: 2 },
      { pergunta: 'O que é o "Present Perfect" em inglês e quando é usado?', resposta: 'É um tempo verbal usado para ações que começaram no passado e continuam no presente ou que ocorreram em um tempo não especificado no passado (ex: I have lived here for 10 years).', id_area: 14, id_topico: 54, id_dificuldade: 3 },
      // Tópico 55: Vocabulário
      { pergunta: 'Como se diz "biblioteca" em inglês?', resposta: 'Library.', id_area: 14, id_topico: 55, id_dificuldade: 1 },
      { pergunta: 'O que significa a palavra "actually" em inglês?', resposta: 'Significa "na verdade" ou "realmente", e não "atualmente".', id_area: 14, id_topico: 55, id_dificuldade: 2 },
      { pergunta: 'Explique a diferença entre "lend" e "borrow" em inglês.', resposta: '"Lend" significa emprestar algo a alguém (I will lend you my book). "Borrow" significa pegar algo emprestado de alguém (Can I borrow your book?).', id_area: 14, id_topico: 55, id_dificuldade: 3 },
      // Tópico 56: Conversação
      { pergunta: 'Como se pergunta "Qual é o seu nome?" em inglês?', resposta: '"What is your name?"', id_area: 14, id_topico: 56, id_dificuldade: 1 },
      { pergunta: 'O que significa a expressão "it\'s raining cats and dogs"?', resposta: 'É uma expressão idiomática que significa "está chovendo muito forte".', id_area: 14, id_topico: 56, id_dificuldade: 2 },
      { pergunta: 'Como você responderia educadamente a um agradecimento ("Thank you") em inglês? Cite duas formas.', resposta: 'You\'re welcome. / My pleasure. / Don\'t mention it. / No problem.', id_area: 14, id_topico: 56, id_dificuldade: 3 },
      // Tópico 57: Cultura Estrangeira
      { pergunta: 'Qual é a principal data comemorativa dos Estados Unidos, celebrada em 4 de julho?', resposta: 'O Dia da Independência (Independence Day).', id_area: 14, id_topico: 57, id_dificuldade: 1 },
      { pergunta: 'O que é o "Thanksgiving" (Ação de Graças) nos EUA?', resposta: 'Um feriado nacional para agradecer pelas bênçãos do ano, tradicionalmente celebrado com uma grande refeição em família.', id_area: 14, id_topico: 57, id_dificuldade: 2 },
      { pergunta: 'Explique o que é o "Boxing Day", celebrado no Reino Unido e em outros países da Commonwealth.', resposta: 'É um feriado celebrado em 26 de dezembro. Tradicionalmente era o dia de dar presentes ("boxes") aos empregados, mas hoje é mais conhecido por promoções comerciais e eventos esportivos.', id_area: 14, id_topico: 57, id_dificuldade: 3 }
      
    ];

    for (const flashcard of flashcards) {
      const pergunta = flashcard.pergunta.replace(/'/g, "''");
      const resposta = flashcard.resposta.replace(/'/g, "''");

      await queryInterface.sequelize.query(
        `INSERT INTO Flashcard (pergunta, resposta, id_area, id_topico, id_dificuldade, createdAt, updatedAt) VALUES ('${pergunta}', '${resposta}', ${flashcard.id_area}, ${flashcard.id_topico}, ${flashcard.id_dificuldade}, NOW(), NOW())`
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('DELETE FROM Flashcard');
    await queryInterface.sequelize.query('ALTER TABLE Flashcard AUTO_INCREMENT = 1');
  }
};

