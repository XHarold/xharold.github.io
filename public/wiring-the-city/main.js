"use strict";

const cityOrder = ["london", "shenzhen", "hangzhou", "shanghai", "seoul"];
const numberFormat = new Intl.NumberFormat("zh-CN", { maximumFractionDigits: 0 });
const $ = (id) => document.getElementById(id);
const state = { cities: [], city: null, day: null, hour: null, hover: null, locked: null, lineHover: null, lineLocked: null };
let tideSvg = null;
let radialSvg = null;

function dayName(city, day) {
  if (day === "non_workday") return "休息日";
  if (day === "all_days") return "5 个工作日";
  return "工作日";
}

function directionName(direction) {
  if (direction === "toward_inner") return "内区集聚趋势";
  if (direction === "toward_outer") return "外区集聚趋势";
  return "内外区方向未一致";
}

function cityById(id) {
  return state.cities.find((city) => city.id === id);
}

function createButton(label, className, pressed, action) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.textContent = label;
  button.setAttribute("aria-pressed", String(pressed));
  button.addEventListener("click", action);
  return button;
}

const svgNS = "http://www.w3.org/2000/svg";
const zoneLabels = {
  shanghai: "内环", shenzhen: "二线关", hangzhou: "限行圈", london: "内环路", seoul: "2 号线环",
};
const signedNumber = (value) => `${value > 0 ? "+" : value < 0 ? "−" : ""}${numberFormat.format(Math.abs(value))}`;

function point(radius, angle) {
  const radians = angle * Math.PI / 180;
  return [430 + radius * Math.sin(radians), 550 - radius * Math.cos(radians)];
}

function sector(slot, count) {
  const start = 390 + slot * 300 / count;
  const end = 390 + (slot + 1) * 300 / count;
  const a = point(55, start), b = point(400, start), c = point(400, end), d = point(55, end);
  return `M ${a} L ${b} A 400 400 0 0 1 ${c} L ${d} A 55 55 0 0 0 ${a} Z`;
}

function parseDiagram(markup) {
  const documentSvg = new DOMParser().parseFromString(markup, "image/svg+xml");
  if (documentSvg.querySelector("parsererror")) throw new Error("SVG could not be parsed");
  return document.importNode(documentSvg.documentElement, true);
}

function toggleSelection(selection) {
  const same = state.locked?.type === selection.type && state.locked?.value === selection.value;
  state.locked = same ? null : selection;
  state.hover = null;
  renderSelection();
}

function previewSelection(selection) {
  if (state.hover?.type === selection.type && state.hover?.value === selection.value) return;
  state.hover = selection;
  renderSelection();
}

function clearPreview(type) {
  if (state.hover?.type !== type) return;
  state.hover = null;
  renderSelection();
}

function updateLocation() {
  if (window.location.protocol === "file:") return;
  const url = new URL(window.location.href);
  url.searchParams.set("city", state.city.id);
  if (state.city.days.length > 1) url.searchParams.set("day", state.day);
  else url.searchParams.delete("day");
  window.history.replaceState(null, "", url);
}

function setCity(id) {
  const city = cityById(id);
  if (!city) return;
  state.city = city;
  state.day = city.days[0];
  state.hover = state.locked = state.lineHover = state.lineLocked = null;
  const rows = city.hourly[state.day];
  state.hour = rows.reduce((best, row) => row.activity > best.activity ? row : best).hour;
  render();
}

function setDay(day) {
  if (!state.city.days.includes(day)) return;
  state.day = day;
  state.hover = state.locked = state.lineHover = state.lineLocked = null;
  const rows = state.city.hourly[day];
  state.hour = rows.reduce((best, row) => row.activity > best.activity ? row : best).hour;
  render();
}

function renderMileage() {
  const list = $("mileage-list");
  list.replaceChildren();
  const maximum = Math.max(...state.cities.map((city) => city.mileage));
  for (const id of cityOrder) {
    const city = cityById(id);
    const row = createButton("", "mileage-row", city.id === state.city.id, () => {
      setCity(city.id);
      $("explore").scrollIntoView({ behavior: "smooth" });
    });
    row.setAttribute("aria-label", `${city.name}，${city.mileage.toFixed(2)} 公里，查看城市节律`);
    const name = document.createElement("span");
    name.className = "mileage-city";
    name.textContent = city.english;
    const local = document.createElement("small");
    local.textContent = city.name;
    name.append(local);
    const track = document.createElement("span");
    track.className = "mileage-track";
    const bar = document.createElement("span");
    bar.className = "mileage-bar";
    bar.style.setProperty("--length", `${(city.mileage / maximum * 100).toFixed(3)}%`);
    bar.style.setProperty("--bar", city.color);
    track.append(bar);
    const value = document.createElement("span");
    value.className = "mileage-number";
    value.textContent = city.mileage.toFixed(2);
    const unit = document.createElement("small");
    unit.textContent = "km";
    value.append(unit);
    row.append(name, track, value);
    list.append(row);
  }
}

