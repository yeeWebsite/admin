<template>
  <div class="content">
    <headerComponent></headerComponent>
    <el-row class="tac" :gutter="10">
      <el-col :span="4"><leftComponent></leftComponent></el-col>
      <el-col :span="20">
        <breadtitleComponent></breadtitleComponent>
        <!-- 页面输入内容 -->
        <el-row type="flex">
          <el-col :span="24" class="searchbox" v-if="isysadmin">
            店铺ID或店铺名模糊搜索：<el-input class="searchinput" placeholder="店铺ID或店铺名" icon="search" v-model="search"></el-input>&nbsp;&nbsp;
            <el-button type="primary" :loading="false"  @click.stop="searchDineshop()">搜索</el-button>
            <span style="margin-left:20px;">门店：{{shopname?shopname:'-'}}</span>
            <el-button type="primary" style="float: right; margin-right: 16px;" @click.stop="addDeskinfo()">新增桌型</el-button>
          </el-col>
          <el-col :span="24" class="searchbox" v-else>
            <span style="margin-left:20px; line-height:36px;">门店：{{shopname?shopname:'-'}}</span>
            <el-button type="primary" style="float: right; margin-right: 16px;" @click.stop="addDeskinfo()">新增桌型</el-button>
          </el-col>
        </el-row>
        <el-table :data="desklist"  :default-sort="{prop:'seatnum',order:'ascending'}" empty-text="暂无数据..." style="width: 100%" id="loading">
          <el-table-column type="index" label="序号" width="120"></el-table-column>
          <el-table-column prop="deskid" label="桌型编号"></el-table-column>
          <el-table-column label="桌型名称">
            <template scope="scope">
              <span>{{scope.row.seatnum}}人桌</span>
            </template>
          </el-table-column>
          <el-table-column prop="desknum" label="放号数量"></el-table-column>
          <el-table-column prop="ordernum" label="已预订数量"></el-table-column>
          <el-table-column prop="status" label="桌型状态"></el-table-column>
          <el-table-column label="桌型状态" class-name="noticeinfo">
            <template scope="scope">
              <span v-if="scope.row.status == 0">已删除</span>
              <span v-else>可用</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template scope="scope">
              <el-button size="small" @click.stop="modDeskinfo(scope.row)">修改</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- dialog弹层 -->
        <el-dialog class="discount-dialog" :title="dialog.dialogtitle" :visible.sync="dialog.showdialog" size="tiny" :close-on-click-modal="false">
          <div class="deskinfoDialog">
            <el-form ref="deskform" :model="dialog.data" label-width="80px" label-position="right">
              <el-form-item v-if="dialog.type=='modify'" label="桌型编号"><span>{{dialog.data.deskid}}</span></el-form-item>
              <el-form-item label="就餐人数" prop="seatnum" :rules="[{required:true,message:'请选择就餐人数'}]">
                <el-select v-model="dialog.data.seatnum" placeholder="请选择">
                  <el-option v-for="seatnum in seatnumlist" :key="seatnum.value" :label="seatnum.label" :value="seatnum.value" :disabled="false"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="桌型数量" prop="desknum" :rules="[{required:true,message:'请输入桌型数量'},{type:'number',message:'桌型数量必须为数字值'}]">
                <el-input v-model.number="dialog.data.desknum" class="inlineinput"></el-input>
              </el-form-item>
              <el-form-item v-if="dialog.type=='add'" label="桌型编号" prop="deskid" :rules="[{required:true,message:'请输入桌型数量'}]">
                <el-input v-model.number="dialog.data.deskid" class="inlineinput"></el-input>
              </el-form-item>
              <el-form-item v-if="dialog.type=='modify'" label="是否可用">
                <el-switch on-text="" off-text="" v-model="dialog.data.status" on-value="1" off-value="0" style="margin-right:10px;"></el-switch>
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
      search: '',
      shopid: '',
      fontshopid: '',
      shopname: '',
      desklist:[],
      seatnumlist: [
        { value: 2, label: '2人桌' },
        { value: 4, label: '4人桌' },
        { value: 6, label: '6人桌' },
        { value: 12, label: '12人桌' }
      ],
      dialog:{
        type:'',
        showdialog: false,
        dialogtitle: '',
        data:{
          id: "",
          seatnum: '',
          desknum: '',
          deskid: '',
          status: '1', //是否可用
        }
      }
    }
  },
  methods: {
    //搜索店铺
    searchDineshop(){
      //获取店铺信息
      this.getDineshopInfo(this.search, (fontshopid)=>{
        this.getDesklist(fontshopid);
      });
    },
    getDineshopInfo(shopid, callback){
      if(shopid){
        ajax.get('/admin/shop/getDineshopInfo', {params:{ shopid:shopid, indicator:{async:true} }}).then((response) => {
          if (response.data && response.data.code > 0) {
            const info = response.data.info;
            this.fontshopid = info.fontshopid;
            if(callback) callback(this.fontshopid);
          } else {
            this.$message.error(response.data.msg);
          }
        }).catch((e) => {
          this.$message.error(e.toString());
        });
      }
    },
    //获取店铺桌型列表信息
    getDesklist(fontshopid){
      this.shopname = '-';
      this.desklist = [];
      if(fontshopid){
        ajax.get('/admin/shop/getDesklist', {params:{ shopid: fontshopid }}).then((response) => {
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
      this.dialog.type = 'add';
      this.dialog.showdialog = true;
      this.dialog.dialogtitle = '添加桌型';
      this.dialog.data.deskid = '';
      this.dialog.data.seatnum = '';
      this.dialog.data.desknum = '';
    },
    //修改桌型信息
    modDeskinfo(deskinfo){
      this.dialog.type = 'modify';
      this.dialog.showdialog = true;
      this.dialog.dialogtitle = '修改桌型';
      this.dialog.data = {
        deskid: deskinfo.deskid,
        seatnum: parseInt(deskinfo.seatnum),
        desknum: parseInt(deskinfo.desknum),
        status: '1',
      };
    },
    processDeskinfo(deskform){
      this.$refs[deskform].validate((valid) => {
        if (valid) {
          let url = '/admin/shop/addDesk';
          let params = {shopid:this.fontshopid, seatnum:this.dialog.data.seatnum, desknum:this.dialog.data.desknum, deskid: this.dialog.data.deskid};
          let fn = (data) => {
            this.desklist.push({
              shopid: this.shopid,
              seatnum: this.dialog.data.seatnum,
              desknum: this.dialog.data.desknum,
              deskid: this.dialog.data.deskid,
              ordernum: 0,
              status: 1,
            });
          }
          //如果是修改则需处理
          if(this.dialog.type == 'modify'){
            url = '/admin/shop/modDesk';
            params = {shopid:this.fontshopid, deskid:this.dialog.data.deskid, seatnum:this.dialog.data.seatnum, desknum:this.dialog.data.desknum, status:this.dialog.data.status};
            fn = (data) => {
              for (var i = 0; i < this.desklist.length; i++) {
                if(this.desklist[i].deskid == this.dialog.data.deskid){
                  this.desklist[i].seatnum = this.dialog.data.seatnum;
                  this.desklist[i].desknum = this.dialog.data.desknum;
                  this.desklist[i].status = this.dialog.data.status;
                  break;
                }
              }
            }
          }
          ajax.get(url, {params:params}).then((response) => {
            this.dialog.showdialog = false;
            if (response.data && response.data.code > 0) {
              fn(response.data);
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
    //门店端
    if(!this.isysadmin){
      this.shopid = this.shopinfo?this.shopinfo.id:'';
    }else{
      this.shopid = this.defshopid;
    }
    //获取店铺信息
    this.getDineshopInfo(this.shopid, (fontshopid)=>{
      this.getDesklist(fontshopid);
    });
    
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
