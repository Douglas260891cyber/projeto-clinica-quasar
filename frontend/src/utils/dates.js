export function parseDateOnly(value) {
    let year
    let month
    let day

    if (value instanceof Date) {
        if (Number.isNaN(value.getTime())) return null
        year = value.getUTCFullYear()
        month = value.getUTCMonth() + 1
        day = value.getUTCDate()
    } else if (typeof value === 'string') {
        const normalized = value.trim()
        const isoMatch = normalized.match(/^(\d{4})-(\d{2})-(\d{2})(?:$|T)/)
        const brazilianMatch = normalized.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/)

        if (isoMatch) {
            [, year, month, day] = isoMatch
            year = Number(year)
            month = Number(month)
            day = Number(day)
        } else if (brazilianMatch) {
            [, day, month, year] = brazilianMatch
            year = Number(year)
            month = Number(month)
            day = Number(day)
        } else {
            return null
        }
    } else {
        return null
    }

    const date = new Date(year, month - 1, day, 12)
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null
    return date
}

export function formatDateOnly(value) {
    const date = parseDateOnly(value)
    return date ? date.toLocaleDateString('pt-BR') : 'Data inválida'
}
