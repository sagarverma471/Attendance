const students=[
  ["Rahul Kumar","23","B.Tech Computer Science","3rd Year","5th Semester","87",11],
  ["Aman Kumar","24","B.Tech Computer Science","3rd Year","5th Semester","92",12],
  ["Rohit Singh","25","B.Tech Computer Science","3rd Year","5th Semester","68",13],
  ["Priya Sharma","26","B.Tech Computer Science","3rd Year","5th Semester","95",14],
  ["Ankit Kumar","27","B.Tech Computer Science","3rd Year","5th Semester","81",15],
  ["Neha Kumari","28","B.Tech Computer Science","3rd Year","5th Semester","73",16],
  ["Vikash Kumar","29","B.Tech Computer Science","3rd Year","5th Semester","89",17],
  ["Sneha Gupta","30","B.Tech Computer Science","3rd Year","5th Semester","91",18],
  ["Aditya Raj","31","B.Tech Computer Science","3rd Year","5th Semester","76",19],
  ["Pooja Kumari","32","B.Tech Computer Science","3rd Year","5th Semester","84",20]
].map((x,i)=>({id:i,name:x[0],roll:x[1],branch:x[2],year:x[3],sem:x[4],att:+x[5],img:`https://i.pravatar.cc/700?img=${x[6]}`}));

const classes=[
  {subject:"Database Management System",code:"CS301",class:"B.Tech CSE",year:"3rd Year",section:"A",count:58,icon:"▣"},
  {subject:"Operating Systems",code:"CS302",class:"B.Tech CSE",year:"3rd Year",section:"B",count:54,icon:"◈"},
  {subject:"Computer Networks",code:"CS303",class:"B.Tech CSE",year:"3rd Year",section:"A",count:56,icon:"⌁"}
];

const state={index:0,decisions:[],activeClass:classes[0],drag:false,startX:0,startY:0,dx:0,dy:0,card:null};

const $=id=>document.getElementById(id);
const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));

function toast(message){
  const t=$("toast");t.textContent=message;t.classList.add("show");
  clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove("show"),1400);
}

function showPage(name){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  $(name).classList.add("active");
  document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.page===name));
  if(window.innerWidth<701)$("sidebar").classList.remove("open");
}

document.querySelectorAll(".nav-item").forEach(b=>b.addEventListener("click",()=>showPage(b.dataset.page)));

function classCard(c){
 return `<article class="class-card">
   <div class="class-icon">${c.icon}</div>
   <h3>${escapeHTML(c.subject)}</h3>
   <p>${c.class} · ${c.year} · Section ${c.section}</p>
   <div class="class-tags"><span class="tag">${c.code}</span><span class="tag">${c.count} Students</span><span class="tag">10:00 AM</span></div>
   <button class="purple-btn start-class" data-code="${c.code}">Start Attendance</button>
 </article>`;
}

function renderClasses(){
 $("classGrid").innerHTML=classes.map(classCard).join("");
 $("classesPageGrid").innerHTML=classes.map(classCard).join("");
 document.querySelectorAll(".start-class").forEach(btn=>btn.addEventListener("click",()=>{
   state.activeClass=classes.find(c=>c.code===btn.dataset.code)||classes[0];
   startAttendance();
 }));
}
renderClasses();

function startAttendance(){
 state.index=0;state.decisions=[];
 $("subjectTitle").textContent=state.activeClass.subject.toUpperCase();
 $("classTitle").textContent=`${state.activeClass.class} · ${state.activeClass.year} · Section ${state.activeClass.section}`;
 showPage("attendance");renderDeck();updateProgress();
}

$("quickStart").onclick=startAttendance;
$("backDashboard").onclick=()=>showPage("dashboard");
$("endSession").onclick=()=>{
 if(confirm("End this attendance session?"))finishAttendance();
};
$("summaryBack").onclick=()=>showPage("dashboard");
$("saveFinish").onclick=()=>{toast("Attendance saved successfully");setTimeout(()=>showPage("dashboard"),450)};

function createCard(s,active,depth){
 const el=document.createElement("div");el.className="student-card"+(active?" active":"");
 el.style.zIndex=active?10:9-depth;
 el.style.transform=`translateY(${-depth*8}px) scale(${1-depth*.025})`;
 el.innerHTML=`<img src="${s.img}" alt="${escapeHTML(s[0]||s.name)}">
   <div class="swipe-label swipe-present">✓ PRESENT</div>
   <div class="swipe-label swipe-absent">× ABSENT</div>
   <div class="card-content">
     <h3>${escapeHTML(s.name)}</h3>
     <p>Roll No. ${escapeHTML(s.roll)}</p>
     <p>▣ ${escapeHTML(s.branch)}</p>
     <p>⌂ ${escapeHTML(s.year)} · ${escapeHTML(s.sem)} · Section ${state.activeClass.section}</p>
     <span class="attendance-pill">Attendance ${s.att}%${s.att<75?" · ⚠ Low":""}</span>
   </div>`;
 return el;
}

