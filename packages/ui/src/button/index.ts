import { App, Plugin } from 'vue';
import _Button from './button.vue';

type SFCWithInstall<T> = T & Plugin;

const withInstall = <T>(component: T): SFCWithInstall<T> => {
  const componentInstall = (app: App) => {
    const name = (component as any).name;
    app.component(name, component as SFCWithInstall<T>);
  };

  (component as SFCWithInstall<T>).install = componentInstall;

  return component as SFCWithInstall<T>;
}

export const Button = withInstall(_Button);
export default Button;
