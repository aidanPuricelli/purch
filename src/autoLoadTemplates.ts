export async function getAutoLoadedTemplate(componentName: string): Promise<string | undefined> {
  try {
    // Remove the ./ prefix if it exists
    const cleanPath = componentName.startsWith('./') ? componentName.slice(2) : componentName
    // Remove any existing .html extension
    const basePath = cleanPath.replace(/\.html$/, '')
    // Use a relative path to look in the app's components directory
    const importPath = `/src/components/${basePath}.html`
    const template = await import(/* @vite-ignore */ importPath)
    return template.default
  } catch (e) {
    return undefined
  }
}

export async function getAutoLoadedStyles(componentName: string): Promise<string | undefined> {
  try {
    const cleanPath = componentName.startsWith('./') ? componentName.slice(2) : componentName
    const basePath = cleanPath.replace(/\.css$/, '')
    // Use a relative path to look in the app's components directory
    const importPath = `/src/components/${basePath}.css`
    const virtualId = `/@purch-style${importPath}`
    const styles = await import(/* @vite-ignore */ virtualId)

    if (!styles.default) {
      return undefined
    }

    return styles.default
  } catch (e) {
    return undefined
  }
}






