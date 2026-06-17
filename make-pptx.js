const fs = require("fs");
const path = require("path");
const pptxgen = require("pptxgenjs");

const sourcePath = path.join(__dirname, "midterm-draft.md");
const outputPath = path.join(__dirname, "midterm.pptx");
const source = fs.readFileSync(sourcePath, "utf8");
const requiredSections = [
  "Title",
  "Research Question & Hypothesis",
  "Background",
  "Literature Review",
  "Research Design / Method",
  "Research Plan & Challenges",
  "Expected Results — user study not yet run",
  "References",
  "Acknowledgements"
];

function parseSections(markdown) {
  const chunks = markdown.split(/^## /m).slice(1);
  return chunks.map((chunk) => {
    const lines = chunk.trim().split(/\r?\n/);
    const title = lines.shift().trim();
    const body = lines.join("\n").trim();
    return { title, body };
  });
}

function assertDraft(sections) {
  const titles = sections.map((section) => section.title);
  const missing = requiredSections.filter((title) => !titles.includes(title));
  if (missing.length > 0) {
    throw new Error(`Missing required section(s): ${missing.join(", ")}`);
  }
  const empty = sections.filter((section) => !section.body.trim()).map((section) => section.title);
  if (empty.length > 0) {
    throw new Error(`Empty required section(s): ${empty.join(", ")}`);
  }
  const chinese = source.match(/[\u3400-\u9fff]/g);
  if (chinese) {
    throw new Error("midterm-draft.md contains Chinese text. The deck must be all English.");
  }
}

function splitParagraphs(text) {
  return text
    .split(/\n{2,}/)
    .map((item) => item.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function addText(slide, text, options) {
  slide.addText(text, {
    fontFace: "Times New Roman",
    color: "111111",
    breakLine: false,
    fit: "shrink",
    margin: 0.05,
    valign: "mid",
    ...options
  });
}

function addHeader(slide, title, pageNumber) {
  addText(slide, title, {
    x: 0.55,
    y: 0.35,
    w: 11.6,
    h: 0.42,
    fontSize: 28,
    bold: true
  });
  slide.addShape(pptx.ShapeType.line, {
    x: 0.55,
    y: 0.93,
    w: 12.2,
    h: 0,
    line: { color: "C8C8C8", width: 1 }
  });
  addText(slide, String(pageNumber), {
    x: 12.25,
    y: 6.94,
    w: 0.45,
    h: 0.2,
    fontSize: 12,
    align: "right"
  });
}

function addBody(slide, text, geometry = {}) {
  const paragraphs = splitParagraphs(text);
  const runs = paragraphs.map((paragraph) => ({
    text: paragraph,
    options: { bullet: { indent: 15 }, hanging: 4, breakLine: true }
  }));
  slide.addText(runs, {
    x: geometry.x ?? 0.75,
    y: geometry.y ?? 1.25,
    w: geometry.w ?? 11.75,
    h: geometry.h ?? 5.45,
    fontFace: "Times New Roman",
    fontSize: geometry.fontSize ?? 14,
    color: "111111",
    fit: "shrink",
    margin: 0.05,
    breakLine: false,
    paraSpaceAfterPt: 6,
    lineSpacingMultiple: 1.15
  });
}

function addReferences(slide, text) {
  const refs = splitParagraphs(text);
  const runs = refs.map((reference) => ({
    text: reference,
    options: { bullet: { indent: 12 }, hanging: 4, breakLine: true }
  }));
  slide.addText(runs, {
    x: 0.72,
    y: 1.18,
    w: 11.9,
    h: 5.7,
    fontFace: "Times New Roman",
    fontSize: 12,
    color: "111111",
    fit: "shrink",
    margin: 0.03,
    paraSpaceAfterPt: 3,
    lineSpacingMultiple: 1.15,
    breakLine: false
  });
}

const sections = parseSections(source);
assertDraft(sections);

const pptx = new pptxgen();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "Ava Zhang";
pptx.subject = "Midterm presentation";
pptx.title = "Anonymous Support Check-In";
pptx.company = "BNDS";
pptx.lang = "en-US";
pptx.theme = {
  headFontFace: "Times New Roman",
  bodyFontFace: "Times New Roman",
  lang: "en-US"
};
pptx.defineLayout({ name: "BNDS_WIDE", width: 13.333, height: 7.5 });
pptx.layout = "BNDS_WIDE";

sections.forEach((section, index) => {
  const slide = pptx.addSlide();
  slide.background = { color: "FFFFFF" };

  if (section.title === "Title") {
    addText(slide, "Anonymous Support Check-In", {
      x: 1.15,
      y: 2.15,
      w: 11.0,
      h: 0.7,
      fontSize: 28,
      bold: true,
      align: "center"
    });
    addText(slide, "A one-page anonymous web tool for safer first steps", {
      x: 2.0,
      y: 3.05,
      w: 9.35,
      h: 0.35,
      fontSize: 16,
      align: "center"
    });
    addText(slide, "Ava Zhang", {
      x: 2.0,
      y: 4.12,
      w: 9.35,
      h: 0.25,
      fontSize: 14,
      align: "center"
    });
    addText(slide, "Research Advisor: Lawted Wu", {
      x: 2.0,
      y: 4.5,
      w: 9.35,
      h: 0.25,
      fontSize: 14,
      align: "center"
    });
    return;
  }

  addHeader(slide, section.title, index + 1);

  if (section.title === "Expected Results — user study not yet run") {
    addBody(slide, section.body.replace(/Insert prototype screenshot here:.*/s, "").trim(), {
      x: 0.75,
      y: 1.35,
      w: 6.4,
      h: 4.9,
      fontSize: 14
    });
    slide.addShape(pptx.ShapeType.rect, {
      x: 7.75,
      y: 1.62,
      w: 4.35,
      h: 3.95,
      fill: { color: "F4F4F4", transparency: 10 },
      line: { color: "8A8A8A", width: 1.5, dash: "dash" }
    });
    addText(slide, "Insert prototype screenshot here", {
      x: 8.18,
      y: 3.35,
      w: 3.5,
      h: 0.35,
      fontSize: 14,
      color: "666666",
      align: "center"
    });
  } else if (section.title === "References") {
    addReferences(slide, section.body);
  } else {
    addBody(slide, section.body);
  }
});

pptx.writeFile({ fileName: outputPath }).then(() => {
  console.log(`Wrote ${outputPath}`);
});
