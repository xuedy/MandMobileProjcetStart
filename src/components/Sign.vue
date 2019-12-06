
<template>
  <div style="text-align:left">
    <md-field>
        <md-field-item
          title="签约银行"
          v-model="sign.OppBank"
          @click="oppBankPickerShow = true"
          placeholder="请选择签约银行"
          :content="pickerValue0"
          arrow
          solid
          :disabled="isFromLink"
        ></md-field-item>
        <div v-if="showType==='default'">
          <md-input-item
            title="卡号"
            v-model="sign.OppAct"
            type="bankCard"
            placeholder="请输入交易方账号"
            clearable
            :disabled="isFromLink"
          ></md-input-item>
        </div>
        <!-- 脱敏 -->
        <div v-else-if="showType==='dataMasking'">
          <md-input-item
            title="卡号"
            v-model="displayOppAct"
            type="text"
            placeholder="请输入交易方账号"
            clearable
            :disabled="isFromLink"
          ></md-input-item>
        </div>
        <md-input-item
          type="text"
          title="账户名"
          v-model="sign.OppActName"
          placeholder="请输入交易方户名"
          clearable
          :disabled="isFromLink"
        ></md-input-item>
        <!-- 卡类型 -->
        <md-field-item
            title="卡类型"
            v-model="sign.CardType"
            :content="pickerValue1"
            placeholder="请选择卡类型"
            @click="cardTypePickerShow = true"
            arrow
            solid
            :disabled="isFromLink"
            >
        </md-field-item>
   
      <div v-if="pickerValue1==='信用卡'">
        <md-field-item
          name="ExpiredDate"
          title="卡有效期"
          arrow="arrow-right"
          align="right"
          v-model="sign.ExpiredDate"
           placeholder="请选择卡有效期"
          :content="datePickerValue"
          @click.native="isDatePickerShow = true" 
          class="idExpiryDate"
          >
        </md-field-item>
      </div>
      <!-- 证件类型 -->
      <div v-if="dataDisplay==='default'">
        <md-field-item
            title="证件类型"
            v-model="sign.CertType"
            :content="pickerValue2"
            placeholder="请选择证件类型"
            @click="idTypePickerShow = true"
            arrow
            solid
            :disabled="isFromLink"
            >
        </md-field-item>
        <md-input-item
          ref="applicat.name"
          type="text"
          title="证件号码"
          v-model="sign.CertNumber"
          placeholder="请输入证件号码"
          clearable
          :disabled="isFromLink"
        ></md-input-item>
      </div>  
      <md-input-item
          title="手机号"
          type="phone"
          v-model="sign.CellPhone"
          placeholder="请输入手机号"
          clearable
          :disabled="isFromLink"
      ></md-input-item>
      <div v-if="pickerValue0==='中国建设银行股份有限公司'">
        <md-input-item
          title="保单号"
          v-model="sign.PolicyNo"
          type="digit"
          placeholder="请输入保单号"
          disabled
        ></md-input-item>  
         <md-input-item
          title="代扣周期"
          v-model="sign.LimitPeriodUnit"
          type="digit"
          placeholder="请输入代扣周期"
          disabled
          hidden
        ></md-input-item>
        <md-input-item
          title="代扣周期"
          v-model="LimitPeriodUnit"
          type="text"
          placeholder="请输入代扣周期"
          disabled
        ></md-input-item>
         <md-input-item
          title="保费金额"
          v-model="sign.NoteMoney"
          type="money"
          placeholder="请输入总保费金额(单位)元"
          clearable
          disabled
        ></md-input-item>
      </div>
    </md-field>
     <div style="width:90%;margin:5%;">
      <md-agree
        v-model="agreeConf.checked"
        :disabled="agreeConf.disabled"
        :size="agreeConf.size"
        @change="onChange(agreeConf.name, agreeConf.checked, $event)"
      >
       <span style="color: #111a34;"> 本人已充分了解签约内容，理解并同意此次签约</span>
        <!-- <span v-for="item in doclist" :key="item.value">
            <a :href="item.value"  target="_black"  class="text-orange">{{item.label}}</a >
        </span> -->
      </md-agree>
    </div>
    <div>
          <md-button type="primary" round @click="queryAndSign">提交</md-button>
    </div>
    <div>
      <!-- 所属银行 选择器-->
      <md-picker
          ref="picker0"
          v-model="oppBankPickerShow"
          :data="oppBankPickerData"
          @confirm="onPickerConfirm(0,'sign.OppBank')"
          title="请选择签约银行"
      ></md-picker>
      <!-- 卡类型 选择器-->
      <md-picker
          ref="picker1"
          v-model="cardTypePickerShow"
          :data="cardTypePickerData"
          @confirm="onPickerConfirm(1,'sign.CardType')"
          title="请选择卡类型"
      ></md-picker>
       <!-- 证件类型选择器 -->
      <md-picker
          ref="picker2"
          v-model="idTypePickerShow"
          :data="idTypePickerData"
          @confirm="onPickerConfirm(2,'sign.CertType')"
          title="请选择证件类型"
      ></md-picker>
      <md-date-picker
        ref="datePicker0"
        v-model="isDatePickerShow"
        type="custom"
        :custom-types="['yyyy', 'MM',]"
        title="选择信用卡有效日期"
        today-text="今天"
        :min-date="minIdExpiryDate"
        @change="onDatePickerChange"
        @confirm="onDatePickerConfirm('0','datePickerValue','sign.ExpiredDate')"
    ></md-date-picker>

    </div>
  </div>
