import { Plugin, TransformResult } from 'vite'
import { readFileSync } from 'fs'
import { resolve, join, normalize } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Virtual module identifiers
const VIRTUAL_CSS_PREFIX = '/@purch-style/'
const VIRTUAL_MODULE_ID_PREFIX = '\0virtual:purch-css:'

export function purchPlugin(): Plugin {
  let appRoot = process.cwd()
  let projectRoot = appRoot

  // Helper to extract component name from path
  const getComponentName = (path: string): string => {
    const parts = path.split('/')
    const componentIndex = parts.indexOf('components')
    return componentIndex !== -1 ? parts[componentIndex + 1] : parts[0]
  }

  return {
    name: 'purch-plugin',
    enforce: 'pre',

    configResolved(config) {
      // Set projectRoot to the parent of src directory
      projectRoot = config.root ? dirname(config.root) : appRoot
      appRoot = dirname(projectRoot)
      console.log('[Purch Debug] Project root:', projectRoot)
      console.log('[Purch Debug] App root:', appRoot)
    },

    resolveId(id) {
      const [baseId, query] = id.split('?');
      if (baseId.startsWith(VIRTUAL_CSS_PREFIX)) {
        const relativePath = baseId.slice(VIRTUAL_CSS_PREFIX.length)
        const virtualId = VIRTUAL_MODULE_ID_PREFIX + relativePath + '.js'            
        console.log('[Purch Debug] resolveId →', id, '=>', virtualId);
        return virtualId;
      }
      return null;
    },

    load(id) {
      if (id.startsWith(VIRTUAL_MODULE_ID_PREFIX)) {
        const baseId = id.split('?')[0]
        const relativePath = baseId
          .slice('\0virtual:purch-css:'.length)
          .replace(/\.js$/, '') // remove the .js added earlier
      
        const fullPath = resolve(projectRoot, relativePath)
        const content = readFileSync(fullPath, 'utf-8')
        return `export default ${JSON.stringify(content)};`
      }
      return null
    },

    // Add transform hook to handle HTML and CSS imports
    transform(code, id) {
      // Handle HTML files
      if (id.endsWith('.html')) {
        const componentName = getComponentName(id)
        const fullPath = resolve(projectRoot, 'src/components', componentName, `${componentName}.html`)
        
        try {
          const content = readFileSync(fullPath, 'utf-8')
          return {
            code: `export default ${JSON.stringify(content)}`,
            map: null
          } as TransformResult
        } catch (err) {
          console.error('[Purch Debug] Failed to load HTML:', fullPath, err)
          return {
            code: `export default ${JSON.stringify(id)}`,
            map: null
          } as TransformResult
        }
      }
      
      // Handle CSS files
      if (id.endsWith('.css')) {
        const componentName = getComponentName(id)
        const cssPath = resolve(projectRoot, 'src/components', componentName, `${componentName}.css`)
        
        try {
          const content = readFileSync(cssPath, 'utf-8')
          return {
            code: `
              const style = document.createElement('style');
              style.setAttribute('data-component', '${componentName}');
              style.textContent = ${JSON.stringify(content)};
              document.head.appendChild(style);
              
              if (import.meta.hot) {
                import.meta.hot.accept((newModule) => {
                  const existingStyle = document.querySelector(\`style[data-component="${componentName}"]\`);
                  if (existingStyle) {
                    existingStyle.textContent = newModule.default;
                  }
                });
              }
              
              export default ${JSON.stringify(content)};
            `,
            map: null
          } as TransformResult
        } catch (err) {
          console.error('[Purch Debug] Failed to load CSS:', cssPath, err)
          return null
        }
      }
      
      return null
    }
  }
}
