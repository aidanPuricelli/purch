export async function getAutoLoadedTemplate(componentName: string): Promise<string | undefined> {
  try {
    const cleanPath = componentName.startsWith('./') ? componentName.slice(2) : componentName;
    const basePath = cleanPath.replace(/\.html$/, '');

    // 🔧 Split path to avoid esbuild inlining
    const root = '/src/components/';
    const importPath = `${root}${basePath}.html`;

    const template = await import(/* @vite-ignore */ importPath);
    console.log('[Purch ⛓️ Dynamic HTML import attempted]:', importPath);
    return template.default;
  } catch (e) {
    return undefined;
  }
}

export async function getAutoLoadedStyles(componentName: string): Promise<string | undefined> {
  try {
    const cleanPath = componentName.startsWith('./') ? componentName.slice(2) : componentName;
    const basePath = cleanPath.replace(/\.css$/, '');

    // 🔧 Split path to avoid esbuild inlining
    const root = '/src/components/';
    const importPath = `${root}${basePath}.css`;
    const virtualId = `/@purch-style${importPath}`;

    const styles = await import(/* @vite-ignore */ virtualId);
    console.log('[Purch ⛓️ Dynamic STYLE import attempted]:', virtualId);


    if (!styles.default) {
      return undefined;
    }

    return styles.default;
  } catch (e) {
    return undefined;
  }
}







