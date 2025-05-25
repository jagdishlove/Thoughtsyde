import ReactDOM from "react-dom/client";
import { Widget } from "@/components/Widget";

// Fix typo: replace 'repl' with 'replace' and 'toUppercase' with 'toUpperCase'
export const normalizeAttribute = (attribute: string): string => {
  return attribute.replace(/-([a-z])/g, (_, letter: string) =>
    letter.toUpperCase()
  );
};

type Props = Record<string, string>;

class WidgetWebComponent extends HTMLElement {
  shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const props = this.getPropsFromAttributes();
    const root = ReactDOM.createRoot(this.shadow);
    root.render(<Widget {...props} />);
  }

  getPropsFromAttributes(): Props {
    const props: Props = {};
    for (const { name, value } of this.attributes) {
      props[normalizeAttribute(name)] = value;
    }
    return props;
  }
}

export default WidgetWebComponent;
