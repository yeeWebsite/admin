<template lang="html">
  <el-menu theme="dark" class="el-menu-demo topmenu" mode="horizontal" @select="handleSelect">
    <el-menu-item index="title" class="title info">后台管理系统</el-menu-item>
    <el-menu-item index="/logout/" class="fright">退出登录</el-menu-item>
    <el-menu-item index="/orders/" class="fright">订单管理</el-menu-item>
    <el-menu-item index="tips" class="fright info">你好，{{username}}</el-menu-item>
  </el-menu>
</template>

<script>
import { ajax } from "@/libs/ajax"
import { mapGetters, mapActions } from 'vuex'

export default {
  data(){
    return {
      username: ''
    }
  },
  props: [],
  methods:{
    handleSelect(key, keyPath) {
      if(key == '/orders/') this.$router.push({path:key});
      else if(key == '/logout/'){
        //退出登录
        const params = { ck: this.userinfo.userck, uid: this.userinfo.userid, indicator:{async:true} };
        ajax.get('/admin/User/logout', {params:params}).then((response) => {
          if (response.data && response.data.code > 0) {
            //服务端已退出登录，执行前端退出登录
            this.$store.dispatch('setUserLogout').then(() => {
              this.$router.push('/user/login/');
            });
          } else {
            this.$message.error(response.data.msg);
          }
        }).catch((e) => {
          this.$message.error(e.toString());
        });
      }
    },
    getUserinfo(){
      const params = {ck: this.userinfo.userck, uid: this.userinfo.userid, userid: this.userinfo.userid, indicator:{async:true}};
      ajax.get('/admin/User/getuserinfo', {params:params}).then((response) => {
        if (response.data && response.data.code > 0) {
          const info = response.data.info;
          this.username = info.username || '';
        } else {
          this.$message.error(response.data.msg);
        }
      }).catch((e) => {
        this.$message.error(e.toString());
      });
    }
  },
  created(){
    this.getUserinfo();
  },
  computed: {
    ...mapGetters({
      userinfo: 'userinfo'
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