import './studio-resources.js';
const el = id => document.getElementById(id);
const lessons = [
  ['Computers & Programs','Follow a set of instructions and discover how a computer turns input into output.','Instruction Tracer','first_task.html'],
  ['Boxes & Patterns','Look at the sequence and predict what comes next.','Pattern Finder','second_task.html'],
  ['Variables, print & input','Store a value, ask a question, and print the answer.','Variable Builder','third_task.html'],
  ['Operator Powers','Choose operators to calculate and compare values.','Operator Explorer','fourth_task.html'],
  ['Logic Powers','elif, and / or / not, and nested decisions. 5 levels, about 15 minutes.','Logic Powers','sixth_task.html']
];
// Instructor-confirmed completions belong to specific missions, independent of quiz scores.
const finishedLessons = new Set(['first_task.html','second_task.html','third_task.html','fourth_task.html']);
const count = lessons.filter(([, , , href]) => finishedLessons.has(href)).length;
const nextLesson = lessons.find(([, , , href]) => !finishedLessons.has(href));
el('headline').textContent = 'Welcome back, Batool.';
el('missionNumber').textContent = nextLesson ? 'Next mission' : 'Mission log';
el('title').textContent = nextLesson?.[0] ?? 'All missions complete.';
el('description').textContent = nextLesson?.[1] ?? 'You earned every skill badge. Pick a mission to play again while your next challenge is on its way.';
el('start').href = nextLesson?.[3] ?? '#missions';
el('start').textContent = nextLesson?.[4] ? 'Preview mission' : nextLesson ? 'Start lesson' : 'Review missions';
el('diagramTitle').textContent = 'Decision notes';
for (const value of ['Condition', 'If true', 'Else']) {
  const slip = document.createElement('span');
  slip.textContent = value;
  el('diagram').append(slip);
}
el('mission-meter').max = lessons.length;
el('mission-meter').value = count;
el('progress').textContent = count+' of '+lessons.length+' missions complete';
lessons.forEach(([name,,badge,href,status],i)=>{
  const done = finishedLessons.has(href);
  const row=document.createElement('li');
  row.className = done ? 'cleared' : 'current';
  const number=document.createElement('span');
  number.className='num';
  number.textContent=String(i+1).padStart(2,'0');
  const link=document.createElement('a');
  link.href=href;
  link.textContent=name;
  const award=document.createElement('span');
  award.className='earned';
  award.textContent=(done ? 'Badge earned ? ' : 'Skill badge ? ')+badge;
  link.append(award);
  const state=document.createElement('small');
  state.textContent=done?'Complete':status ?? 'Available';
  row.append(number,link,state);
  el('list').append(row);
});
el('runner').onsubmit=event=>{
  event.preventDefault();
  el('result').textContent='Hello, '+el('person').value+'!';
};
el('enter').onclick=()=>{el('welcome').close();el('headline').focus();};
el('welcome').oncancel=event=>event.preventDefault();
if (location.hash === '#missions') {
  el('missions').focus();
} else {
  el('welcome').showModal();
}
