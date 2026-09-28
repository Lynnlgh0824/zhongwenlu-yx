<script setup>
import { computed } from 'vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import Icon from './Icon.vue'
import {ui} from './store'
import AdminView from './AdminView.vue'
import StudentView from './StudentView.vue'
import FlowView from './FlowView.vue'
import RulesView from './RulesView.vue'
const tabs=[{key:'admin',name:'后台',icon:'DesktopOutlined'},{key:'app',name:'App',icon:'MobileOutlined'},{key:'flow',name:'业务流程图',icon:'ApartmentOutlined'},{key:'rules',name:'评分规则',icon:'SlidersOutlined'}]
const menus=computed(()=>ui.role==='学校管理员'?[['工作台','AppstoreOutlined'],['教学组织','TeamOutlined'],['学校设置','SettingOutlined']]:ui.role==='教学负责人'?[['工作台','AppstoreOutlined'],['作文任务','FileTextOutlined'],['评分标准','SlidersOutlined'],['学情分析','BarChartOutlined']]:[['工作台','AppstoreOutlined'],['作文任务','FileTextOutlined'],['收稿管理','InboxOutlined'],['批改中心','FormOutlined'],['成绩与反馈','SolutionOutlined'],['评分标准','SlidersOutlined']])
function changeRole(){ui.menu='工作台'}
</script>
<template>
<a-config-provider :locale="zhCN" :theme="{token:{colorPrimary:'#3557cf',borderRadius:7,fontFamily:'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC, Microsoft YaHei, sans-serif',fontSize:14,colorText:'#202c46'}}">
<div class="prototype">
 <header class="topbar">
  <a class="brand" href="#admin" @click="ui.tab='admin'"><span class="brandmark">中</span><strong>中文路</strong><span class="brand-divider"></span><span class="product-name">命题作文</span></a>
  <nav class="top-tabs" aria-label="产品主导航"><button v-for="tab in tabs" :key="tab.key" :class="{active:ui.tab===tab.key}" @click="ui.tab=tab.key"><Icon :name="tab.icon"/>{{tab.name}}</button></nav>
  <div class="prototype-tools"><span class="prototype-badge">2026 — 2027 学年</span><a-avatar size="small" style="background:#edf1ff;color:#3557cf">王</a-avatar></div>
 </header>
 <div v-if="ui.tab==='admin'" class="admin-shell">
  <aside class="sidebar">
   <div class="school"><span class="school-icon"><Icon name="BankOutlined"/></span><div><strong>明德书院</strong><small>2026 — 2027 学年</small></div></div>
   <div class="nav-label">教学工作空间</div>
   <button v-for="[label,icon] in menus" :key="label" class="side-item" :class="{selected:ui.menu===label}" @click="ui.menu=label"><Icon :name="icon"/><span>{{label}}</span><span v-if="label==='批改中心'" class="tiny-dot"></span></button>
   <div class="sidebar-bottom"><div class="info-note"><Icon name="SafetyCertificateOutlined"/><span>AI 辅助评阅<br><small>教师复核后发布</small></span></div><a-select v-model:value="ui.role" @change="changeRole" :options="['任课教师','教学负责人','学校管理员'].map(x=>({value:x,label:x}))" style="width:100%"/><div class="user"><a-avatar style="background:#e9edfd;color:#3557cf">王</a-avatar><div><strong>王老师</strong><small>{{ui.role}}</small></div></div></div>
  </aside>
  <main class="admin-main"><AdminView/></main>
 </div>
 <StudentView v-else-if="ui.tab==='app'"/>
 <FlowView v-else-if="ui.tab==='flow'"/>
 <RulesView v-else-if="ui.tab==='rules'"/>
 <footer class="global-foot">中文路 · 命题作文 <span>明德书院 · 2026 — 2027 学年</span></footer>
</div>
</a-config-provider>
</template>
