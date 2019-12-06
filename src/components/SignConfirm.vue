<template>
  <div style="text-align:left;margin-top:10%;">
    <md-field>
     <md-input-item
        title="签约流水号"
        type="text"
        v-model="signConfirm.RdSeq"
        placeholder="请输入签约流水号"
        readonly
        hidden
      ></md-input-item>
      <md-input-item
        title="手机号"
        type="phone"
        v-model="signConfirm.CellPhone"
        placeholder="请输入手机号"
        disabled
      ></md-input-item>
      <md-input-item
        title="验证码"
        type="digit"
        v-model="signConfirm.VerfyCode"
        placeholder="请输入验证码"
        :maxlength="6"
        :minlength="6"
        clearable
      ></md-input-item>
    </md-field>
    <div>
          <md-button type="primary" round @click="queryAndSign">签约</md-button>
    </div>
  </div>
</template>

<script>
import {Toast,Dialog} from 'mand-mobile'

export default {

  data() {
    return {
       //非空验证
      requiredReg:/\S/,
      //手机号码验证
      mobileReg:/^1[3546789][0-9]{9}$/,
      signConfirm:{
        CellPhone:localStorage.getItem('CellPhone'),
        RdSeq:localStorage.getItem('RdSeq'),
        VerfyCode:'',
        TransSource:localStorage.getItem('TransSource'),
      },
      signConfirmFields:[
           {
              fieldName: "RdSeq",
              regExp: "requiredReg",
              fieldMsg:"签约流水号有误"
          },
          {
              fieldName: "CellPhone",
              regExp: "mobileReg",
              fieldMsg:"手机号有误"
          },
            {
              fieldName: "VerfyCode",
              regExp: "requiredReg",
              fieldMsg:"验证码不能为空"
          },
      ], 
    }
  },   

  methods: {
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
    
    queryAndSign(){
    
      //页面录入字段检验
      this.validResult=this.beforeHandleValid('signConfirm',this.signConfirmFields)
      if(this.validResult!==true){
         return
      }
      let URL=this.$signConfirmUrl
      let params=this.signConfirm
      Toast.loading('签约中...')
      console.log('请求路径：'+URL)
      console.log('申请参数：'+JSON.stringify(params))
      this.$axios
          .post(URL,params )
          .then(successResponse => {
              console.log(successResponse.data)
               var returnNode=successResponse.data
               if(returnNode.RtnCode==='success'){
                  var ResultNode=returnNode.OUT[0]
                  let RdCode=ResultNode.RdCode
                   console.log(RdCode)
                   if(RdCode==='success'){
                      if(ResultNode.SignState==='0'){
                          Toast.info('暂不支持此账号签约！')
                          return
                      }
                      else if(ResultNode.SignState==='1'){
                          Toast.info('未签约')
                          return
                      }
                      else if(ResultNode.SignState==='2'){
                            Toast.hide()
                            Dialog.confirm({
                              title: '提示',
                              content: '本次签约已成功',
                              confirmText: '返回首页',
                              onConfirm:()=>{
                                 this.$router.go(-1)
                              },
                              onCancel:()=>{
                              }
                            })
                          return
                      }
                      else if(ResultNode.SignState==='3'){
                          Toast.info('签约失败，请稍后在来！')
                          return
                      }
                      else if(ResultNode.SignState==='4'){
                          Toast.info('签约进行中')
                          return
                      }
                     
                   }else{
                       Toast.failed(ResultNode.RdMsg)
                        console.log("提交信息异常")
                   }
                            
               }else {
                  Toast.failed(returnNode.RdMsg)
                  console.log("接口请求异常")
               }
             
          })
          .catch(failResponse => {
              Toast.failed('系统异常，请稍后再试！')
              console.log("调用"+URL+"核保接口失败:"+failResponse)
          })

    }
  },
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