const defaults = [
    "https://us05web.zoom.us/j/88526203616?pwd=hR2vArpnVCn3HrM8zPJLdKWVYa5Q9R.1",
    "https://fcihelwanedu-my.sharepoint.com/my?id=%2Fpersonal%2Fabdullah%5F20220276%5Ffci%5Fcapu%5Fedu%5Feg%2FDocuments%2FBatool%20Course%20Material\u0026viewid=6784a886%2Df3ab%2D4243%2D827f%2D5c2ac621b8fb"
];
const resources = document.getElementById('resources');
resources.innerHTML = `<h2>Class links</h2><div class="class-grid">
<article><p class="label">Zoom</p><h3>Your Zoom classroom</h3><p>Meet your instructor in the same room each session.</p><a id="zoom" class="action" target="_blank" rel="noreferrer">Join Zoom class</a><p id="meeting"></p><button id="copy" type="button">Copy meeting details</button><span id="copy-status" role="status"></span></article>
<article><p class="label" id="provider"></p><h3>Course materials</h3><a id="drive" class="folder" target="_blank" rel="noreferrer"><strong>Batool’s course folder</strong><span>Open course materials</span></a></article></div>`;
const [meetingUrl, materialsUrl] = defaults;
document.getElementById('zoom').href = meetingUrl;
document.getElementById('drive').href = materialsUrl;
document.getElementById('provider').textContent = 'SharePoint';
const meetingId = new URL(meetingUrl).pathname.split('/').pop();
document.getElementById('meeting').textContent = 'Meeting ID ? ' + meetingId;
document.getElementById('copy').onclick=async()=>{
  const text=['Join Zoom class',document.getElementById('zoom').href,document.getElementById('meeting').textContent].filter(Boolean).join('\n');
  const status=document.getElementById('copy-status');
  try{await navigator.clipboard.writeText(text);status.textContent='Meeting details copied.';}catch{status.textContent=text;}
};
const stages=[
  ['Thinking Like a Programmer','Connect your Scratch experience to programming by planning the steps for a cat to find its way home.'],
  ['Python Fundamentals','Use variables, conditions, loops, and functions to build a small guessing game.'],
  ['Intro to OOP','Design a cat character with its own name, energy, and moves.'],
  ['Data & Mini Projects','Build a quest journal that remembers your entries.'],
  ['Web Sprint','Give your favorite animated series a fan page using HTML and CSS.'],
  ['Capstone Project','Plan, build, and present your own project to your family.']
];
const stageList=document.getElementById('stages');
for(const [index,[name,description]] of stages.entries()){
  const detail=document.createElement('details');
  const summary=document.createElement('summary');
  const chapter=document.createElement('small');
  chapter.textContent='Chapter 0'+(index+1);
  summary.append(chapter,name);
  const paragraph=document.createElement('p');
  paragraph.textContent=description;
  detail.append(summary,paragraph);
  stageList.append(detail);
}
stageList.append('Coming later · Advanced Web Development and Real-World Projects');
