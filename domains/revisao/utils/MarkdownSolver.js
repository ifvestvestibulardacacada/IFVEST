const MarkdownIt = require('markdown-it')
const katex = require('katex')

const md = new MarkdownIt()

class MarkdownSolver {

  static DELIMITER = '=====MARKDOWN_REFERENCE_DELIMITTER====='

  static Render = (rawMarkdown) => {
    if (!rawMarkdown) return null

    const formulas = []
    let placeholderMarkdown = rawMarkdown

    

    // Regex captura $...$, $$...$$, \(...\), \[...\]
    const latexRegex = /\$\$([^$]+)\$\$|\$([^$]+)\$|\\\(([^)]+)\\\)|\\\[([^\]]+)\\\]/g

    placeholderMarkdown = placeholderMarkdown.replace(latexRegex, (match, g1, g2, g3, g4) => {
      const expr = g1 || g2 || g3 || g4
      const displayMode = !!(g1 || g4) // $$...$$ ou \[...\] = displayMode
      let rendered = ''

      try {
        rendered = katex.renderToString(expr, { displayMode })
      } catch (err) {
        console.error("Erro KaTeX:", err)
        rendered = match // fallback
      }

      const index = formulas.length
      formulas.push(rendered)
      return `{{MATH_${index}}}`
    })


    // Agora renderiza o markdown SEM permitir html
    let html = md.render(placeholderMarkdown)

    // Substitui placeholders pelos HTML KaTeX
    formulas.forEach((formula, i) => {
      html = html.replace(`{{MATH_${i}}}`, formula)
    })

    return html
  }

  static Editor = () => {}

  static processReferences = (markdown) => {
    // Retorna o markdown puro com a lista de referências já no final do arquivo devidamente processada
    if (!markdown.includes(MarkdownSolver.DELIMITER))
      return markdown
    const parts = markdown.split(MarkdownSolver.DELIMITER)
    let referencesMD = "## Materiais Externos \n\n"
    let references = JSON.parse(parts[1] || "[]")
    references.forEach(ref => {
      referencesMD += MarkdownSolver.getMarkdownLink(ref.name, ref.link) + "\n\n"
    })
    return parts[0].trim() + "\n\n" + referencesMD.trim()
  }

  static mergeReference = (markdown, references) => {
    // Salva a lista de objetos de referência em formaro JSON no final do markdown
    if (markdown.includes(MarkdownSolver.DELIMITER))
      markdown.replaceAll(MarkdownSolver.DELIMITER, '')
    return markdown + MarkdownSolver.DELIMITER + JSON.stringify(references)
  }

  static getMarkdownLink = (name, link) => {
    // Normalize inputs
    const nm = (typeof name === 'string') ? name : String(name || '')
    const lk = (typeof link === 'string') ? link : String(link || '')

    // escape ']' in the link text
    const safeName = nm.replace(/\]/g, '\\]')

    // If there's no link, return only the text
    if (!lk) return safeName

    try {
      // remove nulls and trim
      let url = lk.replace(/\u0000/g, '').trim()
      // avoid literal '>' which would close the angle bracket
      url = url.replace(/>/g, '%3E')
      // encodeURI will percent-encode spaces and other unsafe characters
      url = encodeURI(url)
      // wrap in angle brackets to make markdown links safe when they contain
      // parentheses or spaces (they will already be encoded)
      return `[${safeName}](<${url}>)`
    } catch (e) {
      // fallback to simple form if encoding fails
      return `[${safeName}](${lk.replace(/>/g, '%3E')})`
    }
  }

  static getReferences = (markdown) => {
    // Retorna a lista de referências a partir do markdown salvo
    if (!markdown.includes(MarkdownSolver.DELIMITER))
      return []
    return JSON.parse(markdown.split(MarkdownSolver.DELIMITER)[1] || "[]")
  }

  static breakMarkdown = (markdown) => {
    // retorna um objeto com o markdown e as referências
    if (!markdown.includes(MarkdownSolver.DELIMITER))
      return { markdown, references: [] }
    const parts = markdown.split(MarkdownSolver.DELIMITER)
    return {
      markdown: parts[0].trim(),
      references: JSON.parse(parts[1] || "[]")
    }
  }
}

module.exports = MarkdownSolver
