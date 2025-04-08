export function html(strings: TemplateStringsArray, ...values: any[]): string {
    return strings.reduce((result, str, i) => result + str + (values[i] ?? ''), '')
}
  