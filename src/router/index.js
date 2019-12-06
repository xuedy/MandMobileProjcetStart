import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Sign from '@/components/Sign'
import SignConfirm from '@/components/SignConfirm'

Vue.use(Router)

export default new Router({
    //激活选项有背景色  router-link 
    // css 样式
    //a{
    //   font-size: 14px
    //   color:red  //没有被点击显示红色
    //   &.active{
    //       color:blue    //被点击后显示蓝色
    //   }
    // }
  linkActiveClass:'active',
  // 去掉路由地址的# 不过打包会有问题
  //base:'/项目名称/目录名称',
  // 修改 config /index.js
  // build 下面 assetsPublicPath： “/项目名称/目录名称/”
  // 后端 匹配 /项目名称/目录名称/ 下面的资源，重定向到打包后的index.html
  //mode:'history', 
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/sign',
      name: 'Sign',
      component: Sign
    },
    {
      path: '/signConfirm',
      name: 'SignConfirm',
      component: SignConfirm
    }
  ]
})
