<template lang="html">
  <el-menu :router="true" :default-active="defaultActive" :default-openeds="['dineshop','orders','money']" v-if="isysadmin">
    <el-menu-item index="/">管理首页</el-menu-item>
    <el-submenu index="dineshop">
      <template slot="title">门店管理</template>
      <el-menu-item-group index="" title="店铺管理">
        <el-menu-item index="/dineshop/">门店列表</el-menu-item>
        <el-menu-item index="/dineshop/sellinfo/">放号管理</el-menu-item>
        <el-menu-item index="/dineshop/discount/">折扣管理</el-menu-item>
        <el-menu-item index="/dineshop/deskinfo/">桌型管理</el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group index="" title="菜肴管理">
        <el-menu-item index="/food/dishes/">菜肴信息</el-menu-item>
        <el-menu-item index="/food/classify/">菜肴分类管理</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
    <el-submenu index="orders">
      <template slot="title">订单管理</template>
      <el-menu-item index="/orders/">外卖订单</el-menu-item>
      <el-menu-item index="/orders/eatin/">预售订单</el-menu-item>
    </el-submenu>
    <!-- <el-submenu index="money">
      <template slot="title">资金管理</template>
      <el-menu-item index="/money/">押金/余额</el-menu-item>
      <el-menu-item index="/money/lucre/">门店收益金</el-menu-item>
    </el-submenu> -->
    <el-submenu index="user">
      <template slot="title">用户管理</template>
      <el-menu-item index="/user/admin/">门店用户管理</el-menu-item>
      <el-menu-item index="/user/">订餐用户管理</el-menu-item>
    </el-submenu>
  </el-menu>
  <el-menu :router="true" :default-active="defaultActive" v-else>
    <el-menu-item index="/">我的门店</el-menu-item>
    <el-menu-item index="/dineshop/sellinfo/">放号管理</el-menu-item>
    <el-menu-item index="/dineshop/discount/">折扣管理</el-menu-item>
    <el-menu-item index="/dineshop/deskinfo/">桌型管理</el-menu-item>
    <el-menu-item index="/food/dishes/">菜肴信息</el-menu-item>
    <el-menu-item index="/food/classify/">菜肴分类管理</el-menu-item>
    <el-menu-item index="/orders/">外卖订单</el-menu-item>
    <el-menu-item index="/orders/eatin/">预售订单</el-menu-item>
  </el-menu>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data(){
    return {
      defaultActive:''
    }
  },
  props: ['path'],
  methods:{

  },
  created(){
    if(!this.islogin){
      this.$router.push('/user/login/');
    }
    this.defaultActive = this.path?this.path:this.$route.path;
  },
  computed: {
    ...mapGetters({
      islogin: 'islogin',
      isysadmin: 'isysadmin',
      userinfo: 'userinfo',
      shopinfo: 'shopinfo',
    })
  },
  components: {

  }
}
</script>

<style type="text/css">

</style>