function toSafeString(obj, string) {
    const escapeRegExp = (str) => {
        return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    }

    let str = string

    Object.keys(obj).forEach((e) => {
        str = str.replace(
            new RegExp(`${escapeRegExp(obj[e])}`, "g"),
            "*".repeat(5)
        )
    })
    return str
}

module.exports = toSafeString
