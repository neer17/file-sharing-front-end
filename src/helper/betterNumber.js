export const betterNumber = (fileInBytes, inFormat = false) => {
    const kb = 1024
    const mb = kb * kb
    const gb = mb * mb
    let fileFormat = ''
    let betterFormat = 0

    if (fileInBytes < kb) {
        if (inFormat)
            return fileFormat = String(Math.round(fileInBytes / kb)).concat('KB')
        else
            return betterFormat = Math.round(fileInBytes / kb)
    }
    if (fileInBytes > kb) {
        if (inFormat)
            return fileFormat = String(Math.round(fileInBytes / kb)).concat('KB')
        else
            return betterFormat = Math.round(fileInBytes / kb)
    }
    if (fileInBytes > mb) {
        if (inFormat)
            return fileFormat = String(Math.round(fileInBytes / mb)).concat('MB')
        else
            return betterFormat = Math.round(fileInBytes / mb)
    }
    if (fileInBytes > gb) {
        if (inFormat)
            return fileFormat = String(Math.round(fileInBytes / gb)).concat('GB')
        else
            return betterFormat = Math.round(fileInBytes / gb)
    }
}