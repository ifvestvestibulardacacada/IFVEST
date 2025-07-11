const ArcanaFlow = require('./ArcanaFlow')

// Exibindo cabeçalho
ArcanaFlow.loadHeader() 

// Cadastrando Entidades
ArcanaFlow.addEntity("Auth", "red")
ArcanaFlow.addEntity("Sequelize", "magenta")
ArcanaFlow.addEntity("Render", "green")

// Ação de entidade anônima (criada agora)
ArcanaFlow.action("Database", "Inseriu dados no banco")

// Agindo com as entidades criadas
ArcanaFlow.action("Render", "Renderizou a tela")

// Outras ações
ArcanaFlow.error("Render", "Não renderizou a tela")
ArcanaFlow.warning("Sequelize", "Falha ao carregar as models!")
ArcanaFlow.error("Auth", "Acesso negado!")

ArcanaFlow.setActive(false)

// Mudando a configuração
ArcanaFlow.setConfig("file", false)
ArcanaFlow.setConfig("line", false)
ArcanaFlow.loadHeader()
ArcanaFlow.action("Database", "Inseriu dados no banco")