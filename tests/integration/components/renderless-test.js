import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled, clearRender } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

import Service, { inject as service } from '@ember/service';
import { LifeCycleComponent } from 'ember-lifecycle-component';

module('Integration | Component | renderless', function (hooks) {
  setupRenderingTest(hooks);

  test('lifecycles', async function (assert) {
    assert.expect(7);

    this.owner.register(
      'component:foo',
      class Foo extends LifeCycleComponent {
        constructor(...args) {
          super(...args);

          assert.equal(this.args.foo, 2, 'constructor receives args');
        }

        didReceiveArgs(previousArgs, nextArgs) {
          assert.equal(previousArgs.foo, 2, 'previous args');
          assert.equal(nextArgs.foo, 3, 'next args');
          assert.equal(this.args.foo, 3, 'next args');
          assert.equal(this.args, nextArgs, 'this args are nextArgs');
        }

        didUpdate() {
          assert.equal(this.args.foo, 3, 'didUpdate');
        }

        willDestroy() {
          assert.ok(true, 'willDestroy');
        }
      }
    );

    this.setProperties({ foo: 2 });

    await render(hbs`<Foo @foo={{this.foo}} />`);

    this.setProperties({ foo: 3 });

    await settled();
    await clearRender();
  });

  test('injection', async function (assert) {
    assert.expect(1);

    this.owner.register(
      'service:bar',
      class extends Service {
        bar = 2;
      }
    );

    this.owner.register(
      'component:foo',
      class Foo extends LifeCycleComponent {
        @service bar;

        constructor(...args) {
          super(...args);

          assert.equal(this.bar.bar, 2, 'Service value accessible');
        }
      }
    );

    await render(hbs`<Foo />`);
  });
});
