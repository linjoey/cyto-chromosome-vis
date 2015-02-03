cyto-chromosome-vis
===============

Interactive Chromosome visualization using D3.js

Documentation: [project page](http://linjoey.github.io/cyto-chromosome-vis)

## Basics:

HTML

```<svg id="chr13"></svg>
```

JS

```var Chromosome = require('Chromosome');
   var ch13 = new Chromosome({
       segment: "13",
       target: "#chr13",
       width: 1000
   }).draw();
```

## License

MIT

