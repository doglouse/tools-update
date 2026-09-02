/* PRIME Admin 3 — Article Uploader / SynopsiMedEd Feeds
   Plain JS. No framework, no build step. State object + full re-render. */
(function () {
"use strict";

/* ---------------------------------------------------------------- data */

var PROJECTS = [
  { code: "542410", name: "Beyond the Abstracts: Leveraging the Power of AI to Support Clinicians With Staying Up-to-Date on the Latest Evidence in PBC", active: true },
  { code: "84233", name: "SynopsiMedEd: Leveraging Artificial Intelligence to Stay Up to Date on the Latest Evidence in NSCLC", active: true },
  { code: "72244", name: "SynopsiMedEd: Harnessing the Power of Artificial Intelligence to Advance Evidence-Based Immunotherapy Treatment in Early-Stage Melanoma", active: true },
  { code: "62241", name: "SynopsiMedEd: Leveraging Artificial Intelligence to Support Clinicians in Staying Up to Date on New and Emerging Treatments for IgAN Nephropathy", active: true },
  { code: "20241", name: "SynopsiMedEd: Harnessing the Power of Artificial Intelligence to Accelerate the Adoption of Rapidly Evolving Evidence and Treatment Options for Atopic Dermatitis", active: false },
  { code: "24253", name: "Latest Clinical Evidence in Chronic Spontaneous Urticaria", active: true },
  { code: "24262", name: "Emerging Targeted Therapies in mHSPC", active: false },
  { code: "10254", name: "TEST Project", active: false }
];

var SOURCES = ["Journal of Clinical Medicine", "The Lancet Oncology", "JAMA Network Open", "Annals of Internal Medicine", "New England Journal of Medicine", "Kidney International"];
var TYPES = ["Journal", "Preprint", "Conference Abstract", "Review", "Guideline"];
var SPECIALTIES = ["Pulmonology", "Critical Care", "Infectious Disease", "Emergency Medicine", "Oncology", "Nephrology", "Dermatology", "Hepatology", "Cardiology", "Urology"];
var TOPICS = ["Pneumonia", "Infection", "Septic Shock", "Immunotherapy", "Biomarkers", "Screening", "Glaucoma", "Health Equity", "Treatment Adherence", "Diagnostics"];

var RAW = [
  [103533, "542410", "Journal of Clinical Medicine", "Pulmonary Vascular Permeability and Extravascular Lung Water Index Vary with Infection Site in Patients with Liver Cirrhosis and Septic Shock.", "2026-08-19"],
  [103532, "542410", "Journal of Clinical Medicine", "Comparison of Ceftolozane-Tazobactam Versus Meropenem Regimens in Treating Bloodstream Infections Caused by Extended-Spectrum \u03b2-Lactamase-Producing Enterobacterales: Real-World Data from a Greek Tertiary Center.", "2026-08-19"],
  [103531, "542410", "Journal of Clinical Medicine", "Intracolonic Treatment with a Rifamycin SV In Situ Gelling Formulation Ameliorates Macroscopic and Histological Damage in an Acute Rat Model of Oxazolone-Induced Colitis: A Proof-of-Concept Study.", "2026-08-19"],
  [103530, "542410", "Journal of Clinical Medicine", "Diagnosis-to-Treatment Interval Reflects Clinical Urgency and Disease Burden in T-Lymphoblastic Lymphoma: A Multicenter Cohort Study.", "2026-08-19"],
  [103529, "542410", "Journal of Clinical Medicine", "Pulmonary Thromboembolism in Hospitalized Patients with Acute Exacerbation of COPD: Frequency, Predictors, and D-Dimer Performance.", "2026-08-19"],
  [103528, "542410", "Journal of Clinical Medicine", "Artificial Intelligence in Cardiovascular Ultrasound: Clinical Applications, Foundation Models, and the Path to Precision Cardiology.", "2026-08-19"],
  [103527, "542410", "Journal of Clinical Medicine", "Ultrasonographic Airway Measurements and Difficult Laryngoscopy in Children Undergoing Adenotonsillectomy: A Prospective Observational Study.", "2026-08-19"],
  [103526, "542410", "Journal of Clinical Medicine", "Gastric Cancer Surgery in an Emergency Setting: Insights from a Western Multicenter Cohort.", "2026-08-19"],
  [103525, "542410", "Journal of Clinical Medicine", "Twelve-Month Outcomes of iStent Infinite in Severe Open-Angle Glaucoma Compared with iStent Inject W in Mild-to-Moderate Disease.", "2026-08-19"],
  [103524, "542410", "Journal of Clinical Medicine", "Beyond Accuracy: A Controlled Comparative Glaucoma Screening Benchmark Across Deep Learning and Hybrid Models Under Within- and Cross-Dataset Conditions.", "2026-08-19"],
  [103519, "84233", "The Lancet Oncology", "Perioperative Immunotherapy in Resectable NSCLC: Pooled Analysis of Pathologic Response and Event-Free Survival.", "2026-08-14"],
  [103518, "84233", "JAMA Network Open", "Real-World Sequencing of Targeted Therapy After Osimertinib Progression in EGFR-Mutant NSCLC.", "2026-08-13"],
  [103517, "84233", "Annals of Internal Medicine", "Lung Cancer Screening Uptake Among Rural Primary Care Populations: A Stepped-Wedge Trial.", "2026-08-11"],
  [103516, "72244", "New England Journal of Medicine", "Adjuvant Pembrolizumab Versus Observation in Stage IIB Melanoma: Five-Year Follow-Up.", "2026-08-08"],
  [103515, "72244", "The Lancet Oncology", "Neoadjuvant Combination Checkpoint Blockade in Early-Stage Melanoma: Biomarker-Driven Response Patterns.", "2026-08-06"],
  [103514, "72244", "JAMA Network Open", "Sentinel Lymph Node Biopsy Practice Variation and Downstream Treatment Decisions in Melanoma.", "2026-08-04"],
  [103511, "62241", "Kidney International", "Targeted-Release Budesonide in IgA Nephropathy: Proteinuria Reduction and eGFR Slope at 24 Months.", "2026-07-29"],
  [103510, "62241", "Annals of Internal Medicine", "Endothelin Receptor Antagonism in Progressive IgA Nephropathy: A Pragmatic Comparative Study.", "2026-07-27"],
  [103509, "62241", "Kidney International", "Risk Prediction Tools in IgA Nephropathy: External Validation Across Three Cohorts.", "2026-07-24"],
  [103505, "20241", "JAMA Network Open", "Dupilumab Persistence and Discontinuation Patterns in Moderate-to-Severe Atopic Dermatitis.", "2026-07-18"],
  [103504, "20241", "New England Journal of Medicine", "Oral JAK Inhibition Versus Biologic Therapy in Adolescent Atopic Dermatitis: A Randomized Comparison.", "2026-07-16"],
  [103501, "24253", "JAMA Network Open", "Omalizumab Response Predictors in Chronic Spontaneous Urticaria: A Multicenter Registry Analysis.", "2026-07-09"],
  [103500, "24253", "Annals of Internal Medicine", "Quality of Life Burden and Care Gaps in Chronic Spontaneous Urticaria.", "2026-07-07"],
  [103497, "24262", "The Lancet Oncology", "Triplet Therapy in Metastatic Hormone-Sensitive Prostate Cancer: Updated Overall Survival.", "2026-06-30"],
  [103496, "24262", "JAMA Network Open", "PSMA-PET Staging and Treatment Intensification Decisions in mHSPC.", "2026-06-27"],
  [103490, "10254", "Journal of Clinical Medicine", "TEST record \u2014 ingestion pipeline validation article.", "2026-06-20"]
];

var ARTICLES = RAW.map(function (r) {
  return { id: r[0], projectCode: r[1], source: r[2], title: r[3], date: r[4] };
});

var FEEDS = [
  { code: "10212", title: "Test Project for Zoom Webinar Integration1", supporter: "PRIME (10)", release: "\u2014",
    name: "SynopsiMedEd: Test Project 0981", tag: "SynopsiMedEd_Tag", slug: "synopsimeded-test-project-0981",
    sources: ["Cancer Discovery", "Therapeutic Advances in Medical Oncology", "Thoracic Cancer"],
    live: { name: "SynopsiMedEd: Test Project 0981", tag: "SynopsiMedEd_Tag", description: "This unique educational activity offers: Expert clinical commentaries and case-based discussions\u2026" },
    active: false },
  { code: "24253", title: "Accelerating Adoption of the Latest Evidence for the Diagnosis and Treatment of Chronic Spontaneous Urticaria: A SynopsiMedEd\u2122 Initiative Leveraging the Power of AI to Keep Providers on the Cutting Edge of Clinical Evidence", supporter: "Novartis (24)", release: "Jun 24, 2025",
    name: "SynopsiMedEd: Chronic Spontaneous Urticaria", tag: "CSU_Tag", slug: "synopsimeded-chronic-spontaneous-urticaria",
    sources: ["JAMA Dermatology", "Allergy"],
    live: { name: "SynopsiMedEd: Chronic Spontaneous Urticaria", tag: "CSU_Tag", description: "Evidence updates for clinicians managing chronic spontaneous urticaria." },
    active: true },
  { code: "24262", title: "A New Era in Metastatic Hormone-Sensitive Prostate Cancer: Transforming Care Through Precision Medicine \u2014 A SynopsiMedEd\u2122 Initiative Leveraging the Power of AI to Keep Clinicians Up-to-Date on Emerging Clinical Trial Data", supporter: "Novartis (24)", release: "May 28, 2026",
    name: "SynopsiMedEd: mHSPC Precision Medicine", tag: "mHSPC_Tag", slug: "synopsimeded-mhspc-precision-medicine",
    sources: ["The Lancet Oncology", "European Urology"],
    live: { name: "SynopsiMedEd: mHSPC Precision Medicine", tag: "mHSPC_Tag", description: "Emerging trial data and practical implications in mHSPC." },
    active: true },
  { code: "17263", title: "Decoding Dual-Targeting: Clinical Mastery of Emerging Bispecific ADCs in Solid Tumors Leveraging AI-Driven Personalization to Advance Knowledge of the Latest Evidence", supporter: "Bristol Myers Squibb (17)", release: "Jul 10, 2026",
    name: "SynopsiMedEd: Bispecific ADCs", tag: "ADC_Tag", slug: "synopsimeded-bispecific-adcs",
    sources: ["Cancer Discovery", "Nature Reviews Clinical Oncology"],
    live: { name: "SynopsiMedEd: Bispecific ADCs", tag: "ADC_Tag", description: "Dual-targeting ADC evidence for solid tumours." },
    active: false }
];

var FEED_LISTS = [
  { id: 1, kind: "Static List", count: 8, query: "woman", scopes: ["Title", "Body"], articles: [
    { source: "JAMA Oncology", type: "Journal", date: "Mar 18, 2025", title: "Sex-Based Differences in Immunotherapy Response Across Solid Tumours.", summary: "Pooled analysis across 24 trials shows a modest but consistent difference in checkpoint-inhibitor benefit by sex, with the largest gap observed in melanoma and NSCLC cohorts\u2026", specialty: "Oncology/Hematology", topic: "Immunotherapy" },
    { source: "The Lancet Oncology", type: "Journal", date: "Feb 27, 2025", title: "Enrollment of Women in Late-Phase Oncology Trials: A Decade Review.", summary: "Representation improved overall but remains below disease-incidence parity in gastrointestinal and hepatobiliary studies, with enrollment gaps concentrated in community sites\u2026", specialty: "Oncology/Hematology", topic: "Health Equity" }
  ] },
  { id: 2, kind: "Dynamic List", count: 281, query: "cancer", scopes: ["Title", "Body"], articles: [
    { source: "Cancer Discovery", type: "Journal", date: "Apr 08, 2025", title: "Convergent Genetic Adaptation in Human Tumors Developed Under Systemic Hypoxia and in Populations Living at High Altitudes.", summary: "This study reveals a broad convergence in genetic adaptation to hypoxia between natural populations and tumors, suggesting that insights from natural populations could enhance our understanding of cancer biology and identify\u2026", specialty: "Oncology/Hematology", topic: "Hypoxia" },
    { source: "Cancer Discovery", type: "Journal", date: "Apr 02, 2025", title: "The Hallmarks of Cancer as Eco-Evolutionary Processes.", summary: "Viewing the hallmarks as a sequence of adaptations captures the \"why\" behind the \"how\" of the molecular changes driving cancer. This eco-evolutionary view distils the complexity of cancer progression into logical steps, providing a\u2026", specialty: "Oncology/Hematology", topic: "Cancer" },
    { source: "Nature Reviews Clinical Oncology", type: "Review", date: "Mar 21, 2025", title: "Bispecific Antibody\u2013Drug Conjugates in Solid Tumours: Mechanisms and Early Clinical Signals.", summary: "Dual-targeting constructs improve payload delivery in preclinical models, and first-in-human data suggest a manageable safety profile, though optimal sequencing after single-target ADCs remains undefined\u2026", specialty: "Oncology/Hematology", topic: "Targeted Therapy" }
  ] },
  { id: 3, kind: "Dynamic List", count: 4, query: "he", scopes: ["Title", "Body"], articles: [
    { source: "JAMA Network Open", type: "Journal", date: "Feb 11, 2025", title: "Health Equity in Oncology Trial Design: A Structured Review of Eligibility Criteria.", summary: "Broadening organ-function thresholds would have made an estimated one in five excluded patients eligible, with the largest effect among patients with chronic kidney disease\u2026", specialty: "Oncology/Hematology", topic: "Health Equity" }
  ] },
  { id: 4, kind: "Static List", count: 2, query: "heart", scopes: ["Title", "Body"], articles: [
    { source: "Journal of Clinical Medicine", type: "Review", date: "Jan 29, 2025", title: "Artificial Intelligence in Cardiovascular Ultrasound: Clinical Applications, Foundation Models, and the Path to Precision Cardiology.", summary: "Foundation models trained on large echo archives now approach expert-level chamber quantification, but prospective validation and workflow integration remain the limiting steps\u2026", specialty: "Cardiology", topic: "Diagnostics" }
  ] }
];

var EDITOR_TOOLS = [
  { icon: "mdi mdi-undo", title: "Undo" }, { icon: "mdi mdi-redo", title: "Redo" },
  { icon: "mdi mdi-format-quote-close", title: "Quote" }, { icon: "mdi mdi-link-variant", title: "Link" },
  { icon: "mdi mdi-format-underline", title: "Underline" }, { icon: "mdi mdi-format-strikethrough", title: "Strikethrough" },
  { icon: "mdi mdi-format-italic", title: "Italic" }, { icon: "mdi mdi-format-bold", title: "Bold" },
  { icon: "mdi mdi-format-list-bulleted", title: "Bulleted list" }, { icon: "mdi mdi-format-list-numbered", title: "Numbered list" },
  { icon: "mdi mdi-minus", title: "Divider" }, { icon: "mdi mdi-format-indent-decrease", title: "Outdent" },
  { icon: "mdi mdi-format-indent-increase", title: "Indent" }
];

var ACTIVITIES = [
  "70CS231 - CS Activity Title long",
  "70CS232 - Case Challenge: Advanced Practice Considerations",
  "84233A - Expert Commentary: Emerging Evidence in NSCLC",
  "24253B - Clinical Snapshot: Urticaria Treatment Sequencing",
  "17263C - Roundtable: Bispecific ADC Safety Management"
];

var LOOKBACKS = ["6-month lookback", "1-year lookback", "2-year lookback", "All time"];
var MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
var SCOPE_KEYS = ["Titles", "Body", "Sources", "Specialty", "Topic"];

/* --------------------------------------------------------------- state */

var S = {
  section: "articles",
  view: "list",
  query: "", page: 1, perPage: 10, sort: "id", dir: "desc",
  includeInactive: true, filterCodes: [], filterQuery: "",
  menu: null, specialtyQuery: "", topicQuery: "",
  confirm: null, removed: [], toast: null,
  form: { id: null, project: "", source: "", date: "", type: "", title: "", url: "", specialties: [], topics: [] },
  touched: false,
  feedQuery: "", feedView: "list", feedCode: null, feedTab: "details",
  feedEditing: false, feedDraft: null,
  newSources: [{ name: "", url: "" }],
  chapters: [], chapterModal: null, chapterName: "", chapterActivities: [],
  feedActive: {}, activeConfirm: null,
  publishChecks: { name: false, tag: false, description: true },
  artSearch: "", searchScopes: { Titles: true, Body: true, Sources: false, Specialty: false, Topic: false },
  lookback: "1-year lookback", includeUsed: false,
  listOrder: [1, 2, 3, 4], expandedList: 2, listPages: {}, searched: false
};

/* -------------------------------------------------------------- helpers */

function esc(v) {
  return String(v == null ? "" : v)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function attr(name, value) { return value == null || value === false ? "" : " " + name + '="' + esc(value) + '"'; }
function act(name, arg) { return ' data-act="' + name + '"' + (arg === undefined ? "" : ' data-arg="' + esc(JSON.stringify(arg)) + '"'); }
function inp(name, arg) { return ' data-inp="' + name + '"' + (arg === undefined ? "" : ' data-arg="' + esc(JSON.stringify(arg)) + '"'); }
function cx() { return Array.prototype.filter.call(arguments, Boolean).join(" "); }
function longDate(iso) { var p = iso.split("-"); return MONTHS[Number(p[1]) - 1] + " " + Number(p[2]) + ", " + p[0] + ", at 12:00 AM"; }
function usDate(iso) { var p = iso.split("-"); return p[1] + "/" + p[2] + "/" + p[0]; }
function projectOf(code) {
  for (var i = 0; i < PROJECTS.length; i++) if (PROJECTS[i].code === code) return PROJECTS[i];
  return { code: code, name: "", active: true };
}
function feedOf(code) {
  for (var i = 0; i < FEEDS.length; i++) if (FEEDS[i].code === code) return FEEDS[i];
  return FEEDS[0];
}
function boxIcon(on) { return "mdi " + (on ? "mdi-checkbox-marked" : "mdi-checkbox-blank-outline"); }
function pageNumbers(pageCount, current) {
  var out = [];
  for (var n = 1; n <= pageCount; n++) {
    if (n === 1 || n === pageCount || Math.abs(n - current) <= 2) out.push(n);
    else if (out[out.length - 1] !== "\u2026") out.push("\u2026");
  }
  return out;
}
var CHIP_STYLE = "display:inline-flex;align-items:center;gap:8px;height:32px;padding:0 12px 0 14px;border-radius:16px;background:var(--pa-primary-050);color:var(--pa-ink);font-family:var(--pa-font-sans);font-size:12.5px;line-height:1";
var MENU_STYLE = "position:absolute;top:100%;left:0;right:0;margin-top:4px;z-index:30;background:#fff;border-radius:8px;box-shadow:var(--pa-elev-modal);overflow:auto;padding:6px 0";
var OVERLAY = "position:fixed;inset:0;background:rgba(33,33,33,0.46);display:flex;align-items:center;justify-content:center;z-index:40;padding:24px";

var toastTimer = null;
function showToast(msg) {
  clearTimeout(toastTimer);
  S.toast = msg;
  toastTimer = setTimeout(function () { S.toast = null; render(); }, 4000);
  render();
}

/* ------------------------------------------------------------ fragments */

function pager(pages, prevAct, nextAct, argBase, centered) {
  return '<div class="pa-pager"' + (centered ? ' style="justify-content:center"' : "") + '>' +
    '<button title="Previous page"' + act(prevAct, argBase) + '><i class="mdi mdi-chevron-left" style="font-size:20px;vertical-align:-4px"></i></button>' +
    pages.map(function (p) {
      if (p === "\u2026") return '<button disabled>\u2026</button>';
      var arg = argBase === undefined ? p : { id: argBase, page: p };
      return '<button' + (p === pages.current ? ' aria-current="page"' : "") + act(argBase === undefined ? "page" : "listPage", arg) + '>' + p + '</button>';
    }).join("") +
    '<button title="Next page"' + act(nextAct, argBase) + '><i class="mdi mdi-chevron-right" style="font-size:20px;vertical-align:-4px"></i></button>' +
    '</div>';
}

function checkRow(label, checked, action, arg, extraStyle) {
  return '<label class="vsel"' + (extraStyle ? ' style="' + extraStyle + '"' : "") + act(action, arg) + '>' +
    '<input type="checkbox"' + (checked ? " checked" : "") + ' tabindex="-1">' +
    '<span class="vsel__box"><i class="' + boxIcon(checked) + '"></i></span>' +
    (label ? '<span class="vsel__label" style="font-size:13.5px">' + esc(label) + "</span>" : "") +
    "</label>";
}

function menuRow(label, ticked, action, arg, strongPrefix) {
  return '<div' + act(action, arg) + ' class="menu-row" style="display:flex;align-items:flex-start;gap:10px;padding:10px 16px;font-size:13.5px;line-height:20px;cursor:pointer;text-wrap:pretty">' +
    '<span style="flex:1">' + (strongPrefix ? "<strong>" + esc(strongPrefix) + "</strong>" : "") + esc(label) + "</span>" +
    (ticked ? '<i class="mdi mdi-check" style="font-size:18px;color:var(--pa-primary)"></i>' : "") +
    "</div>";
}

function chip(label, removeAct, arg, removable) {
  return '<span style="' + CHIP_STYLE + '"><span>' + esc(label) + "</span>" +
    (removable === false ? "" : '<i class="mdi mdi-close" style="font-size:16px;color:var(--pa-ink-2);cursor:pointer" title="Remove"' + act(removeAct, arg) + "></i>") +
    "</span>";
}

/* ----------------------------------------------------------- app chrome */

function sidebar() {
  var items = [{ id: "articles", label: "Article Uploader" }, { id: "feeds", label: "SynopsiMedEd Feeds" }];
  return '<nav class="sb" style="position:sticky;top:0;height:100vh;overflow:auto">' +
    '<div class="sb__head"><img src="assets/logo-rev.svg" alt="PRIME ADMIN" style="height:22px;width:auto"><i class="mdi mdi-chevron-left sb__collapse"></i></div>' +
    ['<div class="sb__section"><div class="sb__item"><i class="mdi mdi-account-box-outline"></i><span>Program Management</span><i class="mdi mdi-chevron-down sb__item__chev"></i></div></div>',
     '<div class="sb__section"><div class="sb__item"><i class="mdi mdi-chart-line"></i><span>Marketing</span><i class="mdi mdi-chevron-down sb__item__chev"></i></div></div>',
     '<div class="sb__section"><div class="sb__item"><i class="mdi mdi-view-dashboard"></i><span>Outcomes</span><i class="mdi mdi-chevron-down sb__item__chev"></i></div></div>',
     '<div class="sb__section"><div class="sb__item"><i class="mdi mdi-chart-box-outline"></i><span>Reporting</span><i class="mdi mdi-chevron-down sb__item__chev"></i></div></div>'].join("") +
    '<div class="sb__section">' +
      '<div class="sb__item sb__item--active"><i class="mdi mdi-tools"></i><span>Tools</span><i class="mdi mdi-chevron-up sb__item__chev"></i></div>' +
      '<div class="sb__sub">' + items.map(function (n) {
        return '<div class="' + cx("sb__sub-item", S.section === n.id && "sb__sub-item--active") + '"' + act("navSection", n.id) + ">" + esc(n.label) + "</div>";
      }).join("") + "</div>" +
    "</div>" +
    '<div class="sb__section"><div class="sb__item"><i class="mdi mdi-account-key"></i><span>User Manager</span><i class="mdi mdi-chevron-down sb__item__chev"></i></div></div>' +
    "</nav>";
}

function topbar() {
  return '<header class="topbar" style="position:sticky;top:0;z-index:5">' +
    '<div class="search" style="flex:1;max-width:520px;height:40px"><input placeholder="Search for [Project]"><i class="mdi mdi-magnify" style="color:var(--pa-ink-6);font-size:18px"></i></div>' +
    '<button class="pa-btn pa-btn--primary"><i class="mdi mdi-plus"></i><span>Create</span></button>' +
    '<div style="flex:1"></div>' +
    '<button class="topbar__btn" title="Notifications" style="position:relative"><i class="mdi mdi-bell-outline" style="font-size:22px;color:var(--pa-ink-3)"></i>' +
      '<span style="position:absolute;top:2px;right:2px;min-width:16px;height:16px;border-radius:8px;background:var(--pa-error);color:#fff;font-size:10px;line-height:16px;font-weight:500;padding:0 4px">2</span></button>' +
    '<span class="avatar" title="Douglas Benjamin">DB</span>' +
    "</header>";
}

/* -------------------------------------------------------- articles list */

function filteredArticles() {
  var q = S.query.trim().toLowerCase();
  var list = ARTICLES.filter(function (a) {
    if (S.removed.indexOf(a.id) !== -1) return false;
    if (!S.includeInactive && !projectOf(a.projectCode).active) return false;
    if (S.filterCodes.length && S.filterCodes.indexOf(a.projectCode) === -1) return false;
    if (!q) return true;
    return a.title.toLowerCase().indexOf(q) !== -1 || a.source.toLowerCase().indexOf(q) !== -1 ||
      String(a.id).indexOf(q) !== -1 || a.projectCode.indexOf(q) !== -1;
  });
  return list.sort(function (a, b) {
    var v = S.sort === "date" ? a.date.localeCompare(b.date) : a.id - b.id;
    return S.dir === "asc" ? v : -v;
  });
}

function articlesList() {
  var all = filteredArticles();
  var pageCount = Math.max(1, Math.ceil(all.length / S.perPage));
  var page = Math.min(S.page, pageCount);
  var start = (page - 1) * S.perPage;
  var rows = all.slice(start, start + S.perPage);
  var nums = pageNumbers(pageCount, page); nums.current = page;
  var range = all.length ? (start + 1) + "-" + Math.min(start + S.perPage, all.length) + " of " + all.length + " articles" : "0 articles";
  var bar = '<div class="pa-tablebar"><span>' + range + "</span>" +
    '<span style="display:flex;align-items:center;gap:10px">Rows per page: <select data-sel="perPage">' +
      [10, 25, 50].map(function (n) { return '<option value="' + n + '"' + (S.perPage === n ? " selected" : "") + ">" + n + "</option>"; }).join("") +
    "</select></span>" + pager(nums, "prevPage", "nextPage") + "</div>";
  var footBar = '<div class="pa-tablebar pa-tablebar--footer"><span>' + range + "</span>" + pager(nums, "prevPage", "nextPage") + "</div>";

  var fq = S.filterQuery.trim().toLowerCase();
  var options = PROJECTS.filter(function (p) {
    if (!S.includeInactive && !p.active) return false;
    return !fq || p.code.indexOf(fq) !== -1 || p.name.toLowerCase().indexOf(fq) !== -1;
  });

  return '<div style="display:flex;flex-direction:column;gap:20px">' +
    '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:24px">' +
      '<h1 class="pa-page-title" style="margin:0">SynopsiMedEd Articles</h1>' +
      '<button class="pa-btn pa-btn--primary"' + act("openCreate") + '><i class="mdi mdi-plus"></i><span>Add Article</span></button></div>' +

    '<div style="display:flex;align-items:center;gap:16px">' +
      '<div class="search" style="flex:1;max-width:none;height:40px"><input placeholder="Search for SynopsiMedEd article(s)" value="' + esc(S.query) + '"' + inp("query") + '><i class="mdi mdi-magnify" style="color:var(--pa-ink-6);font-size:20px"></i></div>' +
      '<button class="pa-btn pa-btn--secondary pa-btn--lg" style="flex-shrink:0"><span>Search</span></button></div>' +

    '<div style="display:flex;align-items:center;gap:20px;flex-wrap:wrap">' +
      '<label class="vsw"' + act("toggleInactive") + '><input type="checkbox"' + (S.includeInactive ? " checked" : "") + ' tabindex="-1"><span class="vsw__track"><span class="vsw__thumb"></span></span><span class="vsw__label" style="padding-left:10px">Include articles in inactive projects</span></label>' +
      '<span style="width:1px;height:24px;background:var(--pa-line)"></span>' +
      '<div style="position:relative">' +
        '<button class="' + cx("pa-btn", "pa-btn--lg", S.filterCodes.length ? "pa-btn--primary" : "pa-btn--secondary") + '"' + act("toggleMenu", "filter") + '><span>' +
          (S.filterCodes.length ? S.filterCodes.length + (S.filterCodes.length === 1 ? " project selected" : " projects selected") : "SynopsiMedEd Project") +
        '</span><i class="mdi mdi-menu-down" style="font-size:18px;margin-left:6px"></i></button>' +
        (S.menu === "filter" ?
          '<div style="position:absolute;top:calc(100% + 6px);left:0;width:620px;max-width:70vw;z-index:30;background:#fff;border-radius:8px;box-shadow:var(--pa-elev-modal);display:flex;flex-direction:column;overflow:hidden">' +
            '<div style="padding:12px 12px 8px"><div class="search" style="height:36px;width:100%;max-width:none"><input placeholder="Search projects\u2026" value="' + esc(S.filterQuery) + '"' + inp("filterQuery") + "></div></div>" +
            '<div style="max-height:340px;overflow:auto;display:flex;flex-direction:column;padding-bottom:4px">' +
              options.map(function (p) {
                var checked = S.filterCodes.indexOf(p.code) !== -1;
                return '<label class="vsel" style="display:flex;align-items:flex-start;gap:12px;padding:9px 16px;text-align:left"' + act("toggleFilterCode", p.code) + '>' +
                  '<input type="checkbox"' + (checked ? " checked" : "") + ' tabindex="-1"><span class="vsel__box" style="margin-top:1px"><i class="' + boxIcon(checked) + '"></i></span>' +
                  '<span class="vsel__label" style="font-size:13.5px;line-height:20px;text-wrap:pretty"><strong>' + esc(p.code) + "</strong> \u2013 " + esc(p.name || "(no title)") + "</span></label>";
              }).join("") +
            "</div>" +
            '<div style="border-top:1px solid var(--pa-divider);padding:8px 12px;display:flex;justify-content:space-between;align-items:center">' +
              '<button class="pa-btn pa-btn--tertiary-grey"' + act("clearFilter") + '><span>Clear</span></button>' +
              '<button class="pa-btn pa-btn--tertiary"' + act("closeMenus") + '><span>Done</span></button></div>' +
          "</div>" : "") +
      "</div></div>" +

    '<div style="min-width:0;overflow-x:auto">' + bar +
      '<table class="pa-ltable"><thead><tr>' +
        '<th class="sortable" style="width:110px"' + act("sort", "id") + ">Article ID " + (S.sort === "id" ? (S.dir === "asc" ? "\u2191" : "\u2193") : "") + "</th>" +
        '<th style="width:120px">Project Code</th><th style="width:180px">Source</th><th style="min-width:420px">Title</th>' +
        '<th class="sortable" style="width:200px"' + act("sort", "date") + ">Published At " + (S.sort === "date" ? (S.dir === "asc" ? "\u2191" : "\u2193") : "") + "</th>" +
        '<th class="acts" style="width:96px">Actions</th></tr></thead><tbody>' +
        rows.map(function (a) {
          return "<tr>" +
            '<td class="num" style="vertical-align:middle">' + a.id + "</td>" +
            '<td class="num" style="vertical-align:middle">' + esc(a.projectCode) + "</td>" +
            '<td style="vertical-align:middle;color:var(--pa-ink-2)">' + esc(a.source) + "</td>" +
            '<td style="vertical-align:middle"><a href="#"' + act("openEdit", a.id) + ">" + esc(a.title) + "</a></td>" +
            '<td class="num" style="vertical-align:middle;white-space:nowrap">' + longDate(a.date) + "</td>" +
            '<td class="acts" style="vertical-align:middle">' +
              '<button class="pa-icon-btn pa-icon-btn--sm" title="Edit article"' + act("openEdit", a.id) + '><i class="mdi mdi-pencil" style="font-size:17px"></i></button>' +
              '<button class="pa-icon-btn pa-icon-btn--sm pa-icon-btn--danger" title="Delete article"' + act("askRemove", a.id) + '><i class="mdi mdi-delete" style="font-size:17px"></i></button>' +
            "</td></tr>";
        }).join("") +
      "</tbody></table>" +
      (all.length ? "" : '<div style="padding:56px 0;text-align:center"><i class="mdi mdi-file-document-outline" style="font-size:40px;color:var(--pa-ink-6)"></i><div class="pa-body-16" style="margin-top:10px;color:var(--pa-ink-2)">No articles match this search.</div></div>') +
      footBar +
    "</div></div>";
}

/* -------------------------------------------------------- article form */

function combobox(kind, label, all, selected, query, placeholder) {
  var t = query.trim().toLowerCase();
  var options = all.filter(function (o) { return !t || o.toLowerCase().indexOf(t) !== -1; });
  return '<div class="pa-field pa-field--filled" style="position:relative">' +
    '<label class="pa-field__label">' + esc(label) + "</label>" +
    '<div class="pa-field__control" style="flex-wrap:wrap;gap:6px;padding:4px 0 7px;cursor:text"' + act("openMenu", kind) + ">" +
      selected.map(function (o) { return chip(o, "toggleTag", { kind: kind, value: o }); }).join("") +
      '<input style="flex:1;min-width:140px;border:none;outline:none;background:transparent;font-family:var(--pa-font-display);font-size:13.5px;color:var(--pa-ink);padding:3px 0" placeholder="' + esc(placeholder) + '" value="' + esc(query) + '"' + inp(kind + "Query") + ">" +
      '<i class="mdi mdi-menu-down" style="cursor:pointer"' + act("toggleMenu", kind) + "></i>" +
    "</div>" +
    (S.menu === kind ? '<div style="' + MENU_STYLE + ';max-height:300px">' + options.map(function (o) {
      return checkRow(o, selected.indexOf(o) !== -1, "toggleTag", { kind: kind, value: o }, "display:flex;align-items:center;gap:12px;padding:8px 16px;text-align:left");
    }).join("") + "</div>" : "") +
    "</div>";
}

function articleForm() {
  var f = S.form;
  var isEdit = S.view === "edit";
  var fp = f.project ? projectOf(f.project) : null;
  var titleInvalid = S.touched && !f.title.trim();
  var urlInvalid = S.touched && !/^https?:\/\/\S+$/.test(f.url.trim());

  return '<div style="display:flex;flex-direction:column;gap:24px;max-width:1180px">' +
    '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:24px"><div>' +
      '<div class="pa-crumb"><a href="#"' + act("goList") + ">SynopsiMedEd Articles</a> &gt; " + (isEdit ? "Article " + f.id : "New article") + "</div>" +
      '<h1 class="pa-page-title" style="margin:6px 0 0">' + (isEdit ? "Edit SynopsiMedEd Article" : "Create SynopsiMedEd Article") + "</h1></div>" +
      '<div style="display:flex;align-items:center;gap:10px;flex-shrink:0">' +
        '<button class="pa-btn pa-btn--secondary-grey"' + act("goList") + '><span>Cancel</span></button>' +
        '<button class="pa-btn pa-btn--primary"' + act("saveArticle") + '><span>Save</span></button></div></div>' +

    '<div class="pa-card pa-card--form">' +
      '<div class="pa-band">Source</div><div class="pa-card__body">' +

        '<div class="pa-field" style="position:relative"><label class="pa-field__label">Project</label>' +
          '<div class="pa-field__control" style="cursor:pointer"' + act("toggleMenu", "project") + '>' +
            '<span class="' + cx("pa-field__value", !fp && "pa-field__value--empty") + '">' + esc(fp ? fp.code + " \u2013 " + (fp.name || "(no title)") : "Select a project") + "</span>" +
            '<i class="mdi mdi-menu-down"></i></div>' +
          '<div class="pa-field__hint">' + (fp && !fp.active ? "This project is inactive \u2014 the article will not appear in live feeds." : "Determines which SynopsiMedEd feed the article publishes to.") + "</div>" +
          (S.menu === "project" ? '<div style="' + MENU_STYLE + ';max-height:320px">' + PROJECTS.map(function (p) {
            return menuRow(" \u2013 " + (p.name || "(no title)"), f.project === p.code, "pickProject", p.code, p.code);
          }).join("") + "</div>" : "") +
        "</div>" +

        '<div class="pa-field" style="position:relative"><label class="pa-field__label">Source</label>' +
          '<div class="pa-field__control" style="cursor:pointer"' + act("toggleMenu", "source") + '>' +
            '<span class="' + cx("pa-field__value", !f.source && "pa-field__value--empty") + '">' + esc(f.source || "Select a source") + "</span>" +
            '<i class="mdi mdi-menu-down"></i></div>' +
          (S.menu === "source" ? '<div style="' + MENU_STYLE + ';max-height:300px">' + SOURCES.map(function (o) {
            return menuRow(o, f.source === o, "pickSource", o);
          }).join("") + "</div>" : "") +
        "</div>" +

        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:24px 40px">' +
          '<div class="pa-field pa-field--filled"><label class="pa-field__label">Publication Date</label>' +
            '<div class="pa-field__control"><i class="mdi mdi-calendar-blank-outline"></i>' +
            '<input class="pa-field__value" style="border:none;outline:none;background:transparent;padding:0" value="' + esc(f.date) + '"' + inp("formDate") + "></div></div>" +
          '<div class="pa-field" style="position:relative"><label class="pa-field__label">Article Type</label>' +
            '<div class="pa-field__control" style="cursor:pointer"' + act("toggleMenu", "type") + '>' +
              '<span class="' + cx("pa-field__value", !f.type && "pa-field__value--empty") + '">' + esc(f.type || "Select a type") + "</span>" +
              '<i class="mdi mdi-menu-down"></i></div>' +
            (S.menu === "type" ? '<div style="' + MENU_STYLE + '">' + TYPES.map(function (o) {
              return menuRow(o, f.type === o, "pickType", o);
            }).join("") + "</div>" : "") +
          "</div></div>" +

      "</div>" +

      '<div class="pa-band">Article</div><div class="pa-card__body">' +
        '<div class="' + cx("pa-field", titleInvalid && "pa-field--error", f.title && "pa-field--filled") + '">' +
          '<label class="pa-field__label">Title</label>' +
          '<input class="pa-field__input" value="' + esc(f.title) + '"' + inp("formTitle") + ">" +
          '<div class="pa-field__hint">' + (titleInvalid ? "A title is required." : "Pulled from the source record \u2014 edit only to fix formatting.") + "</div></div>" +
        '<div class="' + cx("pa-field", urlInvalid && "pa-field--error", f.url && "pa-field--filled") + '">' +
          '<label class="pa-field__label">Article URL</label>' +
          '<input class="pa-field__input" value="' + esc(f.url) + '"' + inp("formUrl") + ">" +
          '<div class="pa-field__hint">' + (urlInvalid ? "Enter a full URL, including https://" : "DOI or publisher link the feed sends readers to.") + "</div></div>" +
      "</div>" +

      '<div class="pa-band">Classification</div><div class="pa-card__body">' +
        combobox("specialty", "Specialty/ies", SPECIALTIES, f.specialties, S.specialtyQuery, f.specialties.length ? "Add another" : "Type to search specialties") +
        combobox("topic", "Topic/s", TOPICS, f.topics, S.topicQuery, f.topics.length ? "Add another" : "Type to search topics") +
      "</div>" +
    "</div>" +

    (isEdit ? '<div style="display:flex;justify-content:flex-start"><button class="pa-btn pa-btn--danger-outline"' + act("askRemove", f.id) + '><i class="mdi mdi-delete-outline"></i><span>Delete Article</span></button></div>' : "") +
    "</div>";
}

/* ------------------------------------------------------------ feed list */

function feedsList() {
  var fq = S.feedQuery.trim().toLowerCase();
  var list = FEEDS.filter(function (f) {
    return !fq || f.code.indexOf(fq) !== -1 || f.title.toLowerCase().indexOf(fq) !== -1 || f.supporter.toLowerCase().indexOf(fq) !== -1;
  });
  return '<div style="display:flex;flex-direction:column;gap:20px">' +
    '<h1 class="pa-page-title" style="margin:0">SynopsiMedEd Feeds</h1>' +
    '<div style="display:flex;align-items:center;gap:16px">' +
      '<div class="search" style="flex:1;max-width:none;height:40px"><input placeholder="Search for SynopsiMedEd feed(s)" value="' + esc(S.feedQuery) + '"' + inp("feedQuery") + '><i class="mdi mdi-magnify" style="color:var(--pa-ink-6);font-size:20px"></i></div>' +
      '<button class="pa-btn pa-btn--secondary pa-btn--lg" style="flex-shrink:0"><span>Search</span></button></div>' +
    '<div style="min-width:0;overflow-x:auto">' +
      '<div class="pa-tablebar"><span>' + list.length + (list.length === 1 ? " feed" : " feeds") + "</span></div>" +
      '<table class="pa-ltable"><thead><tr><th style="width:110px">Code</th><th style="min-width:520px">Project Title</th><th style="width:190px">Supporter</th><th style="width:140px">Release Date</th><th class="acts" style="width:96px">Actions</th></tr></thead><tbody>' +
      list.map(function (f) {
        return "<tr>" +
          '<td class="num" style="vertical-align:middle">' + esc(f.code) + "</td>" +
          '<td style="vertical-align:middle"><a href="#"' + act("openFeed", { code: f.code, editing: false }) + ">" + esc(f.title) + "</a></td>" +
          '<td style="vertical-align:middle;color:var(--pa-ink-2)">' + esc(f.supporter) + "</td>" +
          '<td class="num" style="vertical-align:middle;white-space:nowrap">' + esc(f.release) + "</td>" +
          '<td class="acts" style="vertical-align:middle">' +
            '<button class="pa-icon-btn pa-icon-btn--sm" title="View feed"' + act("openFeed", { code: f.code, editing: false }) + '><i class="mdi mdi-eye-outline" style="font-size:17px"></i></button>' +
            '<button class="pa-icon-btn pa-icon-btn--sm" title="Edit feed"' + act("openFeed", { code: f.code, editing: true }) + '><i class="mdi mdi-pencil" style="font-size:17px"></i></button>' +
          "</td></tr>";
      }).join("") + "</tbody></table>" +
      (list.length ? "" : '<div style="padding:56px 0;text-align:center"><i class="mdi mdi-rss" style="font-size:40px;color:var(--pa-ink-6)"></i><div class="pa-body-16" style="margin-top:10px;color:var(--pa-ink-2)">No feeds match this search.</div></div>') +
    "</div></div>";
}

/* ---------------------------------------------------------- feed detail */

function currentDraft(fd) {
  if (!S.feedDraft) S.feedDraft = { name: fd.name, tag: fd.tag, slug: fd.slug, sources: fd.sources.slice() };
  return S.feedDraft;
}

function feedDetailsTab(fd, draft, ro) {
  return '<div class="pa-card pa-card--form"><div class="pa-band">Feed Details</div><div class="pa-card__body">' +
    '<div class="pa-meta" style="display:grid;grid-template-columns:repeat(3,minmax(160px,1fr));gap:24px 40px">' +
      '<div><div class="pa-meta-key">Code</div><div class="pa-meta-val">' + esc(fd.code) + "</div></div>" +
      '<div><div class="pa-meta-key">Release Date</div><div class="pa-meta-val">' + esc(fd.release) + "</div></div>" +
      '<div><div class="pa-meta-key">Supporter</div><div class="pa-meta-val">' + esc(fd.supporter) + "</div></div></div>" +

    '<div class="' + cx("pa-field", "pa-field--filled", ro && "pa-field--disabled") + '"><label class="pa-field__label">Feed Name</label>' +
      '<input class="pa-field__input" value="' + esc(draft.name) + '"' + (ro ? " readonly" : "") + inp("feedName") + "></div>" +

    '<div class="pa-field pa-field--filled"><label class="pa-field__label">Project Tag</label>' +
      '<div class="pa-field__control" style="gap:8px"><span style="' + CHIP_STYLE + ';padding:0 12px">' + esc(draft.tag) + "</span>" +
      '<span style="flex:1"></span><i class="mdi mdi-menu-down"></i></div></div>' +

    '<div style="display:grid;grid-template-columns:minmax(240px,340px) 1fr;gap:24px 40px;align-items:end">' +
      '<div class="pa-field pa-field--filled pa-field--disabled"><label class="pa-field__label">URL</label>' +
        '<div class="pa-field__control" style="border-bottom-style:dashed"><span class="pa-field__value" style="color:var(--pa-ink-6)">https://primeinc.org/site/synopsimeded/</span></div></div>' +
      '<div class="pa-field pa-field--filled"><label class="pa-field__label">Slug</label>' +
        '<div class="pa-field__control"><input class="pa-field__value" style="border:none;outline:none;background:transparent;padding:0" value="' + esc(draft.slug) + '"' + (ro ? " readonly" : "") + inp("feedSlug") + '><i class="mdi mdi-link-variant" style="color:var(--pa-ink-3)"></i></div></div></div>' +

    '<div class="pa-field pa-field--filled"><label class="pa-field__label">Feed Description</label>' +
      '<div style="border:1px solid var(--pa-line);border-radius:4px;overflow:hidden">' +
        '<div style="display:flex;align-items:center;gap:2px;flex-wrap:wrap;padding:6px 8px;background:var(--pa-band);border-bottom:1px solid var(--pa-line)">' +
          EDITOR_TOOLS.map(function (t) {
            return '<button class="pa-icon-btn pa-icon-btn--sm" title="' + esc(t.title) + '"' + (ro ? " disabled" : "") + '><i class="' + t.icon + '" style="font-size:17px"></i></button>';
          }).join("") + "</div>" +
        '<div style="padding:16px 18px;font-family:var(--pa-font-sans);font-size:14px;line-height:22px;color:var(--pa-ink);min-height:150px" contenteditable="' + (ro ? "false" : "true") + '">' +
          '<p style="margin:0 0 14px">This unique educational activity offers:</p>' +
          '<p style="margin:0 0 14px">Expert clinical commentaries and case-based discussions on the nuances of HIV treatment decision-making across specific federal and public care settings</p>' +
          '<ul style="margin:0;padding-left:22px;display:flex;flex-direction:column;gap:6px"><li>Self-paced learning for busy providers</li><li>Testing</li></ul>' +
        "</div></div></div>" +

    '<div class="pa-field pa-field--filled"><label class="pa-field__label">Existing Sources</label>' +
      '<div class="pa-field__control" style="flex-wrap:wrap;gap:6px;padding:4px 0 7px">' +
        draft.sources.map(function (s) { return chip(s, "removeSource", s, !ro); }).join("") +
        '<span style="flex:1"></span><i class="mdi mdi-menu-down"></i></div></div>' +

    "<div>" +
      '<div class="pa-field-label" style="margin-bottom:8px">New Sources</div>' +
      '<div class="pa-table"><div class="pa-table__head" style="grid-template-columns:minmax(0,1fr) minmax(0,1fr) 56px"><div>Name</div><div>URL</div><div></div></div>' +
        S.newSources.map(function (r, i) {
          var cell = "width:100%;box-sizing:border-box;border:none;outline:none;background:transparent;padding:12px 16px;font-family:var(--pa-font-sans);font-size:13px;color:var(--pa-ink)";
          return '<div class="pa-table__row" style="grid-template-columns:minmax(0,1fr) minmax(0,1fr) 56px">' +
            '<div style="padding:0"><input placeholder="Source name" value="' + esc(r.name) + '"' + (ro ? " readonly" : "") + inp("newSourceName", i) + ' style="' + cell + '"></div>' +
            '<div style="padding:0"><input placeholder="https://" value="' + esc(r.url) + '"' + (ro ? " readonly" : "") + inp("newSourceUrl", i) + ' style="' + cell + '"></div>' +
            '<div style="padding:0;display:flex;justify-content:center"><button class="pa-icon-btn pa-icon-btn--sm pa-icon-btn--danger" title="Remove source"' + (ro ? " disabled" : "") + act("removeNewSource", i) + '><i class="mdi mdi-delete-outline" style="font-size:17px"></i></button></div>' +
          "</div>";
        }).join("") + "</div>" +
      '<div style="margin-top:10px"><button class="pa-btn pa-btn--tertiary"' + (ro ? " disabled" : "") + act("addNewSource") + '><i class="mdi mdi-plus"></i><span>Add source</span></button></div>' +
    "</div>" +

    "<div>" +
      '<div class="pa-field-label" style="margin-bottom:10px">Chapters</div>' +
      '<div style="display:flex;flex-direction:column;gap:16px;align-items:flex-start">' +
        '<button class="pa-btn pa-btn--primary"' + (ro ? " disabled" : "") + act("openChapterModal") + '><i class="mdi mdi-plus"></i><span>Create Chapter</span></button>' +
        S.chapters.map(function (c) {
          return '<div style="width:100%;max-width:520px;border:1px solid var(--pa-ink);border-radius:4px;overflow:hidden;box-shadow:var(--pa-elev-1)">' +
            '<div style="display:flex;align-items:center;gap:12px;padding:12px 16px;background:var(--pa-primary);color:#fff">' +
              '<span class="pa-body-14" style="flex:1;min-width:0;color:#fff"><strong style="text-transform:uppercase;letter-spacing:.3px;color:#fff">Chapter:</strong> ' + esc(c.name) + "</span>" +
              '<button class="pa-icon-btn pa-icon-btn--sm" style="color:#fff" title="Rename chapter"' + (ro ? " disabled" : "") + act("editChapter", c.id) + '><i class="mdi mdi-pencil" style="font-size:17px"></i></button>' +
              '<button class="pa-icon-btn pa-icon-btn--sm" style="color:#fff" title="Remove chapter"' + (ro ? " disabled" : "") + act("removeChapter", c.id) + '><i class="mdi mdi-delete-outline" style="font-size:17px"></i></button></div>' +
            '<div style="padding:14px 16px;display:flex;flex-direction:column;gap:8px">' +
              c.activities.map(function (a) {
                return '<div class="pa-body-14" style="background:var(--pa-band);border-radius:4px;padding:12px 16px;text-wrap:pretty">' + esc(a) + "</div>";
              }).join("") + "</div></div>";
        }).join("") +
      "</div></div>" +

  "</div></div>";
}

function feedArticlesTab(fd) {
  var ordered = S.listOrder.map(function (id) {
    for (var i = 0; i < FEED_LISTS.length; i++) if (FEED_LISTS[i].id === id) return FEED_LISTS[i];
  });
  return '<div style="display:flex;flex-wrap:wrap;gap:28px;align-items:flex-start">' +
    '<div class="pa-card pa-card--form" style="flex:3 1 560px;min-width:0"><div class="pa-band">Feed Search</div><div class="pa-card__body">' +
      '<div class="pa-meta" style="display:grid;grid-template-columns:repeat(3,minmax(140px,1fr));gap:24px 40px">' +
        '<div><div class="pa-meta-key">Code</div><div class="pa-meta-val">' + esc(fd.code) + "</div></div>" +
        '<div><div class="pa-meta-key">Release Date</div><div class="pa-meta-val">' + esc(fd.release) + "</div></div>" +
        '<div><div class="pa-meta-key">Supporter</div><div class="pa-meta-val">' + esc(fd.supporter) + "</div></div></div>" +

      '<div class="' + cx("pa-field", S.artSearch && "pa-field--filled") + '"><label class="pa-field__label">Search</label>' +
        '<input class="pa-field__input" value="' + esc(S.artSearch) + '"' + inp("artSearch") + "></div>" +

      '<div style="display:flex;align-items:center;gap:18px;flex-wrap:wrap">' +
        '<span class="pa-body-13" style="color:var(--pa-ink-2)">Search on articles:</span>' +
        SCOPE_KEYS.map(function (k) { return checkRow(k, S.searchScopes[k], "toggleScope", k); }).join("") + "</div>" +

      '<div style="display:flex;align-items:flex-end;justify-content:space-between;gap:24px;flex-wrap:wrap">' +
        '<div class="pa-field pa-field--filled" style="max-width:260px;position:relative"><label class="pa-field__label">Lookback</label>' +
          '<div class="pa-field__control" style="cursor:pointer"' + act("toggleMenu", "lookback") + '><span class="pa-field__value">' + esc(S.lookback) + '</span><i class="mdi mdi-menu-down"></i></div>' +
          (S.menu === "lookback" ? '<div style="' + MENU_STYLE + '">' + LOOKBACKS.map(function (o) {
            return menuRow(o, S.lookback === o, "pickLookback", o);
          }).join("") + "</div>" : "") + "</div>" +
        '<button class="pa-btn pa-btn--primary pa-btn--lg"' + act("runArtSearch") + "><span>Search</span></button></div>" +

      '<div style="display:flex;align-items:center;justify-content:space-between;gap:24px;flex-wrap:wrap;border-top:1px solid var(--pa-divider);padding-top:20px">' +
        checkRow("Include articles currently used in this feed", S.includeUsed, "toggleIncludeUsed") +
        '<div style="display:flex;gap:10px;flex-wrap:wrap">' +
          '<button class="pa-btn pa-btn--secondary"' + (S.searched ? "" : " disabled") + act("createList", "dynamic") + "><span>Create Dynamic List</span></button>" +
          '<button class="pa-btn pa-btn--secondary"' + (S.searched ? "" : " disabled") + act("createList", "static") + "><span>Create Static List</span></button></div></div>" +

      '<div class="pa-helper" style="margin:0">' + (S.searched
        ? "34 articles match \u2014 create a dynamic list to keep it updating, or a static list to freeze this result."
        : "Run a search to enable list creation.") + "</div>" +
    "</div></div>" +

    '<div style="flex:1 1 420px;min-width:0;display:flex;flex-direction:column;gap:14px">' +
      '<div class="pa-rail-title">Feed Preview</div>' +
      ordered.map(function (l, i) {
        var expanded = S.expandedList === l.id;
        var pageCount = Math.max(1, Math.ceil(l.count / 20));
        var cur = S.listPages[l.id] || 1;
        var nums = pageNumbers(pageCount, cur); nums.current = cur;
        return '<div class="pa-card" style="display:flex;align-items:stretch">' +
          '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;padding:0 6px;color:var(--pa-ink-6);border-right:1px solid var(--pa-divider)">' +
            '<button class="pa-icon-btn pa-icon-btn--sm" title="Move up"' + act("moveList", { index: i, delta: -1 }) + '><i class="mdi mdi-chevron-up" style="font-size:18px"></i></button>' +
            '<i class="mdi mdi-drag" style="font-size:16px"></i>' +
            '<button class="pa-icon-btn pa-icon-btn--sm" title="Move down"' + act("moveList", { index: i, delta: 1 }) + '><i class="mdi mdi-chevron-down" style="font-size:18px"></i></button></div>' +
          '<div style="flex:1;min-width:0;padding:14px 16px;display:flex;flex-direction:column;gap:10px">' +
            '<div style="display:flex;align-items:center;gap:12px">' +
              '<span class="pa-body-14" style="font-weight:500">Articles: ' + l.count + "</span>" +
              '<span class="pa-body-13">' + l.kind + "</span>" +
              '<span style="flex:1"></span>' +
              '<button class="pa-icon-btn" title="Expand list"' + act("toggleList", l.id) + '><i class="mdi ' + (expanded ? "mdi-chevron-up" : "mdi-chevron-down") + '" style="font-size:20px"></i></button></div>' +
            '<div class="pa-body-13" style="color:var(--pa-ink-3);display:flex;align-items:center;gap:14px;flex-wrap:wrap"><span>Search Query: \u201c' + esc(l.query) + '\u201d</span>' +
              l.scopes.map(function (s) { return '<span style="color:var(--pa-primary)">' + esc(s) + "</span>"; }).join("") + "</div>" +
            (expanded ? '<div style="display:flex;flex-direction:column;gap:14px;padding-top:4px">' +
              pager(nums, "listPrev", "listNext", l.id, true) +
              '<div style="display:flex;justify-content:center;gap:10px;flex-wrap:wrap">' +
                '<button class="pa-btn pa-btn--danger-outline pa-btn--sm"' + act("deleteList", l.id) + "><span>Delete List</span></button>" +
                '<button class="pa-btn pa-btn--secondary pa-btn--sm"' + act("convertList", l.id) + "><span>" + (l.kind === "Dynamic List" ? "Convert to Static List" : "Convert to Dynamic List") + "</span></button>" +
                '<button class="pa-btn pa-btn--secondary pa-btn--sm" style="color:var(--pa-success);border-color:var(--pa-success)"><i class="mdi mdi-check"></i><span>' + l.kind + "</span></button></div>" +
              '<div style="display:flex;flex-direction:column;gap:14px">' +
                l.articles.map(function (a) {
                  return '<div class="pa-card" style="padding:18px 20px;display:flex;flex-direction:column;gap:12px;box-shadow:var(--pa-elev-1)">' +
                    '<div style="display:flex;align-items:baseline;justify-content:space-between;gap:16px">' +
                      '<span class="pa-body-14" style="font-style:italic">' + esc(a.source) + "</span>" +
                      '<span style="display:flex;align-items:baseline;gap:14px;flex-shrink:0">' +
                        '<span class="pa-body-13" style="color:var(--pa-primary)">' + esc(a.type) + "</span>" +
                        '<span class="pa-body-13" style="color:var(--pa-ink-2);white-space:nowrap">' + esc(a.date) + "</span></span></div>" +
                    '<div class="pa-body-14" style="font-weight:500;line-height:22px;text-wrap:pretty">' + esc(a.title) + "</div>" +
                    '<div class="pa-body-14" style="color:var(--pa-ink-2);line-height:23px;text-wrap:pretty">' + esc(a.summary) + "</div>" +
                    '<div style="border-top:1px solid var(--pa-divider);padding-top:12px;display:flex;align-items:center;gap:16px;flex-wrap:wrap">' +
                      '<span class="pa-body-13" style="color:var(--pa-ink-2)">' + esc(a.specialty) + "</span>" +
                      '<span class="pa-body-13" style="color:var(--pa-primary)">' + esc(a.topic) + "</span></div></div>";
                }).join("") + "</div></div>" : "") +
          "</div></div>";
      }).join("") +
    "</div></div>";
}

function publishDefsFor(fd, draft) {
  return [
    { key: "name", label: "Feed Name", admin: draft.name, live: fd.live.name },
    { key: "tag", label: "Feed Tag", admin: draft.tag, live: fd.live.tag },
    { key: "description", label: "Feed Description", admin: "DRAFT \u2014 This unique educational activity offers: expert clinical commentaries, case-based discussions, self-paced learning.", live: fd.live.description }
  ];
}

function feedPublishTab(fd, draft) {
  var defs = publishDefsFor(fd, draft);
  var checked = defs.filter(function (d) { return S.publishChecks[d.key]; });
  var active = S.feedActive[fd.code] === undefined ? fd.active : S.feedActive[fd.code];
  return '<div class="pa-card pa-card--form"><div class="pa-band">Publish</div><div class="pa-card__body">' +
    '<div><div class="pa-body-14" style="font-weight:500">' + esc(fd.title) + "</div>" +
      '<div class="pa-helper" style="margin:4px 0 0">This form publishes content from PRIME Admin to <a href="#">primeinc.org</a>. Changes must be saved in Admin before they can be published.</div></div>' +
    '<label class="vsw"' + act("askActive") + '><input type="checkbox"' + (active ? " checked" : "") + ' tabindex="-1"><span class="vsw__track"><span class="vsw__thumb"></span></span><span class="vsw__label" style="padding-left:10px">' + (active ? "Active" : "Inactive") + "</span></label>" +
    '<div style="min-width:0;width:100%;overflow-x:auto"><table class="pa-ltable" style="min-width:640px"><thead><tr>' +
      '<th style="width:180px">Field</th><th style="min-width:180px">Saved in Admin</th><th style="min-width:180px">Published on PRIMEINC.ORG</th>' +
      '<th style="width:150px;text-align:center"><div style="display:flex;flex-direction:column;align-items:center;gap:4px"><span>Publish</span>' +
        '<button class="pa-btn pa-btn--tertiary pa-btn--sm"' + act("toggleAllPublish") + "><span>" + (checked.length === defs.length ? "Uncheck all" : "Check all") + "</span></button></div></th>" +
    "</tr></thead><tbody>" +
      defs.map(function (d) {
        return "<tr>" +
          '<td style="vertical-align:middle;font-weight:500">' + esc(d.label) + "</td>" +
          '<td class="desc" style="vertical-align:middle">' + esc(d.admin) + "</td>" +
          '<td class="desc" style="vertical-align:middle">' + esc(d.live) + "</td>" +
          '<td style="text-align:center;vertical-align:middle">' + checkRow("", !!S.publishChecks[d.key], "togglePublish", d.key, "justify-content:center") + "</td></tr>";
      }).join("") +
    "</tbody></table></div>" +
    '<div class="pa-body-14"><strong>Fields being updated:</strong> ' + (checked.length ? checked.map(function (d) { return esc(d.label); }).join(", ") : "None selected") + "</div>" +
  "</div></div>";
}

function feedDetail() {
  var fd = feedOf(S.feedCode);
  var draft = currentDraft(fd);
  var ro = !S.feedEditing;
  var tabs = [{ id: "details", label: "Details" }, { id: "articles", label: "Articles" }, { id: "publish", label: "Publish" }];
  var defs = publishDefsFor(fd, draft);
  var anyChecked = defs.some(function (d) { return S.publishChecks[d.key]; });

  return '<div style="display:flex;flex-direction:column;gap:20px">' +
    '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:24px">' +
      '<h1 class="pa-page-title" style="margin:0">SynopsiMedEd Feeds</h1>' +
      '<div style="display:flex;align-items:center;gap:10px;flex-shrink:0">' +
        (S.feedTab !== "publish" && ro ? '<button class="pa-btn pa-btn--primary"' + act("startFeedEdit") + "><span>Edit</span></button>" : "") +
        (S.feedTab !== "publish" && !ro ? '<button class="pa-btn pa-btn--secondary-grey"' + act("cancelFeedEdit") + '><span>Cancel</span></button><button class="pa-btn pa-btn--primary"' + act("saveFeedEdit") + "><span>Save</span></button>" : "") +
        (S.feedTab === "publish" ? '<button class="pa-btn pa-btn--primary"' + (anyChecked ? "" : " disabled") + act("publishFeed") + "><span>Publish</span></button>" : "") +
      "</div></div>" +

    '<div class="pa-tabs">' + tabs.map(function (t) {
      return '<button class="' + cx("pa-tabs__btn", S.feedTab === t.id && "pa-tabs__btn--active") + '"' + act("feedTab", t.id) + ">" + t.label + "</button>";
    }).join("") + "</div>" +

    '<div><div class="pa-crumb"><a href="#"' + act("goFeedList") + ">SynopsiMedEd Feeds</a> &gt; " + esc(fd.code) + "</div>" +
      '<h2 class="pa-screen-title" style="margin:6px 0 0;text-wrap:pretty">' + esc(fd.title) + "</h2></div>" +

    (S.feedTab === "details" ? feedDetailsTab(fd, draft, ro) : "") +
    (S.feedTab === "articles" ? feedArticlesTab(fd) : "") +
    (S.feedTab === "publish" ? feedPublishTab(fd, draft) : "") +
  "</div>";
}

/* -------------------------------------------------------------- modals */

function chapterModal() {
  if (S.chapterModal === null) return "";
  return '<div style="' + OVERLAY + '"' + act("closeChapterModal") + '>' +
    '<div style="width:660px;max-width:100%;background:#fff;border-radius:8px;box-shadow:var(--pa-elev-modal)" data-stop>' +
      '<div style="padding:34px 40px 8px;display:flex;flex-direction:column;gap:34px">' +
        '<div class="' + cx("pa-field", S.chapterName && "pa-field--filled") + '"><label class="pa-field__label">Chapter Name</label>' +
          '<input class="pa-field__input" value="' + esc(S.chapterName) + '"' + inp("chapterName") + "></div>" +
        '<div class="pa-field pa-field--filled" style="position:relative"><label class="pa-field__label">Select Activities</label>' +
          '<div class="pa-field__control" style="flex-wrap:wrap;gap:6px;padding:4px 0 7px;cursor:pointer"' + act("toggleMenu", "activities") + ">" +
            S.chapterActivities.map(function (a) { return chip(a, "toggleActivity", a); }).join("") +
            (S.chapterActivities.length ? "" : '<span class="pa-field__value pa-field__value--empty" style="flex:1">Select Activities</span>') +
            '<span style="flex:1"></span><i class="mdi mdi-menu-down"></i></div>' +
          (S.menu === "activities" ? '<div style="' + MENU_STYLE + ';max-height:260px">' + ACTIVITIES.map(function (a) {
            return checkRow(a, S.chapterActivities.indexOf(a) !== -1, "toggleActivity", a, "display:flex;align-items:center;gap:12px;padding:9px 16px;text-align:left");
          }).join("") + "</div>" : "") +
        "</div></div>" +
      '<div style="padding:20px 40px 26px;display:flex;justify-content:flex-end;gap:12px">' +
        '<button class="pa-btn pa-btn--secondary-grey"' + act("closeChapterModal") + '><span>Cancel</span></button>' +
        '<button class="pa-btn pa-btn--primary"' + (S.chapterName.trim() && S.chapterActivities.length ? "" : " disabled") + act("addChapter") + "><span>" +
          (S.chapterModal === "new" ? "Add Chapter" : "Save Chapter") + "</span></button></div>" +
    "</div></div>";
}

function activeModal() {
  if (S.activeConfirm === null) return "";
  var on = S.activeConfirm;
  return '<div style="' + OVERLAY + '"' + act("cancelActive") + '>' +
    '<div style="width:520px;max-width:100%;background:#fff;border-radius:8px;box-shadow:var(--pa-elev-modal);overflow:hidden" data-stop>' +
      '<div class="pa-modal-title" style="padding:24px 26px 10px;text-transform:none;font-size:20px">' + (on ? "Set this feed as active?" : "Set this feed as inactive?") + "</div>" +
      '<div class="pa-body-13" style="padding:0 26px 22px;color:var(--pa-ink-2);line-height:20px;text-wrap:pretty">' +
        (on ? "The feed becomes visible on primeinc.org as soon as it is published. Please confirm your action."
            : "The feed stops appearing on primeinc.org. Published articles stay in place but are no longer served. Please confirm your action.") + "</div>" +
      '<div style="border-top:1px solid var(--pa-divider);padding:14px 26px;display:flex;justify-content:flex-end;gap:12px">' +
        '<button class="pa-btn pa-btn--secondary-grey"' + act("cancelActive") + '><span>Cancel</span></button>' +
        '<button class="pa-btn pa-btn--primary"' + act("confirmActive") + "><span>" + (on ? "Set as active" : "Set as inactive") + "</span></button></div>" +
    "</div></div>";
}

function deleteModal() {
  if (!S.confirm) return "";
  var c = S.confirm;
  return '<div style="' + OVERLAY + '"' + act("closeConfirm") + '>' +
    '<div style="width:480px;max-width:100%;background:#fff;border-radius:8px;box-shadow:var(--pa-elev-modal);overflow:hidden" data-stop>' +
      '<div class="pa-modal-title" style="padding:24px 26px 10px;text-transform:none;font-size:20px">Delete this article?</div>' +
      '<div class="pa-body-13" style="padding:0 26px 6px;color:var(--pa-ink-2);line-height:20px;text-wrap:pretty">\u201c' + esc(c.title) + '\u201d will be removed from the SynopsiMedEd feed for this project. This cannot be undone.</div>' +
      '<div class="pa-body-13" style="padding:10px 26px 22px;color:var(--pa-ink-3)">Article ' + c.id + " \u00b7 Project " + esc(c.projectCode) + "</div>" +
      '<div style="border-top:1px solid var(--pa-divider);padding:14px 26px;display:flex;justify-content:flex-end;gap:12px">' +
        '<button class="pa-btn pa-btn--secondary-grey"' + act("closeConfirm") + '><span>Cancel</span></button>' +
        '<button class="pa-btn pa-btn--danger"' + act("confirmRemove") + "><span>Delete</span></button></div>" +
    "</div></div>";
}

function toastEl() {
  if (!S.toast) return "";
  return '<div style="position:fixed;left:50%;bottom:28px;transform:translateX(-50%);z-index:50;display:flex;align-items:center;gap:12px;background:#fff;border-left:4px solid var(--pa-success);border-radius:4px;box-shadow:var(--pa-elev-raised);padding:14px 20px;font-family:var(--pa-font-sans);font-size:13.5px;color:var(--pa-ink)">' +
    '<i class="mdi mdi-check-circle" style="color:var(--pa-success);font-size:19px"></i><span>' + esc(S.toast) + "</span></div>";
}

/* -------------------------------------------------------------- render */

function main() {
  if (S.section === "articles") return S.view === "list" ? articlesList() : articleForm();
  return S.feedView === "list" ? feedsList() : feedDetail();
}

function render() {
  var root = document.getElementById("app");
  var activeKey = null, caret = null;
  var ae = document.activeElement;
  if (ae && ae.dataset && ae.dataset.inp) {
    activeKey = ae.dataset.inp + "|" + (ae.dataset.arg || "");
    try { caret = ae.selectionStart; } catch (e) { caret = null; }
  }

  root.innerHTML =
    '<div style="display:flex;min-height:100vh;background:#fff;font-family:var(--pa-font-sans)">' +
      sidebar() +
      '<div style="flex:1;min-width:0;display:flex;flex-direction:column">' +
        topbar() +
        '<main style="flex:1;padding:24px 32px 32px;display:flex;flex-direction:column;gap:20px">' + main() + "</main>" +
        (S.menu ? '<div style="position:fixed;inset:0;z-index:20"' + act("closeMenus") + "></div>" : "") +
        chapterModal() + activeModal() + deleteModal() + toastEl() +
        '<footer style="margin-top:auto;text-align:center;padding:22px;font-family:var(--pa-font-sans);font-size:13px;font-weight:700;color:var(--pa-ink);border-top:1px solid var(--pa-divider);background:#fff">1997-2026 PRIME Education, LLC</footer>' +
      "</div></div>";

  if (activeKey) {
    var nodes = root.querySelectorAll("[data-inp]");
    for (var i = 0; i < nodes.length; i++) {
      var key = nodes[i].dataset.inp + "|" + (nodes[i].dataset.arg || "");
      if (key === activeKey) {
        nodes[i].focus();
        if (caret != null && nodes[i].setSelectionRange) { try { nodes[i].setSelectionRange(caret, caret); } catch (e) {} }
        break;
      }
    }
  }
}

/* ------------------------------------------------------------- actions */

function openCreate() {
  var d = new Date();
  var iso = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  S.view = "create"; S.menu = null; S.touched = false;
  S.form = { id: null, project: "", source: "", date: usDate(iso), type: "", title: "", url: "", specialties: [], topics: [] };
}

function articleById(id) {
  for (var i = 0; i < ARTICLES.length; i++) if (ARTICLES[i].id === id) return ARTICLES[i];
  return null;
}

var ACTIONS = {
  navSection: function (id) { S.section = id; S.view = "list"; S.feedView = "list"; S.menu = null; S.confirm = null; },
  toggleMenu: function (name) { S.menu = S.menu === name ? null : name; },
  openMenu: function (name) { S.menu = name; },
  closeMenus: function () { S.menu = null; },

  openCreate: openCreate,
  openEdit: function (id) {
    var a = articleById(id);
    S.view = "edit"; S.menu = null; S.touched = false;
    S.form = {
      id: a.id, project: a.projectCode, source: a.source, date: usDate(a.date), type: "Journal",
      title: a.title, url: "https://doi.org/10.3390/jcm" + a.id,
      specialties: SPECIALTIES.slice(0, 4), topics: TOPICS.slice(0, 3)
    };
  },
  goList: function () { S.view = "list"; S.menu = null; },
  saveArticle: function () {
    var f = S.form;
    if (!f.title.trim() || !/^https?:\/\/\S+$/.test(f.url.trim())) { S.touched = true; return; }
    var edit = S.view === "edit";
    S.view = "list"; S.menu = null;
    showToast(edit ? "Article " + f.id + " saved." : "Article created.");
  },
  pickProject: function (code) { S.form.project = code; S.menu = null; },
  pickSource: function (v) { S.form.source = v; S.menu = null; },
  pickType: function (v) { S.form.type = v; S.menu = null; },
  toggleTag: function (a) {
    var key = a.kind === "specialty" ? "specialties" : "topics";
    var arr = S.form[key];
    var i = arr.indexOf(a.value);
    if (i === -1) arr.push(a.value); else arr.splice(i, 1);
    S.specialtyQuery = ""; S.topicQuery = "";
  },

  sort: function (key) { S.dir = S.sort === key && S.dir === "desc" ? "asc" : "desc"; S.sort = key; S.page = 1; },
  page: function (n) { S.page = n; },
  prevPage: function () { S.page = Math.max(1, S.page - 1); },
  nextPage: function () {
    var pageCount = Math.max(1, Math.ceil(filteredArticles().length / S.perPage));
    S.page = Math.min(pageCount, S.page + 1);
  },
  toggleInactive: function () { S.includeInactive = !S.includeInactive; S.page = 1; },
  toggleFilterCode: function (code) {
    var i = S.filterCodes.indexOf(code);
    if (i === -1) S.filterCodes.push(code); else S.filterCodes.splice(i, 1);
    S.page = 1;
  },
  clearFilter: function () { S.filterCodes = []; S.page = 1; },

  askRemove: function (id) { S.confirm = articleById(id); },
  closeConfirm: function () { S.confirm = null; },
  confirmRemove: function () {
    var id = S.confirm.id;
    S.removed.push(id); S.confirm = null; S.view = "list";
    showToast("Article " + id + " deleted.");
  },

  openFeed: function (a) {
    var fd = feedOf(a.code);
    S.feedView = "detail"; S.feedCode = fd.code; S.feedTab = "details"; S.feedEditing = !!a.editing; S.menu = null;
    S.feedDraft = { name: fd.name, tag: fd.tag, slug: fd.slug, sources: fd.sources.slice() };
  },
  goFeedList: function () { S.feedView = "list"; S.feedEditing = false; S.menu = null; },
  feedTab: function (id) { S.feedTab = id; S.menu = null; },
  startFeedEdit: function () { S.feedEditing = true; },
  cancelFeedEdit: function () {
    var fd = feedOf(S.feedCode);
    S.feedEditing = false;
    S.feedDraft = { name: fd.name, tag: fd.tag, slug: fd.slug, sources: fd.sources.slice() };
  },
  saveFeedEdit: function () { S.feedEditing = false; showToast("Feed " + feedOf(S.feedCode).code + " saved."); },
  removeSource: function (name) {
    S.feedDraft.sources = S.feedDraft.sources.filter(function (x) { return x !== name; });
  },
  addNewSource: function () { S.newSources.push({ name: "", url: "" }); },
  removeNewSource: function (i) {
    if (S.newSources.length > 1) S.newSources.splice(i, 1);
    else S.newSources = [{ name: "", url: "" }];
  },

  openChapterModal: function () { S.chapterModal = "new"; S.chapterName = ""; S.chapterActivities = []; S.menu = null; },
  closeChapterModal: function () { S.chapterModal = null; S.menu = null; },
  toggleActivity: function (a) {
    var i = S.chapterActivities.indexOf(a);
    if (i === -1) S.chapterActivities.push(a); else S.chapterActivities.splice(i, 1);
  },
  editChapter: function (id) {
    var c = S.chapters.filter(function (x) { return x.id === id; })[0];
    S.chapterModal = id; S.chapterName = c.name; S.chapterActivities = c.activities.slice(); S.menu = null;
  },
  removeChapter: function (id) { S.chapters = S.chapters.filter(function (x) { return x.id !== id; }); },
  addChapter: function () {
    var name = S.chapterName.trim();
    if (!name || !S.chapterActivities.length) return;
    if (S.chapterModal === "new") S.chapters.push({ id: Date.now(), name: name, activities: S.chapterActivities.slice() });
    else S.chapters = S.chapters.map(function (c) {
      return c.id === S.chapterModal ? { id: c.id, name: name, activities: S.chapterActivities.slice() } : c;
    });
    var isNew = S.chapterModal === "new";
    S.chapterModal = null; S.menu = null;
    showToast(isNew ? "Chapter added." : "Chapter updated.");
  },

  toggleScope: function (k) { S.searchScopes[k] = !S.searchScopes[k]; },
  pickLookback: function (o) { S.lookback = o; S.menu = null; },
  runArtSearch: function () { S.searched = true; },
  toggleIncludeUsed: function () { S.includeUsed = !S.includeUsed; },
  createList: function (kind) {
    showToast((kind === "dynamic" ? "Dynamic" : "Static") + " list created from \u201c" + (S.artSearch || "all articles") + "\u201d.");
  },
  toggleList: function (id) { S.expandedList = S.expandedList === id ? null : id; },
  moveList: function (a) {
    var j = a.index + a.delta;
    if (j < 0 || j >= S.listOrder.length) return;
    var t = S.listOrder[a.index]; S.listOrder[a.index] = S.listOrder[j]; S.listOrder[j] = t;
  },
  listPage: function (a) { S.listPages[a.id] = a.page; },
  listPrev: function (id) { S.listPages[id] = Math.max(1, (S.listPages[id] || 1) - 1); },
  listNext: function (id) {
    var l = FEED_LISTS.filter(function (x) { return x.id === id; })[0];
    var pageCount = Math.max(1, Math.ceil(l.count / 20));
    S.listPages[id] = Math.min(pageCount, (S.listPages[id] || 1) + 1);
  },
  convertList: function (id) {
    var l = FEED_LISTS.filter(function (x) { return x.id === id; })[0];
    showToast(l.kind === "Dynamic List" ? "List converted to a static list." : "List converted to a dynamic list.");
  },
  deleteList: function () { showToast("List removed from the feed."); },

  askActive: function () {
    var fd = feedOf(S.feedCode);
    var active = S.feedActive[fd.code] === undefined ? fd.active : S.feedActive[fd.code];
    S.activeConfirm = !active;
  },
  cancelActive: function () { S.activeConfirm = null; },
  confirmActive: function () {
    var fd = feedOf(S.feedCode);
    var next = S.activeConfirm;
    S.feedActive[fd.code] = next; S.activeConfirm = null;
    showToast(next ? "Feed set as active." : "Feed set as inactive.");
  },
  togglePublish: function (key) { S.publishChecks[key] = !S.publishChecks[key]; },
  toggleAllPublish: function () {
    var all = S.publishChecks.name && S.publishChecks.tag && S.publishChecks.description;
    S.publishChecks = { name: !all, tag: !all, description: !all };
  },
  publishFeed: function () {
    var n = ["name", "tag", "description"].filter(function (k) { return S.publishChecks[k]; }).length;
    showToast("Published " + n + (n === 1 ? " field" : " fields") + " to primeinc.org.");
  }
};

var INPUTS = {
  query: function (v) { S.query = v; S.page = 1; },
  filterQuery: function (v) { S.filterQuery = v; },
  specialtyQuery: function (v) { S.specialtyQuery = v; S.menu = "specialty"; },
  topicQuery: function (v) { S.topicQuery = v; S.menu = "topic"; },
  formTitle: function (v) { S.form.title = v; },
  formUrl: function (v) { S.form.url = v; },
  formDate: function (v) { S.form.date = v; },
  feedQuery: function (v) { S.feedQuery = v; },
  feedName: function (v) { S.feedDraft.name = v; },
  feedSlug: function (v) { S.feedDraft.slug = v; },
  newSourceName: function (v, i) { S.newSources[i].name = v; },
  newSourceUrl: function (v, i) { S.newSources[i].url = v; },
  chapterName: function (v) { S.chapterName = v; },
  artSearch: function (v) { S.artSearch = v; }
};

/* -------------------------------------------------------------- events */

document.addEventListener("click", function (e) {
  var stop = e.target.closest("[data-stop]");
  var node = e.target.closest("[data-act]");
  if (!node) return;
  if (stop && !stop.contains(node)) return;
  if (node.tagName === "A") e.preventDefault();
  if (node.disabled) return;
  var fn = ACTIONS[node.dataset.act];
  if (!fn) return;
  e.stopPropagation();
  var arg = node.dataset.arg === undefined ? undefined : JSON.parse(node.dataset.arg);
  fn(arg, e);
  render();
});

document.addEventListener("input", function (e) {
  var node = e.target.closest("[data-inp]");
  if (!node) return;
  var fn = INPUTS[node.dataset.inp];
  if (!fn) return;
  fn(node.value, node.dataset.arg === undefined ? undefined : JSON.parse(node.dataset.arg));
  render();
});

document.addEventListener("change", function (e) {
  if (e.target.dataset && e.target.dataset.sel === "perPage") {
    S.perPage = Number(e.target.value); S.page = 1; render();
  }
});

render();
})();
