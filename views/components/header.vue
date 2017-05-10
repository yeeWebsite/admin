<template lang="html">
  <el-menu theme="dark" class="el-menu-demo topmenu" mode="horizontal" @select="handleSelect">
    <el-menu-item index="title" class="title info">后台管理系统</el-menu-item>
    <el-menu-item index="/logout/" class="fright">退出登录</el-menu-item>
    <el-menu-item index="/orders/" class="fright">订单管理</el-menu-item>
    <el-menu-item index="tips" class="fright info">你好，admin</el-menu-item>
  </el-menu>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data(){
    return {
      
    }
  },
  props: [],
  methods:{
    handleSelect(key, keyPath) {
      if(key == '/orders/') this.$router.push({path:key});
      else if(key == '/logout/') this.$router.push({path:'/user/login/'});
    }
  },
  created(){
    
  },
  computed: {
    ...mapGetters({
      
    })
  },
  components: {

  }
}
</script>

<style type="text/css">
.topmenu{border-radius: 0px;}
.topmenu .is-active{color:#bfcbd9;}
.topmenu li.el-menu-item{ height: 50px; line-height: 50px;}
.topmenu li.title{ font-size: 18px; }
.topmenu li.info, .topmenu li.info:hover{ color: #FF4949;border-bottom: none;}
.topmenu li.fright{float: right;}
</style>