export const testPCB = {
  version: "0.0.2",
  footprints: [],
  components: [],
  traces: [],
  regions: [],
  drills: [],
  pours: [],
  nets: [],
  mmPerUnit: 25.4,
};

export const testPCB2 = {
  footprints: [
    {
      id: "test",
      pads: [
        {
          id: "pad_0",
          position: [0, 0],
        },
      ],
      regions: [
        {
          contour: [
            ["s", 0, 0, "biarc"],
            ["r", 1, 1, "biarc"],
            ["r", 0, -1, "biarc"],
            ["c"],
          ],
          layers: ["F.Cu"],
          polarity: "+",
        },
      ],
      drills: [
        {
          position: [0, 0],
          diameter: 1.2,
          start: "F.Cu",
          end: "B.Cu",
          plated: true,
        },
      ],
    },
  ],
  components: [
    {
      id: "test_0",
      footprint: "test",
      position: [0, 0],
      rotate: 0,
      flip: false,
    },
    {
      id: "test_1",
      footprint: "test",
      position: [2.2, 0.0],
      rotate: 0,
      flip: false,
    },
  ],
  regions: [
    {
      contour: [
        ["s", -13, -5, "biarc"],
        ["r", 41, 0, "fillet", 1.28],
        ["r", 0, 10, "fillet", 15.1],
        ["r", -27, 0, "fillet", 15.4],
        ["c"],
      ],
      layers: ["outline"],
      polarity: "+",
    },
  ],
  traces: [
    {
      track: [["s", 8.5, -2], ["r", 10, 0], ["r", 0, 5], ["r", -9, -2], ["c"]],
      diameter: 0.37,
      layers: ["F.Cu", "F.Mask"],
      polarity: "+",
    },
  ],
  drills: [
    {
      position: [1, 0],
      diameter: 1.0,
      start: "F.Cu",
      end: "B.Cu",
      plated: true,
    },
  ],
};
