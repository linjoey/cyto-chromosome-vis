
(function (chr_map, d3) {

  var defaultDataURLs = {
    "400" : "ideogram_9606_GCF_000001305.14_400_V1",
    "550" : "ideogram_9606_GCF_000001305.14_550_V1",
    "850" : "ideogram_9606_GCF_000001305.14_850_V1",
    "1200" : "ideogram_9606_GCF_000001305.13_1200_v1"
  };

  var baseDir = 'data/';

  var dataCache = {
    "400" : [],
    "550" : [],
    "850" : [],
    "1200" : []
  };

  var cache = [];
  var loaded = false;

  function loadData(file, res, cb) {
    if (dataCache[res].length === 0) {
      console.log('network load')
      d3.tsv(file, function(d) {
        //dataCache[res] = d;
        cache = d;
        loaded = true;
        cb(d);
      });

    } else {
      cb(dataCache[res]);
    }
  }

  function getChromosomeData(chr, resolution, cb) {

    var fileName = defaultDataURLs[resolution];

    loadData(baseDir + fileName, resolution, function (d) {
      var filteredResults = filterByChromosome(d, chr);
      cb(filteredResults);
    });
  }

  function filterByChromosome(data, chr) {
    var newAry = [];
    for(var i = 0; i < data.length; i++) {
      if (data[i]['#chromosome'] === chr) {
        newAry.push(data[i]);
      }
    }
    return newAry;
  }

  chr_map.modelLoader = {
    load: getChromosomeData,
    setBaseDir: function(d) {baseDir = d;}
  };

})(window.chr_map = window.chr_map || {}, d3);