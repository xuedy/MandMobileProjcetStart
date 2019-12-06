// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import 'lib-flexible/flexible'
import mandMobile from 'mand-mobile'
import 'mand-mobile/lib/mand-mobile.css'
import App from './App'
import router from './router'
import HttpRequest from '@/utils/http'

let  queryAndSignUrl="/queryAndSign"
let  signConfirmUrl="/signConfirm"

const bankLists=
[[
  { value: "103", label: "中国农业银行股份有限公司" },
  { value: "306", label: "广发银行股份有限公司" },
  { value: "301", label: "交通银行" },
]]
const idTypeLists=
[
  [
    {value:'0',label:'身份证'},
    {value:'1',label:'户口簿'},
    {value:'2',label:'护照'},
    {value:'3',label:'军官证'},
    {value:'4',label:'士兵证'},
    {value:'9',label:'警官证'},
    {value:'7',label:'临时身份证'},
    {value:'8',label:'外国人居留证'},
    {value:'10',label:'港澳台居民居住证'},
    {value:'5',label:'港澳居民来往内地通行证'},
    {value:'6',label:'台湾同胞来往内地通行证'},
    {value:'99',label:'其他证件'},
  ] 
]  
const cardTypeLists=[[
  {
    value: '1',
    label: '存折'
  },
  {
    value: '2',
    label: '借记卡'
  },
  {
    value: '3',
    label: '信用卡'
  }
]]
Vue.prototype.$signConfirmUrl=signConfirmUrl
Vue.prototype.$queryAndSignUrl=queryAndSignUrl
Vue.prototype.$axios = HttpRequest
Vue.prototype.$bankLists=bankLists
Vue.prototype.$idTypeLists=idTypeLists
Vue.prototype.$cardTypeLists=cardTypeLists
Vue.config.productionTip = false
Vue.use(mandMobile)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

