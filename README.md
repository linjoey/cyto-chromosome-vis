# cyto-chromosome-vis

> Interactive visual representation/ web visualization tool for **chromosome** ideograms

This is a web component built with D3.js to render chromosome representations in SVG. Each chromosome has interactive features such as clicking a band, picking a specific cyto-location (base pair), or removing a specific selection. A convenient API is included to integrate user actions on the chromosomes with other js components. 

This can be used in plain JavaScript environments or with ***Angular.js*** (as a directive or a service).

### Demo
A demo is available here: http://linjoey.github.io/cyto-chromosome-vis/
![](ss-1.3.0.png)

### Basic Usage

1. Include D3 and the project source: `cyto-chromosome.min.js`

2. Create a target div to host the chromosome
```html
<div id="chrY"></div>
```
3. Instantiate a chromosome object.
```javascript
var chromosomeFactory = cyto_chr.chromosome;
var x = chromosomeFactory()
        .segment("X")
        .target('#chrX')
        .render();
```

### Angular environments
1. Include the module `cyto-chromosome-vis` as a project dependency
```javascript
angular.module('demoApp',['cyto-chromosome-vis'])
```

2. Simply use the directive `chromosome`
```html
<chromosome segment="X" width="1000" show-axis="true" use-relative="true" resolution="400"></chromosome>
```

3. If you require interacting with the chromosome instance from a controller, manually instantiate it with the service `chromosomeFactory`:

```html
<div id="chr3"></div>
```
```JavaScript
.controller('someController', function($scope, chromosomeFactory) {
                var c = chromosomeFactory.build()
                        .target("#chr3")
                        .segment(3)
                        .render();
                        
                    c.on('bandclick',...);
            })

```

Once a chromosome is drawn, `click` a band to add a selector, `shift-click` to add multiple selectors. Drag the edges of the selector to change the selection; click the red button on a selector to delete it.

### Configurations

Configure chromosomes with `chromosome.config(type, value)` or `chromosome.type(value)`. `chromosome.type()` (no arguments) will return the current configuration. The default values for each configuration is shown below.

```javascript
var s = cyto_chr.chromosome()
    .config('segment', "2")
    .config('target', '#chrX') 
    .config('resolution', "850") //400, 550, or 850
    .config('width', 1200)
    .config('useRelative', false)
    .config('showAxis', false)
    .render();
    
s.resolution(); //850
s.width(); //1200
```

**chromosome.segment** 
The chromosome number to draw, e.g. `"1" or "X"`
Default: 1

**chromosome.target** 
id of a div to append the chromosome svg
Default: the root html document

**chromosome.resolution**
g-band resolutions
Default: 550

**chromosome.width**
Total width on the page to render
Default: 1000

**chromosome.useRelative**
Render each chromosome relative to their real sizes. Setting this to `false` will draw the chromosome to the full `width`.
Default: true

**chromosome.showAxis** 
Display the basepair axis below the chromosome
Default: false

### Chromosome API

**chromosome.render()**
A call to `render()` will update the svg with the current configurations. If something is changed later, call to `render()` again to re-draw the chromosome.

**chromosome.getSelections()**
Get an list of all the selections on the chromosome

**chromosome.on(event, callback)**
Capture events from user interactions.
Two events are emmited: `bandclick` and `selectorchange`

```javascript
chromosome.on('bandclick', function(e) {
    //e contains contextual data
})
```

If the data directory is changed relative to the source, updated it with:
```javascript
cyto_chr.modelLoader.setDataDir('../data/');
```

### Date source: 
Data is loaded from static files in the `data/` directory. G-banding resolutions included are `400`, `550`, and `850`.

ftp://ftp.ncbi.nlm.nih.gov/pub/gdp/

# License
MIT