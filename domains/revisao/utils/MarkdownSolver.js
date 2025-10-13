const MarkdownIt = require('markdown-it')
const katex = require('katex')

const md = new MarkdownIt()

class MarkdownSolver {
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
}

module.exports = MarkdownSolver
