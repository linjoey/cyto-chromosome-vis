cyto-chromosome-vis
===============

Interactive Chromosome visualization using D3.js

[![npm version](https://badge.fury.io/js/cyto-chromosome-vis.svg?style=flat)](http://badge.fury.io/js/cyto-chromosome-vis)

Documentation: [project page](http://linjoey.github.io/cyto-chromosome-vis)

![](http://i.imgur.com/AufbUNe.gif)

This project uses D3.js to visualize chromosome bands using svg rect. The annotations are retrieved remotely from a specified DAS source.

## Basics:

HTML



```html
<script src="./dist/cyto-chromosome.min.js"></script>
<link href="css/cyto-chromosome.style.css" rel="stylesheet"  type="text/css"/>
<svg id="chr13"></svg>
```

JS

```javascript
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

