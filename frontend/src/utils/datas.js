export function interpretarData(valor) {
    let ano
    let mes
    let dia

    if (valor instanceof Date) {
        if (Number.isNaN(valor.getTime())) return null
        ano = valor.getUTCFullYear()
        mes = valor.getUTCMonth() + 1
        dia = valor.getUTCDate()
    } else if (typeof valor === 'string') {
        const normalizado = valor.trim()
        const correspondenciaIso = normalizado.match(/^(\d{4})-(\d{2})-(\d{2})(?:$|T)/)
        const correspondenciaBrasileira = normalizado.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/)

        if (correspondenciaIso) {
            [, ano, mes, dia] = correspondenciaIso
            ano = Number(ano)
            mes = Number(mes)
            dia = Number(dia)
        } else if (correspondenciaBrasileira) {
            [, dia, mes, ano] = correspondenciaBrasileira
            ano = Number(ano)
            mes = Number(mes)
            dia = Number(dia)
        } else {
            return null
        }
    } else {
        return null
    }

    const data = new Date(ano, mes - 1, dia, 12)
    if (data.getFullYear() !== ano || data.getMonth() !== mes - 1 || data.getDate() !== dia) return null
    return data
}

export function formatarData(valor) {
    const data = interpretarData(valor)
    return data ? data.toLocaleDateString('pt-BR') : 'Data inválida'
}
