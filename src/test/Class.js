testRunner.functions.push(function t1(test) {
  test('Class.extend()', function t2(assert) {
    function Parent() {}
    Parent.prototype = {
      foo: 'foo',
      bar: 'foo',
      f1: function f1() {
        this.foo = 'baz';
      }
    };

    function Child() {}
    SlackBot.Class.extend(Child, Parent, {
      foo: 'bar',
      f1: function f1() {
        this.bar = 'baz';
        Child._super(this, arguments);
      }
    });

    var pObj = new Parent();
    assert.equal(pObj.foo, 'foo');
    assert.equal(pObj.bar, 'foo');
    pObj.f1();
    assert.equal(pObj.foo, 'baz');
    assert.equal(pObj.bar, 'foo');

    var cObj = new Child();
    assert.equal(cObj.foo, 'bar');
    assert.equal(cObj.bar, 'foo');
    cObj.f1();
    assert.equal(cObj.foo, 'baz');
    assert.equal(cObj.bar, 'baz');
  });
});
