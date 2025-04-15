export async function getAutoLoadedTemplate(componentName: string): Promise<string | undefined> {
  try {
    // Import HTML directly - let Vite handle it
    const templatePath = `/components/${componentName}/${componentName}.html`;
    console.log('[Purch Debug] Loading template from:', templatePath);
    
    const module = await import(/* @vite-ignore */ templatePath);
    if (!module.default) {
      console.warn('[Purch Debug] Template import returned empty:', templatePath);
      return undefined;
    }
    
    return module.default;
  } catch (e) {
    console.warn('[Purch Debug] Template load failed:', componentName, e);
    return undefined;
  }
}

export async function getAutoLoadedStyles(componentName: string): Promise<string | undefined> {
  try {
    // Use virtual module for CSS with the correct path structure
    const stylePath = `src/components/${componentName}/${componentName}.css`;
    const virtualId = `/@purch-style/${stylePath}.js`;
    console.log('[Purch Debug] Loading style from:', virtualId);
    
    const module = await import(/* @vite-ignore */ virtualId);
    if (!module.default) {
      console.warn('[Purch Debug] Style import returned empty:', virtualId);
      return undefined;
    }
    
    return module.default;
  } catch (e) {
    console.warn('[Purch Debug] Style load failed:', componentName, e);
    return undefined;
  }
}








