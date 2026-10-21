<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

const props = withDefaults(
  defineProps<{ mode?: "hero" | "preview" | "lab" }>(),
  { mode: "hero" },
);
const canvas = ref<HTMLCanvasElement>();
const ready = ref(false);
const selected = ref(0);
const message = ref("选择一个节点，开始探索。");
const paused = ref(false);
const names = [
  "CURIOSITY",
  "IDEA",
  "PEOPLE",
  "DESIGN",
  "BUILD",
  "QUESTION",
  "LEARN",
  "PLAY",
  "CONNECT",
];
const initial = [
  [0.5, 0.49],
  [0.3, 0.23],
  [0.71, 0.22],
  [0.78, 0.52],
  [0.63, 0.79],
  [0.33, 0.79],
  [0.17, 0.49],
  [0.48, 0.12],
  [0.85, 0.78],
];
let points = initial.map(([x, y]) => ({ x: x!, y: y! }));
let width = 600,
  height = 400,
  frame = 0,
  drag = -1,
  visible = true;
let ctx: CanvasRenderingContext2D | null = null;
let resizeObserver: ResizeObserver | undefined;
let intersectionObserver: IntersectionObserver | undefined;
let reduced: MediaQueryList | undefined;
let lastTime = 0;
const dark = props.mode !== "hero";

function draw(time = 0) {
  if (!ctx) return;
  ctx.clearRect(0, 0, width, height);
  const motion =
    props.mode === "hero" && !reduced?.matches && !paused.value
      ? Math.sin(time / 2400) * 5
      : 0;
  const rendered = points.map((p, i) => ({
    x: p.x * width + (i % 2 ? motion : -motion),
    y: p.y * height + (i % 3 ? motion : -motion),
  }));
  // Fine constellation grid.
  ctx.fillStyle = dark ? "rgba(185,192,236,.12)" : "rgba(83,102,216,.14)";
  for (let x = 14; x < width; x += 26)
    for (let y = 14; y < height; y += 26) {
      ctx.beginPath();
      ctx.arc(x, y, 0.7, 0, Math.PI * 2);
      ctx.fill();
    }
  const center = rendered[0]!;
  ctx.strokeStyle = dark ? "rgba(172,183,255,.10)" : "rgba(83,102,216,.12)";
  for (const scale of [0.21, 0.35, 0.46]) {
    ctx.beginPath();
    ctx.ellipse(
      width * 0.5,
      height * 0.49,
      width * scale,
      height * scale * 0.85,
      -0.23,
      0,
      Math.PI * 2,
    );
    ctx.stroke();
  }
  rendered.forEach((p, i) =>
    rendered.forEach((q, j) => {
      if (
        i >= j ||
        (i !== 0 && Math.hypot(p.x - q.x, p.y - q.y) > width * 0.37)
      )
        return;
      ctx!.strokeStyle = dark
        ? "rgba(164,178,244,.28)"
        : "rgba(83,102,216,.25)";
      ctx!.lineWidth = i === 0 ? 1.2 : 0.7;
      ctx!.beginPath();
      ctx!.moveTo(p.x, p.y);
      ctx!.lineTo(q.x, q.y);
      ctx!.stroke();
    }),
  );
  rendered.forEach((p, i) => {
    const radius = i === 0 ? (props.mode === "hero" ? 12 : 10) : 5;
    if (i === 0 || (props.mode === "lab" && selected.value === i)) {
      ctx!.fillStyle = dark ? "rgba(133,153,255,.1)" : "rgba(83,102,216,.06)";
      ctx!.beginPath();
      ctx!.arc(p.x, p.y, radius + 14, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.strokeStyle = dark ? "rgba(133,153,255,.35)" : "rgba(83,102,216,.3)";
      ctx!.stroke();
    }
    ctx!.fillStyle =
      i === 0 ? (dark ? "#aebcff" : "#5366d8") : dark ? "#778ab9" : "#9aa8db";
    ctx!.beginPath();
    ctx!.arc(p.x, p.y, radius, 0, Math.PI * 2);
    ctx!.fill();
    if (props.mode !== "preview") {
      ctx!.font = `${width < 400 ? 8 : 10}px "JetBrains Mono", monospace`;
      ctx!.fillStyle = dark ? "#b6bfd9" : "#69708a";
      ctx!.textAlign = "center";
      ctx!.fillText(names[i]!, p.x, p.y + radius + 22);
    }
  });
  ctx.beginPath();
  ctx.arc(center.x, center.y, 2.5, 0, Math.PI * 2);
  ctx.fillStyle = dark ? "#1b2334" : "#fff";
  ctx.fill();
}

function animate(time: number) {
  if (visible && !document.hidden && time - lastTime > 32) {
    draw(time);
    lastTime = time;
  }
  frame = requestAnimationFrame(animate);
}
function updateMotion() {
  cancelAnimationFrame(frame);
  draw();
  if (props.mode === "hero" && !reduced?.matches && !paused.value)
    frame = requestAnimationFrame(animate);
}
function resize() {
  if (!canvas.value || !ctx) return;
  const rect = canvas.value.getBoundingClientRect();
  width = rect.width;
  height = rect.height;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.value.width = width * dpr;
  canvas.value.height = height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  draw();
}
function location(event: PointerEvent) {
  const rect = canvas.value!.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) / rect.width,
    y: (event.clientY - rect.top) / rect.height,
  };
}
function pointerDown(event: PointerEvent) {
  if (props.mode !== "lab") return;
  const p = location(event);
  drag = points.findIndex(
    (node) => Math.hypot((node.x - p.x) * width, (node.y - p.y) * height) < 28,
  );
  if (drag >= 0) {
    selected.value = drag;
    canvas.value?.setPointerCapture(event.pointerId);
    canvas.value?.focus({ preventScroll: true });
    draw();
  }
}
function pointerMove(event: PointerEvent) {
  if (drag < 0) return;
  const p = location(event);
  points[drag] = {
    x: Math.max(0.08, Math.min(0.92, p.x)),
    y: Math.max(0.09, Math.min(0.86, p.y)),
  };
  draw();
}
function pointerUp(event: PointerEvent) {
  if (drag < 0) return;
  message.value = `${names[drag]} 的位置已更新。`;
  drag = -1;
  if (canvas.value?.hasPointerCapture(event.pointerId))
    canvas.value.releasePointerCapture(event.pointerId);
}
function move(dx: number, dy: number) {
  const p = points[selected.value]!;
  p.x = Math.max(0.08, Math.min(0.92, p.x + dx));
  p.y = Math.max(0.09, Math.min(0.86, p.y + dy));
  message.value = `${names[selected.value]} 已移动。`;
  draw();
}
function keydown(event: KeyboardEvent) {
  const direction: Record<string, [number, number]> = {
    ArrowLeft: [-0.03, 0],
    ArrowRight: [0.03, 0],
    ArrowUp: [0, -0.03],
    ArrowDown: [0, 0.03],
  };
  if (direction[event.key]) {
    event.preventDefault();
    move(...direction[event.key]!);
  }
}
function reset() {
  points = initial.map(([x, y]) => ({ x: x!, y: y! }));
  selected.value = 0;
  message.value = "所有节点已恢复初始位置。";
  draw();
}
function toggleMotion() {
  paused.value = !paused.value;
  updateMotion();
}
onMounted(() => {
  ctx = canvas.value?.getContext("2d") || null;
  ready.value = !!ctx;
  reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  reduced.addEventListener("change", updateMotion);
  resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas.value!);
  intersectionObserver = new IntersectionObserver((entries) => {
    visible = entries[0]?.isIntersecting ?? true;
  });
  intersectionObserver.observe(canvas.value!);
  resize();
  updateMotion();
  // Canvas text must be redrawn once the self-hosted webfont has loaded.
  document.fonts.ready.then(() => {
    if (ctx) draw();
  });
});
onUnmounted(() => {
  cancelAnimationFrame(frame);
  resizeObserver?.disconnect();
  intersectionObserver?.disconnect();
  reduced?.removeEventListener("change", updateMotion);
  ctx = null;
});
</script>

