const MarkdownIt = require('markdown-it')
const katex = require('markdown-it-katex')

const md = new MarkdownIt().use(katex)

class MarkdownSolver{
    static Render = (rawMarkdown) => {
        if (!rawMarkdown)
            return null
        return md.render(rawMarkdown)
    }
    
    static Editor = () => {}
}

module.exports = MarkdownSolver
