<template>
  <div class="content">
    <headerComponent></headerComponent>
    <el-row class="tac" :gutter="10">
      <el-col :span="4"><leftComponent></leftComponent></el-col>
      <el-col :span="20">
        <!-- 页面输入内容 -->
        <el-card class="box-card">
          <div v-for="(info, key) in update" :key="key" class="text item">
            <div style="color:red; padding:6px 0px;">{{info.date}} 更新内容：</div>
            <div style="border:1px solid #ccc; padding:12px 20px;" v-html="info.msg"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ajax } from "@/libs/ajax"
import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      update:[
        {date: '2017/06/06', msg: '1,添加登录，退出登录等功能（管理员用户：sysadmin 123456; 门店用户：test 123456）;<br> 2,添加用户目录权限;<br> 3,预售订单操作功能'},
        {date: '2017/06/05', msg: '1,预售订单列表查询已更新;'},
        {date: '2017/05/27', msg: '1,添加菜肴信息管理; <br> 2,添加菜肴信息修改和新增；<br> 3,修复店铺后台修改前端不能正常显示问题；'},
        {date: '2017/05/24', msg: '略'}
      ]
    }
  },
  methods: {
    
  },
  computed: {
    ...mapGetters({
      isysadmin: 'isysadmin'
    }),
  },
  created () {
    if(!this.isysadmin){
      this.$router.push('/dineshop/detail/');
    }
  },
  destroyed(){
    
  },
  components: {
    headerComponent: require('components/header.vue'),
    leftComponent: require('components/left.vue'),
    breadtitleComponent: require('components/breadtitle.vue'),
  },
  watch: {
    
  }
}
</script>

<style type="text/css">
  
</style>
