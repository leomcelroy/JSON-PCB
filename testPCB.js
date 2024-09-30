export const testPCB = {
  footprints: [
    {
      id: "footprint0",
      pads: [
        {
          id: "GND",
          // net: "GND", // name? this is the kicad convention, https://klc.kicad.org/footprint/f4/f4.3/
          position: [25, -15], // or pos, translate?
          traces: [],
          regions: [
            {
              contour: [
                ["start", 0, 0, { corner: ["fillet", 10] }],
                ["lineBy", 0, 30, { corner: ["fillet", 10] }],
                ["lineBy", 50, 0],
                ["lineBy", 0, -30],
                ["close"],
              ],
              polarity: "+",
            },
          ],
          layers: ["F.Cu"],
          drill: {
            diameter: 0.02,
            start: "F.Cu",
            end: "B.Cu",
            plated: false,
            // track: [], // ?need to check if this is supported again
          },
          maskOffset: 0.03, // solderMaskMargin, maskMargin
        },
        {
          id: "PWR",
          // net: "GND", // name? this is the kicad convention, https://klc.kicad.org/footprint/f4/f4.3/
          position: [-75, -15], // or pos, translate?
          traces: [],
          regions: [
            {
              contour: [
                ["start", 0, 0, { corner: ["fillet", 10] }],
                ["lineBy", 0, 30, { corner: ["fillet", 10] }],
                ["lineBy", 50, 0],
                ["lineBy", 0, -30],
                ["close"],
              ],
              polarity: "+",
            },
          ],
          layers: ["F.Cu"],
          drill: {
            diameter: 0.02,
            start: "F.Cu",
            end: "B.Cu",
            plated: false,
            // track: [], // ?need to check if this is supported again
          },
          maskOffset: 0.03, // solderMaskMargin, maskMargin
        },
      ],
    },
  ],
  components: [
    {
      id: "r1", // unique and displayed as label
      footprint: "footprint0",
      translate: [100, 50],
      rotate: 45,
      flip: false,
    },
  ],
  // nets: [
  //   {
  //     name: "GND", // names get merged
  //     pads: [["componentId", "padId"]],
  //   },
  // ],
  traces: [
    {
      track: [
        ["start", 100, 100],
        ["lineTo", 400, 400],
      ],
      thickness: 3,
      polarity: "+",
      layer: "B.Cu",
    },
    // {
    //   track: [
    //     ["moveTo", 100, 400],
    //     ["lineTo", 400, 100],
    //   ],
    //   thickness: 10,
    //   polarity: "-",
    //   layer: "F.Cu",
    // },
  ],
  regions: [
    {
      contour: [
        ["start", 100, 100, { corner: ["fillet", 30] }],
        ["lineTo", 200, 100, { corner: ["fillet", 30] }],
        ["lineTo", 200, 200, { corner: ["fillet", 30] }],
        ["lineTo", 100, 200, { corner: ["fillet", 30] }],
        ["close"],
      ],
      // polarity: "+",
      layer: "F.Cu",
    },

    {
      contour: [
        ["start", 125, 125, { corner: ["fillet", 10] }],
        ["lineBy", 50, 0, { corner: ["fillet", 10] }],
        ["lineBy", 0, 50, { corner: ["fillet", 10] }],
        ["lineBy", 0, 50, { corner: ["fillet", 10] }],
        ["lineBy", -50, 0, { corner: ["fillet", 10] }],
        ["close"],
      ],
      polarity: "-",
      layer: "F.Cu",
    },

    // {
    //   contour: [
    //     ["moveTo", 300, 200],
    //     ["lineTo", 0, 400],
    //     ["arcBy", 0, -50],
    //     ["arcBy", 0, -50],
    //   ],
    //   polarity: "-",
    //   layer: "F.Cu",
    // },

    // {
    //   contour: [
    //     ["moveTo", 100, 150],
    //     ["arcBy", 0, -100, { sweepAngle: 180 }],
    //     ["arcBy", 0, 100, { sweepAngle: 180 }],
    //   ],
    //   polarity: "+",
    //   layer: "B.Cu",
    // },
    // {
    //   contour: [
    //     ["moveTo", 150, 150],
    //     ["arcBy", 0, -50, { sweepAngle: 180 }],
    //     ["arcBy", 0, 50, { sweepAngle: 180 }],
    //   ],
    //   polarity: "-",
    //   layer: "B.Cu",
    // },
  ],
  // pours: [
  //   {
  //     contour: [],
  //     layer: "F.Cu",
  //     net: "GND",
  //     clearance: 0.01,
  //   },
  // ],
  mmPerUnit: 25.4,
};
