import { App, Plugin } from 'vue';
import * as components from './src';

const install = (app: App) => {
  for (const c in components) {
    app.use(components[c as keyof typeof components] as Plugin);
  }
}

export * from './src';
export default { install };
