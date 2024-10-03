# JSON PCB

![Screenshot 2024-10-03 at 2 44 12 PM](https://github.com/user-attachments/assets/e8281deb-e20b-4d66-ac85-571a90c7eb95)

JSON PCB was made to have a very easy way to create boards and an editor for the JSON circuit board description format.

I've made a few EDA tools like [SVG-PCB](https://github.com/leomcelroy/svg-pcb) and [NetWeaver](https://github.com/leomcelroy/net-weaver).

While SVG-PCB works for describing boards programatically I wanted a scripting target that wasn't linked to a particular runtime.

I also noticed many SVG-PCB users weren't writing scripts at all and instead jsut using the GUI. When extending these features in SVG-PCB the editor becomes
quite heavy handed in modifying portions of users code.

These two things made me want to make this. It doesn't replace SVG-PCB. It just has different design principles.

These principles were:

- Have a static easily serializable and transfrable format for describing boards.
- Make sure this format and losslessly map to Gerber.
- Make an editor for this format that is easy to use and allows manipulation over all aspects.

## The Board Format

This is still evolving but at the moment boards look like this.

```
path = [
  ["start", x, y],
  ["lineTo", x, y],
  ["arcTo", x, y],
  ["arcTo", x, y, { sweepAngle: angle }],
  ["lineTo", x, y, { corner: [ "fillet", radius ]}],
  ...,
  ["close"],
]

{
  footprints: [
    {
      id: "footprintId", // unique and displayed as label
      pads: [
        {
          id: "GND",
          position: [0, 0],
          traces: [],
          regions: [
            {
              contour: path,
              polarity: "+" | "-",
              layer: "F.Cu"
            }
          ],
          drill: {
            diameter: 0.02,
            start: "F.Cu",
            end: "B.Cu",
            plated: false,
            // possible addition of track
          },
          maskOffset: .03 // 0 by default
        }
      ]
    }
  ],
  components: [
    {
      id: "R1206_50ohm_0", // unique and displayed as label
      footprint: "footprintId",
      translate: [0, 1], // [0, 0] by default
      rotate: 90, // 0 by default
      flip: false // false by default
    }
  ],
  traces: [ // used for wires
    {
      track: path,
      thickness: 0.015,
      polarity: "+" | "-",
      layer: "F.Cu"
    }
  ],
  regions: [
    {
      contour: path,
      polarity: "+" | "-",
      layer: "F.Cu"
    },
  ],
  mmPerUnit: 25.4,
```

`pours` and `nets` are planned to be added.

`outline` is currently specified in region but will possibly be separated.

## Documentation

### Importing Footprints

You can drop in Kicad Footprints (`kicad_mod`) to import them.

You can find the [Fab Inventory here](https://gitlab.fabcloud.org/pub/libraries/electronics/kicad/-/tree/master/fab.pretty?ref_type=heads).

Simply download the directory and drop in the components you need.

### Adding Components

To create a componet drag the icon of a footprint into the workpane.

### Hot Keys

Press the meta key (`cmd` on Mac) in order to stop snapping when dragging points.

## Development

To run first clone the repo then in the directory run

```
npm install
npm run dev
```

