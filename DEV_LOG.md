# DEV LOG

## TODO

- remove negative paths from bounding box generation
- path manipulation
  - fillet editing
  - deleting points
  - adding points on path
- top menu
  - save
  - gerber export
  - examples
- log mouse position in the corner
- overflow layer menu
- json editor button color
- test round rect import

- box select
- a grid
- snap to pads
- netlists
- pours/keepout zones
- remove empty traces/regions?
- add component labels and pad labels to bottom of layer list

## BUGS

- when I click a hoverable path another one flashes
- some instability when dragging color changer

## DONE

- link to github
- hotkeys
- documentation
- edit footprint id
- export
  - json
  - png
- center view
- view json
- ? make sure board bounding box is updated when dragging elements
- update bounding box when centering
- make it look nice
- use arcs when converting kicad modules
- prevent footprint deletion if component is used
- new file
- footprint import
- footprint drop in
  - ? json
  - kicad
- try to match current layer order
- json view/editor
- display component labels
- display pad labels
- indices for more than first shape in a path are wrong
- add layer order sorting
- component adding
  - translate
  - rotate
  - flip
- display
  - component names
  - component labels
- layer editing
  - reordering
  - visibility
  - color
- component adding gui
  - display footprints
  - draggable adding
  - footprint delete
- modal editors
  - trace/region editing
    - layer selection
    - thickness
    - deletion
  - components
- set layers when initializing board
- path creation
  - draw preview path
  - draw preview point
- holes

### Nov 6, 2024

Moved text rendering to canvas which greatly improved snapiness.

Have weird issues with the text not scaling smoothly or positioning properly.

Maybe there is a lower limit on text size.

Also decided to make `layer` into `layers`


### Oct 2, 2024

How to handle footprints listing multiple layers.

Should I duplicate the traces/contours.

Or allow traces/contours to be on multiple layers.

The like how the former is more explicit, but the latter matches the convention more.

I think the main drawback of having to only specify one layer is that it's more verbose.

One thing to consider is that kicad_modules don't assign ids to pads.
So many pads share a name (which is the net).
In my case I really want to differentiate id's based on location.
So I want to group things which may not be on the same pads.

But I could still have multiple layers per a region, which is probably the right thing to do because
geometry is often the same like (F.Mask, F.Cu)

Will have to adjust the menu for this too

### Sep 30, 2024

I need to take into account drill layers and tracks.

I need to think about how to select multiple things at once.

### Sep 28, 2024

I need to add information to pads what should I add?
In SVG-PCB they had this

  - drills
  - flip
  - footprint
  - id
  - layers
  - padShapes
  - padLocations
  - rotation
  - position

- should regions and traces be able to be on multiple layers
- why do components have seperate layers but regions don't

- check that arcs are behaving properly (does `computeArc` match my og implementation)
- check that svg renders arc properly (seems to now)
- make paths only have one path (no `moves`)
- switch `move` to `start`, `begin`, or `open`
  - I like having some parity with close
  - Start is maybe the most clear, also implies it doesn't need to be closed
  - move fillet from close to start, that way fillet is on controlPoint of cmd
- add checks that start and close are first and last 
- compare `renderCanvas` and `computeArc`

- to add
  - component adding
    - flip
    - rotate
    - translate
  - radius manipulation
  - path drawing

### Before

Some thoughts on API design. Evolving to gerber inspired JSON.

```js
{
  id: "footprintName", // or name
  pads: [
    {
      id: "GND", // is this unique? if not is it name? what if internally connected
      // net: "GND", // name? this is the kicad convention, https://klc.kicad.org/footprint/f4/f4.3/
      pos: [0, 0],
      shape: "M 0,0 ...", // or polylines[]
      layers: ["F.Cu", "B.Cu", "F.Mask", "B.Mask", "*.Cu", ...],
      drill: { // add oval support
        diameter: 0.02, // or radius, what if oval
        // ?oval | slot: { x, y }, // [x, y]
        start: "F.Cu",
        end: "B.Cu",
        plated: false, // can something other than a hole be plated
        offset: [0, 0],
        // track?
      },
      maskOffset: .03 // solderMaskMargin, maskMargin
      // regions?
      // outlines?
    }
  ]
}
```

