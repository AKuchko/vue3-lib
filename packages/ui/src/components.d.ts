import * as components from './index';

declare module "@vue/runtime-core" {
  export interface GlobalComponents {
    akButton: typeof components.Button;
  }
};

export default {};
