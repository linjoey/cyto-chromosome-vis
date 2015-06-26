(function(){
  QUnit.module('model-loader.js');

  QUnit.test('model-loader: loaded', function(assert) {
    assert.ok(chr_map.modelLoader, "Initialized model-loader");
  });

  QUnit.test('model-loader: load default chromosome data', function (assert) {

    var d1 = assert.async();

    chr_map.modelLoader.setBaseDir('../data/');
    var a = chr_map.modelLoader.load("1", 400, function(d) {
      assert.ok(d.length > 0, "Some results returned");
      d1();
    });
  });
})();