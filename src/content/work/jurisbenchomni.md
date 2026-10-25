---
slug: jurisbenchomni
title: JurisBenchOmni
subtitle: 从真实庭审到裁判文书的法律全模态评测
summary: 基于真实民事庭审视频及对应裁判文书，研究模型对出庭角色、现场互动、证据质证和庭审内容与文书关联的理解能力。
category: RESEARCH / LEGAL AI
tags: [法律 AI, 全模态评测, Benchmark]
domain: Legal AI / Multimodal Evaluation
status: 论文在投
paperStatus: 论文在投 · 暂无公开论文链接
placeholder: false
featured: true
order: 1
art: benchmark
links:
  - label: GitHub 评测仓库
    url: https://github.com/jurisbenchomni/jurisbenchomni
---

## 项目概览

JurisBenchOmni 是一项面向司法实践的法律全模态评测研究。项目以真实中国民事庭审视频及对应裁判文书为材料，考察模型如何结合画面、声音与语言信息理解庭审，而不只依赖文字转写。

## 评测内容

当前在投稿包含 150 场民事庭审、四个能力维度和 11 项选择题任务。四个维度分别关注出庭角色归属、现场互动理解、证据识别，以及庭审内容与裁判文书的关联。任务覆盖从识别在场人员、对齐发言与动作，到理解质证立场和定位文书内容的不同层次。

## 研究观察

研究比较了完整音视频与不同模态输入下的模型表现。结果显示，额外提供画面或声音并不保证每项任务都获得提升；角色识别与跨模态对齐仍是值得继续分析的环节。评测衡量的是特定题目上的表现，不代表模型具备独立处理真实案件的能力。

## 论文与代码

论文目前处于匿名评审阶段，暂不公开 PDF。下方 GitHub 仓库提供评测代码和预测结果，但对应较早的任务版本；其任务定义与统计数字不能直接视作当前在投稿的复现结果。
