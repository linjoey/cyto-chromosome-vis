(function(cyto_chr, QUnit, d3) {

  //assert.async()
  //
  //assert.deepEqual()
  //assert.notDeepEqual()
  //
  //assert.equal()
  //assert.notEqual()
  //
  //assert.ok()
  //assert.notOk()
  //
  //assert.expect()
  //
  //assert.throws(fn, msg)

  cyto_chr.modelLoader.setDataDir('../data/');

  QUnit.test("base test", function(assert){
    assert.ok(true, "passed");
  });

  // MODEL-LOADER
  QUnit.module("model-loader.js");
  QUnit.test("initialize model loader", function(assert) {
    assert.ok(cyto_chr.modelLoader, "modelLoader is defined");
  });
  QUnit.test("get & set data directory", function(assert) {
    cyto_chr.modelLoader.setDataDir('../data-dir');
    assert.equal(cyto_chr.modelLoader.getDataDir(), "../data-dir", 'setter/ getter passed');
    cyto_chr.modelLoader.setDataDir('../data/');
  });
  QUnit.test("load some chromosome data", function(assert) {
    var as1 = assert.async();
    cyto_chr.modelLoader.load('1','550',function(d){
      assert.ok(d.length > 0, "some data retrieved");
      as1();
    });

    var as2 = assert.async();
    cyto_chr.modelLoader.load('2','550',function(d){
      assert.ok(d.length > 0, "retrieved chr2 data");
      as2();
    });

    var as3 = assert.async();
    cyto_chr.modelLoader.load('X','850',function(d){
      assert.ok(d.length > 0, "retrieved different resolution data");
      as3();
    });

    // CHROMOSOME
    QUnit.module("chromosome.js");
    QUnit.test("initialize chromosome object", function(assert){
      assert.ok(cyto_chr.chromosome, "chromosome constructor defined");
    });

    QUnit.test("create new chromosome", function(assert){

      var c = cyto_chr.chromosome();
      function checkpros(o) {
        if(o['_segment'] && o['_domTarget']) {
          return true;
        } else {
          return false;
        }
      }
      assert.ok(c && (typeof c === 'object') && checkpros(c), "chromosome constructor returned chromosome object");
    });
    QUnit.test("chromosome configuration", function(assert){

      var c = cyto_chr.chromosome()
        .config('segment', '5');
      assert.equal(c.segment(),'5', "configured segment");

      c.config('resolution', 400);
      assert.equal(c.resolution(),'400', "configured resolution");

      c.showAxis(true);
      assert.equal(c.showAxis(), true, "configured showAxis");
      //TODO test rest of configs
    });
  });


})(cyto_chr, QUnit, d3);