<template>
  <div class="network" :class="`network-${mode}`">
    <div class="network-canvas-wrap">
      <svg
        v-if="!ready"
        class="network-fallback"
        viewBox="0 0 600 400"
        aria-hidden="true"
      >
        <g stroke="#8999d8" fill="none" opacity=".5">
          <ellipse cx="300" cy="200" rx="220" ry="140" />
          <path
            d="M300 200L180 92 102 196 198 316 378 316 468 208 426 88Z M300 200L198 316M300 200L468 208M300 200L426 88"
          />
        </g>
        <circle cx="300" cy="200" r="12" fill="#8999d8" />
      </svg>
      <canvas
        ref="canvas"
        :tabindex="mode === 'lab' ? 0 : undefined"
        :role="mode === 'lab' ? 'group' : 'img'"
        :aria-label="
          mode === 'lab'
            ? '节点网络画布。拖拽节点，或使用下方控件选择节点后用方向键移动。'
            : '想法、设计和开发互相连接的节点网络'
        "
        @pointerdown="pointerDown"
        @pointermove="pointerMove"
        @pointerup="pointerUp"
        @pointercancel="pointerUp"
        @keydown="keydown"
        >节点网络示意；互动需要启用 JavaScript。</canvas
      >
      <button
        v-if="mode === 'hero' && ready"
        class="motion-toggle"
        :aria-pressed="paused"
        @click="toggleMotion"
      >
        {{ paused ? "播放动态" : "暂停动态" }}
      </button>
    </div>
    <div v-if="mode === 'lab'" class="network-controls">
      <label
        >选择节点<select v-model.number="selected" @change="draw()">
          <option v-for="(name, i) in names" :key="name" :value="i">
            {{ name }}
          </option>
        </select></label
      >
      <div class="direction-controls" aria-label="移动所选节点">
        <button aria-label="向左移动节点" @click="move(-0.03, 0)">←</button
        ><button aria-label="向上移动节点" @click="move(0, -0.03)">↑</button
        ><button aria-label="向下移动节点" @click="move(0, 0.03)">↓</button
        ><button aria-label="向右移动节点" @click="move(0.03, 0)">→</button>
      </div>
      <button class="reset-button" @click="reset">重置网络 ↺</button>
      <p class="network-status" role="status">{{ message }}</p>
    </div>
  </div>
</template>