```js
const JSON_PCB = {
  footprints: [

  ],
  components: [
    {
      id: "R1206_50ohm_0", // unique and displayed as label
      footprint: ..., // string or { ... }
      translate: [0, 1],
      rotate: 90,
      flip: false
    }
  ],
  nets: [
    {
      name: "GND", // names get merged
      pads: [
        [ "componentId", "padId" ]
      ]
    }
  ],
  wires: [
    {
      points: [ [x, y]... ], // track
      thickness: .015,
      layer: "F.Cu",
    }
  ],
  shapes: [
    {
      shape: [ [ [x, y]... ]... ] // polylines? "M ..."
      layer: "F.Cu",
      // if profile, p or np for plating
    }
  ],
  zones: [
    {
      points: [ [x, y]... ], // implied closed
      type: "pour" | "keepout" // | "polygon cutout" | "board cutout"
      layer: "F.Cu",
      clearance: .1,
    }
  ]
};

const board = createPCB(JSON_PCB);
```

```js
board.addFootprint({ ... })
board.addComponent({ ... }) // (footprint, { ... })
board.addNet({ ... }) // ({ ... })
board.addWire({ ... }) // (points, thickness, layer)
board.addShape({ ... }) // (shape, layer)
// board.add()

board.getLayer(layerName, flatten = false)

// board.components
// board.wires
// board.shapes
// board.nets

// board.getComponentById
// board.query("componentId", ?"padId", ?"x" | "y" | "xy")

// board.toJSON()

// board.getPadLabels()
// board.getComponentLabels()

```

```js
const via = (diameterHole, diameterCopper, layers = ["F.Cu", "B.Cu"]) => ({
  "via": {
    pos: [0, 0],
    layers: layers,
    shape: getPathData(circle(diameterCopper/2)),
    drill: {
      diameter: diameterHole,
      start: layers[0],
      end: layers[1],
      plated: true
    },
  }
})

createText(...)

renderPCB({
  pcb: board,
  layers: [
    {
      name: "F.Cu",
      color: "#00ff00ff"
    }
  ],
  mmPerUnit: 25.4,
  limits: { // what if I want this to be an offset of the board
    x: [ 0, 1 ],
    y: [ 0, 1 ]
  },
  background: "#ffff00ff"
})
```

```js
pt(0, 0)

path(
  ["point", [0, 0]],
  ["fillet", .3, [1, 1]],
  ["cubic", [ .2, .3 ], [ .5, .4 ], [5, 3 ] ],
  ["chamfer", .3, [ 3, 4 ]],
  // [ "arc", center, end ]
)

inputs({
  name,
  value,
  type // range(min: num, max: num, step: num), number, text, option(options: str[])
})
```

```js
const comp0 = board.addComponent({ footprint });

comp0.pad("padId");
comp0.padX("padId");
comp0.padY("padId");
comp0.pos();
comp0.posX();
comp0.posY();
comp0.boundingBox(); // { width, height, left, top, bottom, right }
```

How to represent paths?

Could have paths

```js
[
  // native gerber
  [ "moveTo", [x, y] ],
  [ "lineTo", [x, y] ],
  // in gerber it's end center
  [ "arcTo", center: pt, end: pt, angle: 1 | -1 | "+" | "-" ],
  // extended
  ["fillet", radius, [x, y]],
  ["chamfer", radius, [x, y]]
]
```

or like existing function

```js
path(
  ["point", [0, 0]],
  ["fillet", .3, [1, 1]],
  ["cubic", [ .2, .3 ], [ .5, .4 ], [5, 3 ] ],
  ["chamfer", .3, [ 3, 4 ]],
  // [ "arc", center, end ]
)
```

or just polylines

```js
[
  [
    [x, y]
  ]
]
```

### More Gerber Like

