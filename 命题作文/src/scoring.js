export const bands = ['极差劣 / 空白','下下','下中','下上','中下','中中（下）','中中（上）','中上','上下','上中','上上']
export const dse = { id:'dse-2025', name:'DSE 2025 · 卷二乙部', version:'v1.0', type:'official', dimensions:[{key:'content',name:'内容',max:40},{key:'expression',name:'表达',max:30},{key:'structure',name:'结构',max:20},{key:'writing',name:'标点字体',max:10}], wordLimit:650, typoMax:3, caps:true }
export function calculate(input, rule=dse) {
  const words=Number(input.words), typos=Number(input.typos)
  const pending=[]; const adjustments=[]
  if(input.words===null||input.words===''||!Number.isInteger(words)||words<0) pending.push('字数必须为非负整数')
  if(input.typos===null||input.typos===''||!Number.isInteger(typos)||typos<0) pending.push('确认错字数必须为非负整数')
  if(rule.caps && words===300) pending.push('恰好300字：原文件边界措辞重叠，需教学负责人确认')
  let contentCap=10
  if(rule.caps && words!==300) contentCap=words<300?3:words<450?5:words<550?7:10
  const dimensions=rule.dimensions.map(d=>{
    const raw=Number(input[d.key] ?? 7)
    if(!Number.isInteger(raw)||raw<0||raw>10) pending.push(`${d.name}等级值应为0—10整数`)
    let cap=10;const reasons=[]
    if(rule.caps && d.key==='content' && contentCap<10){ cap=contentCap; reasons.push(`字数${words}，内容最高${bands[contentCap]}`) }
    if(rule.caps && input.offTopic && ['content','expression','structure'].includes(d.key)) { const off=d.key==='content'?3:7; cap=Math.min(cap,off);reasons.push(`确认离题，${d.name}最高${bands[off]}`) }
    const final=Math.min(raw,cap), score=Math.round(final/10*d.max*10)/10
    if(reasons.length) adjustments.push(...reasons)
    return {...d,raw,final,cap,score,reasons}
  })
  const typoScore=rule.typoMax ? (typos<=1?3:typos<=4?2:typos<=7?1:0) : 0
  const total=Math.round((dimensions.reduce((n,d)=>n+d.score,0)+typoScore)*10)/10
  return {dimensions,typoScore,total,max:rule.dimensions.reduce((n,d)=>n+d.max,0)+(rule.typoMax||0),pending,adjustments}
}
