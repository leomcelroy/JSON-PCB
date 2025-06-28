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

---

path

```
[
  [ "start", x, y, ?[ "fillet" | "chamfer" | "biarc", radius] ],
  [ "absolute", x, y],
  [ "relative", dx, dy],
  ?[ "polarAbsolute", angle, distance ],
  ?[ "polarRelative", angle, distance ],
  ?[ "arc", x, y, bulge | sweepAngle ],
  [ "close" ]
]
```
