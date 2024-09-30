export function addPanZoomCanvas(canvas, redraw) {
  let cancelPanZoom = false;
  const context = canvas.getContext("2d");
  let scale = 1;
  let pointX = 0;
  let pointY = 0;
  let start = { x: 0, y: 0 };
  let mousedown = false;

  const togglePanZoom = (bool) => {
    cancelPanZoom = bool;
  };

  const getXY = (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return [x, y];
  };

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const scaleFactor = window.devicePixelRatio || 1;

    canvas.width = rect.width;
    canvas.height = rect.height;

    setTransform();
  }

  window.addEventListener("resize", resizeCanvas);

  resizeCanvas();

  function setTransform() {
    context.setTransform(scale, 0, 0, scale, pointX, pointY);
    redrawCanvas();
  }

  function redrawCanvas() {
    context.clearRect(
      -pointX / scale,
      -pointY / scale,
      canvas.width / scale,
      canvas.height / scale,
    );

    redraw();
  }

  canvas.addEventListener("mousedown", (e) => {
    if (cancelPanZoom) return;
    if (e.shiftKey) return;

    const [x, y] = getXY(e);
    mousedown = true;
    start = { x: x - pointX, y: y - pointY };
  });

  canvas.addEventListener("mousemove", (e) => {
    if (cancelPanZoom || !mousedown) return;

    const [x, y] = getXY(e);
    pointX = x - start.x;
    pointY = y - start.y;

    setTransform();
  });

  canvas.addEventListener("mouseup", () => {
    mousedown = false;
  });

  canvas.addEventListener("mouseout", () => {
    mousedown = false;
  });

  canvas.addEventListener("wheel", (e) => {
    if (cancelPanZoom) return;

    const [x, y] = getXY(e);
    const xs = (x - pointX) / scale;
    const ys = (y - pointY) / scale;

    if (Math.sign(e.deltaY) < 0) {
      scale *= 1.03; // Zoom in
    } else {
      scale /= 1.03; // Zoom out
    }

    pointX = x - xs * scale;
    pointY = y - ys * scale;

    setTransform();
    e.preventDefault();
  });

  function setScaleXY(limits) {
    const bb = canvas.getBoundingClientRect();
    const xr = limits.x[1] - limits.x[0];
    const yr = limits.y[1] - limits.y[0];
    const xScalingFactor = bb.width / xr;
    const yScalingFactor = bb.height / yr;
    const scalingFactor = Math.min(xScalingFactor, yScalingFactor) * 0.9;

    scale = scalingFactor; // * window.devicePixelRatio;
    const center = {
      x: ((limits.x[0] + limits.x[1]) / 2) * scalingFactor - bb.width / 2,
      y: ((limits.y[0] + limits.y[1]) / 2) * scalingFactor - bb.height / 2,
    };

    pointX = -center.x;
    pointY = -center.y;

    setTransform();
  }

  function corners() {
    const { width, height } = canvas.getBoundingClientRect();
    const rt = getPoint(width, height);
    const lt = getPoint(0, height);
    const rb = getPoint(width, 0);
    const lb = getPoint(0, 0);
    return { rt, lt, rb, lb };
  }

  function getPoint(x, y) {
    const newX = (x - pointX) / scale;
    const newY = (y - pointY) / scale;
    return [newX, newY];
  }

  return {
    scale: () => scale,
    x: () => pointX,
    y: () => pointY,
    corners,
    getPoint,
    setScaleXY,
    togglePanZoom,
  };
}

