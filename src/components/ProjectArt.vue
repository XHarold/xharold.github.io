<script setup lang="ts">
import { assetUrl } from "../lib/urls";
defineProps<{ kind: "graph" | "metro" | "learning" | "benchmark"; compact?: boolean }>();
const nodes = [
  [360, 208],
  [238, 126],
  [495, 112],
  [534, 286],
  [210, 286],
  [367, 355],
  [123, 181],
  [596, 181],
  [405, 64],
  [135, 341],
  [576, 370],
  [282, 392],
  [85, 95],
  [630, 77],
];
const edges = [
  [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [1, 6], [1, 8],
  [2, 8], [2, 7], [3, 7], [3, 10], [4, 6], [4, 9], [4, 11],
  [5, 11], [5, 10], [6, 12], [7, 13],
];
</script>

<template>
  <div class="project-art" :class="[`art-${kind}`, { compact }]" :aria-label="kind === 'metro' ? 'Wiring the City 项目封面' : '项目概念示意封面'">
    <template v-if="kind === 'graph'">
      <div class="art-topline">
        <span>COURTGRAPH / SYSTEM EXPLORATION</span><span>FIG. 001</span>
      </div>
      <svg class="graph-art" viewBox="0 0 720 440" role="img" aria-label="连接中心事实与周边信息的节点图，视觉示意">
        <g fill="none" stroke="currentColor">
          <ellipse cx="360" cy="220" rx="250" ry="165" class="graph-orbit" />
          <ellipse cx="360" cy="220" rx="175" ry="115" class="graph-orbit" />
          <line
            v-for="(edge, i) in edges"
            :key="i"
            :x1="nodes[edge[0]!]![0]"
            :y1="nodes[edge[0]!]![1]"
            :x2="nodes[edge[1]!]![0]"
            :y2="nodes[edge[1]!]![1]"
            class="graph-edge"
          />
        </g>
        <g v-for="(node, i) in nodes" :key="i">
          <circle :cx="node[0]" :cy="node[1]" :r="i === 0 ? 38 : i < 6 ? 18 : 6" :class="i === 0 ? 'graph-core' : 'graph-node'" />
          <circle v-if="i === 0" :cx="node[0]" :cy="node[1]" r="49" fill="none" stroke="#97a5ff" opacity=".35" />
        </g>
        <g class="graph-text">
          <text x="360" y="212" text-anchor="middle">FACT</text>
          <text x="211" y="95">QUESTION</text>
          <text x="474" y="78">EVIDENCE</text>
          <text x="557" y="290">CONTEXT</text>
          <text x="115" y="289">ENTITY</text>
          <text x="340" y="394">REASONING</text>
        </g>
      </svg>
      <div class="art-bottomline">
        <span><i class="tiny-dot"></i> CONNECTING THE MISSING PIECES</span><span>概念示意 ↗</span>
      </div>
    </template>
    <template v-else-if="kind === 'metro'">
      <div class="art-topline">
        <span>WIRING THE CITY / URBAN RHYTHMS</span><span>FIG. 002</span>
      </div>
      <div class="metro-cover-copy">
        <strong>Wiring<br />the City<span>.</span></strong>
        <span>城市脉络<br />地铁线网与城市节律</span>
      </div>
      <div class="metro-cover-stamps" aria-hidden="true">
        <img :src="assetUrl('wiring-the-city/assets/stamps/london-stamp.svg')" alt="" loading="lazy" />
        <img :src="assetUrl('wiring-the-city/assets/stamps/shanghai-stamp.svg')" alt="" loading="lazy" />
        <img :src="assetUrl('wiring-the-city/assets/stamps/seoul-stamp.svg')" alt="" loading="lazy" />
      </div>
      <div class="art-bottomline">
        <span>FIVE CITIES / ONE VISUAL STORY</span><span>交互作品 ↗</span>
      </div>
    </template>
    <template v-else-if="kind === 'benchmark'">
      <div class="art-topline">
        <span>JURISBENCHOMNI / RESEARCH</span><span>FIG. 004</span>
      </div>
      <div class="benchmark-cover">
        <div class="benchmark-cover-title">
          <span>LEGAL · OMNI-MODAL EVALUATION</span>
          <strong>JurisBench<br />Omni<span>.</span></strong>
          <small>从庭审影像到司法文书</small>
        </div>
        <div class="benchmark-cover-matrix" aria-hidden="true">
          <div><b>01</b><span>角色归属</span></div>
          <div><b>02</b><span>互动理解</span></div>
          <div><b>03</b><span>证据识别</span></div>
          <div><b>04</b><span>庭审与文书关联</span></div>
        </div>
      </div>
      <div class="art-bottomline">
        <span>HEARING → JUDGMENT</span><span>研究概览图形 ↗</span>
      </div>
    </template>
    <template v-else>
      <div class="art-topline">
        <span>IELTS AGENT / LEARNING COMPANION</span><span>FIG. 003</span>
      </div>
      <div class="learning-scene">
        <div class="learning-circle"></div>
        <div class="learning-card">
          <div class="learning-card-head">
            <span class="agent-symbol">✳</span><span>A little practice.<br /><strong>A little progress.</strong></span><span class="learning-dot"></span>
          </div>
          <div class="waveform" aria-hidden="true">
            <i v-for="i in 35" :key="i" :style="{ height: `${12 + Math.abs(Math.sin(i * 1.7)) * 40}px` }"></i>
          </div>
          <div class="learning-card-foot">
            <span>YOUR VOICE, YOUR PACE</span><span>↗</span>
          </div>
        </div>
        <span class="floating-label">One conversation at a time.</span>
      </div>
      <div class="art-bottomline">
        <span>A SPACE TO FIND YOUR VOICE</span><span>概念示意 ↗</span>
      </div>
    </template>
  </div>
</template>
