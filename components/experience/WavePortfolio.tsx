"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type MouseEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import * as THREE from "three";
import { TrackOfTheDay } from "@/components/experience/TrackOfTheDay";
import { studio } from "@/content/studio";
import { site } from "@/lib/site";

export type WaveProject = {
  slug: string;
  title: string;
  client: string;
  industry: string;
  summary: string;
  services: string[];
  liveUrl?: string;
  card: string;
  cardVideo?: string;
  frames: string[];
  tone: string;
  result?: string;
  plus?: boolean;
};

const CARD_W = 2.85;
const CARD_H = 1.6;
const GAP = 0.16;
const SPACING = CARD_W + GAP;
const MOBILE_MAX = 800;

/** Slight side elastication — amount roughly -1..1.
 *  Soft mid-side bow with vertical ease in/out so it meets the corner radii cleanly. */
function bulgePanelPath(amount: number) {
  const b = amount * 0.016;
  const r = 0.036;
  return [
    `M ${r} 0`,
    `L ${1 - r} 0`,
    `Q 1 0 1 ${r}`,
    // Right: ease out vertically, bow, ease back vertically into bottom corner
    `C 1 ${0.22} ${1 + b} 0.5 1 ${0.78}`,
    `L 1 ${1 - r}`,
    `Q 1 1 ${1 - r} 1`,
    `L ${r} 1`,
    `Q 0 1 0 ${1 - r}`,
    // Left
    `C 0 ${0.78} ${0 - b} 0.5 0 ${0.22}`,
    `L 0 ${r}`,
    `Q 0 0 ${r} 0`,
    "Z",
  ].join(" ");
}

const waveVertex = /* glsl */ `
  // Keep the portfolio itself as a horizontal ribbon. The About portal is a
  // separate foreground object; cards should never become the torus.
  float wx = uCardX + position.x;
  float wave = cos(wx * 0.82);

  vec3 flatPos = transformed;
  flatPos.z += wave * 1.55;
  flatPos.y += wave * 0.32;

  // Preserve the original horizontal portfolio even while About is open.
  // The portal's black aperture + chrome torus sits in front of this strip.
  transformed = flatPos;

  // Keep the subtle hover ripple only when the portfolio is in its normal state.
  vec2 delta = uv - uPointer;
  float d = length(delta);
  float ring =
    sin(28.0 * d - uRippleTime * 6.5) * 0.7 +
    sin(14.0 * d - uRippleTime * 3.8) * 0.3;
  float ripple = ring * exp(-3.2 * d) * uHover * (1.0 - uAbout);
  transformed.z -= ripple * 0.18;
  transformed.x += (uv.x - 0.5) * ripple * 0.06;

  // Portfolio track swap — a traveling ripple that washes across the ribbon.
  float swapAmt = uSwap * (1.0 - uAbout);
  if (swapAmt > 0.001) {
    vec2 fromCenter = uv - vec2(0.5);
    float sd = length(fromCenter);
    float traveling =
      sin(22.0 * sd - uSwapTime * 10.0) * 0.65 +
      sin(10.0 * sd - uSwapTime * 5.5) * 0.35;
    float envelope = exp(-2.4 * sd) * swapAmt;
    float swapRipple = traveling * envelope;
    transformed.z -= swapRipple * 0.42;
    transformed.y += fromCenter.y * swapRipple * 0.14;
    transformed.x += fromCenter.x * swapRipple * 0.1;
    // Slight card peel as the wash passes.
    transformed.z += sin(uCardX * 1.4 + uSwapTime * 3.2) * swapAmt * 0.22;
  }
`;

function coverDraw(
  ctx: CanvasRenderingContext2D,
  image: CanvasImageSource,
  width: number,
  height: number,
  sourceWidth: number,
  sourceHeight: number,
) {
  const imageRatio = sourceWidth / sourceHeight;
  const canvasRatio = width / height;
  let dw = width;
  let dh = height;
  let dx = 0;
  let dy = 0;
  if (imageRatio > canvasRatio) {
    dw = height * imageRatio;
    dx = (width - dw) / 2;
  } else {
    dh = width / imageRatio;
    dy = (height - dh) / 2;
  }
  ctx.drawImage(image, dx, dy, dw, dh);
}

function paintCard(
  canvas: HTMLCanvasElement,
  title: string,
  tone: string,
  image: CanvasImageSource | null,
  plusLogo: CanvasImageSource | null = null,
) {
  const width = canvas.width;
  const height = canvas.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, width, height);
  ctx.save();
  const radius = 42;
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.arcTo(width, 0, width, height, radius);
  ctx.arcTo(width, height, 0, height, radius);
  ctx.arcTo(0, height, 0, 0, radius);
  ctx.arcTo(0, 0, width, 0, radius);
  ctx.closePath();
  ctx.clip();

  if (image) {
    const sourceWidth =
      "videoWidth" in image && image.videoWidth
        ? image.videoWidth
        : "naturalWidth" in image
          ? image.naturalWidth
          : width;
    const sourceHeight =
      "videoHeight" in image && image.videoHeight
        ? image.videoHeight
        : "naturalHeight" in image
          ? image.naturalHeight
          : height;
    coverDraw(ctx, image, width, height, sourceWidth || width, sourceHeight || height);
  } else {
    ctx.fillStyle = tone;
    ctx.fillRect(0, 0, width, height);
  }

  if (plusLogo) {
    const sourceW =
      "naturalWidth" in plusLogo && plusLogo.naturalWidth
        ? plusLogo.naturalWidth
        : 1875;
    const sourceH =
      "naturalHeight" in plusLogo && plusLogo.naturalHeight
        ? plusLogo.naturalHeight
        : 386;
    const logoH = 28;
    const logoW = logoH * (sourceW / sourceH);
    const padX = 18;
    const padY = 11;
    const pillW = logoW + padX * 2;
    const pillH = logoH + padY * 2;
    const pillX = 40;
    const pillY = 36;
    const pillR = pillH / 2;
    ctx.beginPath();
    ctx.moveTo(pillX + pillR, pillY);
    ctx.arcTo(pillX + pillW, pillY, pillX + pillW, pillY + pillH, pillR);
    ctx.arcTo(pillX + pillW, pillY + pillH, pillX, pillY + pillH, pillR);
    ctx.arcTo(pillX, pillY + pillH, pillX, pillY, pillR);
    ctx.arcTo(pillX, pillY, pillX + pillW, pillY, pillR);
    ctx.closePath();
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.drawImage(plusLogo, pillX + padX, pillY + padY, logoW, logoH);
  }

  const shade = ctx.createLinearGradient(0, height - 260, 0, height);
  shade.addColorStop(0, "rgba(0,0,0,0)");
  shade.addColorStop(1, "rgba(0,0,0,0.55)");
  ctx.fillStyle = shade;
  ctx.fillRect(0, height - 260, width, 260);

  const family = getComputedStyle(document.body).fontFamily || "sans-serif";
  let size = 52;
  ctx.fillStyle = "#ffffff";
  ctx.textBaseline = "alphabetic";
  ctx.font = `500 ${size}px ${family}`;
  while (ctx.measureText(title).width > width - 250 && size > 30) {
    size -= 2;
    ctx.font = `500 ${size}px ${family}`;
  }
  ctx.fillText(title, 52, height - 58);

  const cx = width - 86;
  const cy = height - 74;
  ctx.beginPath();
  ctx.arc(cx, cy, 30, 0, Math.PI * 2);
  ctx.fillStyle = "#0c0c0c";
  ctx.fill();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2.2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(cx - 9, cy);
  ctx.lineTo(cx + 8, cy);
  ctx.moveTo(cx + 2, cy - 7);
  ctx.lineTo(cx + 9, cy);
  ctx.lineTo(cx + 2, cy + 7);
  ctx.stroke();
  ctx.restore();
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(src));
    image.src = src;
  });
}

