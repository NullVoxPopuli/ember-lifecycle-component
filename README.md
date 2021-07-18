# ember-lifecycle-component

[![npm version](https://badge.fury.io/js/ember-lifecycle-component.svg)](https://badge.fury.io/js/ember-lifecycle-component)
[![CI](https://github.com/NullVoxPopuli/ember-lifecycle-component/actions/workflows/tests.yml/badge.svg?branch=master&event=push)](https://github.com/NullVoxPopuli/ember-lifecycle-component/actions/workflows/tests.yml)

For situations where you don't need a template.
- WebGL Integration
- Other DOM-less situations

The `LifeCycleComponent` has the same interface as `@glimmer/component`, but with some additional hooks.

**Generally, you do not need this. Nearly all side-effecting code can be represented as computed/tracked properties and regular getters while causing changes via the functions that would have started the side-effect anyway**.

All the hooks available for use are:

- constructor(owner, args)
- didReceiveArgs(prev, next)
- didUpdate()
- willDestroy()

## Installation

```
ember install ember-lifecycle-component
```


## Usage

[More examples here, in the tests](https://github.com/NullVoxPopuli/ember-lifecycle-component/blob/master/tests/integration/components/renderless-test.js)

```ts
import { LifeCycleComponent } from 'ember-lifecycle-component';

import THREE from 'three';

let geometry = new THREE.BoxGeometry( 2, 2, 2 );
let material = new THREE.MeshNormalMaterial();

export default class SceneBoxComponent extends LifeCycleComponent {
  constructor(owner, args) {
    super(owner, args);

    this.mesh = new THREE.Mesh(geometry, material);

    let { rx, ry, rz } = this.args;

    this.#updateRotation(rx, ry, rz);
    this.mesh.position.set(0, 0, 0);

    args.scene.add(this.mesh);
  }

  didUpdate() {
    let { rx, ry, rz } = this.args;
    this.#updateRotation({ rx, ry, rz });
  }

  willDestroy() {
    this.args.scene.remove(this.mesh);
  }

  #updateRotation({ rx, ry, rz }) {
    this.mesh.rotation.set(rx, ry, rz);
  }
}
```



## Compatibility

* See: config/ember-try.js


## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.


## License

This project is licensed under the [MIT License](LICENSE.md).
