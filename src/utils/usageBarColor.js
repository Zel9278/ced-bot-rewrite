function usageBarColor(percent, colors) {
    if(percent > 90) return colors.danger;
    if(percent > 75) return colors.attention;
    return colors.default;
}

module.exports = usageBarColor;
