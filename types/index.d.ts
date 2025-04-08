export type PropType = {
  type: StringConstructor | NumberConstructor | BooleanConstructor
  default?: string | number | boolean
}

export type ComponentProps = Record<string, PropType>

export type ComponentConfig = {
  props?: ComponentProps
  html?: string
  css?: string
  template?: (props: Record<string, string>) => string
  styles?: string
  onMount?: (el: HTMLElement) => void
  onDestroy?: (el: HTMLElement) => void
}

export function defineComponent(name: string, config: ComponentConfig): void

declare module 'purch' {
  export function html(strings: TemplateStringsArray, ...values: any[]): string
  export function css(strings: TemplateStringsArray, ...values: any[]): string
} 