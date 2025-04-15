type PropType = {
    type: StringConstructor | NumberConstructor | BooleanConstructor;
    default?: string | number | boolean;
};
type ComponentProps = Record<string, PropType>;
type ComponentConfig = {
    props?: ComponentProps;
    html?: string;
    css?: string;
    template?: (props: Record<string, string>) => string;
    styles?: string;
    onMount?: (el: HTMLElement) => void;
    onDestroy?: (el: HTMLElement) => void;
};
export declare function defineComponent(name: string, config: ComponentConfig): void;
export {};
