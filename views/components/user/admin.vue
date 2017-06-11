<template>
  <div class="content">
    <headerComponent></headerComponent>
    <el-row class="tac" :gutter="10">
      <el-col :span="4"><leftComponent></leftComponent></el-col>
      <el-col :span="20">
        <breadtitleComponent></breadtitleComponent>
        <!-- 页面输入内容 -->
        <el-row type="flex">
          <el-col :span="24" class="searchbox">
            <el-button type="primary" style="float: right; margin-right: 16px;" @click.stop="addUserinfo()">新增门店用户</el-button>
          </el-col>
        </el-row>
        <el-table :data="userlist"  :default-sort="{prop:'uid',order:'ascending'}" empty-text="暂无数据..." style="width: 100%" id="loading">
          <el-table-column type="index" label="序号" width="80"></el-table-column>
          <el-table-column prop="username" label="用户名"></el-table-column>
          <el-table-column prop="realname" label="真实姓名"></el-table-column>
          <el-table-column label="用户状态">
            <template scope="scope">
              <span v-if="scope.row.userstatus == 100">正常</span>
              <span v-else class="noticeinfo">已禁用</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template scope="scope">
              <el-button size="small" @click.stop="modUserinfo(scope.row)">修改</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- dialog弹层 -->
        <el-dialog class="discount-dialog" :title="dialog.dialogtitle" :visible.sync="dialog.showdialog" size="tiny" :close-on-click-modal="false">
          <div class="deskinfoDialog">
            <el-form ref="userform" :model="dialog.data" label-width="80px" label-position="right">
              <el-form-item v-if="dialog.type=='modify'" label="用户ID"><span>{{dialog.data.uid}}</span></el-form-item>
              <el-form-item label="用户名" prop="username" :rules="[{required:true,message:'请输入用户名'}]">
                <el-input v-model="dialog.data.username" class="inlineinput"></el-input>
              </el-form-item>
              <el-form-item v-if="dialog.type=='add'" label="密码" prop="password" :rules="[{required:true,message:'请输入密码'}]">
                <el-input type="password" v-model="dialog.data.password" class="inlineinput"></el-input>
              </el-form-item>
              <el-form-item v-else label="密码">
                <el-input type="password" v-model="dialog.data.password" class="inlineinput"></el-input>
              </el-form-item>
              <el-form-item label="真实姓名" prop="realname" :rules="[{required:true,message:'请输入真实姓名'}]">
                <el-input v-model="dialog.data.realname" class="inlineinput"></el-input>
              </el-form-item>
              <el-form-item v-if="dialog.type=='modify'" label="是否可用">
                <el-switch on-text="" off-text="" v-model="dialog.data.userstatus" on-value="100" off-value="-100" style="margin-right:10px;"></el-switch>
              </el-form-item>
            </el-form>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button size="small" type="primary" @click.stop="processUserinfo('userform')">确 定</el-button>
          </span>
        </el-dialog>
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
      userlist: [],
      dialog:{
        type:'',
        showdialog: false,
        dialogtitle: '',
        data:{
          uid: "",
          username: '',
          password: '',
          realname: '',
          userstatus: '',
        }
      }
    }
  },
  methods: {
    //添加用户信息
    addUserinfo(){
      this.dialog.type = 'add';
      this.dialog.showdialog = true;
      this.dialog.dialogtitle = '添加用户';
      this.dialog.data.username = '';
      this.dialog.data.password = '';
      this.dialog.data.realname = '';
      this.dialog.data.userstatus = '';
    },
    //修改用户信息
    modUserinfo(userinfo){
      this.dialog.type = 'modify';
      this.dialog.showdialog = true;
      this.dialog.dialogtitle = '修改用户';
      this.dialog.data.uid = userinfo.uid;
      this.dialog.data.username = userinfo.username;
      this.dialog.data.password = '';
      this.dialog.data.realname = userinfo.realname;
      this.dialog.data.userstatus = userinfo.userstatus;
    },
    //获取用户列表信息
    getUserlist(){
      ajax.get('/admin/User/getUserList').then((response) => {
        if (response.data && response.data.code > 0) {
          this.userlist = response.data.list;
        } else {
          this.$message.error(response.data.msg);
        }
      }).catch((e) => {
        this.$message.error(e.toString());
      });
    },
    processUserinfo(userform){
      this.$refs[userform].validate((valid) => {
        if (valid) {
          let url = '/admin/user/addUser';
          let params = {username:this.dialog.data.username, password:this.dialog.data.password, realname:this.dialog.data.realname};
          //如果是修改则需处理
          if(this.dialog.type == 'modify'){
            url = '/admin/user/updateUserInfo';
            params = {userid: this.dialog.data.uid, username:this.dialog.data.username, password:this.dialog.data.password, realname:this.dialog.data.realname, userstatus:this.dialog.data.userstatus};
          }
          ajax.get(url, {params:params}).then((response) => {
            this.dialog.showdialog = false;
            if (response.data && response.data.code > 0) {
              this.$message.success(this.dialog.type == 'modify'?'修改成功':'添加成功');
              this.getUserlist(); 
            } else {
              this.$message.error(response.data.msg);
            }
          }).catch((e) => {
            this.$message.error(e.toString());
          });
        } else {
          return false;
        }
      });
    }
  },
  computed: {
    ...mapGetters({
      isysadmin: 'isysadmin',
      userinfo: 'userinfo',
      shopinfo: 'shopinfo',
      defshopid: 'defshopid'
    }),
  },
  created () {
    this.getUserlist();
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