const rippleFrag = /* glsl */ `
  precision mediump float;
  varying vec2 vUv;
  uniform sampler2D uMap;
  void main() {
    vec4 color = texture2D(uMap, vUv);
    if (color.a < 0.08) discard;
    gl_FragColor = color;
  }
`;

const rippleVert = /* glsl */ `
  attribute vec2 position;
  attribute vec2 uv;
  varying vec2 vUv;
  uniform vec2 uPointer;
  uniform float uRippleTime;
  uniform float uHover;
  uniform float uAspect;

  void main() {
    vUv = uv;
    vec2 pos = position;

    vec2 delta = uv - uPointer;
    delta.x *= uAspect;
    float dist = length(delta);

    float ring =
      sin(22.0 * dist - uRippleTime * 4.8) * 0.65 +
      sin(11.0 * dist - uRippleTime * 2.8) * 0.35;

    float ripple = ring * exp(-3.0 * dist) * uHover * 0.32;

    // Very light container nudge — image rides along
    pos.y += ripple * 0.028;
    pos.x += (uv.x - 0.5) * ripple * 0.04;
    pos.y += (uv.y - 0.5) * ripple * 0.024;

    gl_Position = vec4(pos, 0.0, 1.0);
  }
`;

function paintRoundedFrame(
  target: HTMLCanvasElement,
  image: HTMLImageElement,
  width: number,
  height: number,
  radius: number,
) {
  target.width = width;
  target.height = height;
  const ctx = target.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, width, height);
  ctx.save();
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.arcTo(width, 0, width, height, r);
  ctx.arcTo(width, height, 0, height, r);
  ctx.arcTo(0, height, 0, 0, r);
  ctx.arcTo(0, 0, width, 0, r);
  ctx.closePath();
  ctx.clip();
  coverDraw(ctx, image, width, height, image.naturalWidth, image.naturalHeight);
  ctx.restore();
}

function RippleFrame({ src }: { src: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const stateRef = useRef({
    hover: 0,
    hoverGoal: 0,
    pointer: { x: 0.5, y: 0.5 },
    pointerGoal: { x: 0.5, y: 0.5 },
    time: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !img || !wrap) return;

    const gl = canvas.getContext("webgl", { alpha: true, antialias: true, premultipliedAlpha: false });
    if (!gl) return;

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compile(gl.VERTEX_SHADER, rippleVert);
    const fs = compile(gl.FRAGMENT_SHADER, rippleFrag);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const segs = 64;
    const positions: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];
    for (let y = 0; y <= segs; y += 1) {
      for (let x = 0; x <= segs; x += 1) {
        const u = x / segs;
        const v = y / segs;
        positions.push(u * 2 - 1, v * 2 - 1);
        uvs.push(u, v);
      }
    }
    for (let y = 0; y < segs; y += 1) {
      for (let x = 0; x < segs; x += 1) {
        const a = y * (segs + 1) + x;
        const b = a + 1;
        const c = a + (segs + 1);
        const d = c + 1;
        indices.push(a, c, b, b, c, d);
      }
    }

    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);
    const uvLoc = gl.getAttribLocation(program, "uv");
    gl.enableVertexAttribArray(uvLoc);
    gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 0, 0);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    const uMap = gl.getUniformLocation(program, "uMap");
    const uPointer = gl.getUniformLocation(program, "uPointer");
    const uRippleTime = gl.getUniformLocation(program, "uRippleTime");
    const uHover = gl.getUniformLocation(program, "uHover");
    const uAspect = gl.getUniformLocation(program, "uAspect");
    gl.uniform1i(uMap, 0);

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    const paint = document.createElement("canvas");
    let alive = true;
    let frame = 0;
    let ready = false;
    let lastW = 0;
    let lastH = 0;

    const paintAndUpload = () => {
      if (!img.naturalWidth) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(wrap.clientWidth * dpr));
      const height = Math.max(1, Math.round(wrap.clientHeight * dpr));
      if (width !== lastW || height !== lastH || !ready) {
        lastW = width;
        lastH = height;
        paintRoundedFrame(paint, img, width, height, 18 * dpr);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, paint);
      }
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
      gl.uniform1f(uAspect, width / Math.max(height, 1));
      ready = true;
    };

    if (img.complete && img.naturalWidth) paintAndUpload();
    else img.onload = () => paintAndUpload();

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    const tick = () => {
      if (!alive) return;
      frame = requestAnimationFrame(tick);
      paintAndUpload();
      if (!ready) return;
      const state = stateRef.current;
      state.hover += (state.hoverGoal - state.hover) * 0.08;
      state.pointer.x += (state.pointerGoal.x - state.pointer.x) * 0.14;
      state.pointer.y += (state.pointerGoal.y - state.pointer.y) * 0.14;
      if (state.hover > 0.01) state.time += 0.032;

      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uPointer, state.pointer.x, 1 - state.pointer.y);
      gl.uniform1f(uRippleTime, state.time);
      gl.uniform1f(uHover, state.hover);
      gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
    };
    tick();

    const onResize = () => {
      lastW = 0;
      paintAndUpload();
    };
    window.addEventListener("resize", onResize);

    return () => {
      alive = false;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      img.onload = null;
      gl.deleteTexture(texture);
      gl.deleteBuffer(posBuffer);
      gl.deleteBuffer(uvBuffer);
      gl.deleteBuffer(indexBuffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [src]);

  return (
    <div
      ref={wrapRef}
      className="relative"
      onPointerEnter={() => {
        stateRef.current.hoverGoal = 1;
        stateRef.current.time = 0;
      }}
      onPointerLeave={() => {
        stateRef.current.hoverGoal = 0;
      }}
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        stateRef.current.pointerGoal.x = (event.clientX - rect.left) / Math.max(rect.width, 1);
        stateRef.current.pointerGoal.y = (event.clientY - rect.top) / Math.max(rect.height, 1);
      }}
    >
      <img ref={imgRef} src={src} alt="" className="block w-full opacity-0" draggable={false} />
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />
    </div>
  );
}