function renderControls() {
  const cities = $("city-picker");
  const tabs = $("city-tabs");
  const days = $("day-picker");
  cities.replaceChildren();
  tabs.replaceChildren();
  days.replaceChildren();
  for (const [index, id] of cityOrder.entries()) {
    const city = cityById(id);
    const button = createButton("", "stamp-choice", city.id === state.city.id, () => {
      setCity(city.id);
      $("explore").scrollIntoView({ behavior: "smooth" });
    });
    button.setAttribute("aria-label", `查看${city.name}城市节律`);
    button.style.setProperty("--stamp-color", city.color);
    const image = document.createElement("img");
    image.src = city.stampAsset;
    image.alt = "";
    image.width = 1290;
    image.height = 1840;
    const caption = document.createElement("span");
    caption.className = "stamp-caption";
    const number = document.createElement("small");
    number.textContent = String(index + 1).padStart(2, "0");
    const name = document.createElement("strong");
    name.textContent = city.name;
    caption.append(number, name);
    button.append(image, caption);
    cities.append(button);
    const tab = createButton("", "city-tab", city.id === state.city.id, () => setCity(city.id));
    tab.style.setProperty("--tab-color", city.color);
    tab.setAttribute("aria-label", `选择${city.name}`);
    const dot = document.createElement("span");
    dot.className = "city-tab-dot";
    dot.setAttribute("aria-hidden", "true");
    const localName = document.createElement("strong");
    localName.textContent = city.name;
    const englishName = document.createElement("small");
    englishName.textContent = city.english;
    tab.append(dot, localName, englishName);
    tabs.append(tab);
  }
  for (const day of state.city.days) {
    days.append(createButton(dayName(state.city, day), "day-choice", day === state.day, () => setDay(day)));
  }
}

function renderDiagrams() {
  const city = state.city;
  $("city-dossier").style.setProperty("--city-color", city.color);
  $("dossier-city").replaceChildren();
  $("dossier-city").append(document.createTextNode(`${city.name} `));
  const secondary = document.createElement("span");
  secondary.textContent = `${city.english} / ${city.code}`;
  $("dossier-city").append(secondary);
  $("dossier-sample").textContent = city.sample;
  $("dossier-lines").textContent = city.lines;
  $("dossier-mileage").textContent = city.mileage.toFixed(2);
  $("rhythm-scope").textContent = dayName(city, state.day);
  renderRadialGraphic();
  renderTideGraphic();
  $("tide-full-link").href = city.tideAssets[state.day];
}

function renderNetworkDetail() {
  if (!radialSvg) return;
  const active = state.lineLocked ?? state.lineHover;
  radialSvg.classList.toggle("is-selecting", active !== null);
  for (const group of radialSvg.querySelectorAll("[data-radial-line], [data-legend-line]")) {
    group.classList.toggle("is-active", active !== null && (group.getAttribute("data-radial-line") || group.getAttribute("data-legend-line")) === active);
  }
  const detail = $("network-detail");
  if (active === null) {
    detail.textContent = "将鼠标移到色臂或线路名称，查看对应线路。";
    return;
  }
  const shape = radialSvg.querySelector(`[data-radial-line="${active}"]`);
  if (!shape) return;
  const color = shape.querySelector("path")?.getAttribute("fill") || state.city.color;
  detail.replaceChildren();
  const swatch = document.createElement("span");
  swatch.className = "line-swatch";
  swatch.style.background = color;
  const name = document.createElement("strong");
  name.textContent = shape.getAttribute("data-name") || `${active} 号线`;
  const km = document.createElement("span");
  km.textContent = `${shape.getAttribute("data-km")} km · ${state.lineLocked ? "已锁定" : "悬停预览"}`;
  detail.append(swatch, name, km);
}

function renderRadialGraphic() {
  radialSvg = parseDiagram(window.METROFLOW_DIAGRAMS.radial[state.city.id]);
  radialSvg.classList.add("radial-svg");
  radialSvg.setAttribute("role", "group");
  radialSvg.removeAttribute("aria-labelledby");
  radialSvg.setAttribute("aria-label", `${state.city.name}线路放射图；悬停色臂查看线路里程`);
  for (const group of radialSvg.querySelectorAll("[data-radial-line], [data-legend-line]")) {
    const line = group.getAttribute("data-radial-line") || group.getAttribute("data-legend-line");
    group.setAttribute("tabindex", "0");
    group.setAttribute("role", "button");
    group.setAttribute("aria-label", `${state.city.name} ${line} 号线`);
    group.addEventListener("pointerenter", () => { state.lineHover = line; renderNetworkDetail(); });
    group.addEventListener("focus", () => { state.lineHover = line; renderNetworkDetail(); });
    group.addEventListener("click", () => { state.lineLocked = state.lineLocked === line ? null : line; renderNetworkDetail(); });
    group.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); group.click(); }
    });
  }
  radialSvg.addEventListener("click", (event) => {
    if (event.target.closest("[data-radial-line], [data-legend-line]")) return;
    state.lineHover = state.lineLocked = null;
    renderNetworkDetail();
  });
  radialSvg.addEventListener("pointerleave", () => { state.lineHover = null; renderNetworkDetail(); });
  $("radial-graphic").replaceChildren(radialSvg);
  renderNetworkDetail();
}

