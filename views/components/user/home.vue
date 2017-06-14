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
          <el-table-column prop="mobile" label="手机号"></el-table-column>
          <el-table-column prop="usermoney" label="余额"></el-table-column>
          <el-table-column prop="freezemoney" label="冻结金额"></el-table-column>
          <el-table-column prop="allmoney" label="累计消费金额"></el-table-column>
          <el-table-column prop="allnum" label="消费次数"></el-table-column>
          <el-table-column prop="address" label="用户地址"></el-table-column>
          <el-table-column label="用户状态">
            <template scope="scope">
              <span v-if="scope.row.user_status == 0">正常</span>
              <span v-else-if="scope.row.user_status == 200">已认证</span>
              <span v-else-if="scope.row.user_status == -100" class="noticeinfo">已禁止</span>
              <span v-else-if="scope.row.user_status == -200" class="noticeinfo">已清户</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" v-if="this.isysadmin">
            <template scope="scope">
              <el-button v-if="scope.row.user_status >= 0" size="small" @click.stop="userDisable(scope.row)">禁止用户</el-button>
              <el-button v-if="scope.row.user_status == -100" size="small" @click.stop="userDisable(scope.row)">解除禁止</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pageComponent v-if="userlist.length>0" :page="page" :pagesize="pagesize" :total="allnum" :callback="getCurrentPage"></pageComponent>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ajax } from "@/libs/ajax"
import { mapGetters, mapActions } from 'vuex'
import { currency } from "@/filters/currency"

export default {
  data() {
    return {
      page: 1,
      pagesize: 20,
      allnum: 0,
      userlist: [],
    }
  },
  methods: {
    getCurrentPage(page){
      this.page = page;
      this.getUserlist();
    },
    //获取用户列表信息
    getUserlist(){
      const params = { page: this.page, pagesize: this.pagesize };
      ajax.get('/admin/user/getRegUserList', {params:params}).then((response) => {
        if (response.data && response.data.code > 0) {
          let info = response.data.info;
          let userlist = response.data.list;
          for (var i = 0; i < userlist.length; i++) {
            userlist[i].address = userlist[i].address || '-';
            userlist[i].allnum = userlist[i].allnum || 0;
            userlist[i].allmoney = userlist[i].allmoney?currency(userlist[i].allmoney):currency(0);
            userlist[i].usermoney = userlist[i].usermoney?currency(userlist[i].usermoney):currency(0);
            userlist[i].freezemoney = userlist[i].freezemoney?currency(userlist[i].freezemoney):currency(0);
          }
          this.allnum = info.allnum || userlist.length;
          this.userlist = userlist;
        } else {
          this.$message.error(response.data.msg);
        }
      }).catch((e) => {
        this.$message.error(e.toString());
      });
    },
    userDisable(userinfo){
      let _tipstitle = '是否继续';
      const _userid = userinfo.userid;
      const _status = userinfo.user_status;
      if(_status >= 0) _tipstitle = '禁止用户将限制注册用户的任何操作，是否继续？';
      else if(_status == -100) _tipstitle = '是否恢复已禁止用户限制？';
      this.$confirm(_tipstitle, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false,
        callback: (action, instance) => {
          if(action == 'confirm'){
            ajax.get('/admin/user/userDisable', { params:{ userid:_userid, status:_status } }).then((response) => {
              if (response.data && response.data.code > 0) {
                this.$message.success('处理成功');
                this.getUserlist();
              } else {
                this.$message.error(response.data.msg);
              }
            }).catch((e) => {
              this.$message.error(e.toString());
            });
          }
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
    pageComponent: require('components/page.vue'),
  },
  watch: {
    
  }
}
</script>

<style type="text/css">
  
</style>
