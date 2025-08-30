"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var Area_js_1 = require("../../../models/Area.js");
var Topico_js_1 = require("../../../models/Topico.js");
var ArcanaFlow_js_1 = require("../../../logs/ArcanaFlow.js");
exports.default = (function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var perfilUsuario, nomeUsuario, imagemPerfil, id_area, areaAtual, listaTopicos;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                /*
                Objetivo: Retornar uma página de busca de todos os tópicos de uma área específica
                Recebe: id_area da área correspondente
                Retorna: Página de busca de tópicos com a lista de todos os tópicos para renderizar
                */
                /*
                ! Fluxo esperado
                * Recebe a requisição e pega dados de login para exibição
                * Pega o nome e descrição da área escolhida
                * Pega o nome e ID de todos os tópicos pertencentes a área escolhida
                * Renderiza todos os tópicos como botões com nome e link usando o id do tópico, exibindo uma espécie de página representando a área em si, com título da área e subtítulo como descrição
                */
                ArcanaFlow_js_1.default.action('Revisão', 'Pediu buscar topico');
                res.locals.currentPage = "revisao";
                perfilUsuario = req.session.perfil;
                nomeUsuario = req.session.nomeUsuario;
                imagemPerfil = req.session.imagemPerfil;
                id_area = req.params.id_area;
                return [4 /*yield*/, Area_js_1.default.findByPk(id_area, {
                        attributes: ['id_area', 'nome', 'descricao'],
                        include: {
                            attributes: ['id_topico', 'nome'],
                            model: Topico_js_1.default,
                            as: 'Topico'
                        }
                    })];
            case 1:
                areaAtual = _a.sent();
                listaTopicos = areaAtual.Topico;
                res.render('moduloRevisao/buscarTopico', { area: areaAtual, listaTopicos: listaTopicos, nomeUsuario: nomeUsuario, perfilUsuario: perfilUsuario, imagemPerfil: imagemPerfil });
                return [2 /*return*/];
        }
    });
}); });
