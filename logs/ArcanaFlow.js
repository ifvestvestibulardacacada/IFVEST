// ArcanaFlow.js
'use strict';

const {
  colorize, red, green, yellow, blue, magenta, cyan, white, bold, underline
} = require('./color.js');

const getCallerInfo = require('./CallerInfo.js');
const path = require('path')


class ArcanaFlow {

    

    constructor(active = true) {
        this.config = { // Configuração default com tudo habilitado
            flag: true,
            time: true,
            file: true,
            line: true,
            entity: true,
            message: true
        }
        this.active = active;
        this.entities = {}; // Par nome: cor

        this.color_function = {
            "red": red,
            "green": green,
            "yellow": yellow,
            "blue": blue,
            "magenta": magenta,
            "cyan": cyan,
            "white": white,
        }
    
        this.style_text = {
            "bold": bold,
            "underline": underline
        }
    
        this.flag_color_config = {
            "ACTION": "blue",
            "ERROR": "red",
            "NONE": "white",
            "WARNING": "yellow"
        }
    
        this.general_color_config = {
            "time": "green",
            "file": "cyan",
            "line": "cyan",
            "entity": "magenta",
            "message": "white",
            "custom": "green"
        }
    
        this.general_size_config = {
            "flag": 10,
            "time": 10,
            "file": 15,
            "line": 7,
            "entity": 15,
            "message": 30,
            "custom": 20
        }
    }

    // Singleton settings
    setConfig(config, value){
            this.config[config] = value
        }
    setActive(active){
        this.active = active;
    }
    addEntity(name, color){
        this.entities[name] = color;
    }

    // Render methods
    fixBlankSpace(text, value){
        text = String(text)
        if (text.length > value){
            return text.slice(0, value - 3) + "..."    
        }
        return text.padEnd(value, ' ')
    }

    paint(text, kind){
        if (kind == "flag"){
            return this.color_function[this.flag_color_config[text.trim()]](text)
        }
        if (kind == "entity"){
            return this.entities[text.trim()] ? this.color_function[this.entities[text.trim()]](text) : this.color_function[this.general_color_config[kind]](text)
        }
        return this.color_function[this.general_color_config[kind]](text)
    }

    format(text, kind){
        text = this.fixBlankSpace(text, this.general_size_config[kind])
        text = this.paint(text, kind)
        return text
    }

    loadHeader(){
        if (this.active == false){
            return
        }
        let temp = ""
        for (let key in this.config){
            if (this.config[key]){
                temp += this.fixBlankSpace(key, this.general_size_config[key])
            }
        }
        console.log(temp)
    }

    // Functional methods
    action(entity=null, message=null){
        let flag = "ACTION"
        this.out(flag=flag, entity=entity, message=message)
    }
    error(entity=null, message=null){
        let flag = "ERROR"
        this.out(flag=flag, entity=entity, message=message)
    }
    warning(entity=null, message=null){
        let flag = "WARNING"
        this.out(flag=flag, entity=entity, message=message)
    }


    out(flag=null, entity=null, message=null, custom=null){
        // Verifica se está ativo
        // console.log(getCallerInfo())
        if (this.active){
            let prepare_output = ""

            if (this.config.flag){
                // prepare_output += this.paint(this.fixBlankSpace(flag, this.general_size_config["flag"]), "flag")
                prepare_output += this.format(flag, "flag")
            }

            if (this.config.time){
                let now = new Date()
                let now_str = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
                prepare_output += this.format(now_str, "time")
            }
            if (this.config.file){
                prepare_output += this.format(path.basename(getCallerInfo().file), "file")
            }
            if (this.config.line){
                prepare_output += this.format(path.basename(getCallerInfo().line.toString()), "line")
            }
            if (this.config.entity){
                prepare_output += this.format(entity, "entity")
            }
            if (custom){
            }
            if (this.config.message){
                prepare_output += this.format(message, "message")
            }
            console.log(prepare_output)
        } 
    }
}

const instance = new ArcanaFlow()

// Exporta o objeto pronto
module.exports = instance