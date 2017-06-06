<template>
  <div class="loginbox">
    <el-row>
      <el-col :span="4" :offset="10" class="labelname title">用户登录</el-col>
    </el-row>
    <el-row>
      <el-col :span="2" :offset="8" class="labelname">用户名：</el-col>
      <el-col :span="4"><el-input placeholder="用户名" v-model="username"></el-input></el-col>
    </el-row>
    <el-row>
      <el-col :span="2" :offset="8" class="labelname">密码：</el-col>
      <el-col :span="4"><el-input placeholder="密码" type="password" v-model="password"></el-input></el-col>
    </el-row>
    <el-row justify="center" class="loginbtn">
      <el-col :span="4" :offset="10"><el-button type="primary" @click.stop="loginAction">登录</el-button></el-col>
    </el-row>
  </div>
</template>

<script>
import { ajax } from "@/libs/ajax"
import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    loginAction(){
      const params = { username: this.username, password: this.password };
      ajax.get('/admin/user/login', {params:params}).then((response) => {
        if (response.data && response.data.code > 0) {
          const info = response.data.info;
          this.$store.dispatch('setUserLogin', {userck:info.ck, userid:info.uid}).then(() => {
            this.$router.push('/');
          });
        } else {
          this.$message.error(response.data.msg);
        }
      }).catch((e) => {
        this.$message.error(e.toString());
      });
    }
  },
  computed: {
    ...mapGetters({
      islogin: 'islogin'
    }),
  },
  created () {
    if(this.islogin){
      this.$router.push('/');
    }
  },
  destroyed(){
    
  },
  components: {

  },
  watch: {
    
  }
}
</script>

<style type="text/css">
.loginbox{}
.loginbox div.title{text-align: center; font-size: 18px; font-weight: bold; margin-top: 200px;}
.loginbox .el-row{margin:20px;}
.loginbox .labelname{height: 36px; line-height: 36px; text-align: right;}
.loginbtn button{text-align: center; width: 100%;}
</style>
