cyto-chromosome-vis
===============

Interactive Chromosome visualization using D3.js

[![npm version](https://badge.fury.io/js/cyto-chromosome-vis.svg?style=flat)](http://badge.fury.io/js/cyto-chromosome-vis)

Documentation: [project page](http://linjoey.github.io/cyto-chromosome-vis)

## Basics:

HTML



```
<script src="./dist/build/cyto-chromosome.js"></script>
<link href="css/cyto-chromosome.style.css" rel="stylesheet"  type="text/css"/>
<svg id="chr13"></svg>
```

JS

```
var Chromosome = require('cyto-chromosome-vis');
   var ch13 = new Chromosome({
       segment: "13",
       target: "#chr13",
       width: 1000,
       selectionMode: "multi" //use shift-key to multi select
   }).draw();
```

## License

MIT

