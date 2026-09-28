import { reactive, watch } from 'vue'
import { dse, calculate } from './scoring'
const KEY='zhongwenlu-essay-prototype-v2'
const names=['陈芷晴','林子轩','黄乐彤','张梓朗','李嘉怡','何俊熙','许诗涵','周柏言','郑思远','吴梓欣','刘宇辰','梁咏琳']
const statuses=['待复核','已发布','待复核','需补交','未提交','已复核','待复核','已发布','待复核','已复核','未提交','待复核']
export const essay = [
'外婆院子里的桂花树下，藏着一个铁盒。它没有宝石的光泽，只有斑驳的锈迹。小时候，我一直以为宝物应该被锁在玻璃柜里，直到那个雨后的下午。',
'搬家前，我和外婆一起整理花圃。铁锹碰到硬物，发出一声清脆的响。我蹲下身，拂去泥土，盒盖上的花纹已经模糊。外婆却忽然停下手里的动作，目光落在那个小小的铁盒上。',
'盒子里是几封发黄的信，还有一枚用红线系着的纽扣。外婆说，那是外公年轻时留下的东西。她没有多说，只用指尖轻轻摸着信纸的边缘。风吹过桂花树，叶片沙沙作响，我第一次发现，沉默也能装下很长的故事。',
'我原以为，埋在泥土里的东西只是被遗忘。可当外婆慢慢读出信上的字句，我才明白，有些记忆并未消失，只是等待着一个重新打开的时刻。泥土保护了它，也把往日的温度留到了今天。',
'后来，我把铁盒放在新家的书架上。每当看见它，我便想起外婆手上的泥土，想起那个下午的桂花香。珍贵的从来不只是盒子里的物件，而是那些终于被我听见、被我珍惜的岁月。'
]
export function defaultInput(index=0){ return {content:index%3===0?8:7,expression:8,structure:7,writing:8,typos:index%4,words:index===2?520:738+index*13,offTopic:false} }
function initial(){
 const students=names.map((name,i)=>({id:i+1,name,className:'中四 A 班',number:String(i+1).padStart(2,'0')}))
 const rule=structuredClone(dse)
 const submissions=students.map((s,i)=>{
  const input=defaultInput(i); const status=statuses[i]
  return {id:`1-${s.id}`,taskId:1,studentId:s.id,status,source:status==='未提交'?'—':i%2?'老师批量上传':'学生拍照',pages:status==='未提交'?0:status==='需补交'?1:3,input,feedback:'选材贴合题意，铁盒与外婆的回忆建立了自然联系。建议进一步展开发现铁盒时人物的动作和心理，让情感变化更具体。',review:status==='已复核'?calculate(input,rule):null,published:status==='已发布'?{...calculate(input,rule),feedback:'细节自然，情感真切。可以进一步展开人物心理变化。',at:'2026/09/28 10:30'}:null,files:[]}
 })
 return {schema:1,students,tasks:[{id:1,title:'藏在泥土中的宝物',className:'中四 A 班',genre:'记叙文',due:'2026-10-08',status:'收稿中',description:'试以「藏在泥土中的宝物」为题，写作文章一篇。交代宝物的珍贵之处及其藏在泥土中的原因，表达由此引发的感受。',requirements:'合理扣连「宝物」与「藏在泥土中」；取材具体，情感自然。不以关键词数量判定切题。',rule}],submissions,rules:[rule],logs:[{at:'今天 10:30',text:'王老师发布林子轩的作文反馈'},{at:'今天 09:45',text:'系统完成本次作文初评'}]}
}
let saved
try{saved=JSON.parse(localStorage.getItem(KEY)||'null')}catch{}
export const db=reactive(saved?.schema===1?saved:initial())
watch(db,()=>{try{localStorage.setItem(KEY,JSON.stringify(db))}catch{}},{deep:true})
export const ui=reactive({tab:location.hash.slice(1)||'admin',menu:'工作台',role:'任课教师',taskId:1,studentId:1,appPage:'任务',appDetail:false})
watch(()=>ui.tab,v=>{history.replaceState(null,'',`#${v}`);window.scrollTo({top:0,behavior:'instant'})},{flush:'post'})
window.addEventListener('hashchange',()=>{const v=location.hash.slice(1);if(['admin','app','flow','rules'].includes(v))ui.tab=v})
export function reset(){Object.assign(db,initial());ui.taskId=1;ui.studentId=1;ui.appDetail=false}
export function log(text){db.logs.unshift({at:new Date().toLocaleString('zh-CN',{hour12:false}),text})}
export function task(){return db.tasks.find(t=>t.id===ui.taskId)||db.tasks[0]}
export function rows(){return db.submissions.filter(r=>r.taskId===task().id).map(r=>({...r,...{student:db.students.find(s=>s.id===r.studentId)}}))}
export function original(id){return db.submissions.find(r=>r.id===id)}
export function publish(r){
 if(r.status!=='已复核'||!r.review)throw Error('请先完成教师复核')
 if(r.published){r.history??=[];r.history.push(JSON.parse(JSON.stringify(r.published)))}
 r.published=JSON.parse(JSON.stringify({...r.review,feedback:r.feedback,at:new Date().toLocaleString('zh-CN')}));r.status='已发布';log(`王老师发布${db.students.find(s=>s.id===r.studentId)?.name}的成绩`)
}
export function createTask(form){
 const id=Date.now();const rule=JSON.parse(JSON.stringify(db.rules.find(r=>r.id===form.ruleId)||dse))
 db.tasks.unshift({...form,id,status:'收稿中',rule});
 db.students.forEach(s=>db.submissions.push({id:`${id}-${s.id}`,taskId:id,studentId:s.id,status:'未提交',source:'—',pages:0,input:defaultInput(),feedback:'待完成 AI 初评',review:status==='已复核'?calculate(input,rule):null,published:null,files:[]}));ui.taskId=id;log(`发布作文任务「${form.title}」`)
}
