import React, {useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {nodes} from './curriculum';
import './dashboard.css';

const lessons = [
  ['first_task.html','الكمبيوتر والبرنامج','Computers & Programs','مستكشفة الكمبيوتر'],
  ['second_task.html','الصناديق والأنماط','Boxes & Patterns','مكتشفة الأنماط'],
  ['third_task.html','أساسيات بايثون','Variables, print & input','مبرمجة بايثون'],
  ['fourth_task.html','قوى العمليات','Operator Powers','خبيرة العمليات']
];
function read(key) {
  try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
}
function progress() {
  const levels = value => Array.isArray(value) ? value.slice(0,5).filter(x => Number(x)>0).length : 0;
  return [
    Number(Boolean(read('cql_m1_finished') || read('cql_best_score')>0)),
    Number(Boolean(read('cql_m2_finished') || read('cql_m2plus_best')>0)),
    levels(read('cql_m3')), levels(read('cql_m5')?.s)
  ];
}
const targets=[1,1,5,5];
const resources=[
  {id:'zoom',name:'لقاء Zoom',initial:'https://us05web.zoom.us/j/88526203616?pwd=hR2vArpnVCn3HrM8zPJLdKWVYa5Q9R.1',host:/^(?:[\w-]+\.)*zoom\.(us|com)$/},
  {id:'drive',name:'مواد الدورة على SharePoint',initial:'https://fcihelwanedu-my.sharepoint.com/my?id=%2Fpersonal%2Fabdullah%5F20220276%5Ffci%5Fcapu%5Fedu%5Feg%2FDocuments%2FBatool%20Course%20Material&viewid=6784a886%2Df3ab%2D4243%2D827f%2D5c2ac621b8fb',host:/^([\w-]+\.sharepoint\.com|(drive|docs)\.google\.com)$/}
];
function valid(value,host) {
  try {const u=new URL(value); return u.protocol==='https:' && !u.username && !u.password && host.test(u.hostname);} catch {return false;}
}
function Resource({id,name,host,initial}) {
  const key='batool_resource_'+id;
  const [url,setUrl]=useState(()=>{const saved=read(key);return valid(saved,host)?saved:initial;});
  const [editing,edit]=useState(false);
  const [error,setError]=useState('');
  function save(event) {
    event.preventDefault();
    const value=new FormData(event.currentTarget).get('link').trim();
    if(!valid(value,host)){setError('أدخلي رابطًا آمنًا من '+name);return;}
    try{localStorage.setItem(key,JSON.stringify(value));}catch{setError('تعذّر حفظ الرابط في هذا المتصفح.');return;}
    setUrl(value);edit(false);
  }
  return <div className="resource"><div><strong>{url?<a href={url} target="_blank" rel="noreferrer">{name}</a>:name}</strong>
    <button onClick={()=>{edit(!editing);setError('');}} aria-expanded={editing}>{editing?'إلغاء':url?'تعديل':'إضافة رابط'}</button></div>
    {editing&&<form onSubmit={save}><label>رابط {name}<input autoFocus required type="url" name="link" defaultValue={url} dir="ltr"/></label><small>يُحفظ على هذا المتصفح.</small><button>حفظ</button><span role="alert">{error}</span></form>}</div>;
}
function Roadmap(){
  return <section className="panel"><h2>خطة التعلّم</h2>{nodes.map(n=>n.locked?
    <p className="future" key={n.en}>{n.title} · قريبًا</p>:
    <details key={n.en}><summary>{n.title}</summary><p>{n.desc}</p><strong>{n.milestone}</strong></details>)}</section>;
}
function Dashboard(){
  const [counts,update]=useState(progress);
  useEffect(()=>{
    const refresh=()=>update(progress());
    window.addEventListener('pageshow',refresh);window.addEventListener('storage',refresh);
    const dialog=document.getElementById('hello'),enter=document.getElementById('enterSite');
    function dismiss(){dialog.classList.add('gone');dialog.inert=true;document.getElementById('root').inert=false;document.getElementById('continue').focus({preventScroll:true});}
    function key(e){if(e.key==='Escape')dismiss();if(e.key==='Tab'){e.preventDefault();enter.focus();}}
    enter.onclick=dismiss;dialog.onkeydown=key;enter.focus();
    return ()=>{window.removeEventListener('storage',refresh);window.removeEventListener('pageshow',refresh);enter.onclick=null;dialog.onkeydown=null;};
  },[]);
  const done=counts.map((v,i)=>v===targets[i]);
  const total=done.filter(Boolean).length;
  const next=Math.max(0,done.indexOf(false));
  return <><a className="skip" href="#main">انتقلي للمحتوى</a>
    <header className="mast"><b dir="ltr">Batool<span> / Coding Notebook</span></b><nav><a href="#lessons">دروسي</a><a href="#awards">إنجازاتي</a></nav></header>
    <main id="main"><section className="cover"><div><p className="overline" dir="ltr">BATOOL’S CODING NOTEBOOK</p><h1>دفتر باتول للبرمجة</h1><p>{total===4?'أكملتِ كل المهام يا باتول! اختاري درسًا تحبّين تجربته من جديد.':'أهلًا يا باتول! افتحي دفترك وخلّينا نكتشف فكرة جديدة مع بعض.'}</p>
    <a id="continue" className="action" href={lessons[next][0]}>{total===4?'راجعي': 'افتحي درس'} {lessons[next][1]}</a></div>
    <figure dir="ltr"><figcaption>hello.py</figcaption><pre><i># My first greeting</i>{'\n'}name = <em>"Batool"</em>{'\n'}print(<em>"Hello,"</em>, name)</pre><samp>Hello, Batool</samp></figure></section>
    <section className="meter"><div><h2>تقدّمي في الدروس</h2><b>{total} من 4 مهام مكتملة</b></div><progress value={total} max="4" aria-label="المهام المكتملة"/></section>
    <div className="columns"><div><section className="panel" id="lessons"><h2>دروسي</h2>{lessons.map(([url,title,en],i)=><a className={'lesson tint'+i} key={url} href={url}><span className="number">{['01','03','04','05'][i]}</span><span><strong>{title}</strong><small dir="ltr" lang="en">{en}</small></span><span className="state">{done[i]?'مكتملة':counts[i]?counts[i]+' / 5':'ابدئي'}</span></a>)}<p className="note">المهمة 02 · ورقة الأنشطة المرسلة منفصلة عن الدروس التفاعلية.</p></section><Roadmap/></div>
    <aside><section className="panel"><h2>روابط الحصة</h2>{resources.map(r=><Resource key={r.id} {...r}/>)}</section>
    <section className="panel awards" id="awards"><h2>إنجازاتي</h2>{lessons.map((l,i)=><div className="award" key={l[0]}><strong>{l[3]}</strong><small>{done[i]?'حصلتِ عليها':'بعد إكمال '+l[1]}</small></div>)}
    <div className="certificate"><h3>شهادة إتمام المسار</h3>{total===4?<><p>تُمنح لباتول تقديرًا لإتمام الدروس التفاعلية الأربعة في البرمجة.</p><button onClick={()=>window.print()}>اطبعي شهادتك</button></>:<p>أكملي المهام الأربع لتحصلي على شهادتك.</p>}</div></section></aside></div></main>
    <footer className="footer" dir="ltr">All rights reserved.<a href="https://abdullahsherdy.tech">@eng.abdullahsherdy</a></footer></>;
}
createRoot(document.getElementById('root')).render(<Dashboard/>);

