const el = id => document.getElementById(id);
const params = new URLSearchParams(location.search);
const view = params.get('view');
const read = key => {
  try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
};
const save = (key,value) => {
  try { localStorage.setItem(key,JSON.stringify(value)); } catch {}
};
const lessons = [
  ['Computers & Programs','Follow a set of instructions and discover how a computer turns input into output.','Instruction Tracer','?view=lesson'],
  ['Boxes & Patterns','Look at the sequence and predict what comes next.','Pattern Finder','../second_task.html'],
  ['Variables, print & input','Store a value, ask a question, and print the answer.','Variable Builder','../third_task.html'],
  ['Operator Powers','Choose operators to calculate and compare values.','Operator Explorer','../fourth_task.html']
];
const levels = data => Array.isArray(data) ? data.slice(0,5).filter(x => Number(x)>0).length : 0;
const completed = [
  Boolean(read('cql_m1_finished') || read('cql_best_score')>0 || read('studio_mockup_finished')),
  Boolean(read('cql_m2_finished') || read('cql_m2plus_best')>0),
  levels(read('cql_m3'))===5,levels(read('cql_m5')?.s)===5
];
if(view==='first' || view==='return') completed.fill(false);
if(view==='return') completed[0]=true;
const checkpointKey='studio_mockup_checkpoint';
let checkpoint=read(checkpointKey) || {index:0,points:0,tried:false,solved:false};
const count=completed.filter(Boolean).length;
const current=Math.max(0,completed.indexOf(false));
const [title,description,,url]=lessons[current];
const resuming = !['first','return'].includes(view) && (
  current===0 && (checkpoint.index>0 || checkpoint.tried || checkpoint.solved) ||
  current===2 && levels(read('cql_m3'))>0 || current===3 && levels(read('cql_m5')?.s)>0
);
el('headline').textContent=count || resuming ? 'Welcome back, Batool.' : 'Welcome, Batool.';
el('title').textContent=title;
el('description').textContent=description;
el('missionNumber').textContent='Mission 0'+(current+1)+' / 04';
el('diagramTitle').textContent=['Program notes','Pattern notes','Variable notes','Operator notes'][current];
el('diagram').textContent=['Input\nProcess\nOutput','2, 4, 6, 8, …','name = "Batool"','4 + 2 = 6'][current];
el('start').href=url;
el('start').textContent=count===4?'Review lesson':resuming?'Continue lesson':'Start lesson';
el('progress').textContent=count+' of 4 missions complete';
lessons.forEach(([name,,badge,href],i)=>{
  const row=document.createElement('li');
  const number=document.createElement('span');
  number.className='num';
  number.textContent='0'+(i+1);
  const link=document.createElement('a');
  link.href=href;
  link.textContent=name;
  if(completed[i]){
    const award=document.createElement('span');
    award.className='earned';
    award.textContent='Badge earned · '+badge;
    link.append(award);
  }
  const state=document.createElement('small');
  state.textContent=completed[i]?'Complete':i===current && resuming?'In progress':'Ready';
  row.append(number,link,state);
  el('list').append(row);
});
['zoom','drive'].forEach((key,i)=>{
  const saved=read('batool_resource_'+key);
  const valid=i===0?/^https:\/\/([\w-]+\.)*zoom\.(us|com)\//i:/^https:\/\/(([\w-]+\.)+sharepoint\.com|(drive|docs)\.google\.com)\//i;
  el(key).href=valid.test(saved)?saved:resourceUrls[i];
});
el('runner').onsubmit=event=>{
  event.preventDefault();
  el('result').textContent='Hello, '+el('person').value+'!';
};
el('enter').onclick=()=>{el('welcome').close();el('headline').focus();};
el('welcome').oncancel=event=>event.preventDefault();
if(!view) el('welcome').showModal();
function challenge(){
  const item=QUESTIONS[checkpoint.index];
  el('counter').textContent='Challenge '+(checkpoint.index+1)+' of '+QUESTIONS.length;
  el('score').textContent='Score · '+checkpoint.points;
  el('question').textContent=item.q;
  el('next').hidden=!checkpoint.solved;
  el('next').textContent=checkpoint.index===QUESTIONS.length-1?'Finish mission':'Next challenge';
  el('feedback').textContent=checkpoint.solved?item.ex:'';
  el('answers').replaceChildren();
  item.opts.forEach((option,i)=>{
    const button=document.createElement('button');
    button.textContent=option;
    button.disabled=checkpoint.solved;
    button.onclick=()=>{
      if(i===item.correct){
        if(!checkpoint.tried) checkpoint.points++;
        checkpoint.solved=true;
        challenge();
        el('next').focus();
      }else{
        checkpoint.tried=true;
        el('feedback').textContent=(checkpoint.index===0?'Imagine writing the wrong step in a recipe. Would a computer know which step you meant?':item.ex)+' Try again.';
      }
      save(checkpointKey,checkpoint);
    };
    el('answers').append(button);
  });
}
el('next').onclick=()=>{
  if(checkpoint.index===QUESTIONS.length-1){
    save('studio_mockup_finished',true);
    save(checkpointKey,null);
    location.href='?view=home';
    return;
  }
  checkpoint={index:checkpoint.index+1,points:checkpoint.points,tried:false,solved:false};
  save(checkpointKey,checkpoint);
  challenge();
  el('question').focus();
};
if(view==='lesson'){
  el('home').hidden=true;
  el('lesson').hidden=false;
  document.querySelector('nav a').href='?view=home#missions';
  challenge();
}
