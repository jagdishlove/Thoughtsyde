import ReactDom from "react-dom/client";
import { Widget } from "./components/Widget";

export const normalizeAttribute = (attribute) => {
  return attribute.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
};

const widgetStyles = `
:host {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
  --radius: 0.5rem;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.widget-container {
  position: fixed;
  bottom: 16px;
  right: 16px;
  z-index: 99999;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  line-height: 1.5;
  color: hsl(var(--foreground));
}

.widget-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  color: white;
  border: none;
  border-radius: 9999px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 10px 25px rgba(99, 102, 241, 0.4);
  transition: all 0.3s ease;
  font-family: inherit;
}

.widget-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 15px 35px rgba(99, 102, 241, 0.5);
}

.widget-popover {
  position: absolute;
  bottom: 100%;
  right: 0;
  margin-bottom: 12px;
  width: 380px;
  max-width: calc(100vw - 32px);
  background: white;
  border-radius: 12px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  padding: 24px;
  border: 1px solid hsl(var(--border));
}

.widget-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: flex;
  gap: 16px;
}

.form-row > div {
  flex: 1;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 13px;
  font-weight: 500;
  color: hsl(var(--foreground));
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid hsl(var(--border));
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  background: white;
  color: hsl(var(--foreground));
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: hsl(var(--ring));
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.form-textarea {
  min-height: 120px;
  resize: none;
}

.star-rating {
  display: flex;
  justify-content: center;
  gap: 4px;
}

.star {
  width: 28px;
  height: 28px;
  cursor: pointer;
  transition: transform 0.2s, fill 0.2s;
}

.star:hover {
  transform: scale(1.15);
}

.star-filled {
  fill: #fbbf24;
  stroke: #f59e0b;
}

.star-empty {
  fill: white;
  stroke: hsl(var(--border));
}

.submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  font-family: inherit;
  margin: 0 auto;
}

.submit-btn:hover {
  background: #4338ca;
}

.thank-you {
  text-align: center;
  padding: 20px 0;
}

.thank-you h3 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 12px;
  color: hsl(var(--foreground));
}

.thank-you p {
  color: hsl(var(--muted-foreground));
  font-size: 14px;
  line-height: 1.6;
}

.icon {
  width: 20px;
  height: 20px;
}

.popover-enter {
  opacity: 0;
  transform: translateY(10px) scale(0.95);
}

.popover-enter-active {
  opacity: 1;
  transform: translateY(0) scale(1);
  transition: opacity 0.2s, transform 0.2s;
}
`;

class WidgetWebComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._isOpen = false;
  }

  connectedCallback() {
    const style = document.createElement("style");
    style.textContent = widgetStyles;
    this.shadowRoot.appendChild(style);

    const container = document.createElement("div");
    container.className = "widget-container";
    this.shadowRoot.appendChild(container);

    const props = this.getPropsFromAttributes();
    const root = ReactDom.createRoot(container);
    root.render(<Widget {...props} onOpenChange={(isOpen) => (this._isOpen = isOpen)} />);
  }

  getPropsFromAttributes() {
    const props = {};
    for (const { name, value } of this.attributes) {
      props[normalizeAttribute(name)] = value;
    }
    return props;
  }
}

export default WidgetWebComponent;
