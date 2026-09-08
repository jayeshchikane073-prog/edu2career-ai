const state = {stage:"",goal:"",target:"Data Analyst",time:60,step:1,q:0,selected:null,answered:false};
const questions=[
 {topic:"Python Basics",q:"Which data type is used to store a sequence of characters in Python?",a:["list","string","tuple","dictionary"],correct:1},
 {topic:"SQL",q:"Which SQL clause is used to filter rows after aggregation?",a:["WHERE","ORDER BY","HAVING","GROUP BY"],correct:2},
 {topic:"Statistics",q:"If the mean is strongly affected by an extreme value, which measure is usually more robust?",a:["Median","Range","Variance","Sum"],correct:0},
 {topic:"SQL",q:"Which JOIN returns only rows with matching values in both tables?",a:["LEFT JOIN","FULL JOIN","INNER JOIN","CROSS JOIN"],correct:2},
 {topic:"Data Visualization",q:"Which chart is generally best for showing a trend over time?",a:["Pie chart","Line chart","Radar chart","Treemap"],correct:1},
 {topic:"Excel",q:"Which function counts cells that satisfy a condition?",a:["SUM","COUNTIF","AVERAGE","ROUND"],correct:1}
];
function $(id){return document.getElementById(id)}
function go(id){
 document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
 $(id).classList.add("active");
 window.scrollTo({top:0,behavior:"smooth"});
 if(id==="onboarding") updateWizard();
}
function scrollToFeature(){document.querySelector("#features").scrollIntoView({behavior:"smooth"})}
function showHelp(){$("helpModal").classList.add("show")}
function hideHelp(){$("helpModal").classList.remove("show")}
function showToast(msg){const t=$("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2400)}
function pick(key,el,val){state[key]=val;el.parentElement.querySelectorAll(".choice").forEach(x=>x.classList.remove("selected"));el.classList.add("selected")}
function setTime(el,val){state.time=val;document.querySelectorAll(".time-picker button").forEach(x=>x.classList.remove("selected"));el.classList.add("selected")}
function updateWizard(){
 document.querySelectorAll(".step").forEach(s=>s.classList.toggle("active",+s.dataset.step===state.step));
 $("wizardProgress").style.width=(state.step/4*100)+"%";
 $("stepLabel").textContent=String(state.step).padStart(2,"0")+" / 04";
 $("prevBtn").style.visibility=state.step===1?"hidden":"visible";
 $("nextBtn").textContent=state.step===4?"Start diagnostic →":"Continue →";
}
function nextStep(){
 if(state.step===1&&!state.stage){showToast("Choose your current stage first");return}
 if(state.step===2&&!state.goal){showToast("Choose what you're preparing for");return}
 if(state.step===2&&!state.target.trim()){showToast("Enter your target role, exam or skill");return}
 if(state.step<4){state.step++;updateWizard()}else{startAssessment()}
}
function prevStep(){if(state.step>1){state.step--;updateWizard()}}
function startAssessment(){
 state.q=0;state.selected=null;state.answered=false;
 renderQuestion();go("assessment");
}
function renderQuestion(){
 const x=questions[state.q];
 $("qNum").textContent=state.q+1;$("qTopic").textContent=x.topic;$("questionText").textContent=x.q;
 $("answers").innerHTML=x.a.map((a,i)=>`<button class="answer" onclick="selectAnswer(${i},this)">${String.fromCharCode(65+i)}. ${a}</button>`).join("");
 $("answerBtn").disabled=true;$("answerBtn").textContent="Check answer";$("attemptInfo").textContent="Question must be attempted to continue.";
}
function selectAnswer(i,el){
 if(state.answered)return;
 state.selected=i;document.querySelectorAll(".answer").forEach(x=>x.classList.remove("selected"));el.classList.add("selected");
 $("answerBtn").disabled=false;$("attemptInfo").textContent="Answer selected. Check it to record performance.";
}
function submitAnswer(){
 const x=questions[state.q];
 if(!state.answered){
   state.answered=true;
   document.querySelectorAll(".answer").forEach((el,i)=>{if(i===x.correct)el.classList.add("correct");if(i===state.selected&&i!==x.correct)el.classList.add("wrong")});
   $("answerBtn").textContent=state.q===questions.length-1?"Finish assessment":"Next question →";
   $("attemptInfo").textContent=state.selected===x.correct?"Correct — evidence recorded.":"Mistake recorded — this will influence practice priority.";
 }else{
   if(state.q<questions.length-1){state.q++;state.answered=false;state.selected=null;renderQuestion()}
   else finishAssessment();
 }
}
function finishAssessment(){
 $("profileStage").textContent=state.stage||"College";
 $("targetDisplay").textContent=state.target||"Data Analyst";
 $("heroScore").textContent="72%";
 showToast("Assessment complete — your roadmap is ready");
 setTimeout(()=>go("dashboard"),700);
}
function dashTab(name,el){
 document.querySelectorAll(".dash-tab").forEach(x=>x.classList.remove("active"));
 $("dash-"+name).classList.add("active");
 document.querySelectorAll(".nav").forEach(x=>x.classList.remove("active"));
 if(el)el.classList.add("active");
 window.scrollTo({top:0,behavior:"smooth"});
}
function startPractice(){showToast("Practice session opened — every question counts toward progress");setTimeout(()=>{state.q=1;state.answered=false;state.selected=null;renderQuestion();go("assessment")},500)}
document.addEventListener("keydown",e=>{if(e.key==="Escape")hideHelp()});
