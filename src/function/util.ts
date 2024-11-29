export function truncate(value: string, length: number, ellipsis = '...') {
  return value.length > length ? value.slice(0, length).trim() + ellipsis : value.trim()
}

export function truncateFileName(fileName: string) {
  const [name, ext] = fileName.split('.')
  let [firstPart, secondPart] = [
    truncate(name.slice(0, name.length / 2), 32),
    truncate(
      name
        .slice(name.length / 2)
        .split('')
        .toReversed()
        .join(''),
      8,
      ''
    )
      .split('')
      .toReversed()
      .join(''),
  ]

  return firstPart + secondPart + '.' + ext
}

export function sortObjectByValue(obj: Record<string, number>) {
  return Object.fromEntries(Object.entries(obj).sort((a, b) => b[1] - a[1]))
}