</template>

<script>
import {Toast,Dialog} from 'mand-mobile'
import {formatDate} from '../js/date.js';

export default {

  data() {
    return {

      LimitPeriodUnit:'',
      showType:'default',
      dataDisplay:'default',
      isFromLink:false,
      displayOppAct:'',
      fromLinkBankLists:
      [[
        { value: "103", label: "中国农业银行股份有限公司" },
        { value: "306", label: "广发银行股份有限公司" },
        { value: "301", label: "交通银行" },
        { value: "105", label: "中国建设银行股份有限公司" },
      ]],
      doclist:[
        {
            value:'../static/1.doc',
            label:'《签约需知》',
        },
        {
            value:'../static/1.pdf',
            label:'《签约条款》',
        }
      ],
      //页面参数验证结果
      validResult:false,
      transSourceReg:/^(G)([012345679]{2})$/,
      //非空验证
      requiredReg:/\S/,
      //手机号码验证
      mobileReg:/^1[3546789][0-9]{9}$/,
      //银行卡号验证
      renewAccountNumberReg:/^([1-9]{1})(\d{14}|\d{15}|\d{16}|\d{17}|\d{18}|\d{19}|\d{20})$/,
      //最小日期
      minIdExpiryDate: new Date(new Date().getFullYear(),new Date().getMonth(), new Date().getDate()+1),
      sign:{
        TransSource:'G10',
        OppBank:'',
        OppAct:'',
        OppActName:'',
        CardType:'',
        ExpiredDate:'',
        CertType:'',
        CertNumber:'',
        CellPhone:'',
        PolicyNo:'',
        LimitPeriodUnit:'',
        NoteMoney:'',
      },
      
      signFieldsSetOne:[
         {
              fieldName: "TransSource",
              regExp: "transSourceReg",
              fieldMsg:"参数有误，系统来源有误"
          },
          {
              fieldName: "OppBank",
              regExp: "requiredReg",
              fieldMsg:"请选择签约银行"
          },
          {
              fieldName: "OppAct",
              regExp: "renewAccountNumberReg",
              fieldMsg:"卡号输入有误"
          }, {
              fieldName: "OppActName",
              regExp: "requiredReg",
              fieldMsg:"账户名输入有误"
          },
          {
              fieldName: "CardType",
              regExp: "requiredReg",
              fieldMsg:"请选择卡类型"
          },
      ],
      signFieldsSetTow:[
          {
              fieldName: "ExpiredDate",
              regExp: "requiredReg",
              fieldMsg:"请选择卡有效期"
          },
      ],
      signFieldsSetThree:[
          {
              fieldName: "CertType",
              regExp: "requiredReg",
              fieldMsg:"请选择证件类型"
          },
          {
              fieldName: "CertNumber",
              regExp: "requiredReg",
              fieldMsg:"证件号输入有误"
          },
          {
              fieldName: "CellPhone",
              regExp: "mobileReg",
              fieldMsg:"手机号输入有误"
          },
      ],
      signFieldsSetFour:[
          {
              fieldName: "PolicyNo",
              regExp: "requiredReg",
              fieldMsg:"保单号输入有误"
          },
          {
              fieldName: "LimitPeriodUnit",
              regExp: "requiredReg",
              fieldMsg:"代扣周期输入有误"
          },
          {
              fieldName: "NoteMoney",
              regExp: "requiredReg",
              fieldMsg:"总保费金额输入有误"
          },
      ],
      oppBankPickerShow:false,
      pickerValue0:'',
      oppBankPickerData:this.$bankLists,
      cardTypePickerShow:false,
      pickerValue1:'',
      cardTypePickerData:this.$cardTypeLists,
      idTypePickerShow:false,
      pickerValue2:'',
      idTypePickerData:this.$idTypeLists,
      //信用卡有效日期
      isDatePickerShow: false,
      datePickerValue: '',
      agreeConf: {
          checked: false,
          name: 'agree0',
          size: 'md',
          disabled: false,
          introduction: '选中状态',
      },
      
     
    }
  },
   watch: {
        'pickerValue1':function (newVal,oldVal) {
            if(newVal){
              if(newVal!='信用卡'){
               this.sign.ExpiredDate=''
               this.datePickerValue=''
              }
             
            }
        }
   },
  methods: {
    onDatePickerChange(columnIndex, itemIndex, value) {
            console.log(
              `[Mand Mobile] DatePicker Change\ncolumnIndex: ${columnIndex},\nitemIndex:${itemIndex},\nvalue: ${JSON.stringify(
                value,
              )}`,
            )
          },
    beforeHandleValid(validatesObj,validatesFields){
        var  validatesFieldsArr=validatesFields;
        for (let index = 0; index < validatesFieldsArr.length; index++) {
            const element = validatesFieldsArr[index];
            let fieldReg=element.regExp
            let fieldTbale=validatesObj
            let fieldColumn =element.fieldName
            let fieldMsg=element.fieldMsg
            let reg=new RegExp(this[`${fieldReg}`])
            //去除空格
            let value=this[`${fieldTbale}`][`${fieldColumn}`].replace(/\s+/g,"")
            if (value && reg.test(value)) {  

            } else {
                Toast.failed(fieldMsg)
                return false
            }
            
        }
        return true
          
    },
    onPickerConfirm(index,field) {
        const values = this.$refs[`picker${index}`].getColumnValues()
        let res = ''
        let realV= ''
        let fieldList = field.split('.')
        let fieldTbale=fieldList[0]
        let fieldColumn=fieldList[1]
        values.forEach(value => {
          value && (res += `${value.label || value.value}`) && ((realV += `${value.value || value.label}`))
        })
        console.log(res+'&'+realV)
        this[`pickerValue${index}`] = res
        this[`${fieldTbale}`][`${fieldColumn}`]=realV 
    },  
    onChange(name, checked) {
        console.log(`agree name = ${name} is ${checked ? 'checked' : 'unchecked'}`)
    },
    onDatePickerConfirm(index,datePickerValue,field) {
        let fieldList = field.split('.')
        let fieldTbale=fieldList[0]
        let fieldColumn=fieldList[1]
        let  dateStr=this.$refs[`datePicker${index}`].getFormatDate('yyyy-MM');
        this[`${datePickerValue}`] = formatDate(new Date(dateStr),'MMyy')
        this[`${fieldTbale}`][`${fieldColumn}`]= formatDate(new Date(dateStr),'MMyy')
    },
    validSignFieldsSetOne(){
       let signFieldsSetOneResult=false;
       signFieldsSetOneResult=this.beforeHandleValid('sign',this.signFieldsSetOne)
         if(signFieldsSetOneResult===true){
            return true
            }else{
          return false
        }
    },
     validSignFieldsSetTow(){
        let signFieldsSetTowResult=false;
        signFieldsSetTowResult= this.beforeHandleValid('sign',this.signFieldsSetTow)
        if(signFieldsSetTowResult===true){
            return true
        }else{
            return false
        }
    },
     validSignFieldsSetThree(){
       let signFieldsSetThreeResult=false;
       signFieldsSetThreeResult= this.beforeHandleValid('sign',this.signFieldsSetThree)
        if(signFieldsSetThreeResult===true){
            return true
        }else{
            return false
        }
    },
     validSignFieldsSetFour(){
       let signFieldsSetFourResult=false;
       signFieldsSetFourResult= this.beforeHandleValid('sign',this.signFieldsSetFour)
        if(signFieldsSetFourResult===true){
            return true
        }else{
            return false
        }
    },
    validAllFields(){
        let tempValidResult=false;
        
        tempValidResult=this.beforeHandleValid('sign',this.signFieldsSetOne)
        //第一部分字段通过验证
        if(tempValidResult===true){
           if(this.pickerValue1==='信用卡'){
              tempValidResult=this.validSignFieldsSetTow()
           }//不是信用卡类型
        }else{
          return tempValidResult
        }
        //第二部分通过验证
        if(tempValidResult===true){
              tempValidResult=this.validSignFieldsSetThree()
        }else{
          return tempValidResult
        }
        if(tempValidResult===true){
           if(this.pickerValue0==='中国建设银行股份有限公司'){
              tempValidResult=this.validSignFieldsSetFour()
           }//不是信用卡类型
        }else{
          return tempValidResult
        }
        
        return tempValidResult
    },
    goSignConfirm(ResultNode,TransSource){
        localStorage.setItem('CellPhone',this.sign.CellPhone)
        localStorage.setItem('RdSeq',ResultNode.RdSeq)
        localStorage.setItem('TransSource',TransSource)
        
        console.log('RdSeq'+ResultNode.RdSeq)
        this.$router.push({
            path:'signConfirm',
            params:{
              
            }
        });   
    },
    resultAnliz(ResultNode,TransSource){
       var  resultCode =ResultNode.SignConfirmType
        if(resultCode==='0'){
            Toast.info(ResultNode.SignInfo)
            return
        }
        else if(resultCode==='1'){
            Toast.info(ResultNode.SignInfo)
        }
        else if(resultCode==='2'){
            Toast.hide()
            Dialog.succeed({
            title: '成功',
            content: '提交成功，点击确定，完成后续操作！',
            confirmText: '确定',
            onConfirm:()=>{
              this.goSignConfirm(ResultNode,TransSource)
            }
          })
        }
        else if(resultCode==='3'){
            Toast.hide()
            Dialog.succeed({
            title: '成功',
            content: ResultNode.RdMsg+',请按照接收到的短信提示，完成后续操作！',
            confirmText: '确定',
            onConfirm:()=>{
            
            }
            })
        }
        else if(resultCode==='4'){
            Toast.hide()
            Dialog.succeed({
            title: '成功',
            content: ResultNode.RdMsg+',点击确定，完成后续操作！',
            confirmText: '确定',
            onConfirm:()=>{
               //去跳转
               window.location.href=ResultNode.SignUrl
            }
            })
          
        }
    },
    queryAndSign(){
      Toast.loading('正在提交...')

      //页面录入字段检验
      this.validResult=this.validAllFields()
      if(this.validResult===false)
      {
          return false
      }
      //agree 检验
      if(this.agreeConf.checked===false)
      {
         Toast.failed('您还没有接受签约条款')
         return false
      }
      let URL=this.$queryAndSignUrl
       
      if(this.pickerValue0==='交通银行'){
        this.sign.PolicyNo=this.sign.CertNumber
      }
    
      let params=this.sign
      console.log('请求路径：'+URL)
      console.log('申请参数：'+JSON.stringify(params))
      this.$axios
          .post(URL,params )
          .then(successResponse => {
              console.log(successResponse.data);
               var returnNode=successResponse.data;
               var TransSource=returnNode.TransSource
               if(returnNode.RtnCode==='success'){
                  var ResultNode=returnNode.OUT[0]
                  let RdCode=ResultNode.RdCode
                   console.log(RdCode)
                   if(RdCode==='success'){
                      if(ResultNode.SignState==='0'){
                          Toast.info(ResultNode.RdMsg)
                          return
                      }
                      else if(ResultNode.SignState==='1'){
                          this.resultAnliz(ResultNode,TransSource)
                          return
                      }
                      else if(ResultNode.SignState==='2'){
                          Toast.info(ResultNode.RdMsg)
                          return
                      }
                      else if(ResultNode.SignState==='3'){
                          Toast.info(ResultNode.RdMsg)
                          return
                      }
                      //签约中
                      else if(ResultNode.SignState==='4'){
                          this.resultAnliz(ResultNode,TransSource)
                          return
                      }
                     
                   }else{
                       Toast.failed(ResultNode.RdMsg);
                        console.log("提交信息异常");
                   }
                            
               }else {
                  Toast.failed(returnNode.RtnMsg)
                  console.log("接口请求异常");
               }
             
          })
          .catch(failResponse => {
              Toast.failed('系统异常，请稍后再试！')
              console.log("调用"+URL+"核保接口失败:"+failResponse);
          })

    },
    getLabelByValue(lists,valueKey){
         
         var elements=lists[0]
        for (let index = 0; index < elements.length; index++) {
          const element = elements[index];
          if(element.value===valueKey){
              return element.label
          }
          
        }
    },
    loadData()
    {   
          Toast.loading('加载中...')
           //系统来源
          if(this.$route.query.transSource) {
            this.sign.TransSource =this.$route.query.transSource
          }
          var isFromLink=false
          var showType =this.$route.query.showType 
          var dataDisplay =this.$route.query.dataDisplay 
          if(showType){
              isFromLink=true
          }else{
              showType='default'
          }
          if(dataDisplay){
             this.dataDisplay=dataDisplay
          }
          
           this.showType=showType
           this.isFromLink=isFromLink
          //通过链接跳转过来
          if(isFromLink===true){
               
              //加载含有建行列表
              this.oppBankPickerData=this.fromLinkBankLists
              
              //获取链接中参数
             
              if(this.$route.query.oppBank){
                  this.sign.OppBank=this.$route.query.oppBank
                 this.pickerValue0= this.getLabelByValue(this.oppBankPickerData,this.sign.OppBank)
              }
              if(this.$route.query.oppAct){
                  this.sign.OppAct=this.$route.query.oppAct
                  //脱敏
                  var tempOppAct= this.sign.OppAct;
                  this.displayOppAct=tempOppAct.substring(0,this.sign.OppAct.length-8)+'*****'+tempOppAct.substring(this.sign.OppAct.length-3,this.sign.OppAct.length)
              }
              if(this.$route.query.oppActName){
                  this.sign.OppActName=this.$route.query.oppActName
              } 
              if(this.$route.query.cardType){
                  this.sign.CardType=this.$route.query.cardType
                  this.pickerValue1=this.getLabelByValue(this.cardTypePickerData,this.sign.CardType)
                  
              }
              if(this.$route.query.expiredDate){
                    this.sign.ExpiredDate=formatDate(new Date(this.$route.query.expiredDate),'MMyy') 
                    this.datePickerValue=formatDate(new Date(this.$route.query.expiredDate),'MMyy') 
               
              }
              if(this.$route.query.certType){
                  this.sign.CertType=this.$route.query.certType
                  this.pickerValue2=this.getLabelByValue(this.idTypePickerData,this.sign.CertType)
              } 
               if(this.$route.query.certNumber){
                  this.sign.CertNumber=this.$route.query.certNumber
              }
              if(this.$route.query.cellPhone){
                  this.sign.CellPhone=this.$route.query.cellPhone
              }
              if(this.$route.query.policyNo){
                  this.sign.PolicyNo=this.$route.query.policyNo
              }
              if(this.$route.query.limitPeriodUnit){
                  //1：日2：月3：年  如果没有，
                  let  LimitPeriodUnit=this.$route.query.limitPeriodUnit
                  this.sign.LimitPeriodUnit=LimitPeriodUnit
                  if(LimitPeriodUnit==='1'){
                    this.LimitPeriodUnit='日'
                  }else if(LimitPeriodUnit==='2'){
                    this.LimitPeriodUnit='月'
                  }else if(LimitPeriodUnit==='3'){
                    this.LimitPeriodUnit='年'
                  }
              }
              if(this.$route.query.noteMoney){
                  this.sign.NoteMoney=this.$route.query.noteMoney
              } 
          }
          //this.$forceUpdate()
          Toast.hide()
          
    }
  },
  mounted(){
    this.loadData()

  }
}

</script>
<style>
.md-field-item-right {
  color: #41485d;
  font-size: 0.426667rem;
}
.idExpiryDate .md-field-item-control{
   text-align:left;
   margin-left: 5%;
}
.text-orange{
	 color: #fc6102;
   text-decoration:none;

 }

</style>