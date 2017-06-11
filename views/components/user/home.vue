<template>
  <div class="content">
    <headerComponent></headerComponent>
    <el-row class="tac" :gutter="10">
      <el-col :span="4"><leftComponent></leftComponent></el-col>
      <el-col :span="20">
        <breadtitleComponent></breadtitleComponent>
        <!-- 页面输入内容 -->
        <el-row type="flex">
          <el-col :span="24" class="searchbox">&nbsp;</el-col>
        </el-row>
        <el-table :data="userlist"  :default-sort="{prop:'uid',order:'ascending'}" empty-text="暂无数据..." style="width: 100%" id="loading">
          <el-table-column type="index" label="序号" width="80"></el-table-column>
          <el-table-column prop="username" label="手机号"></el-table-column>
          <el-table-column prop="username" label="押金"></el-table-column>
          <el-table-column prop="username" label="余额"></el-table-column>
          <el-table-column prop="username" label="累计消费金额"></el-table-column>
          <el-table-column prop="username" label="消费次数"></el-table-column>
          <el-table-column prop="username" label="用户地址"></el-table-column>
          <el-table-column label="用户状态">
            <template scope="scope">
              <span v-if="scope.row.userstatus == 100">正常</span>
              <span v-else class="noticeinfo">已禁用</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template scope="scope">
              <el-button size="small" @click.stop="userDisable(scope.row)">解除禁用</el-button>
            </template>
          </el-table-column>
        </el-table>
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
    }
  },
  methods: {
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
    userDisable(userform){
      /*ajax.get(url, {params:params}).then((response) => {
        this.dialog.showdialog = false;
        if (response.data && response.data.code > 0) {
          this.$message.success(this.dialog.type == 'modify'?'修改成功':'添加成功');
          this.getUserlist(); 
        } else {
          this.$message.error(response.data.msg);
        }
      }).catch((e) => {
        this.$message.error(e.toString());
      });*/
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
