export function getDrillData(board) {
  const drills = [];

  board.components.forEach((comp) => {
    const { translate, pads } = comp;
    const [translateX, translateY] = translate;
    pads.forEach((pad) => {
      if (pad.drill) {
        const [posX, posY] = pad.position;
        const x = posX;
        const y = posY;

        drills.push({
          ...pad.drill,
          x,
          y,
        });
      }
    });
  });

  return drills;
}
