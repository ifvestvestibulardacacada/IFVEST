import symbolButtons from "./symbolButtons.js"
import Button from "../../core/entity/button.js"


/// Editor buttons ///////////////////////////////////////////////////////////////////////////
const equationInput = document.querySelector('#equation-input')
const equationPreview = document.querySelector('#equation-preview')
const insertBtn = document.querySelector('#insert-btn')
const clearBtn = document.querySelector('#clear-btn')

const editorCloseBtn = document.querySelector("#editor-close-btn")
const editorBox = document.querySelector('#editor-box')
const symbolsBox = document.querySelector("#symbols-box")
const symbolsBoxBtn = document.querySelector("#symbols-box-btn")
const editorContainer = document.querySelector(".editor-container")
let editorId;
// Sections elements /////////////////////////////////////////////////////////////////////////
// Main section
const section_1 = document.querySelector("#section-1")
const section_1_btn = document.querySelectorAll("#section-1 button")
const hiddenSection_1 = document.querySelector("#hidden-section-1")

// Constants Section
const constantsSection = document.querySelector("#constants-section")
const constantsSectionButtons = document.querySelectorAll("#constants-section button")
const hiddenConstantsSection = document.querySelector("#hidden-constants-section")

// Logical Section
const logicalSection = document.querySelector("#logical-section")
const logicalSectionButtons = document.querySelectorAll("#logical-section button")
const hiddenLogicalSection = document.querySelector("#hidden-logical-section")

// Arithmetic Comparison section
const comparisonSection = document.querySelector("#comparison-section")
const comparisonSectionButtons = document.querySelectorAll("#comparison-section button")
const hiddenComparisonSymbols = document.querySelector("#hidden-comparison-symbols")

const tipo = window.questionType || 'objetiva'; // Usa 'objetiva' como fallback
const editorButtons = [
    { id: 'editor-open-btn', editorId: '#editor-container' },
    ...(tipo === 'objetiva' ? [
        { id: 'editor-open-btnA', editorId: '#opcaoA' },
        { id: 'editor-open-btnB', editorId: '#opcaoB' },
        { id: 'editor-open-btnC', editorId: '#opcaoC' },
        { id: 'editor-open-btnD', editorId: '#opcaoD' },
        { id: 'editor-open-btnE', editorId: '#opcaoE' }
    ] : tipo === 'dissertativa' ? [
        { id: 'editor-open-btn-resposta', editorId: '#resposta' } // Apenas opção A para dissertativa, se necessário
    ] : [])
];

/// Editor event listeners ///////////////////////////////////////////////////////////////////
equationInput.addEventListener('keyup', () => {
    equationInput.value = equationInput.value.replaceAll('*', '⋅')
    equationPreview.innerHTML = `\\(${equationInput.value}\\)`
    // MathJax.Hub.Typeset()
    katex.render(equationInput.value, equationPreview, { throwOnError: false })

    equationInput.focus();

    // MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
})

clearBtn.addEventListener('click', () => {
    equationPreview.innerHTML = equationInput.value = '';
    equationInput.focus();

})

symbolsBoxBtn.addEventListener('click', () => {
    symbolsBox.classList.toggle('hide');
})
editorCloseBtn.addEventListener('click', () => {
    editorBox.classList.add('hide');
    symbolsBox.classList.add('hide');
    document.getElementById('overlay').style.display = 'none';
})

editorButtons.forEach(({ id, editorId: targetEditorId }) => {
    const button = document.querySelector(`#${id}`);
    if (button) {
        button.addEventListener('click', () => {
            editorId = targetEditorId;
            editorBox.classList.remove('hide');
            symbolsBox.classList.remove('hide');
            equationInput.focus();
            document.getElementById('overlay').style.display = 'block';
            equationPreview.innerHTML = equationInput.value = '';
        });
    }
});
/// Sections event listeners //////////////////////////////////////////////////////////////////
section_1_btn.forEach(element => {
    element.addEventListener('mouseover', () => {
        hiddenSection_1.classList.remove('hide')
    })
})
section_1_btn.forEach(element => {
    element.addEventListener('mouseout', () => {
        hiddenSection_1.classList.add('hide')
    })
})
section_1.addEventListener('mouseover', () => {
    hiddenSection_1.classList.remove('hide')
})
section_1.addEventListener('mouseout', () => {
    hiddenSection_1.classList.add('hide')
})
constantsSectionButtons.forEach(element => {
    element.addEventListener('mouseover', () => {
        hiddenConstantsSection.classList.remove('hide')
    })
})
constantsSectionButtons.forEach(element => {
    element.addEventListener('mouseout', () => {
        hiddenConstantsSection.classList.add('hide')
    })
})
constantsSection.addEventListener('mouseover', () => {
    hiddenConstantsSection.classList.remove('hide')
})
constantsSection.addEventListener('mouseout', () => {
    hiddenConstantsSection.classList.add('hide')
})
logicalSectionButtons.forEach(element => {
    element.addEventListener('mouseover', () => {
        hiddenLogicalSection.classList.remove('hide')
    })
})
logicalSectionButtons.forEach(element => {
    element.addEventListener('mouseout', () => {
        hiddenLogicalSection.classList.add('hide')
    })
})
logicalSection.addEventListener('mouseover', () => {
    hiddenLogicalSection.classList.remove('hide')
})
logicalSection.addEventListener('mouseout', () => {
    hiddenLogicalSection.classList.add('hide')
})
comparisonSectionButtons.forEach(element => {
    element.addEventListener('mouseover', () => {
        hiddenComparisonSymbols.classList.remove('hide')
    })
})
comparisonSectionButtons.forEach(element => {
    element.addEventListener('mouseout', () => {
        hiddenComparisonSymbols.classList.add('hide')
    })
})
comparisonSection.addEventListener('mouseover', () => {
    hiddenComparisonSymbols.classList.remove('hide')
})
comparisonSection.addEventListener('mouseout', () => {
    hiddenComparisonSymbols.classList.add('hide')
})

insertBtn.addEventListener('click', () => {

    let editor = acessarEditorPorId(editorId)
    var latex = equationInput.value;
    var range = editor.getSelection(true);
    editor.insertEmbed(range.index, 'formula', latex, Quill.sources.USER);
    editor.setSelection(range.index + 1, Quill.sources.SILENT);
    symbolsBox.classList.add('hide');
    editorContainer.classList.add('hide');
    document.getElementById('overlay').style.display = 'none';
});

symbolButtons.forEach(element => {

    let button = new Button();

    button.setButton(element.button)
    button.setValue(element.value)

    element.button.addEventListener('click', () => {
        let start_position = equationInput.selectionStart;
        let end_position = equationInput.selectionEnd;

        equationInput.value = `${equationInput.value.substring(0, start_position)}${element.value}${equationInput.value.substring(end_position, equationInput.value.length)}`
        equationInput.focus()
        equationPreview.innerHTML = `\\(${equationInput.value}\\)`
        katex.render(equationInput.value, equationPreview, { throwOnError: false })
        // MathJax.Hub.Typeset()
    })
})