function renderDeck(){
 const deck=$("deck");deck.innerHTML="";
 students.slice(state.index,state.index+3).reverse().forEach((s,i)=>{
   const depth=(2-i);deck.appendChild(createCard(s,i===2,depth));
 });
 state.card=deck.querySelector(".active");
 if(state.card)state.card.addEventListener("pointerdown",pointerDown);
}

function pointerDown(e){
 state.drag=true;state.startX=e.clientX;state.startY=e.clientY;state.dx=0;state.dy=0;
 state.card.setPointerCapture(e.pointerId);state.card.style.transition="none";
}

document.addEventListener("pointermove",e=>{
 if(!state.drag||!state.card)return;
 state.dx=e.clientX-state.startX;state.dy=e.clientY-state.startY;
 state.card.style.transform=`translate(${state.dx}px,${state.dy}px) rotate(${state.dx*.055}deg)`;
 const power=Math.min(Math.abs(state.dx)/130,1);
 state.card.querySelector(".swipe-present").style.opacity=state.dx>0?power:0;
 state.card.querySelector(".swipe-absent").style.opacity=state.dx<0?power:0;
});

document.addEventListener("pointerup",()=>{
 if(!state.drag)return;state.drag=false;
 if(Math.abs(state.dx)>110)swipe(state.dx>0?"PRESENT":"ABSENT");
 else if(state.card){state.card.style.transition="transform .25s ease";state.card.style.transform="translate(0) rotate(0)";resetLabels();}
});

function resetLabels(){document.querySelectorAll(".swipe-label").forEach(x=>x.style.opacity=0)}

function swipe(status){
 if(!state.card)return;
 const card=state.card,dir=status==="PRESENT"?1:-1;
 card.style.transition="transform .24s ease,opacity .24s ease";
 card.style.transform=`translate(${dir*(innerWidth+250)}px,${state.dy}px) rotate(${dir*25}deg)`;
 card.style.opacity=0;
 setTimeout(()=>mark(status),180);
}

function mark(status){
 const s=students[state.index];
 state.decisions.push({index:state.index,id:s.id,status});
 state.index++;
 if(state.index>=students.length)finishAttendance();else{renderDeck();updateProgress();}
}

function updateProgress(){
 const done=state.decisions.length,total=students.length;
 const present=state.decisions.filter(x=>x.status==="PRESENT").length;
 const absent=state.decisions.filter(x=>x.status==="ABSENT").length;
 $("studentPosition").textContent=`${Math.min(done+1,total)} / ${total} Students`;
 $("progressBar").style.width=`${done/total*100}%`;
 $("presentCount").textContent=present;$("absentCount").textContent=absent;$("remainingCount").textContent=total-done;
}

$("presentButton").onclick=()=>swipe("PRESENT");
$("absentButton").onclick=()=>swipe("ABSENT");

$("undoButton").onclick=()=>{
 const last=state.decisions.pop();
 if(!last)return toast("Nothing to undo");
 state.index=last.index;renderDeck();updateProgress();toast("Previous student restored");
};

document.addEventListener("keydown",e=>{
 if(!$("attendance").classList.contains("active"))return;
 if(e.key==="ArrowRight")swipe("PRESENT");
 if(e.key==="ArrowLeft")swipe("ABSENT");
 if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="z"){e.preventDefault();$("undoButton").click();}
});

function finishAttendance(){
 const total=students.length,present=state.decisions.filter(x=>x.status==="PRESENT").length,absent=total-present;
 $("summaryTotal").textContent=total;$("summaryPresent").textContent=present;$("summaryAbsent").textContent=absent;
 $("summaryPercent").textContent=`${(present/total*100).toFixed(1)}%`;
 $("summaryMeta").textContent=`${state.activeClass.subject} · ${state.activeClass.class} · Section ${state.activeClass.section}`;
 $("summaryList").innerHTML=students.map((s,i)=>{
   const d=state.decisions.find(x=>x.id===s.id);
   const status=d?.status||"UNMARKED";
   return `<div class="summary-row"><span>${status==="PRESENT"?"✓":"×"} ${escapeHTML(s.name)} · Roll ${s.roll}</span><strong class="${status==="PRESENT"?"status-present":"status-absent"}">${status}</strong></div>`;
 }).join("");
 showPage("summary");
}

$("mobileMenu").onclick=()=>$("sidebar").classList.toggle("open");

$("studentSearch").addEventListener("input",e=>{
 const q=e.target.value.toLowerCase();
 const filtered=students.filter(s=>(s.name||"").toLowerCase().includes(q)||(s.roll||"").includes(q));
 renderStudentTable(filtered);
});

function renderStudentTable(list=students){
 $("studentTable").innerHTML=`<div class="student-row"><span></span><strong>Name</strong><strong>Roll</strong><strong>Branch</strong><strong>Attendance</strong></div>`+
 list.map(s=>`<div class="student-row"><img src="${s.img}"><span>${escapeHTML(s.name)}</span><span>${s.roll}</span><span class="branch">CSE</span><strong class="${s.att<75?"red":"green"}">${s.att}%</strong></div>`).join("");
}
renderStudentTable();

document.getElementById("globalSearch").addEventListener("input",e=>{
 const q=e.target.value.toLowerCase();
 if(q.includes("student")||q.includes("rahul"))showPage("students");
});