/*

function init() {
  const canvas = document.querySelector('.main-canvas')

  const bodyListener = createListener(document.body)
  const canvasListener = createListener(canvas)

  // center view
  const { docDimensions } = getStore();

  const br = canvas.getBoundingClientRect()
  panZoomParams.scale = Math.min(
    (br.width - 20) / docDimensions.width,
    (br.height - 20) / docDimensions.height
  )

  panZoomParams.panX =
    br.width / 2 - (docDimensions.width * panZoomParams.scale) / 2
  panZoomParams.panY =
    br.height / 2 + (docDimensions.height * panZoomParams.scale) / 2

  requestRedraw(canvas)

  canvasListener(
    'wheel',
    '',
    (e: WheelEvent) => {
      e.preventDefault()

      const ZOOM_SPEED = 0.0005

      const { panX, panY, scale } = panZoomParams

      // const newScale = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, scale + e.deltaY * -ZOOM_SPEED));
      const newScale = scale + scale * (-e.deltaY * ZOOM_SPEED)

      const br = canvas.getBoundingClientRect()
      const fixedPoint = { x: e.clientX - br.left, y: e.clientY - br.top }
      panZoomParams.panX =
        fixedPoint.x + (newScale / scale) * (panX - fixedPoint.x)
      panZoomParams.panY =
        fixedPoint.y + (newScale / scale) * (panY - fixedPoint.y)
      panZoomParams.scale = newScale

      requestRedraw(canvas)
    },
    { passive: false }
  )

  let mousedown = false
  canvasListener('mousedown', '', e => {
    mousedown = true
  })

  canvasListener('mouseup', '', e => {
    mousedown = false
  })

  canvasListener('mousemove', '', (e: MouseEvent) => {
    // update mousepos
    const mousePos = document.querySelector('.mouse-position') // mousePosRef.current;

    if (mousePos) {
      // convert mouse pos to virtual coords (accounting for zoom, scale)

      const { panX, panY, scale } = panZoomParams
      const br = canvas.getBoundingClientRect()
      let x = e.clientX - br.left
      x = (x - panX) / scale
      let y = e.clientY - br.top
      y = -(y - panY) / scale
      const addPadding = (s: string) => (s.startsWith('-') ? s : ' ' + s)
      mousePos.textContent = `${addPadding(x.toFixed(1))}mm, ${addPadding(
        y.toFixed(1)
      )}mm`
    }

    if (e.buttons !== 1 || !mousedown) return
    e.preventDefault()

    panZoomParams.panX += e.movementX
    panZoomParams.panY += e.movementY

    requestRedraw(canvas)
  })

  bodyListener('click', '', e => {
    // check if contained in element with this selector string
    if (!e.target.closest('.center-view-trigger')) return

    const { docDimensions } = getStore()

    if (!canvas) return

    const br = canvas.getBoundingClientRect()
    panZoomParams.scale = Math.min(
      (br.width - 20) / docDimensions.width,
      (br.height - 20) / docDimensions.height
    )

    panZoomParams.panX =
      br.width / 2 - (docDimensions.width * panZoomParams.scale) / 2
    panZoomParams.panY =
      br.height / 2 + (docDimensions.height * panZoomParams.scale) / 2

    requestRedraw(canvas)
  })

  const resizeObserver = new ResizeObserver(entries => {
    const { width, height } = entries[0].contentRect
    dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    setCtxProperties() // setting width/height clears ctx state

    requestRedraw(canvas)
  })

  resizeObserver.observe(canvas)
}

// drawing function

const panZoomParams = {
  panX: 0,
  panY: 0,
  scale: 1
}

let dpr = typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1

const requestRedraw = (canvas: HTMLCanvasElement) => {
  requestAnimationFrame(() => {
    _redraw(canvas)
  })
}

let _ctx: CanvasRenderingContext2D | null = null

const setCtxProperties = () => {
  if (!_ctx) return

  _ctx!.lineWidth = 1
  _ctx!.lineJoin = 'round'
  _ctx!.lineCap = 'round'
}
const getCtx = (canvas: HTMLCanvasElement) => {
  if (!_ctx) {
    _ctx = canvas.getContext('2d')
    setCtxProperties()
  }
  return _ctx!
}

const _redraw = (canvas: HTMLCanvasElement) => {
  const {
    turtlePos,
    turtles,
    docDimensions: { width: docW, height: docH }
  } = getStore()
  if (!canvas || !turtlePos) return

  // we want to only work in virtual pixels, and just deal with device pixels in rendering
  const width = canvas.width 
  const height = canvas.height

  // turtle canvas
  const ctx = getCtx(canvas)

  ctx.clearRect(0, 0, width, height)

  // DRAW TURTLE
  // ctx.beginPath();
  // ctx.arc(
  //     dpr * (panZoomParams.panX + turtlePos[0] * panZoomParams.scale),
  //     dpr * (panZoomParams.panY + (-1 * turtlePos[1]) * panZoomParams.scale),
  //     dpr * 7,
  //     0,
  //     2 * Math.PI
  // );
  // ctx.strokeStyle = "white";
  // ctx.stroke();
  // ctx.fillStyle = "#ffa500";
  // ctx.fill();

  // draw document

  ctx.strokeStyle = '#3333ee'

  ctx.strokeRect(
    dpr * panZoomParams.panX,
    dpr * panZoomParams.panY,
    dpr * docW * panZoomParams.scale,
    -dpr * docH * panZoomParams.scale
  )

  // draw turtles

  // turtle path
  // if(turtles.length === 0) return;
  const { panX, panY, scale } = panZoomParams

  for (const turtle of turtles) {
    ctx.beginPath()

    for (const polyline of turtle.path) {
      // let paths = polyline.map(([x, y]) => [
      //   dpr * (panX + x * scale),
      //   -(dpr * (-panY + y * scale))
      // ])


      polyline.forEach((p, i) => {
        let [x, y] = p
        x = dpr * (panX + x * scale)
        y = -(dpr * (-panY + y * scale))
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      })
    }

    ctx.lineWidth = turtle.style.width
    ctx.strokeStyle = turtle.style.stroke
    ctx.stroke()

    ctx.lineWidth = 1;

    ctx.fillStyle = turtle.style.fill
    if (turtle.style.fill !== 'none') ctx.fill()
  }
}
*/
