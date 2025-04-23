```
pl
[
  [x, y]
]

region
{
 contour: pl,
 polarity: "+" | "-"
 layers: [],
 maskOffset: 0,
}

traces
{
 track: pl,
 diameter: 0.014,
 layers: [],
 polarity: "+" | "-", // Polarity for traces
 maskOffset: 0,
}

routes/drills
{
 track: pl,
 diameter: 0.014,
 start: "F.Cu",
 end: "B.Cu",
 plated: true,
}

```
