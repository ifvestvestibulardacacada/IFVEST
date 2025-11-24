# 🎓 IFVest - Plataforma de Preparação para Vestibulares

[![Node.js](https://img.shields.io/badge/Node.js-22.5.0-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.1.0-blue.svg)](https://expressjs.com/)
[![Sequelize](https://img.shields.io/badge/Sequelize-6.37.3-orange.svg)](https://sequelize.org/)
[![License](https://img.shields.io/badge/License-ISC-yellow.svg)](LICENSE)

> **Plataforma gratuita de preparação para vestibulares** desenvolvida para auxiliar estudantes no processo de aprendizagem através de simulados, revisão de conteúdos e materiais educacionais.

## 📋 **Índice**

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Uso](#-uso)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [API](#-api)
- [Contribuição](#-contribuição)
- [Licença](#-licença)

## 🎯 **Sobre o Projeto**

O **IFVest** é uma plataforma educacional completa desenvolvida para auxiliar estudantes na preparação para vestibulares. A plataforma oferece um ambiente interativo onde alunos podem:

- 📚 Acessar conteúdos de qualidade organizados por áreas e tópicos
- 🧪 Realizar simulados personalizados (objetivos, dissertativos ou mistos)
- 📖 Revisar materiais educacionais com sistema de busca avançada
- 👨‍🏫 Gerenciar questões e simulados (para professores)
- 📊 Acompanhar progresso e desempenho

### **Objetivos**
- Fornecer acesso gratuito a conteúdo educacional de qualidade
- Criar um ambiente de aprendizado interativo e personalizado
- Facilitar a revisão e preparação para vestibulares
- Promover o aprendizado através de simulados e materiais didáticos

## ✨ **Funcionalidades**

### **👤 Para Estudantes**
- **Simulados Personalizados**: Criação e execução de simulados adaptados às necessidades
- **Sistema de Revisão**: Acesso a materiais organizados por área e tópico
- **Busca Inteligente**: Localização rápida de conteúdos específicos
- **Acompanhamento**: Histórico de simulados realizados e desempenho

### **👨‍🏫 Para Professores**
- **Gestão de Questões**: Criação, edição e organização de questões
- **Criação de Simulados**: Montagem de simulados personalizados
- **Gerenciamento de Conteúdo**: Organização de materiais por área e tópico
- **Análise de Desempenho**: Acompanhamento do progresso dos estudantes

### **🔧 Funcionalidades Técnicas**
- **Autenticação Segura**: Sistema de login com sessões
- **Arquitetura Modular**: Domínios separados para diferentes funcionalidades
- **Validação Robusta**: Proteção contra SQL Injection e XSS
- **Interface Responsiva**: Design adaptável para diferentes dispositivos

## 🛠️ **Tecnologias**

### **Backend**
- **Node.js** (v22.5.0) - Runtime JavaScript
- **Express.js** (v5.1.0) - Framework web
- **Sequelize** (v6.37.3) - ORM para banco de dados
- **EJS** (v3.1.9) - Template engine
- **Express-session** - Gerenciamento de sessões
- **Helmet** - Segurança HTTP
- **CORS** - Cross-Origin Resource Sharing

### **Frontend**
- **Bootstrap** (v5.3.8) - Framework CSS
- **JavaScript** (ES6+) - Lógica do cliente
- **EJS** - Templates server-side
- **CSS3** - Estilização personalizada

### **Banco de Dados**
- **MySQL** - Desenvolvimento e produção
- **PostgreSQL** - Ambiente de testes
- **MariaDB** - Suporte adicional

### **Ferramentas de Desenvolvimento**
- **Nodemon** - Auto-reload em desenvolvimento
- **ESLint** - Análise de código
- **Jest** - Testes unitários
- **Cypress** - Testes end-to-end
- **PM2** - Gerenciador de processos

## 📋 **Pré-requisitos**

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 22.5.0 ou superior)
- **npm** (gerenciador de pacotes)
- **MySQL** ou **PostgreSQL** (banco de dados)
- **Git** (controle de versão)

### **Instalação do Node.js**
```bash
# Windows (usando Chocolatey)
choco install nodejs

# macOS (usando Homebrew)
brew install node

# Linux (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## 🚀 **Instalação**

### **1. Clone o repositório**
```bash
git clone https://github.com/seu-usuario/IFVest.git
cd IFVest
```

### **2. Instale as dependências**
```bash
npm install
```

### **3. Instale o Nodemon globalmente**
```bash
npm install -g nodemon
```

### **4. Configure o banco de dados**
```bash
# Criar banco de dados
npx sequelize db:create

# Executar migrações
npx sequelize db:migrate

# Popular com dados iniciais
npx sequelize db:seed:all
```

### **5. Inicie a aplicação**
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## ⚙️ **Configuração**

### **Configuração do Banco de Dados**

Edite o arquivo `config/config.json` com suas credenciais:

```json
{
  "development": {
    "username": "seu_usuario",
    "password": "sua_senha",
    "database": "ifvest_mysql",
    "host": "localhost",
    "dialect": "mysql",
    "port": "3306"
  }
}
```

## 🎮 **Uso**

### **Acesso à Aplicação**
- **URL**: `http://localhost:3000`
- **Porta padrão**: 3000

### **Scripts Disponíveis**

```bash
# Desenvolvimento com auto-reload
npm run dev

# Produção
npm start

# Criar banco e popular com dados
npm run db:create

# Deploy (instalar dependências e migrar)
npm run deploy
```

### **Comandos do Sequelize**

```bash
# Criar migração
npx sequelize migration:generate --name nome-da-migracao

# Executar migrações
npx sequelize db:migrate

# Reverter migração
npx sequelize db:migrate:undo

# Criar seeder
npx sequelize seed:generate --name nome-do-seeder

# Executar seeders
npx sequelize db:seed:all
```

## 📁 **Estrutura do Projeto**

```
IFVest/
├── 📁 auth/                    # Autenticação e autorização
├── 📁 config/                  # Configurações do banco
├── 📁 domains/                 # Módulos de domínio
│   ├── 📁 revisao/          # Sistema de revisão
│   ├── 📁 simulados/         # Sistema de simulados
│   └── 📁 shared/            # Componentes compartilhados
├── 📁 middleware/             # Middlewares customizados
├── 📁 models/                 # Modelos Sequelize
├── 📁 modules/               # Módulos utilitários
├── 📁 routes/                # Rotas principais
├── 📁 utils/                 # Utilitários gerais
├── 📁 views/                 # Templates EJS
├── 📁 public/                # Assets estáticos
├── 📁 migrations/            # Migrações do banco
├── 📁 seeders/               # Dados iniciais
├── 📄 index.js               # Ponto de entrada
└── 📄 package.json           # Dependências
```

### **Arquitetura Modular**

O projeto utiliza uma arquitetura baseada em domínios:

- **`domains/simulados/`**: Sistema completo de simulados
- **`domains/revisao/`**: Sistema de revisão de conteúdos
- **`domains/shared/`**: Componentes compartilhados

## 🔌 **API**

### **Endpoints Principais**

#### **Autenticação**
```
POST /usuario/login          # Login
POST /usuario/cadastro       # Cadastro
GET  /usuario/logout         # Logout
```

#### **Simulados**
```
GET  /simulados/                    # Lista simulados
GET  /simulados/criar-simulado      # Formulário de criação
POST /simulados/criar-simulado      # Criar simulado
GET  /simulados/:id/fazer          # Executar simulado
POST /simulados/responder-prova/:id # Submeter respostas
GET  /simulados/:id/gabarito       # Visualizar gabarito
```

#### **Questões**
```
GET  /simulados/questoes            # Lista questões
GET  /simulados/registrar-questao/:tipo # Formulário de criação
POST /simulados/registrar-questao/:tipo # Criar questão
```

#### **Revisão**
```
GET  /revisao/                     # Lista materiais
GET  /revisao/criar-material       # Formulário de criação
POST /revisao/criar-material       # Criar material
```

### **Modelos de Dados**

#### **Usuario**
```javascript
{
  id_usuario: Integer,
  nome: String,
  usuario: String,
  email: String,
  tipo_perfil: String, // 'USUARIO' | 'PROFESSOR'
  imagem_perfil: String
}
```

#### **Simulado**
```javascript
{
  id_simulado: Integer,
  titulo: String,
  descricao: Text,
  tipo: Enum, // 'OBJETIVO' | 'DISSERTATIVO' | 'ALEATORIO'
  id_usuario: Integer
}
```

#### **Questao**
```javascript
{
  id_questao: Integer,
  titulo: String,
  pergunta: Text,
  tipo: Enum, // 'OBJETIVA' | 'DISSERTATIVA'
  id_usuario: Integer,
  id_area: Integer
}
```

## 🤝 **Contribuição**

Contribuições são sempre bem-vindas! Para contribuir:

### **1. Fork o projeto**
```bash
git fork https://github.com/seu-usuario/IFVest.git
```

### **2. Crie uma branch para sua feature**
```bash
git checkout -b feature/nova-funcionalidade
```

### **3. Commit suas mudanças**
```bash
git commit -m "Adiciona nova funcionalidade"
```

### **4. Push para a branch**
```bash
git push origin feature/nova-funcionalidade
```

### **5. Abra um Pull Request**

### **Padrões de Código**
- Use ESLint para manter consistência
- Escreva testes para novas funcionalidades (ainda estudando sobre)
- Documente mudanças importantes
- Siga as convenções de nomenclatura do projeto

## 📝 **Licença**

...

## 📞 **Suporte**

Para suporte e dúvidas:

- **Email**: joaopedrov0.dev@gmail.com
- **Issues**: [GitHub Issues](https://github.com/seu-usuario/IFVest/issues)

---

## 🎯 **Roadmap**

### **Próximas Funcionalidades**

#### Geral

- [ ] Escolher licença
- [ ] Integrar módulo de Flashcards
- [ ] Integrar módulo de Quiz
- [ ] Implementar a autenticação do Google com [Firebase](https://firebase.google.com/docs/auth?hl=pt-br)

#### Usabilidade

- [ ] Permitir editar a foto antes de enviar pra saber exatamente como ela será mostrada e evitar distorção
- [ ] Melhorar o perfil de usuário

#### Módulo de Simulados

- [ ] Melhorar geração de PDFs

#### Módulo de Revisão de Conteúdo

- [ ] Coletar informações de tráfego e acesso aos materiais pra saber a relevância deles
- [ ] Exibir em ordem de relevância e com um limitador pra não puxar todos sempre, e ter um sistema de paginação
- [ ] Permitir filtrar materiais na busca
- [ ] Buscar materiais por palavra chave
- [ ] Buscar materiais usando [Elastic Search](https://www.elastic.co/)
- referências de links externos do markdown

#### Futuro distante
- [ ] Sistema de notificações
- [ ] Análise de desempenho avançada
- [ ] Integração com APIs externas (enem.dev)
- [ ] App mobile
- [ ] Sistema de gamificação
- [ ] Módulo de redações

### **Melhorias Técnicas**
- [ ] Implementação de cache Redis
- [ ] Otimização de consultas
- [ ] CI/CD pipeline
- [ ] Monitoramento de performance
- [ ] Testes automatizados
- [ ] Implementação do front-end com React

---

**Desenvolvido com ❤️ para a educação brasileira** 🇧🇷
