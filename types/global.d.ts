// Types for compiled templates
declare module 'ember-lifecycle-component/templates/*' {
  import { TemplateFactory } from 'htmlbars-inline-precompile';
  const tmpl: TemplateFactory;
  export default tmpl;
}

declare module '@ember/component' {
  export function setComponentManager<T>(managerId: string, baseClass: T): T;
  export function setComponentManager<T>(managerFactory: (owner: any) => {}, baseClass: T): T;
  export function capabilities(
    version: string,
    opts?: {
      destructor?: boolean;
      asyncLifecycleCallbacks?: boolean;
      updateHook?: boolean;
    }
  ): any;
}