type PortfolioTrack = "shopify" | "branding";

export function WavePortfolio({
  shopifyProjects,
  brandingProjects,
}: {
  shopifyProjects: WaveProject[];
  brandingProjects: WaveProject[];
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const openRef = useRef<number | null>(null);
  const nudgeRef = useRef<(direction: number) => void>(() => {});
  const [track, setTrack] = useState<PortfolioTrack>("shopify");
  const projects = track === "shopify" ? shopifyProjects : brandingProjects;
  const [active, setActive] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [aboutHover, setAboutHover] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [popupScroll, setPopupScroll] = useState(0);
  const [trackPulse, setTrackPulse] = useState<"idle" | "out" | "in">("idle");
  const [trackRipple, setTrackRipple] = useState<{
    x: number;
    y: number;
    key: number;
  } | null>(null);
  const aboutOpenRef = useRef(aboutOpen);
  const closeRef = useRef<HTMLButtonElement>(null);
  const aboutCloseRef = useRef<HTMLButtonElement>(null);
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const projectBulgeId = useId().replace(/:/g, "");
  const aboutHoverRef = useRef(false);
  const pendingTrackRef = useRef<PortfolioTrack | null>(null);
  const transitionRef = useRef<{ phase: "idle" | "out" | "in"; t: number }>({
    phase: "idle",
    t: 0,
  });
  aboutOpenRef.current = aboutOpen;
  aboutHoverRef.current = aboutHover;

  const switchTrack = (next: PortfolioTrack, event: MouseEvent<HTMLButtonElement>) => {
    if (next === track || transitionRef.current.phase !== "idle" || aboutOpen) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setActive(null);
    setHovered(null);
    if (reduce) {
      setTrack(next);
      return;
    }
    const root = rootRef.current;
    const rect = root?.getBoundingClientRect();
    pendingTrackRef.current = next;
    transitionRef.current = { phase: "out", t: 0 };
    setTrackPulse("out");
    setTrackRipple({
      x: rect ? event.clientX - rect.left : (root?.clientWidth ?? 0) / 2,
      y: rect ? event.clientY - rect.top : (root?.clientHeight ?? 0) * 0.12,
      key: Date.now(),
    });
  };


  useEffect(() => {
    if (active === null) setPopupScroll(0);
  }, [active]);

  // Mobile has no WebGL tick, so drive the track swap on timers instead.
  useEffect(() => {
    if (trackPulse !== "out" || !mobile) return;
    const next = pendingTrackRef.current;
    if (!next) return;
    const swapTimer = window.setTimeout(() => {
      pendingTrackRef.current = null;
      transitionRef.current = { phase: "in", t: 0 };
      setTrackPulse("in");
      setTrack(next);
    }, 420);
    const settleTimer = window.setTimeout(() => {
      transitionRef.current = { phase: "idle", t: 0 };
      setTrackPulse("idle");
      setTrackRipple(null);
    }, 980);
    return () => {
      window.clearTimeout(swapTimer);
      window.clearTimeout(settleTimer);
    };
  }, [trackPulse, mobile]);

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${MOBILE_MAX - 1}px)`);
    const apply = () => setMobile(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    openRef.current = active;
  }, [active]);

  useEffect(() => {
    if (active === null && !aboutOpen) return;
    if (aboutOpen) aboutCloseRef.current?.focus();
    else closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (active !== null) setActive(null);
        else if (aboutOpen) setAboutOpen(false);
        return;
      }
      if (active === null || projects.length < 2) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setActive((i) => (i === null ? i : (i - 1 + projects.length) % projects.length));
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        setActive((i) => (i === null ? i : (i + 1) % projects.length));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, aboutOpen, projects.length]);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (mobile || !root || !canvas || projects.length === 0) return;

    const previousHtml = document.documentElement.style.background;
    const previousBody = document.body.style.background;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0x000000, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // Liquid-metal About portal. This lives in the same WebGL scene as the
    // portfolio cards so the transition feels like the cards are being pulled
    // around a physical object rather than replaced by a separate overlay.
    const portalGroup = new THREE.Group();
    portalGroup.position.set(0, -0.08, 2.05);
    portalGroup.visible = false;
    scene.add(portalGroup);

    const portalBack = new THREE.Mesh(
      new THREE.CircleGeometry(2.30, 160),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.98 }),
    );
    portalBack.position.z = -0.16;
    portalBack.renderOrder = 1000;
    portalGroup.add(portalBack);

    const torusGeometry = new THREE.TorusGeometry(2.40, 0.36, 112, 384);
    const torusMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xb8a99d,
      metalness: 1,
      roughness: 0.11,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      reflectivity: 1,
      transparent: true,
      opacity: 0.98,
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.renderOrder = 1001;
    portalGroup.add(torus);

    const torusHighlight = new THREE.Mesh(
      new THREE.TorusGeometry(2.40, 0.375, 96, 384),
      new THREE.MeshPhysicalMaterial({
        color: 0x3a302a,
        metalness: 1,
        roughness: 0.07,
        clearcoat: 1,
        clearcoatRoughness: 0.03,
        transparent: true,
        opacity: 0.42,
        side: THREE.DoubleSide,
      }),
    );
    torusHighlight.scale.set(1.002, 1.002, 1.002);
    torusHighlight.renderOrder = 1002;
    portalGroup.add(torusHighlight);

    const portalLight = new THREE.PointLight(0xffd49a, 18, 9, 2);
    portalLight.position.set(-3.4, 2.8, 4.0);
    portalGroup.add(portalLight);

    const portalLightCool = new THREE.PointLight(0x8fa8ff, 11, 8, 2);
    portalLightCool.position.set(3.2, -1.8, 3.2);
    portalGroup.add(portalLightCool);

    const portalLightWhite = new THREE.PointLight(0xffffff, 7, 7, 2);
    portalLightWhite.position.set(0, 3.8, 3.2);
    portalGroup.add(portalLightWhite);

    const portalAmbient = new THREE.AmbientLight(0xffffff, 0.22);
    scene.add(portalAmbient);

    const portalDisplacement = torusGeometry.attributes.position;
    const portalBasePositions = new Float32Array(portalDisplacement.array as ArrayLike<number>);
    const portalBaseHighlight = new Float32Array(torusHighlight.geometry.attributes.position.array as ArrayLike<number>);
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 80);
    camera.position.set(0, 0.42, 7.15);
    camera.lookAt(0, -0.12, 0);

    document.documentElement.style.background = "#000";
    document.body.style.background = "#000";

    const disposables: Array<{ dispose: () => void }> = [];

    const cards: Array<{
      mesh: THREE.Mesh;
      paint: HTMLCanvasElement;
      texture: THREE.CanvasTexture;
      video: HTMLVideoElement | null;
      plus: boolean;
      pointerTarget: THREE.Vector2;
      uniforms: {
        uCardX: { value: number };
        uPointer: { value: THREE.Vector2 };
        uRippleTime: { value: number };
        uHover: { value: number };
        uAbout: { value: number };
        uSwap: { value: number };
        uSwapTime: { value: number };
      };
    }> = [];

    const hoverRef = { current: null as number | null };
    let alive = true;
    const videos: HTMLVideoElement[] = [];
    const plusLogoRef: { current: HTMLImageElement | null } = { current: null };

    loadImage("/images/brands/shopify-plus.png")
      .then((image) => {
        if (!alive) return;
        plusLogoRef.current = image;
        cards.forEach((card, index) => {
          if (!card.plus || card.video) return;
          loadImage(projects[index].card)
            .then((cover) => {
              if (!alive) return;
              paintCard(card.paint, projects[index].title, projects[index].tone, cover, image);
              card.texture.needsUpdate = true;
            })
            .catch(() => {
              paintCard(card.paint, projects[index].title, projects[index].tone, null, image);
              card.texture.needsUpdate = true;
            });
        });
      })
      .catch(() => {});

    projects.forEach((project, index) => {
      const paint = document.createElement("canvas");
      paint.width = 1600;
      paint.height = 990;
      paintCard(paint, project.title, project.tone, null, project.plus ? plusLogoRef.current : null);
      const texture = new THREE.CanvasTexture(paint);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 8;

      const pointerTarget = new THREE.Vector2(0.5, 0.5);
      const entering = transitionRef.current.phase === "in";
      const uniforms = {
        uCardX: { value: 0 },
        uPointer: { value: new THREE.Vector2(0.5, 0.5) },
        uRippleTime: { value: 0 },
        uHover: { value: 0 },
        uAbout: { value: 0 },
        uSwap: { value: entering ? 1 : 0 },
        uSwapTime: { value: entering ? 0.55 : 0 },
      };
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        alphaTest: 0.15,
        toneMapped: false,
        fog: false,
      });
      material.onBeforeCompile = (shader: {
        uniforms: Record<string, { value: unknown }>;
        vertexShader: string;
      }) => {
        Object.assign(shader.uniforms, {
          uCardX: uniforms.uCardX,
          uPointer: uniforms.uPointer,
          uRippleTime: uniforms.uRippleTime,
          uHover: uniforms.uHover,
          uAbout: uniforms.uAbout,
          uSwap: uniforms.uSwap,
          uSwapTime: uniforms.uSwapTime,
        });
        shader.vertexShader = shader.vertexShader
          .replace(
            "void main() {",
            `uniform float uCardX;
            uniform vec2 uPointer;
            uniform float uRippleTime;
            uniform float uHover;
            uniform float uAbout;
            uniform float uSwap;
            uniform float uSwapTime;
            void main() {`,
          )
          .replace(
            "#include <begin_vertex>",
            `#include <begin_vertex>
            ${waveVertex}`,
          );
        material.userData.shader = shader;
      };
      material.customProgramCacheKey = () => "wave-track-swap-v1";
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(CARD_W, CARD_H, 160, 96), material);
      mesh.onBeforeRender = () => {
        const shader = material.userData.shader as
          | {
              uniforms: {
                uCardX: { value: number };
                uPointer: { value: THREE.Vector2 };
                uRippleTime: { value: number };
                uHover: { value: number };
                uAbout: { value: number };
                uSwap: { value: number };
                uSwapTime: { value: number };
              };
            }
          | undefined;
        if (!shader) return;
        shader.uniforms.uCardX.value = uniforms.uCardX.value;
        shader.uniforms.uPointer.value.copy(uniforms.uPointer.value);
        shader.uniforms.uRippleTime.value = uniforms.uRippleTime.value;
        shader.uniforms.uHover.value = uniforms.uHover.value;
        shader.uniforms.uAbout.value = uniforms.uAbout.value;
        shader.uniforms.uSwap.value = uniforms.uSwap.value;
        shader.uniforms.uSwapTime.value = uniforms.uSwapTime.value;
      };
      mesh.frustumCulled = false;
      mesh.userData.index = index;
      scene.add(mesh);

      let video: HTMLVideoElement | null = null;
      if (project.cardVideo) {
        video = document.createElement("video");
        video.src = project.cardVideo;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = "auto";
        video.setAttribute("playsinline", "");
        video.style.position = "fixed";
        video.style.width = "1px";
        video.style.height = "1px";
        video.style.opacity = "0";
        video.style.pointerEvents = "none";
        document.body.appendChild(video);
        video.play().catch(() => {});
        videos.push(video);
      }

      cards.push({ mesh, paint, texture, video, plus: Boolean(project.plus), pointerTarget, uniforms });
      disposables.push(mesh.geometry, material, texture);

      if (!project.cardVideo && project.card) {
        loadImage(project.card)
          .then((image) => {
            if (!alive) return;
            paintCard(
              paint,
              project.title,
              project.tone,
              image,
              project.plus ? plusLogoRef.current : null,
            );
            texture.needsUpdate = true;
          })
          .catch(() => {});
      }
    });

    const pointer = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    const count = projects.length;
    const wrap = (delta: number) => {
      let wrapped = ((delta % count) + count) % count;
      if (wrapped > count / 2) wrapped -= count;
      return wrapped;
    };
    let target = Math.min(2, count - 1);
    let current = target;
    let dragging = false;
    let lastX = 0;
    let moved = 0;

    const resize = () => {
      const width = root.clientWidth || window.innerWidth;
      const height = root.clientHeight || window.innerHeight;
      camera.aspect = width / Math.max(height, 1);
      camera.fov = 32;
      const vFov = (camera.fov * Math.PI) / 180;
      const across = 3.0;
      const targetWidth = SPACING * across;
      const distance = targetWidth / (2 * Math.tan(vFov / 2) * camera.aspect);
      camera.position.set(0, 0.42, distance);
      camera.lookAt(0, -0.12, -0.6);
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      renderer.setSize(width, height, false);
    };
    resize();

    const pick = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(cards.map((card) => card.mesh));
      return hits[0] ?? null;
    };

    const isChromeTarget = (event: Event) =>
      Boolean((event.target as HTMLElement | null)?.closest("[data-chrome], a, button, [data-about-dialog], [data-project-dialog]"));

    const blocked = () => openRef.current !== null || aboutOpenRef.current;

    const onPointerDown = (event: PointerEvent) => {
      if (blocked() || isChromeTarget(event)) return;
      if (event.target !== canvas) return;
      dragging = true;
      lastX = event.clientX;
      moved = 0;
      canvas.setPointerCapture?.(event.pointerId);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (blocked()) return;
      if (dragging) {
        const dx = event.clientX - lastX;
        moved += Math.abs(dx);
        target -= (dx / Math.max(root.clientWidth, 1)) * 5.2;
        lastX = event.clientX;
        return;
      }
      if (isChromeTarget(event)) {
        if (hoverRef.current !== null) {
          hoverRef.current = null;
          setHovered(null);
        }
        return;
      }
      const hit = pick(event);
      const index = hit ? (hit.object.userData.index as number) : null;
      if (hit?.uv && index !== null) {
        const card = cards[index];
        card.pointerTarget.copy(hit.uv);
        if (index !== hoverRef.current) {
          card.uniforms.uPointer.value.copy(hit.uv);
          card.uniforms.uRippleTime.value = 0;
        }
      }
      if (index !== hoverRef.current) {
        hoverRef.current = index;
        setHovered(index);
      }
    };
    const onPointerUp = (event: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      try {
        canvas.releasePointerCapture?.(event.pointerId);
      } catch {
        /* already released */
      }
      if (moved < 7 && openRef.current === null && !aboutOpenRef.current && !isChromeTarget(event)) {
        const hit = pick(event);
        if (hit) setActive(hit.object.userData.index as number);
      }
    };
    const onWheel = (event: WheelEvent) => {
      if (blocked() || isChromeTarget(event)) return;
      event.preventDefault();
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      target += delta * 0.0042;
    };

    nudgeRef.current = (direction: number) => {
      target += direction;
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("resize", resize);

    let frame = 0;
    let aboutAmt = 0;
    let aboutVelocity = 0;
    let aboutLastOpen = false;
    let aboutCloseTime = -1;
    const camHome = new THREE.Vector3(0, 0.42, 7.15);
    const camAbout = new THREE.Vector3(0, 0.02, 10.2);
    const lookHome = new THREE.Vector3(0, -0.12, 0);
    const lookAbout = new THREE.Vector3(0, -0.12, 0);
    const lookCurrent = lookHome.clone();
    const tick = () => {
      frame = requestAnimationFrame(tick);
      if (!dragging && openRef.current !== null) {
        target += wrap(openRef.current - target) * 0.12;
      }
      current += (target - current) * 0.12;

      // Use a spring for the portal instead of the old exponential lerp.
      // This makes opening feel physical and, more importantly, lets closing
      // collapse the ring into the centre instead of simply making it disappear.
      const aboutTarget = aboutOpenRef.current ? 1 : 0;
      if (aboutTarget !== Number(aboutLastOpen)) {
        aboutLastOpen = Boolean(aboutTarget);
        if (!aboutTarget) aboutCloseTime = performance.now();
      }
      aboutVelocity += (aboutTarget - aboutAmt) * 0.075;
      aboutVelocity *= 0.78;
      aboutAmt += aboutVelocity;
      aboutAmt = THREE.MathUtils.clamp(aboutAmt, 0, 1);
      if (!aboutTarget && aboutAmt < 0.002) {
        aboutAmt = 0;
        aboutVelocity = 0;
      }

      // Separate visual easings: the content/camera leave smoothly, while
      // the chrome portal has a slightly more dramatic implosion on close.
      const openEase = aboutAmt * aboutAmt * (3 - 2 * aboutAmt);
      const closeEase = aboutAmt * aboutAmt * aboutAmt;
      const portalEase = aboutTarget ? openEase : closeEase;
      const nowMs = performance.now();
      const closePulse = !aboutTarget && aboutCloseTime > 0
        ? Math.exp(-(nowMs - aboutCloseTime) * 0.006) * Math.sin((nowMs - aboutCloseTime) * 0.022)
        : 0;

      camera.position.lerpVectors(camHome, camAbout, openEase);
      lookCurrent.lerpVectors(lookHome, lookAbout, openEase);
      camera.lookAt(lookCurrent);

      portalGroup.visible = aboutAmt > 0.0005;
      const portalScale = portalEase * (1 + closePulse * 0.085);
      portalGroup.scale.setScalar(Math.max(0.001, portalScale));
      portalGroup.rotation.z = Math.sin(nowMs * 0.00045) * 0.008 * portalEase + closePulse * 0.055;
      portalGroup.rotation.x = Math.sin(nowMs * 0.00032) * 0.012 * portalEase - closePulse * 0.035;
      portalGroup.rotation.y = closePulse * 0.045;

      // Animate the liquid-metal surface without rebuilding the geometry.
      const now = performance.now() * 0.001;
      for (let i = 0; i < portalDisplacement.count; i += 1) {
        const ix = i * 3;
        const bx = portalBasePositions[ix];
        const by = portalBasePositions[ix + 1];
        const bz = portalBasePositions[ix + 2];
        const radial = Math.sqrt(bx * bx + by * by);
        const pulse =
          Math.sin(Math.atan2(by, bx) * 7.0 + now * 0.9) * 0.035 +
          Math.sin(radial * 15.0 - now * 1.35) * 0.018;
        const closeWarp = closePulse * (0.35 + 0.65 * (1 - aboutAmt));
        const scale = 1 + pulse * portalEase + closeWarp * Math.sin(Math.atan2(by, bx) * 3.0);
        portalDisplacement.array[ix] = bx * scale;
        portalDisplacement.array[ix + 1] = by * scale;
        portalDisplacement.array[ix + 2] = bz + pulse * 0.55 * portalEase + closeWarp * 0.12;
      }
      portalDisplacement.needsUpdate = true;

      const highlightPositions = torusHighlight.geometry.attributes.position;
      for (let i = 0; i < highlightPositions.count; i += 1) {
        const ix = i * 3;
        const bx = portalBaseHighlight[ix];
        const by = portalBaseHighlight[ix + 1];
        const bz = portalBaseHighlight[ix + 2];
        const angle = Math.atan2(by, bx);
        const shimmer = Math.sin(angle * 5.0 - now * 1.15) * 0.025 * portalEase;
        const closeShimmer = closePulse * 0.035 * Math.sin(angle * 2.0);
        highlightPositions.array[ix] = bx * (1 + shimmer + closeShimmer);
        highlightPositions.array[ix + 1] = by * (1 + shimmer + closeShimmer);
        highlightPositions.array[ix + 2] = bz + shimmer * 0.5 + closePulse * 0.06;
      }
      highlightPositions.needsUpdate = true;

      const hoverMetal = aboutHoverRef.current ? 1 : 0;
      torusMaterial.roughness = 0.16 - hoverMetal * 0.07;
      torusMaterial.opacity = Math.min(0.98, 0.18 + portalEase * 0.8);
      torusHighlight.material.opacity = (0.34 + hoverMetal * 0.22) * portalEase;
      portalLight.intensity = (18 + hoverMetal * 8) * portalEase;
      portalLightCool.intensity = (11 + hoverMetal * 5) * portalEase;
      portalLightWhite.intensity = 7 * portalEase;
      portalBack.material.opacity = 0.98 * portalEase;

      // Track swap ripple: wash out the current ribbon, swap projects at the
      // peak, then wash the new ribbon back in.
      const transition = transitionRef.current;
      let swapStrength = 0;
      let swapTime = 0;
      let swapDim = 1;
      if (!reduce && transition.phase === "out") {
        transition.t = Math.min(1, transition.t + 0.034);
        const t = transition.t;
        swapStrength = Math.sin(Math.min(1, t * 1.15) * Math.PI);
        swapTime = t * 1.55;
        swapDim = 1 - Math.min(1, t * 1.35) * 0.78;
        // Swap at the ripple crest so the new set rises out of the wash.
        if (t >= 0.5 && pendingTrackRef.current) {
          const next = pendingTrackRef.current;
          pendingTrackRef.current = null;
          transitionRef.current = { phase: "in", t: 0 };
          setTrackPulse("in");
          setTrack(next);
        }
      } else if (!reduce && transition.phase === "in") {
        transition.t = Math.min(1, transition.t + 0.032);
        const t = transition.t;
        // Start at full wash (matches remount) and settle as the ribbon resolves.
        swapStrength = (1 - t) * (0.55 + 0.45 * Math.cos(t * Math.PI * 0.5));
        swapTime = 0.6 + t * 1.2;
        swapDim = 0.22 + t * 0.78;
        if (t >= 1) {
          transitionRef.current = { phase: "idle", t: 0 };
          setTrackPulse("idle");
          setTrackRipple(null);
        }
      }

      cards.forEach((card, index) => {
        const x = wrap(index - current) * SPACING;
        const crest = Math.cos(THREE.MathUtils.clamp(x * 0.82, -1.2, 1.2));
        const dim = (0.68 + 0.32 * Math.max(crest, 0)) * swapDim;

        card.mesh.position.set(x, 0, 0);
        card.mesh.rotation.set(0, 0, 0);
        card.mesh.scale.set(1, 1, 1);
        card.mesh.renderOrder = 10;
        card.uniforms.uCardX.value = x;
        card.uniforms.uAbout.value = openEase;
        card.uniforms.uSwap.value = swapStrength;
        card.uniforms.uSwapTime.value = swapTime;

        const material = card.mesh.material as THREE.MeshBasicMaterial;
        material.color.setRGB(dim, dim, dim);

        const goal =
          aboutOpenRef.current || transition.phase !== "idle"
            ? 0
            : hoverRef.current === index
              ? 1
              : 0;
        card.uniforms.uHover.value += (goal - card.uniforms.uHover.value) * 0.14;
        card.uniforms.uPointer.value.lerp(card.pointerTarget, 0.18);
        if (!reduce && card.uniforms.uHover.value > 0.01) {
          card.uniforms.uRippleTime.value += 0.045;
        }

        if (card.video && card.video.readyState >= 2) {
          paintCard(card.paint, projects[index].title, projects[index].tone, card.video, card.plus ? plusLogoRef.current : null);
          card.texture.needsUpdate = true;
        }
      });

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      alive = false;
      cancelAnimationFrame(frame);
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", resize);
      disposables.forEach((item) => item.dispose());
      torusGeometry.dispose();
      torusMaterial.dispose();
      torusHighlight.geometry.dispose();
      (torusHighlight.material as THREE.Material).dispose();
      portalBack.geometry.dispose();
      (portalBack.material as THREE.Material).dispose();
      videos.forEach((video) => {
        video.pause();
        video.removeAttribute("src");
        video.load();
        video.remove();
      });
      renderer.dispose();
      document.documentElement.style.background = previousHtml;
      document.body.style.background = previousBody;
    };
  }, [projects, mobile]);

  useEffect(() => {
    if (!mobile) return;
    const previousHtml = document.documentElement.style.background;
    const previousBody = document.body.style.background;
    document.documentElement.style.background = "#000";
    document.body.style.background = "#000";
    return () => {
      document.documentElement.style.background = previousHtml;
      document.body.style.background = previousBody;
    };
  }, [mobile]);

  useEffect(() => {
    if (!mobile) return;
    const el = mobileScrollRef.current;
    if (!el || projects.length === 0) return;

    const syncLoop = () => {
      const setHeight = el.scrollHeight / 3;
      if (setHeight <= 0) return;
      if (el.scrollTop < setHeight * 0.35) {
        el.scrollTop += setHeight;
      } else if (el.scrollTop > setHeight * 1.65) {
        el.scrollTop -= setHeight;
      }
    };

    const jumpToMiddle = () => {
      const setHeight = el.scrollHeight / 3;
      if (setHeight > 0) el.scrollTop = setHeight;
    };

    requestAnimationFrame(jumpToMiddle);
    el.addEventListener("scroll", syncLoop, { passive: true });
    return () => el.removeEventListener("scroll", syncLoop);
  }, [mobile, projects.length]);

  const project = active === null ? null : projects[active];
  const prevIndex = active === null ? null : (active - 1 + projects.length) % projects.length;
  const nextIndex = active === null ? null : (active + 1) % projects.length;
  const prevProject = prevIndex === null ? null : projects[prevIndex];
  const nextProject = nextIndex === null ? null : projects[nextIndex];
  const overlayOpen = aboutOpen || project !== null;
  const mobileLoop = mobile ? [...projects, ...projects, ...projects] : projects;
  const goProject = (index: number) => setActive(index);
  const popupBulge = Math.sin(popupScroll * Math.PI * 2);
  const popupBulgePath = bulgePanelPath(popupBulge);

  return (
    <div ref={rootRef} className="relative h-[100dvh] w-full overflow-hidden bg-black text-white">
      {mobile ? (
        <>
          <div
            ref={mobileScrollRef}
            className={`absolute inset-0 z-0 overflow-y-auto overscroll-contain transition-[filter,opacity,transform] duration-500 ease-out ${
              trackPulse === "out"
                ? "scale-[1.03] opacity-35 blur-[7px]"
                : trackPulse === "in"
                  ? "wave-track-in"
                  : "scale-100 opacity-100 blur-0"
            }`}
          >
            <ul className="flex flex-col gap-4 px-5 py-28">
              {mobileLoop.map((item, loopIndex) => {
                const index = loopIndex % projects.length;
                return (
                  <li key={`${item.slug}-${loopIndex}`}>
                    <button
                      type="button"
                      onClick={() => setActive(index)}
                      className="relative block w-full overflow-hidden rounded-[22px] text-left"
                      style={{ background: item.tone }}
                      data-cursor={overlayOpen ? undefined : "Open"}
                    >
                      <div className="relative aspect-[16/10] w-full">
                        {item.cardVideo ? (
                          <video
                            src={item.cardVideo}
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                        ) : item.card ? (
                          <img
                            src={item.card}
                            alt=""
                            className="absolute inset-0 h-full w-full object-cover object-top"
                          />
                        ) : null}
                        {item.plus ? (
                          <span className="pointer-events-none absolute top-3 left-3 inline-flex items-center rounded-full bg-white px-2.5 py-1.5">
                            <img
                              src="/images/brands/shopify-plus.png"
                              alt="Shopify Plus"
                              className="h-2.5 w-auto"
                            />
                          </span>
                        ) : null}
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-5 pt-16 pb-5">
                          <p className="text-[1.35rem] leading-none tracking-[-0.03em]">{item.title}</p>
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-28 bg-gradient-to-b from-black via-black/85 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-28 bg-gradient-to-t from-black via-black/85 to-transparent" />
        </>
      ) : (
        <>
          <canvas
            ref={canvasRef}
            className={`absolute inset-0 z-0 h-full w-full transition-[filter,opacity,transform] duration-500 ease-out ${
              trackPulse === "out"
                ? "scale-[1.035] opacity-45 blur-[8px] brightness-[0.65]"
                : trackPulse === "in"
                  ? "wave-track-in"
                  : "scale-100 opacity-100 blur-0 brightness-100"
            }`}
            data-cursor={hovered === null || overlayOpen ? undefined : "Open"}
            aria-label="Selected Lab 13 work"
          />
          <div
            className={`pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.45)_100%)] transition-opacity duration-700 ${aboutOpen ? "opacity-30" : "opacity-100"}`}
          />
          <div
            className={`pointer-events-none absolute inset-y-0 left-0 z-[2] w-[18%] bg-gradient-to-r from-black via-black/80 to-transparent transition-opacity duration-700 sm:w-[22%] ${aboutOpen ? "opacity-0" : "opacity-100"}`}
          />
          <div
            className={`pointer-events-none absolute inset-y-0 right-0 z-[2] w-[18%] bg-gradient-to-l from-black via-black/80 to-transparent transition-opacity duration-700 sm:w-[22%] ${aboutOpen ? "opacity-0" : "opacity-100"}`}
          />
        </>
      )}

      {trackRipple ? (
        <div
          key={trackRipple.key}
          className="pointer-events-none absolute inset-0 z-[25] overflow-hidden"
          aria-hidden
        >
          <span
            className="wave-track-bloom"
            style={{ left: trackRipple.x, top: trackRipple.y }}
          />
          <span
            className="wave-track-ring"
            style={{ left: trackRipple.x, top: trackRipple.y, animationDelay: "0ms" }}
          />
          <span
            className="wave-track-ring wave-track-ring--mid"
            style={{ left: trackRipple.x, top: trackRipple.y, animationDelay: "70ms" }}
          />
          <span
            className="wave-track-ring wave-track-ring--soft"
            style={{ left: trackRipple.x, top: trackRipple.y, animationDelay: "140ms" }}
          />
        </div>
      ) : null}

      <div
        data-chrome
        className="pointer-events-none absolute inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-6 sm:px-10"
      >
        <Link
          href="/"
          className="wave-chrome pointer-events-auto relative z-40 px-2 py-2 font-normal leading-none tracking-[0.22em] uppercase"
        >
          {site.shortName}
        </Link>
        {!aboutOpen ? (
          <nav
            aria-label="Portfolio"
            className="pointer-events-auto absolute left-1/2 top-1/2 z-40 flex -translate-x-1/2 -translate-y-1/2 items-center gap-3"
          >
            <button
              type="button"
              onClick={(event) => switchTrack("shopify", event)}
              className={`wave-chrome px-2 py-2 font-normal leading-none tracking-[0.22em] uppercase transition-colors ${
                track === "shopify" ? "text-white" : "text-white/45 hover:text-white/75"
              }`}
              aria-current={track === "shopify" ? "page" : undefined}
            >
              Shopify
            </button>
            <span aria-hidden className="text-white/25">
              |
            </span>
            <button
              type="button"
              onClick={(event) => switchTrack("branding", event)}
              className={`wave-chrome px-2 py-2 font-normal leading-none tracking-[0.22em] uppercase transition-colors ${
                track === "branding" ? "text-white" : "text-white/45 hover:text-white/75"
              }`}
              aria-current={track === "branding" ? "page" : undefined}
            >
              Branding
            </button>
          </nav>
        ) : null}
        {!aboutOpen ? (
          <button
            type="button"
            onClick={() => setAboutOpen(true)}
            className="wave-chrome pointer-events-auto relative z-40 px-2 py-2 font-normal leading-none tracking-[0.22em] uppercase text-white/80"
          >
            About
          </button>
        ) : (
          <span aria-hidden className="px-2 py-2" />
        )}
      </div>

      <div
        data-chrome
        className="pointer-events-none absolute inset-x-0 bottom-0 z-40 flex items-end justify-between gap-4 px-6 py-6 sm:px-10"
      >
        <p className="wave-chrome px-2 py-2 font-normal leading-none tracking-[0.22em] uppercase text-white/55">
          {track === "branding" ? "We know Branding" : "We know Shopify"}
        </p>
        <TrackOfTheDay className="absolute bottom-6 left-1/2 z-50 -translate-x-1/2 sm:bottom-8" />
        <p className="wave-chrome relative z-40 px-2 py-2 font-normal leading-none tracking-[0.22em] uppercase text-white/80">
          Contact
        </p>
      </div>

      <ul className="sr-only">
        {projects.map((item, index) => (
          <li key={item.slug}>
            <button type="button" onClick={() => setActive(index)}>
              Open {item.title}
            </button>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {aboutOpen ? (
          <motion.div
            className="absolute inset-0 z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
          >
            <button
              type="button"
              aria-label="Close about"
              className="absolute inset-0 cursor-default bg-transparent"
              onClick={() => setAboutOpen(false)}
            />

            <button
              ref={aboutCloseRef}
              type="button"
              data-chrome
              onClick={() => setAboutOpen(false)}
              className="wave-chrome absolute top-6 right-6 z-40 px-2 py-2 font-normal tracking-[0.22em] uppercase text-white/85 sm:top-8 sm:right-10"
            >
              Close
            </button>

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="about-title"
              data-about-dialog
              data-chrome
              onPointerEnter={() => setAboutHover(true)}
              onPointerLeave={() => setAboutHover(false)}
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
              initial={{ scale: 0.35, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.72, opacity: 0 }}
              transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                className="pointer-events-auto relative flex aspect-square w-[min(64vw,64dvh)] flex-col items-center justify-center overflow-visible sm:w-[min(58vw,58dvh)]"
                onClick={(event) => event.stopPropagation()}
              >
                {/* Three.js owns the actual liquid-metal portal. This layer only
                    provides the deep black aperture behind the copy. */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute left-1/2 top-1/2 z-0 aspect-square w-[74%] -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, #000 0%, #000 64%, rgba(0,0,0,0.94) 74%, rgba(0,0,0,0) 100%)",
                    boxShadow:
                      "0 0 80px rgba(0,0,0,0.95), inset 0 0 50px rgba(0,0,0,1)",
                  }}
                />

                <div className="relative z-10 flex max-h-[72%] max-w-[min(34rem,68%)] flex-col items-center justify-center px-6 text-center text-white">
                  <h2 id="about-title" className="sr-only">
                    About
                  </h2>
                  <p className="max-w-[34ch] text-[clamp(0.95rem,1.8vw,1.15rem)] leading-[1.45] tracking-[-0.01em] text-white/90">
                    {studio.about}
                  </p>
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-[10px] tracking-[0.16em] uppercase text-white/45">
                    {studio.people.map((person) => (
                      <span key={person.name}>
                        {person.name}
                        <span className="mx-1.5 text-white/20">·</span>
                        {person.role}
                      </span>
                    ))}
                  </div>
                  <a
                    href={`mailto:${site.email}`}
                    className="mt-8 text-[10px] tracking-[0.2em] uppercase text-white/70 underline underline-offset-[5px]"
                  >
                    Email
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {project && active !== null ? (
          <motion.div
            className="absolute inset-0 z-30 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <button
              type="button"
              aria-label="Close project"
              className="absolute inset-0 bg-black/35"
              onClick={() => setActive(null)}
            />

            <div className="relative z-10 h-full w-full overflow-hidden py-3 sm:py-4 md:py-5">
              {prevProject && prevIndex !== null && projects.length > 1 ? (
                <button
                  type="button"
                  aria-label={`Previous project: ${prevProject.title}`}
                  onClick={() => goProject(prevIndex)}
                  className="absolute top-[7%] bottom-[7%] left-0 z-0 w-[min(90vw,70rem)] -translate-x-[calc(100%-2.5rem)] overflow-hidden rounded-[1.85rem] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.35)] sm:-translate-x-[calc(100%-2.85rem)] md:top-[8%] md:bottom-[8%] md:-translate-x-[calc(100%-3.1rem)]"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.5),rgba(0,0,0,0.72))]" />
                  <span className="sr-only">{prevProject.title}</span>
                </button>
              ) : null}

              <motion.div
                key={project.slug}
                role="dialog"
                aria-modal="true"
                aria-labelledby="project-title"
                data-project-dialog
                onPointerDown={(event) => {
                  if ((event.target as HTMLElement).closest("a, button, [data-gallery]")) return;
                  const startX = event.clientX;
                  const startY = event.clientY;
                  const onUp = (up: PointerEvent) => {
                    window.removeEventListener("pointerup", onUp);
                    const dx = up.clientX - startX;
                    const dy = up.clientY - startY;
                    if (Math.abs(dx) < 70 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
                    if (projects.length < 2) return;
                    if (dx > 0 && prevIndex !== null) goProject(prevIndex);
                    else if (dx < 0 && nextIndex !== null) goProject(nextIndex);
                  };
                  window.addEventListener("pointerup", onUp);
                }}
                className="relative z-10 mx-[3.35rem] flex h-full flex-col overflow-visible text-[#111] sm:mx-[3.75rem] md:mx-[4.25rem] md:flex-row"
                initial={{ x: 28, opacity: 0.85, scale: 0.985 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                exit={{ x: -28, opacity: 0.85, scale: 0.985 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <svg
                  className="pointer-events-none absolute inset-0 h-full w-full overflow-visible drop-shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
                  viewBox="0 0 1 1"
                  preserveAspectRatio="none"
                  aria-hidden
                >
                  <defs>
                    <clipPath id={`project-bulge-clip-${projectBulgeId}`} clipPathUnits="objectBoundingBox">
                      <path d={popupBulgePath} />
                    </clipPath>
                  </defs>
                  <path d={popupBulgePath} fill="#ffffff" />
                </svg>

                <div
                  className="relative z-10 flex min-h-0 w-full flex-1 flex-col md:flex-row"
                  style={{ clipPath: `url(#project-bulge-clip-${projectBulgeId})` }}
                >
                  <div className="hide-scrollbar flex shrink-0 flex-col px-7 pt-10 pb-8 sm:px-10 md:w-[34%] md:overflow-y-auto md:px-12 md:pt-14">
                    <h2 id="project-title" className="display text-[clamp(2.5rem,4.4vw,4.3rem)]">
                      {project.title}
                    </h2>
                    <p className="mt-6 max-w-[36ch] text-[15px] leading-relaxed text-black/70">{project.summary}</p>
                    {project.result ? (
                      <p className="mt-5 max-w-[36ch] text-[14px] leading-relaxed text-black/50">{project.result}</p>
                    ) : null}
                    <div className="mt-8 flex flex-wrap items-center gap-2">
                      <a
                        href={project.liveUrl ?? `/work/${project.slug}`}
                        target={project.liveUrl ? "_blank" : undefined}
                        rel={project.liveUrl ? "noreferrer" : undefined}
                        className="grid h-10 w-10 place-items-center rounded-full bg-black text-white"
                        aria-label={project.liveUrl ? `Visit ${project.title}` : `Open ${project.title} case study`}
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                          <path d="M2 7h10M8 3l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.4" />
                        </svg>
                      </a>
                      {[project.client, project.industry, project.services[0]].filter(Boolean).map((pill) => (
                        <span
                          key={pill}
                          className="rounded-full border border-black/15 px-3 py-2 text-[10px] tracking-[0.16em] uppercase"
                        >
                          {pill}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={`/work/${project.slug}`}
                      className="mt-8 text-[11px] tracking-[0.18em] uppercase underline underline-offset-[6px]"
                    >
                      Case study
                    </Link>
                  </div>

                  <div
                    data-gallery
                    className="hide-scrollbar min-h-0 flex-1 overflow-y-auto px-4 pb-4 md:px-5 md:pt-5 md:pb-5"
                    onScroll={(event) => {
                      const el = event.currentTarget;
                      const max = Math.max(el.scrollHeight - el.clientHeight, 1);
                      setPopupScroll(Math.min(1, Math.max(0, el.scrollTop / max)));
                    }}
                  >
                    <div className="flex flex-col gap-4 md:gap-5">
                      {project.frames.map((src) => (
                        <RippleFrame key={src} src={src} />
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  ref={closeRef}
                  type="button"
                  aria-label="Close"
                  onClick={() => setActive(null)}
                  className="absolute top-4 right-4 z-30 grid h-11 w-11 place-items-center rounded-full bg-black text-white"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                    <path d="M1 1l12 12M13 1L1 13" fill="none" stroke="currentColor" strokeWidth="1.4" />
                  </svg>
                </button>
              </motion.div>

              {nextProject && nextIndex !== null && projects.length > 1 ? (
                <button
                  type="button"
                  aria-label={`Next project: ${nextProject.title}`}
                  onClick={() => goProject(nextIndex)}
                  className="absolute top-[7%] bottom-[7%] right-0 z-0 w-[min(90vw,70rem)] translate-x-[calc(100%-2.5rem)] overflow-hidden rounded-[1.85rem] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.35)] sm:translate-x-[calc(100%-2.85rem)] md:top-[8%] md:bottom-[8%] md:translate-x-[calc(100%-3.1rem)]"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(270deg,rgba(0,0,0,0.5),rgba(0,0,0,0.72))]" />
                  <span className="sr-only">{nextProject.title}</span>
                </button>
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
