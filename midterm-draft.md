# Midterm Draft

## Title

Anonymous Support Check-In

A one-page anonymous web tool for high school students who are questioning or exploring sexual orientation.

Presenter: Ava Zhang

Research Advisor: Lawted Wu

## Research Question & Hypothesis

Research question: How does an anonymous support webpage affect the feeling of being understood for high school students who are questioning or exploring sexual orientation?

Hypothesis: I hypothesize that after using the anonymous support webpage, high school students who are questioning or exploring sexual orientation will increase their feeling of being understood and will be more able to name a safer next step.

## Background

Some students who are exploring sexual orientation may feel uncertain, private, or afraid of rejection. They may not be ready to talk face to face with a teacher, counselor, parent, or friend.

This issue matters because the risk is not caused by identity itself. Many sources point to stigma, bullying, discrimination, and lack of support as the problem. A small private tool cannot replace real support, but it can be a first step when a student is not ready to speak openly.

My project focuses on privacy, non-judgmental language, and safe next steps.

## Literature Review

The American Psychological Association explains that sexual orientation is a normal part of human diversity. This supports my decision not to test, diagnose, or label users.

Berger et al. reviewed research on LGBTQ youth and social media. They found that online spaces can help with connection, identity exploration, and support, but they also warned about risks such as outing and weak privacy protections. This supports my focus on anonymity and not collecting identity data.

CDC materials show that LGBTQ students are especially affected in the youth mental health crisis, and that school connectedness can protect student well-being. This supports the idea that safer support pathways matter.

GLSEN reports that hostile school climates are linked with lower self-esteem, higher depression, lower GPAs, and missed school. This shows why fear of rejection and safety concerns belong in the prototype.

The Trevor Project 2025 survey reports that 36% of LGBTQ young people seriously considered suicide in the past year and that 77% identified online spaces as supportive. This does not prove that my tool will work, but it shows why supportive and low-barrier online spaces are worth testing.

## Research Design / Method

### Artifact

The artifact was an online, one-page anonymous support space for Chinese high school students navigating self-identity-related concerns, especially questions connected to sexual orientation, privacy, expression safety, and support seeking. After an opening consent screen, users moved through a guided sequence: a pre-survey, a scenario pathway, an AI safety-next-step helper, a brief self-assessment, a peer-story section, an optional anonymous story submission page, resource navigation, a post-survey, and a final feedback page. The scenario pathway asked users to choose one of six concerns: uncertainty about attraction, fear of being known, telling a friend, telling family, bullying or threats, or wanting to know that they were not alone. For each choice, the page displayed pre-written supportive text, normalization language, suggested next steps, actions to avoid, and conditions under which the user should seek help. The self-assessment displayed scores for emotional distress, perceived support, and expression safety in the user's browser. The pre/post survey responses, optional story submissions, and site feedback were submitted to Supabase as pending-review records. The scenario guidance and peer stories were curated, pre-written prototype materials rather than personalized predictions. The AI helper used a server endpoint to call the DeepSeek API when the environment variable was configured; it generated brief general safety guidance and was instructed not to diagnose, label, predict identity, request identifying information, or replace counseling or crisis support.

### Design

The study used a within-subject pre/post design. The independent variable was exposure to the anonymous support webpage, including the scenario pathway, optional AI helper, self-assessment, peer stories, and resource navigation. The primary dependent variables were five 1-5 Likert-style ratings collected before and after the experience. These items measured whether users could notice their self-identity-related feelings, classify the situation as exploration, privacy risk, expression safety, emotional pressure, or help-seeking need, connect the issue to life and safety choices, identify factors such as rumors, privacy exposure, lack of support, or family pressure, and pause to evaluate safety and support before acting. The page automatically calculated item-level changes, total pre-score, total post-score, total change, and average change. Additional outcome indicators included optional open-ended site feedback, anonymous story submissions, privacy-risk warnings generated from submitted text, and the self-assessment summaries shown to the user.

### Consent and Safety

