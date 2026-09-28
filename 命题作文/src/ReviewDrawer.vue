<script setup>
import {computed,reactive,ref} from 'vue'
import {message} from 'ant-design-vue'
import {db,original,essay,log} from './store'
import {calculate,bands} from './scoring'
import Icon from './Icon.vue'
const props=defineProps({id:String});const emit=defineEmits(['close'])
const record=original(props.id), student=db.students.find(s=>s.id===record.studentId), assignment=db.tasks.find(t=>t.id===record.taskId)
const input=reactive({...record.input});const feedback=ref(record.feedback),reason=ref(''),confirmed=ref(false),activePara=ref(2),sourceTab=ref('原稿')
const result=computed(()=>calculate(input,assignment.rule))
const dirty=computed(()=>JSON.stringify(input)!==JSON.stringify(record.input)||feedback.value!==record.feedback)
function save(){if(result.value.pending.length)return message.warning('请先处理规则边界或无效输入');if(!confirmed.value)return message.warning('请确认已经核对原稿和评分依据');if(dirty.value&&!reason.value.trim())return message.warning('修改评分或评语时，请记录调整原因');Object.assign(record,{input:{...input},feedback:feedback.value,review:JSON.parse(JSON.stringify(result.value)),status:'已复核'});log(`${student.name}完成教师复核${reason.value?'：'+reason.value:''}`);message.success(record.published?'修订已保存，重新发布后学生端才会更新':'复核已保存，可前往成绩页发布');emit('close')}
</script>
<template><a-drawer :open="true" width="min(1320px, 96vw)" :title="`${student.name} · 作文复核`" @close="emit('close')" class="review-drawer"><template #extra><a-tag color="blue">{{assignment.rule.name}}</a-tag></template>
 <div class="review-title"><div><h2>{{assignment.title}}</h2><p>{{student.className}} · {{student.number}}号 · {{record.source}} · {{record.pages}}页</p></div><div class="score-summary"><b>{{result.pending.length?'待确认':result.total}}</b><span>/ {{result.max}}</span></div></div>
 <a-alert v-if="record.published" message="当前为已发布稿件的复核。保存修订不会立即覆盖学生成绩，需要重新发布。" type="info" show-icon style="margin-bottom:16px"/>
 <div class="review-grid">
  <div class="manuscript-pane"><div class="subhead"><strong>原稿与定位</strong><a-tag>原稿文字</a-tag></div><div class="paper"><div class="paper-meta">中四 A 班　{{student.number}}号　{{student.name}}</div><h3>{{assignment.title}}</h3><p v-for="(p,i) in essay" :key="i" :class="{highlight:activePara===i}" @click="activePara=i">{{p}}</p><div class="paper-foot">点击段落查看关联批注</div></div><div class="source-caption">字数包含标点。疑难字请对照原稿核实。</div></div>
  <div class="review-controls"><div class="subhead"><strong>教师复核</strong><span class="muted">原评 → 规则后</span></div><div v-for="d in result.dimensions" class="dimension-control"><div class="dimension-label"><strong>{{d.name}}</strong><span>{{d.score}} / {{d.max}}</span></div><div class="grade-row"><a-select v-model:value="input[d.key]" :options="bands.map((b,i)=>({value:i,label:`${b} · ${i}`}))" style="flex:1"/><span class="muted">→</span><a-tag :color="d.raw!==d.final?'orange':'blue'">{{bands[d.final]}}</a-tag></div></div><div class="form-grid"><a-form-item label="确认字数"><a-input-number v-model:value="input.words" :min="0" :precision="0" style="width:100%"/></a-form-item><a-form-item label="确认错字"><a-input-number v-model:value="input.typos" :min="0" :precision="0" style="width:100%"/></a-form-item></div><a-checkbox v-model:checked="input.offTopic">教师确认离题</a-checkbox><div class="rule-log"><strong>规则执行记录</strong><p v-for="r in result.adjustments">{{r}}</p><p>错别字独立得分：{{result.typoScore}} / {{assignment.rule.typoMax}}</p><p v-if="!result.adjustments.length">未触发维度封顶规则。</p></div><a-alert v-for="p in result.pending" :message="p" type="warning" show-icon style="margin-bottom:8px"/></div>
 </div>
 <div class="feedback-grid"><div class="panel evidence-card"><h3><Icon name="PushpinOutlined"/> 评价依据</h3><button @click="activePara=2">第三段 · “只用指尖轻轻摸着信纸的边缘”</button><p>动作细节与情感相连，取材能够体现物件的珍贵。建议进一步展开“我”的理解变化。</p></div><div><a-form layout="vertical"><a-form-item label="给学生的反馈"><a-textarea v-model:value="feedback" :rows="3"/></a-form-item><a-form-item label="调整原因（修改后必填）"><a-input v-model:value="reason" placeholder="例如：原文情感变化有依据，调整内容品第"/></a-form-item></a-form></div></div>
 <template #footer><div class="review-footer"><a-checkbox v-model:checked="confirmed">已核对原稿、评分依据与待确认项</a-checkbox><a-space><a-button @click="emit('close')">取消</a-button><a-button type="primary" :disabled="result.pending.length>0" @click="save">保存复核</a-button></a-space></div></template>
</a-drawer></template>
