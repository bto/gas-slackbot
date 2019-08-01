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
    Class.extend(Child, Parent, {
      foo: 'bar',
      f1: function f1() {
        this.bar = 'baz';
        Child._super(arguments).call(this);
      }
    });

    var pObj = new Parent();
    assert.equal(pObj.foo, 'foo', 'has a valid value');
    assert.equal(pObj.bar, 'foo', 'has a valid value');
    pObj.f1();
    assert.equal(pObj.foo, 'baz', 'has a valid value');
    assert.equal(pObj.bar, 'foo', 'has a valid value');

    var cObj = new Child();
    assert.equal(cObj.foo, 'bar', 'has a valid value');
    assert.equal(cObj.bar, 'foo', 'has a valid value');
    cObj.f1();
    assert.equal(cObj.foo, 'baz', 'has a valid value');
    assert.equal(cObj.bar, 'baz', 'has a valid value');
  });
});
