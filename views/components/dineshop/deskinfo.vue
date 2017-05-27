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
            输入店铺ID：<el-input class="searchinput" placeholder="店铺ID" icon="search" v-model="shopid"></el-input>&nbsp;&nbsp;
            <el-button type="primary" :loading="false"  @click.stop="searchDineshop()">搜索</el-button>
            <span style="margin-left:20px;">门店：{{shopname?shopname:'-'}}</span>
            <el-button type="primary" style="float: right; margin-right: 16px;" @click.stop="addDeskinfo()">新增桌型</el-button>
          </el-col>
        </el-row>
        <el-table :data="desklist"  :default-sort="{prop:'seatnum',order:'ascending'}" empty-text="暂无数据..." style="width: 100%" id="loading">
          <el-table-column type="index" label="序号" width="120"></el-table-column>
          <el-table-column prop="id" label="桌型ID"></el-table-column>
          <el-table-column label="桌型名称">
            <template scope="scope">
              <span>{{scope.row.seatnum}}人桌</span>
            </template>
          </el-table-column>
          <el-table-column prop="desknum" label="放号数量"></el-table-column>
          <el-table-column label="操作" width="200">
            <template scope="scope">
              <el-button size="small" @click.stop="modDeskinfo(scope.row)">修改</el-button>
              <el-button size="small" @click.stop="delDeskinfo(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- dialog弹层 -->
        <el-dialog class="discount-dialog" :title="dialog.dialogtitle" :visible.sync="dialog.showdialog" size="tiny" :close-on-click-modal="false">
          <div class="deskinfoDialog">
            <el-form ref="deskform" :model="dialog.data" label-width="80px" label-position="right">
              <el-form-item label="就餐人数" prop="seatnum" :rules="[{required:true,message:'请输入就餐人数'},{type:'number',message:'就餐人数必须为数字值'}]">
                <el-input v-model.number="dialog.data.seatnum" auto-complete="off" class="inlineinput">
                  <template slot="append">人桌</template>
                </el-input>
              </el-form-item>
              <el-form-item label="桌型数量" prop="desknum" :rules="[{required:true,message:'请输入桌型数量'},{type:'number',message:'桌型数量必须为数字值'}]">
                <el-input v-model.number="dialog.data.desknum" class="inlineinput"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button size="small" type="primary" @click.stop="processDeskinfo('deskform')">确 定</el-button>
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
      shopid: '1',
      shopname: '',
      desklist:[],
      dialog:{
        showdialog: false,
        dialogtitle: '',
        data:{
          id: "",
          seatnum: '',
          desknum: ''
        }
      }
    }
  },
  methods: {
    //搜索店铺
    searchDineshop(){
      this.getDesklist();
    },
    //获取店铺桌型列表信息
    getDesklist(){
      if(this.shopid){
        ajax.get('/admin/shop/getDesklist', {params:{ shopid:this.shopid }}).then((response) => {
          if (response.data && response.data.code > 0) {
            const info = response.data.info;
            const list = response.data.list;
            this.shopname = info.shopname;
            this.desklist = list;
          } else {
            this.$message.error(response.data.msg);
          }
        }).catch((e) => {
          this.$message.error(e.toString());
        });
      }
    },
    //添加桌型信息
    addDeskinfo(){
      this.dialog.showdialog = true;
      this.dialog.dialogtitle = '添加桌型';
      this.dialog.data.seatnum = '';
      this.dialog.data.desknum = '';
    },
    //修改桌型信息
    modDeskinfo(deskinfo){
      this.dialog.showdialog = true;
      this.dialog.dialogtitle = '修改桌型';
      console.log(deskinfo);
      this.dialog.data = {
        id: deskinfo.id,
        seatnum: parseInt(deskinfo.seatnum),
        desknum: parseInt(deskinfo.desknum),
      };
    },
    processDeskinfo(deskform){
      this.$refs[deskform].validate((valid) => {
        if (valid) {
          let url = '/admin/shop/addDesk';
          let params = {shopid:this.shopid, seatnum:this.dialog.data.seatnum, desknum:this.dialog.data.desknum};
          let fn = (data) => {
            this.desklist.push({
              id: data.info.deskid,
              shopid: this.shopid,
              seatnum: this.dialog.data.seatnum,
              desknum: this.dialog.data.desknum
            });
          }
          if(this.dialog.data.id){
            url = '/admin/shop/modDesk';
            params = {deskid:this.dialog.data.id, seatnum:this.dialog.data.seatnum, desknum:this.dialog.data.desknum};
            fn = (data) => {
              for (var i = 0; i < this.desklist.length; i++) {
                if(this.desklist[i].id == this.dialog.data.id){
                  this.desklist[i].seatnum = this.dialog.data.seatnum;
                  this.desklist[i].desknum = this.dialog.data.desknum;
                  break;
                }
              }
            }
          }
          ajax.get(url, {params:params}).then((response) => {
            if (response.data && response.data.code > 0) {
              fn(response.data);
              this.dialog.showdialog = false;
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
    },
    //删除桌型信息
    delDeskinfo(deskid){
      this.$confirm('删除的桌型信息将不可恢复，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false,
        callback: (action) => {
          if(action == 'confirm'){
            ajax.get('/admin/shop/delDesk', {params:{ deskid:deskid }}).then((response) => {
              if (response.data && response.data.code > 0) {
                for (var i = 0; i < this.desklist.length; i++) {
                  if(this.desklist[i].id == deskid){
                    this.desklist.splice(i,1); 
                    break;
                  }
                }
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
      
    }),
  },
  created () {
    this.searchDineshop();
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
.deskinfoDialog{max-height: 300px;overflow: auto}
.deskinfoDialog .el-form-item__content{width: 180px;}
</style>
