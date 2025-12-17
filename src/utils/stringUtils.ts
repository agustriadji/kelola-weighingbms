/**
 * Convert display name to fullname format
 * Example: "Operator Pos Satu" -> "operator_pos_satu"
 */
export function nameToFullname(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
}

/**
 * Convert fullname to display name format
 * Example: "operator_pos_satu" -> "Operator Pos Satu"
 */
export function fullnameToName(fullname: string): string {
  return fullname
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}