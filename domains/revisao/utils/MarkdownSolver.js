const MarkdownIt = require('markdown-it')
const katex = require('katex')
const fs = require('fs');
const path = require('path');
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
  static getViteAssets() {
  const manifestConfigs = [
    {
      manifestPath: path.join(__dirname, '..', '..', '..', 'editor_markdown', 'dist', '.vite', 'manifest.json'),
      entry: 'src/main.jsx',
    
    },
    {
      manifestPath: path.join(__dirname, '..', '..', '..', 'editor_links', 'dist', '.vite', 'manifest.json'),
      entry: 'src/App.jsx',
    
    }
  ];

  const jsPath = [];
  const cssPaths = [];

  for (const { manifestPath, entry } of manifestConfigs) {
    try {
      // Check if manifest file exists
      if (!fs.existsSync(manifestPath)) {
        throw new Error(`Manifest file not found at ${manifestPath}`);
      }

      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

      const entryData = manifest[entry];
      if (!entryData) {
        throw new Error(`Entry ${entry} not found in manifest at ${manifestPath}. Available entries: ${Object.keys(manifest).join(', ')}`);
      }

      // Add JS path
      jsPath.push(`/${entryData.file}`);

      // Add CSS paths
      if (entryData.css) {
        cssPaths.push(...entryData.css.map(css => `/${css}`));
      }
    } catch (error) {
      console.error('Error processing Vite manifest:', error.message);
      // Skip adding paths for failed manifests
    }
  }

  return { jsPath, cssPaths };
}

  static Editor = () => { }
}

module.exports = MarkdownSolver
