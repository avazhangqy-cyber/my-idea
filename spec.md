# 匿名日记本 — MVP Spec

## 它做什么

一个匿名网页，让高中生先完成前测，再输入一句关于自我认同或性取向探索的困惑。AI 会把这段困惑整理成一篇透明标注的匿名反思日记，让用户像读别人的故事一样重新看见自己的处境，最后完成后测。

## 给谁用

一个正在对性取向、隐私、安全表达感到困惑，但还不一定准备和别人当面谈的高中生。

## Research Question & Hypothesis

### Research Question

Can a transparent AI-assisted anonymous reflective diary increase high school students' feeling of being understood, reduce loneliness, and help them identify a safer next step when exploring self-identity or sexual-orientation-related concerns?

### Hypothesis

I hypothesize that after reading a transparent AI-assisted anonymous reflective diary based on their own concern, users will report higher feelings of being understood, lower loneliness, stronger self-acceptance, and clearer next steps.

### 变量

- Independent variable: reading one transparent AI-assisted anonymous reflective diary based on the user's anonymous one-sentence concern.
- Dependent variables: change between the pre-survey and post-survey scores on the same five 1-5 items: feeling understood, loneliness, self-acceptance, knowing a safer next step, and emotional calm.
- Success line: with 15-20 complete pre/post pairs, the hypothesis is preliminarily supported if the average post-survey total score is at least 2 points higher than the average pre-survey total score, or if the average item score increases by at least 0.4 points.

## 核心流程

1. 用户打开网页，看到匿名和隐私说明。
2. 用户完成 5 个 1-5 分前测题。
3. 用户选择一个困惑方向，或匿名写下一句最近的困惑。
4. 网页明确说明匿名日记是 AI 整理生成的文本，不是真人投稿、搜索结果或心理咨询。
5. AI 生成一篇匿名日记，呈现理解、客观整理、隐私保护和一个更安全的小下一步。
6. 用户完成同样 5 个后测题，网页自动计算变化。
7. 用户可以选择把本次生成的匿名日记保存在当前浏览器里的“我的匿名日记本”。
8. 用户可以主动同意，将 AI 整理后的匿名日记提交给研究者分析；默认不上传日记本内容。
9. 用户可以回答 1-2 个开放题：匿名日记里哪一段有感觉、读完后想法有没有变化。

## 不在 MVP 里

- 不做性取向测试
- 不判断或预测用户身份
- 不收集姓名、学校、联系方式、精确位置
- 不要求用户描述具体个人经历
- 不做登录系统
- 不做开放式 AI 聊天机器人，只生成一次透明标注的匿名反思日记
- 不做社区、评论区或公开分享
- 不做复杂数据看板
- 不做服务端长期用户档案；本地日记本只保存在用户自己的浏览器里

## 怎么收集反馈

MVP 只收集最少的匿名反馈：

- 用户选择了哪一个日记方向
- 前测 5 题 1-5 分
- 后测 5 题 1-5 分
- 自动计算的总分变化和每题平均变化
- 用户主动同意后提交的 AI 整理匿名日记
- 开放题：匿名日记里有没有哪一句或哪一段让用户有感觉
- 开放题：读完以后，用户的想法有没有一点变化

这些数据可以用来回答研究问题：透明标注的 AI 辅助匿名反思日记，是否能让正在探索自我认同或性取向相关困惑的高中生更感觉被理解、更不孤单，并更能说出一个安全的下一步。

## 成功标准

- 收集 15-20 个完整前后测配对；“完整”指同一个用户完成前测、体验网页、再完成后测。
- 主要成功线：后测平均总分比前测平均总分至少提高 2 分（满分 25 分），或每题平均提高至少 0.4 分。
- 如果数据低于 15 个完整配对，只把结果写成早期趋势，不说成已经证明假设。
- 开放反馈能整理出 3 个以上下一版最需要回答或修改的问题。
