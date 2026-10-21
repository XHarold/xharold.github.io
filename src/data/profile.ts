// Public-facing details are transcribed from the resume supplied by the site owner.
// Keep the preview flag enabled until the owner has reviewed the full public site.
export const profile = {
  name: "鞠帆",
  englishName: "Fan Ju",
  wordmark: "Fan Ju",
  isPlaceholder: true,
  tagline: "鞠帆的个人网站：教育经历、实习与项目作品。",
  email: "haaarold@foxmail.com",
  portrait: "/images/portrait.jpg",
  background: "",
  education: [
    {
      period: "2026.09—2029.06",
      school: "同济大学",
      program: "设计学（工学）硕士 · 人工智能与数据设计方向",
      details: "在读",
    },
    {
      period: "2022.09—2026.06",
      school: "北京邮电大学",
      program: "数字媒体技术 · 本科",
      details: "GPA 89.11；雅思 8.0；CET-6 637 分",
    },
  ] as { period: string; school: string; program: string; details: string }[],
  experiences: [
    {
      period: "2025.10—2026.05",
      organization: "北京通用人工智能研究院",
      title: "实习研究助理",
      description: "参与法庭庭审多智能体交互模拟与评测，以及 JurisBench-Omni 法律多模态评测基准。",
      projects: [
        {
          title: "法庭庭审多智能体交互模拟与评测",
          points: [
            "设计法官、原告和被告参与的多智能体庭审流程，以澄清式提问推进事实查明。",
            "将案件中的待查明事实拆解为可独立核验的“原子事实”，设计追问、当事人澄清与事实状态更新流程。",
            "设计逐轮评测方法，记录原子事实首次覆盖轮次与覆盖率，并对生成判决的事实、说理和结果进行分项对比。",
          ],
        },
        {
          title: "JurisBench-Omni",
          points: [
            "参与构建覆盖 150 场中国民事庭审、11 项任务和 1,650 道专家验证选择题的评测基准。",
            "参与庭审资料采集流程、案例清洗、多模态数据处理、任务设计与标注。",
            "论文共同作者；简历标注 ICLR 2027 在投，当前不表示已录用。",
          ],
        },
      ],
    },
  ] as {
    period: string;
    organization: string;
    title: string;
    description: string;
    projects: { title: string; points: string[] }[];
  }[],
};