```js
{
  footprints: [
    {
      id: "footprintName",
      pads: [
        {
          id: "GND",
          // net: "GND", // name? this is the kicad convention, https://klc.kicad.org/footprint/f4/f4.3/
          pos: [0, 0],
          outline: [],
          traces: [],
          regions: [
            {
              contour: [ "moveTo", "lineTo", "arcTo" ],
              polarity: "+"
            }
          ],
          layers: ["F.Cu", "B.Cu", "F.Mask", "B.Mask", "*.Cu", ...],
          drill: {
            diameter: 0.02,
            start: "F.Cu",
            end: "B.Cu",
            plated: false,
            track: [ "moveTo", "lineTo", "arcTo" ]
          },
          maskOffset: .03 // solderMaskMargin, maskMargin
        }
      ]
    }
  ],
  components: [
    {
      id: "R1206_50ohm_0", // unique and displayed as label
      footprint: "footprintName",
      translate: [0, 1],
      rotate: 90,
      flip: false
    }
  ],
  nets: [ // netlist
    {
      name: "GND", // names get merged
      pads: [
        [ "componentId", "padId" ]
      ]
    }
  ],

  outline: [
    {
      countour: [],
      polarity: "+"
    },
    // {
    //   track: [...], // this is either inside or outside
    //   thickness: 0.015
    // }
  ],

  // can a trace have a polarity? 
  traces: [ // wires? can I do silk in here, what about outlines?
    {
      track: [ "moveTo", "lineTo", "arcTo" ],
      thickness: 0.015,
      layer: "F.Cu"
    },
    {
      track: [ "moveTo", "lineTo", "arcTo" ],
      thickness: 0.015,
      polarity: "-",
      layer: "F.Silk"
    }
  ],

  regions: [
    {
      contour: [ "moveTo", "lineTo", "arcTo" ],
      polarity: "+", // negative: false
      layer: "F.Cu"
    },
    {
      contour: [ "moveTo", "lineTo", "arcTo" ],
      polarity: "-", // negative: true
      layer: "F.Cu"
    },

    // outlines
    // "Edge.Cuts", interior, edge, cuts, outline, mechanical, dimension
    // this means we'll have to perform offsetting operations
    
    {
      contour: [ "moveTo", "lineTo", "arcTo" ],
      polarity: "+", // negative: false
      layer: "outline" 
    },
    {
      contour: [ "moveTo", "lineTo", "arcTo" ], // add moutning holes
      polarity: "-", // negative: true
      layer: "outline" 
    }

  ],
  pours: [
    {
      contour: [ "moveTo", "lineTo", "arcTo" ],
      layer: "F.Cu",
      net: "GND",
      clearance: 0.01
    }
  ],
  // mmPerUnit: 25.4,
  // mmOrInch: "mm"
}
```

### Aperatures and Tracks

To create wires set aperature to a circle.

Move aperature along track.

Done.

### Regions

Should I have regions with polarity?

```js
{
  contour: [
    "moveTo", "lineTo", "arcTo"
  ],
  polarity: "+", // optional: "+" | "-"
  layer: "F.Cu"
}
```

### Copper Pours

```js
{
  contour: [
    "moveTo", "lineTo", "arcTo"
  ],
  layer: "F.Cu",
  clearance: .1,
}
````

Doesn't fill negative polarity regions. 
Clearance is for tracks only.

### Outline

```js
{
  track: [
    "moveTo", "lineTo", "arcTo"
  ],
  plated: false, // optional: false | true
}
```

Why not do it like this?

If outlines are tracks I have to offset based on the thickness of the cutting tool or dimensions will be off.


### Contours

Contours can not be self intersecting and also must be closed

I will assume they are closed and close them for the user if not

I can warn the user if it self intersects perhaps?

### Other

need a function which can verify structure of text

EDITORS

- footprint editor
- 

OBJECTIVES

- be able to use sub-boards
  - allow users to adjut parameterized components/footprints
- be direct manipulation first

- don't eval the whole code on drag
- eval code in web worker
- on interaction end or run do eval
- during interaction modify the board tree directly
- createPCB expects valid json


```js
board.addRegion({
  contour: [...],
  polarity: "+", // ?
  layer: "F.Cu"
});

board.addKeepout({
  contour: [...],
  layer: "F.Cu"
});

board.addOutline({ // ?addCutout
  contour: [...],
});
```