Participation was presented as voluntary, anonymous, and limited to classroom research. The first consent screen stated that users were not required to provide names, schools, class information, phone numbers, WeChat accounts, email addresses, or other identifying information; that they could choose not to participate; and that they could leave at any time by closing the webpage. It also warned users not to enter real names, specific schools, contact information, or other identifiable details in any input field. The first substantive screen identified the tool as non-clinical: it was not psychological counseling, diagnosis, or crisis intervention, and users facing violence, threats, forced outing, self-harm thoughts, or acute distress were directed to trusted adults, school counselors, local support lines, or emergency services.

### Recruitment, Coding, and Analysis

Participants were recruited from [TODO: recruitment source, e.g., classmates, school peers, or a specific class/program], and approximately [TODO: N] users completed the website experience. Recruitment was [TODO: describe how the link was distributed, e.g., QR code, message, classroom demo, or one-on-one invitation]. No names, schools, contact information, exact locations, or detailed personal identity records were intentionally collected. Quantitative analysis used descriptive statistics for pre- and post-survey scores, including mean or median pre-score, mean or median post-score, total change, average item change, and item-level direction of change. If the final sample size supported it, pre/post differences were analyzed using [TODO: paired-samples t-test or Wilcoxon signed-rank test]. Open-ended feedback and story submissions were coded thematically. The initial coding categories were [TODO: coding categories, e.g., clarity, privacy/safety, emotional support, usefulness of resources, confusion, and requested features], and repeated themes were counted and summarized without linking responses to personal identities.

## Research Plan & Challenges

Current progress: the website prototype is built, deployed, and documented. The research folder includes sources, a summary, questions, and key findings.

Next steps: test with at least 10 users, collect anonymous feedback, organize the feedback themes, and improve the wording and safety guidance.

Main challenges: the topic is sensitive, so the tool must avoid pressure, labels, and identity collection. Another challenge is that the first user study will be small, so I should describe it as early feedback, not final proof.

## Expected Results — user study not yet run

I expect some users will say the tool feels safer than asking a person immediately, because it is anonymous and low pressure.

I expect the strongest feedback to be about wording, privacy, and what resources should be shown next.

I do not have user study results yet. I will not claim that the prototype works until real users test it.

Insert prototype screenshot here: I plan to capture the page after a user selects one concern and sees the supportive response.

## References

American Psychological Association. (n.d.). Just the facts about sexual orientation and youth. https://www.apa.org/pi/lgbt/resources/just-the-facts

Berger, M. N., Taba, M., Marino, J. L., Lim, M. S. C., & Skinner, S. R. (2022). Social media use and health and well-being of LGBTQ youth: Systematic review. Journal of Medical Internet Research, 24(9), e38449. https://www.jmir.org/2022/9/e38449/

Centers for Disease Control and Prevention. (2024). 2023 Youth Risk Behavior Survey results. https://www.cdc.gov/yrbs/results/2023-yrbs-results.html

Centers for Disease Control and Prevention. (2024). School connectedness helps students thrive. https://www.cdc.gov/youth-behavior/school-connectedness/index.html

GLSEN. (2022). The 2021 National School Climate Survey. https://files.eric.ed.gov/fulltext/ED625378.pdf

Substance Abuse and Mental Health Services Administration. (2022). LGBTQI+ youth, like all Americans, deserve evidence-based care. https://www.samhsa.gov/blog/lgbtqi-youth-all-americans-deserve-evidence-based-care

The Trevor Project. (2023). School-related protective factors for LGBTQ middle and high school students. https://www.thetrevorproject.org/research-briefs/school-related-protective-factors-for-lgbtq-middle-and-high-school-students-aug-2023/

The Trevor Project. (2026). 2025 U.S. National Survey on the Mental Health of LGBTQ+ Young People. https://www.thetrevorproject.org/survey-2025/

## Acknowledgements

Thank you to Lawted Wu for the criticism, guidance, and project structure. Thank you to classmates who will test the prototype and help me make the language clearer.
