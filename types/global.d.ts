// Types for compiled templates
declare module 'ember-lifecycle-component/templates/*' {
  import { TemplateFactory } from 'htmlbars-inline-precompile';
  const tmpl: TemplateFactory;
  export default tmpl;
}

