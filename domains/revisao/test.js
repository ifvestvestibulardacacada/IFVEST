const leitura = require('./controllers/leitura')

const req = {
    session: {
        nomeUsuario: "Emma Ayers",
        perfil: "PROFESSOR",
        imagemPerfil: ""
    },
    params: {
        id_conteudo: 49
    }
}
const res = {
    render: (view, params) => {
        console.log("Renderizando página")
    }
}

(async () => {
    await leitura(req, res)
})()