function renderTideGraphic() {
  tideSvg = parseDiagram(window.METROFLOW_DIAGRAMS.tide[state.city.id][state.day]);
  tideSvg.classList.add("tide-svg");
  tideSvg.setAttribute("role", "group");
  tideSvg.setAttribute("aria-label", `${state.city.name}${dayName(state.city, state.day)}潮汐圆图；悬停或轻触各时段查看数据`);
  const rows = state.city.slots[state.day];
  const layer = document.createElementNS(svgNS, "g");
  layer.setAttribute("class", "tide-hit-layer");
  rows.forEach((row, index) => {
    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", sector(index, rows.length));
    path.setAttribute("data-hit-slot", String(index));
    path.setAttribute("tabindex", "0");
    path.setAttribute("role", "button");
    path.setAttribute("aria-label", `${row.start}—${row.end}，全网活动量 ${numberFormat.format(row.activity)} 次`);
    path.addEventListener("pointerenter", () => previewSelection({ type: "slot", value: index }));
    path.addEventListener("focus", () => previewSelection({ type: "slot", value: index }));
    path.addEventListener("click", () => toggleSelection({ type: "slot", value: index }));
    path.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); path.click(); }
    });
    layer.append(path);
  });
  tideSvg.append(layer);
  tideSvg.addEventListener("pointerleave", () => clearPreview("slot"));
  $("tide-graphic").replaceChildren(tideSvg);
}

function renderHourDetail() {
  const city = state.city;
  const selection = state.locked ?? state.hover ?? { type: "hour", value: state.hour };
  const slot = selection.type === "slot" ? city.slots[state.day][selection.value] : null;
  const hour = slot?.hour ?? selection.value;
  const row = slot ?? city.hourly[state.day].find((item) => item.hour === hour);
  const zone = slot ?? city.zones[state.day].find((item) => item.hour === hour);
  const start = String(hour).padStart(2, "0");
  const end = String(hour + 1).padStart(2, "0");
  $("selected-hour").textContent = slot ? `${slot.start}—${slot.end}` : `${start}:00—${end}:00`;
  $("selected-activity").textContent = `${numberFormat.format(row.activity)} 次`;
  $("selected-direction").textContent = `进站 ${numberFormat.format(row.in)} 次 · 出站 ${numberFormat.format(row.out)} 次。内外区闸机差额显示：${directionName(zone.direction)}。`;
  for (const button of $("hour-chart").querySelectorAll("button[data-hour]")) {
    button.setAttribute("aria-pressed", String(Number(button.dataset.hour) === hour));
  }
  renderTideDetail(selection, row, zone, slot);
  renderTideHighlight(selection, hour);
}

function renderTideDetail(selection, row, zone, slot) {
  const detail = $("tide-detail");
  const start = slot?.start || `${String(selection.value).padStart(2, "0")}:00`;
  const end = slot?.end || `${String(selection.value + 1).padStart(2, "0")}:00`;
  const mode = state.locked ? "已锁定 · 再次点击或按 Esc 解除" : state.hover ? "悬停预览" : "当前峰值";
  const granularity = slot ? `原始 ${state.city.intervalMinutes} 分钟` : "逐小时汇总";
  const zoneName = zoneLabels[state.city.id];
  detail.replaceChildren();
  const heading = document.createElement("div");
  heading.className = "tide-detail-heading";
  const title = document.createElement("strong");
  title.textContent = `${start}—${end}`;
  const context = document.createElement("span");
  context.textContent = `${granularity} · ${mode}`;
  heading.append(title, context);
  const metrics = document.createElement("div");
  metrics.className = "tide-metrics";
  for (const [label, value, unit] of [
    ["全网活动量", numberFormat.format(row.activity), "次"],
    ["进站 / 出站", `${numberFormat.format(row.in)} / ${numberFormat.format(row.out)}`, "次"],
    [`${zoneName}内净出站`, signedNumber(zone.innerNetExit), "次"],
    [`${zoneName}外净进站`, signedNumber(zone.outerNetEntry), "次"],
  ]) {
    const item = document.createElement("div");
    const small = document.createElement("span"); small.textContent = label;
    const strong = document.createElement("strong"); strong.textContent = `${value} ${unit}`;
    item.append(small, strong);
    metrics.append(item);
  }
  const foot = document.createElement("p");
  foot.textContent = `${directionName(zone.direction)}。${state.city.id === "shenzhen" ? "区域净值仅含可定位站点；全网活动量含无站名记录。" : ""}`;
  detail.append(heading, metrics, foot);
}

