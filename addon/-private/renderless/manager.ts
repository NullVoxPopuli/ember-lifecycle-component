// Inspiration
// https://github.com/glimmerjs/glimmer.js/blob/master/packages/%40glimmer/component/addon/-private/ember-component-manager.ts
// https://github.com/rwjblue/sparkles-component/blob/master/addon/component-managers/sparkles.ts

import Ember from 'ember';
import { set } from '@ember/object';
import { getOwner, setOwner } from '@ember/application';
import { capabilities } from '@ember/component';
import { schedule } from '@ember/runloop';

import BaseComponent, { setDestroyed, setDestroying } from './component';

export interface ComponentManagerArgs {
  named: object;
  positional: any[];
}

interface Constructor<T> {
  new (owner: unknown, args: {}): T;
}

export default class ComponentManager<Component extends BaseComponent> {
  capabilities = capabilities('3.13', {
    destructor: true,
    asyncLifecycleCallbacks: true,
    updateHook: true,
  });

  static create(attrs: {}) {
    let owner = getOwner(attrs);
    return new ComponentManager(owner);
  }

  constructor(owner: unknown) {
    setOwner(this, owner);
  }

  createComponent(Klass: Constructor<Component>, args: ComponentManagerArgs) {
    let instance = new Klass(getOwner(this), args.named);

    return instance;
  }

  didCreateComponent(_component: Component) {}

  updateComponent(component: Component, args: ComponentManagerArgs) {
    component.willUpdate(args.named);

    set(component, 'args', args.named);
  }

  didUpdateComponent(component: Component) {
    component.didUpdate();
  }

  destroyComponent(component: Component) {
    if (component.isDestroying) {
      return;
    }

    let meta = Ember.meta(component);

    meta.setSourceDestroying();
    setDestroying(component);

    schedule('actions', component, component.willDestroy);
    schedule('destroy', this, scheduledDestroyComponent, component, meta);
  }

  getContext(component: Component) {
    return component;
  }
}

function scheduledDestroyComponent(component: BaseComponent, meta) {
  if (component.isDestroyed) {
    return;
  }

  Ember.destroy(component);

  meta.setSourceDestroyed();
  setDestroyed(component);
}
