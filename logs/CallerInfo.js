/**
 * Obtém informações do local (arquivo, linha) de onde a função foi chamada.
 * Usa a API V8 Stack Trace para uma abordagem robusta e eficiente.
 * @returns {{file: string, line: number, column: number, functionName: string}|null}
 */
function getCallerInfo() {
    const originalPrepareStackTrace = Error.prepareStackTrace;
    let callerInfo = null;

    try {
        // Sobrescrevemos temporariamente o prepareStackTrace
        Error.prepareStackTrace = (err, stack) => stack;

        const err = new Error();

        // captureStackTrace otimiza a captura e nos ajuda a pular frames
        // O segundo argumento é a função que queremos "esconder" da pilha
        Error.captureStackTrace(err, getCallerInfo);

        // ! Testando a função pra ver aonde ela ta na stack
        // console.log(err.stack.forEach((val) => {
        //     console.log(val.getFileName())
        // }))

        // Agora, err.stack é um array de objetos CallSite, não uma string!
        const callSite = err.stack[2];

        if (callSite) {
            callerInfo = {
                file: callSite.getFileName() || 'unknown',
                line: callSite.getLineNumber(),
                column: callSite.getColumnNumber(),
                functionName: callSite.getFunctionName() || 'anonymous',
            };
        }
    } catch (e) {
        // Em caso de qualquer erro, não quebramos a aplicação
    } finally {
        // ESSENCIAL: Restaura a função original para não afetar outros códigos
        Error.prepareStackTrace = originalPrepareStackTrace;
    }

    return callerInfo;
}

module.exports = getCallerInfo;