function renderTideHighlight(selection, hour) {
  if (!tideSvg) return;
  const active = selection.type === "slot" ? [selection.value] : state.city.slots[state.day].filter((row) => row.hour === hour).map((row) => row.slot);
  const slots = new Set(active.map(String));
  tideSvg.classList.add("is-selecting");
  for (const element of tideSvg.querySelectorAll("[data-activity-slot], [data-tide-slot], [data-hit-slot]")) {
    const slot = element.getAttribute("data-activity-slot") || element.getAttribute("data-tide-slot") || element.getAttribute("data-hit-slot");
    element.classList.toggle("is-active", slots.has(slot));
  }
}

function renderSelection() {
  if (!state.city) return;
  renderHourDetail();
}

function renderRhythm() {
  const chart = $("hour-chart");
  chart.replaceChildren();
  const rows = state.city.hourly[state.day];
  for (let hour = 0; hour < 24; hour += 1) {
    const row = rows.find((item) => item.hour === hour);
    if (!row) {
      const missing = document.createElement("span");
      missing.className = "hour-bin missing";
      missing.setAttribute("role", "img");
      missing.setAttribute("aria-label", `${String(hour).padStart(2, "0")}:00 未覆盖`);
      chart.append(missing);
      continue;
    }
    const button = createButton("", "hour-bin", hour === state.hour, () => toggleSelection({ type: "hour", value: hour }));
    button.addEventListener("pointerenter", () => previewSelection({ type: "hour", value: hour }));
    button.addEventListener("focus", () => previewSelection({ type: "hour", value: hour }));
    button.addEventListener("blur", () => clearPreview("hour"));
    button.dataset.hour = String(hour);
    button.setAttribute("aria-label", `${String(hour).padStart(2, "0")}:00 到 ${String(hour + 1).padStart(2, "0")}:00，闸机进出站活动量 ${numberFormat.format(row.activity)} 次`);
    button.title = `${String(hour).padStart(2, "0")}:00 · ${numberFormat.format(row.activity)} 次`;
    button.style.setProperty("--height", `${(10 + row.index * 85).toFixed(1)}%`);
    const bar = document.createElement("span");
    bar.className = "bar";
    bar.setAttribute("aria-hidden", "true");
    button.append(bar);
    chart.append(button);
  }
  chart.onpointerleave = () => clearPreview("hour");
  renderSelection();
}

function render() {
  renderMileage();
  renderControls();
  renderDiagrams();
  renderRhythm();
  updateLocation();
}

function init() {
  try {
    if (!Array.isArray(window.METROFLOW_CITIES) || !window.METROFLOW_CITIES.length || !window.METROFLOW_DIAGRAMS) {
      throw new Error("City data is unavailable");
    }
    state.cities = window.METROFLOW_CITIES;
    const params = new URLSearchParams(location.search);
    const selected = cityById(params.get("city")) || cityById(cityOrder[0]);
    state.city = selected;
    state.day = selected.days.includes(params.get("day")) ? params.get("day") : selected.days[0];
    const rows = selected.hourly[state.day];
    state.hour = rows.reduce((best, row) => row.activity > best.activity ? row : best).hour;
    render();
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        state.locked = state.hover = null;
        state.lineLocked = state.lineHover = null;
        renderSelection();
        renderNetworkDetail();
      }
      if ((event.key === "ArrowRight" || event.key === "ArrowLeft") && state.locked && !/^(SELECT|INPUT|TEXTAREA)$/.test(document.activeElement?.tagName || "")) {
        event.preventDefault();
        const delta = event.key === "ArrowRight" ? 1 : -1;
        const limit = state.locked.type === "slot" ? state.city.slots[state.day].length - 1 : 22;
        state.locked.value = Math.max(state.locked.type === "slot" ? 0 : 6, Math.min(limit, state.locked.value + delta));
        renderSelection();
      }
    });
    document.addEventListener("pointerdown", (event) => {
      if (!state.lineLocked || event.target.closest("[data-radial-line], [data-legend-line]")) return;
      state.lineHover = state.lineLocked = null;
      renderNetworkDetail();
    });
  } catch (error) {
    console.error("MetroFlow data loading failed", error);
    $("error-banner").hidden = false;
  }
}

init();
