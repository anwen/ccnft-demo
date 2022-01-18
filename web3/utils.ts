export function getBrief(astr) {
  if (!astr) return ""
  return astr.substring(0, 6) + "..." + astr.substr(astr.length - 4)
}
