import { getAutoLoadedTemplate, getAutoLoadedStyles } from './autoLoadTemplates'

type PropType = {
  type: StringConstructor | NumberConstructor | BooleanConstructor
  default?: string | number | boolean
}

type ComponentProps = Record<string, PropType>

type ComponentConfig = {
  props?: ComponentProps
  html?: string
  css?: string
  template?: (props: Record<string, string>) => string
  styles?: string
  onMount?: (el: HTMLElement) => void
  onDestroy?: (el: HTMLElement) => void
}

function applyTemplate(template: string, props: Record<string, string>): string {
  return template.replace(/\{\{(.*?)\}\}/g, (_, key) => props[key.trim()] ?? '')
}

export function defineComponent(name: string, config: ComponentConfig) {
  console.log(`[Purch] Defining component: ${name}`, config)

  class PurchComponent extends HTMLElement {
    static get observedAttributes() {
      const attrs = Object.keys(config.props || {})
      console.log(`[Purch] Observed attributes for ${name}:`, attrs)
      return attrs
    }

    private props: Record<string, string> = {}
    private shadow: ShadowRoot
    private templateStr: string = ''
    private stylesStr: string = ''

    constructor() {
      super()
      console.log(`[Purch] Constructing component: ${name}`)
      this.shadow = this.attachShadow({ mode: 'open' })
      this.loadResources()
    }

    private async loadResources() {
      console.log(`[Purch] Loading resources for ${name}`)
      const id = config.html || name
      console.log(`[Purch] Template ID: ${id}`)
      
      try {
        this.templateStr = await getAutoLoadedTemplate(`${id}/${id}.html`) || ''
      } catch (e) {
        console.log(`[Purch] Failed to load template for ${name}:`, e)
        this.templateStr = ''
      }
      
      console.log(`[Purch] Loaded template for ${name}:`, this.templateStr)
      
      try {
        this.stylesStr = await getAutoLoadedStyles(`${id}/${id}.css`) || ''
      } catch (e) {
        console.log(`[Purch] Failed to load styles for ${name}:`, e)
        this.stylesStr = ''
      }
      
      console.log(`[Purch] Loaded styles for ${name}:`, this.stylesStr)
      
      this.render()
    }

    connectedCallback() {
      console.log(`[Purch] Component connected: ${name}`)
      // Set default values for props
      if (config.props) {
        Object.entries(config.props).forEach(([key, prop]) => {
          if (prop.default !== undefined && !this.hasAttribute(key)) {
            console.log(`[Purch] Setting default value for ${key}:`, prop.default)
            this.setAttribute(key, String(prop.default))
          }
        })
      }
      config.onMount?.(this)
    }

    disconnectedCallback() {
      console.log(`[Purch] Component disconnected: ${name}`)
      config.onDestroy?.(this)
    }

    attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
      console.log(`[Purch] Attribute changed for ${name}:`, attrName, oldVal, newVal)
      if (oldVal !== newVal) {
        this.props[attrName] = newVal
        this.render()
      }
    }

    private render() {
      console.log(`[Purch] Rendering component: ${name}`)
      // Get latest attribute values
      const props = Object.keys(config.props || {})
      props.forEach((prop) => {
        this.props[prop] = this.getAttribute(prop) || ''
      })
      console.log(`[Purch] Current props for ${name}:`, this.props)

      const html = applyTemplate(this.templateStr, this.props)
      const styleTag = this.stylesStr ? `<style>${this.stylesStr}</style>` : ''
      console.log(`[Purch] Final HTML for ${name}:`, `${styleTag}${html}`)

      this.shadow.innerHTML = `${styleTag}${html}`
    }
  }

  customElements.define(name, PurchComponent)
  console.log(`[Purch] Component registered: ${name}`)
}
