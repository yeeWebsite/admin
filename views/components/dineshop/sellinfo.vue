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
            <el-button type="primary" style="float: right; margin-right: 16px;" @click.stop="showTimeslot()">编辑时间段</el-button>
          </el-col>
          <el-col :span="24" class="searchbox" v-else>
            <span style="margin-left:20px; line-height:36px;">门店：{{shopname?shopname:'-'}}</span>
            <el-button type="primary" style="float: right; margin-right: 16px;" @click.stop="showTimeslot()">编辑时间段</el-button>
          </el-col>
        </el-row>
        <el-table :data="shopdata" style="width: 100%" class="sellinfo-table" id="loading">
          <el-table-column prop="timeslot" label="时间段\日期"></el-table-column>
          <el-table-column v-for="(item, index) in this.datelist" :label="item.date">
            <template scope="scope">
              <el-badge :value="scope.row.selldata[index].sellinfo.length" class="item" v-if="scope.row.selldata[index].sellid">
                <el-button size="small" @click.stop="toDetailSell(scope.row,index)">查看</el-button>
              </el-badge>
              <el-badge v-else class="item">
                <el-button size="small" @click.stop="toDetailSell(scope.row,index)">新增</el-button>
              </el-badge>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-dialog class="sellinfo-dialog" title="放号信息" :visible.sync="selldialogvisible"
        size="tiny"
        :close-on-click-modal="false">
      <el-row class="sellinfo-dialog-row">
        <span>{{currentdate.replace(/-/g, '/')}} ({{currenttimeslot.timeslot}})</span>
        <span class="text-button" size="small" style="float: right;" @click.stop="selldialogvisible=false; modifydialogvisible=true;">编辑</span>
        <span class="text-button" size="small" style="float: right; margin-right: 10px;" @click.stop="selldialogvisible=false; inputdialogvisible=true;">新增</span>
      </el-row>
      <el-table :data="currentselldishlist.selldishlist">
        <el-table-column prop="deskname" label="桌型" align="center"></el-table-column>
        <el-table-column prop="desknum" label="总数量" align="center"></el-table-column>
        <el-table-column prop="ordernum" label="已预订" align="center"></el-table-column>
        <el-table-column prop="openum" label="放号数" align="center"></el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog class="sellinfo-dialog" title="编辑放号信息" :visible.sync="modifydialogvisible" size="tiny" :close-on-click-modal="false">
      <el-row class="sellinfo-dialog-row">
        <span>{{currentdate.replace(/-/g, '/')}} ({{currenttimeslot.timeslot}})</span>
        <span class="text-button" size="small" style="float: right;margin-left: 20px;" @click.stop="modifySellList()">完成</span>
      </el-row>
      <el-table :data="currentselldishlist.selldishlist" ref="editsell">
        <el-table-column prop="deskname" label="桌型" align="center"></el-table-column>
        <el-table-column prop="desknum" label="总数量" align="center"></el-table-column>
        <el-table-column prop="ordernum" label="已预订" align="center"></el-table-column>
        <el-table-column label="放号数" align="center">
          <template scope="scope" align="center">
            <el-input v-model="scope.row.openum" size="mini"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="-" align="center">
          <template scope="scope"><span class="el-icon-circle-cross" style="color:#FF4949; cursor:pointer;" @click.stop="delSell(scope.row.tableid)"></span></template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog title="新增放号信息" :visible.sync="inputdialogvisible" size="tiny" :close-on-click-modal="false">
      <el-row class="sellinfo-dialog-row">
        <span style="margin-bottom: 10px;">{{currentdate.replace(/-/g, '/')}} ({{currenttimeslot.timeslot}})</span>
      </el-row>
      <el-form ref="addselldata" :model="addselldata" label-width="80px" label-position="right">
        <el-form-item label="桌型选择:">
          <el-select v-model="addselldata.tableid" placeholder="请选择">
            <el-option v-for="table in tablelist" :key="table.id" :label="table.seatnum+'人桌（总数：'+table.desknum+'已定：'+table.ordernum+'）'" :value="table.id" :disabled="checkHasDish(currenttimeslot.slotid, currentdate, table.id)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="放号:">
          <el-input v-model="addselldata.openum" placeholder="请输入放号(整数)"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click.stop="inputdialogvisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click.stop="addSellInfo(currenttimeslot.slotid, currentdate)">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="新增时间段" :visible.sync="addtimeslotdialogvisible" size="tiny" :close-on-click-modal="false">
      <el-row>
        新增时间段:
        <el-time-select class="add-time-slot-select" placeholder="起始时间" v-model="addtimeslot.starttime" :picker-options="{start: '00:00', step: '00:30', end: '23:00', maxTime: addtimeslot.endtime }">
        </el-time-select>
        <el-time-select class="add-time-slot-select" placeholder="结束时间" v-model="addtimeslot.endtime" :picker-options="{ start: '00:00', step: '00:30', end: '23:00', minTime: addtimeslot.starttime }">
        </el-time-select>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click.stop="addtimeslotdialogvisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click.stop="addTimeSlot()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog class="sellinfo-dialog" title="编辑时间段" :visible.sync="editordialogvisible" size="tiny" :close-on-click-modal="false">
      <div style="max-height: 300px;overflow: auto">
        <el-row class="editor-dialog-row" v-for="(item,index) in timesoltlist">
          <span>{{item.timeslot}}</span>
          <span class="text-button" size="small" @click.stop="deleteTimeSlot(item.id)">删除</span>
        </el-row>
      </div>
      <span class="editor-dialog-add-btn" @click.stop="addtimeslotdialogvisible=true">新增时间段</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click.stop="confirmTimeSlot()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { ajax } from "@/libs/ajax"
import { mapGetters, mapActions } from 'vuex'
import { timefilter } from "@/filters/timefilter"

export default {
  data() {
    return {
      search: "",
      shopid: "",
      shopname: "",
      tablelist: [],
      activename: 'sellinfo',
      shopdata: [],
      datelist: [],
      sellinfo: {}, //解析后的放号信息
      editordialogvisible: false,
      selldialogvisible: false,
      modifydialogvisible: false,
      inputdialogvisible: false,
      addtimeslotdialogvisible: false,
      addtimeslot:{
        starttime:'',
        endtime:''
      },
      addselldata:{
        tableid: '',
        openum:''
      },
      timesoltlist: [],
      currentselldishlist:{
        sellid: '',
        selldishlist: []
      },
      currentdate:'',
      currenttimeslot:{},
    }
  },
  methods: {
    //搜索店铺
    searchDineshop(){
      this.getDineshopInfo(this.search);
    },
    //获取店铺信息
    getDineshopInfo(shopid){
      if(shopid){
        ajax.get('/admin/shop/getDineshopInfo', {params:{ shopid:shopid, indicator:{async:true} }}).then((response) => {
          if (response.data && response.data.code > 0) {
            const info = response.data.info;
            this.shopid = info.id;
            this.shopname = info.shopname;
            this.getDineshopSell();
            this.getTableInfo();
          } else {
            this.$message.error(response.data.msg);
          }
        }).catch((e) => {
          this.$message.error(e.toString());
        });
      }
    },
    //获取店铺桌型信息
    getTableInfo(){
      if(this.shopid){
        ajax.get('/admin/shop/getDesklist', {params:{ shopid:this.shopid, indicator:{async:true} }}).then((response) => {
          if (response.data && response.data.code > 0) {
            this.tablelist = response.data.list;
          } else {
            this.$message.error(response.data.msg);
          }
        }).catch((e) => {
          this.$message.error(e.toString());
        });
      }
    },
    //获取放号信息
    getDineshopSell(){
      if(this.shopid){
        ajax.get('/admin/shop/getDineshopSell', {params:{ shopid:this.shopid}}).then((response) => {
          if (response.data && response.data.code > 0) {
            this.shopdata = response.data.list;
            this.datelist = [];
            for(let i=0;this.shopdata[0].selldata[i];i++){
              this.datelist.push({
                date:this.shopdata[0].selldata[i].date
              });
            };
            //解析放号字段信息
            const sellinfo = {};
            for (var i = 0; i < this.shopdata.length; i++) {
              const info = this.shopdata[i];
              for (var j = 0; j < info.selldata.length; j++) {
                const data = info.selldata[j];
                if(data.sellid){
                  sellinfo[info.slotid+'|'+data.date] = {
                    "sellid": data.sellid,
                    "sellinfo": data.sellinfo,
                  }
                }
              }
            }
            this.sellinfo = sellinfo;
          } else {
            this.$message.error(response.data.msg);
          }
        }).catch((e) => {
          this.$message.error(e.toString());
        });
      }
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    confirmTimeSlot() {
      this.editordialogvisible = false;
      this.shopdata = [];
      this.getDineshopSell();
    },
    toDetailSell(data,index){
      let selldata = data.selldata[index];
      this.currentdate = selldata.date;
      this.currenttimeslot.slotid = data.slotid;
      this.currenttimeslot.timeslot = data.timeslot;
      if(selldata.sellid){
        this.currentselldishlist.sellid = selldata.sellid;
        this.currentselldishlist.selldishlist = selldata.sellinfo;
        this.selldialogvisible=true;
      }else{
        this.inputdialogvisible=true;
      }
    },
    showTimeslot(){
      this.editordialogvisible = true;
      this.timesoltlist = [];
      ajax.get('/admin/shop/getDiscountTimeslot', {params:{ indicator:{async: true} }}).then((response) => {
        if (response.data && response.data.code > 0) {
          for (let i = 0; i < response.data.list.length; i++) {
            let timeslot = response.data.list[i];
            this.timesoltlist.push({id: timeslot.id, timeslot: timeslot.timeslot});
          }
        } else {
          this.$message.error(response.data.msg);
        }
      }).catch((e) => {
        this.$message.error(e.toString());
      });
    },
    addTimeSlot(){
      ajax.get('/admin/shop/addDiscountTimeslot', {params:{ timeslot:this.addtimeslot.starttime+'-'+this.addtimeslot.endtime}}).then((response) => {
        if (response.data && response.data.code > 0) {
          let slotid = response.data.info.slotid;
          this.timesoltlist.push({id: slotid,timeslot:this.addtimeslot.starttime+'-'+this.addtimeslot.endtime});
          this.addtimeslotdialogvisible = false;
          this.addtimeslot.starttime = this.addtimeslot.endtime = '';
        } else {
          this.$message.error(response.data.msg);
        }
      }).catch((e) => {
        this.$message.error(e.toString());
      });
    },
    deleteTimeSlot(id){
      let timesolt = this.timesoltlist;
      this.$confirm('此操作将永久删除该数据，且会同时删除该时间段的所有放号信息，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false,
        callback: function (action,instance) {
          if(action == 'confirm'){
            ajax.get('/admin/shop/delDiscountTimeslot', {params:{ slotid:id}}).then((response) => {
              if (response.data && response.data.code > 0) {
                for (let i = 0; i < timesolt.length; i++) {
                  if(timesolt[i].id == id){timesolt.splice(i,1)};
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
    },
    //根据时间段ID，日期，菜品ID判断当前菜单是否已经添加
    checkHasDish(slotid, date, tableid){
      let isresult = false;
      if(slotid && date && tableid){
        if(this.sellinfo[slotid+'|'+date]){
          const sellinfo = this.sellinfo[slotid+'|'+date].sellinfo;
          for (var i = 0; i < sellinfo.length; i++) {
            if(sellinfo[i].tableid == tableid){
              isresult = true;
              break;
            }
          }
        }
      }
      return isresult;
    },
    //添加放号信息
    addSellInfo(){
      const openum = parseInt(this.addselldata.openum);
      const tableid = this.addselldata.tableid;
      if(!tableid) {
        this.$message.error('请先选择桌型');
        return false;
      }
      if(openum == NaN){
        this.$message.error('放号数据格式不对');
        return false;
      }
      for (var i = 0; i < this.tablelist.length; i++) {
        if(this.tablelist[i].id == tableid){
          const desknum = parseInt(this.tablelist[i].desknum); //桌型总数
          const ordernum = parseInt(this.tablelist[i].ordernum); //已预订数量
          if(openum > desknum - ordernum){
            this.$message.error('放号数不能大于剩余可放号数');
            return false;
          }
          break;
        }
      }
      const params = { shopid:this.shopid,date:this.currentdate,slotid:this.currenttimeslot.slotid,sellinfo:tableid+'@'+openum };
      ajax.get('/admin/shop/addDineshopSell', {params:params}).then((response) => {
        if (response.data && response.data.code > 0) {
          this.inputdialogvisible = false;
          this.getDineshopSell();
        } else {
          this.$message.error(response.data.msg);
        }
      }).catch((e) => {
        this.$message.error(e.toString());
      });
    },
    //删除菜品信息
    delSell(tableid){
      let list = this.currentselldishlist.selldishlist;
      for (var i = 0; i < list.length; i++) {
        if(tableid == list[i].tableid){
          list.splice(i, 1);
          break;
        }
      }
      this.currentselldishlist.selldishlist = list;
    },
    //修改放号信息
    modifySellList(){
      const params = {"id": this.currentselldishlist.sellid};
      const list = this.currentselldishlist.selldishlist;
      const sellinfo = [];
      for (var i = 0; i < list.length; i++) {
        const openum = parseInt(list[i].openum);
        const desknum = parseInt(list[i].desknum);
        const ordernum = parseInt(list[i].ordernum);
        if(openum == NaN){
          this.$message.error('放号数格式不对');
          return false;
          break;
        }
        if(openum > desknum - ordernum){
          this.$message.error('放号数不能大于剩余可放号数');
          return false;
          break;
        }
        sellinfo.push(list[i].tableid+'@'+openum);
      }
      params.sellinfo = sellinfo.join('$');
      ajax.get('/admin/shop/modDineshopSell', {params:params}).then((response) => {
        if (response.data && response.data.code > 0) {
          this.modifydialogvisible = false;
          this.getDineshopSell();
        } else {
          this.$message.error(response.data.msg);
        }
      }).catch((e) => {
        this.$message.error(e.toString());
      });
    },
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
    this.getDineshopInfo(this.shopid);
  },
  destroyed(){
    
  },
  mounted(){
    
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
  .sellinfo-shop-name{margin: 10px;font-weight: bold;}
  .sellinfo-table tr{height: 60px;}
  .sellinfo-table .cell{line-height: 60px;}
  .sellinfo-table .el-badge{line-height: 24px;}
  .sellinfo-dialog{text-align: center;}
  .editor-dialog-row{border-bottom: 1px solid #ccc;padding: 10px 0;}
  .editor-dialog-row span{display: inline-block;width: 40%;}
  .editor-dialog-add-btn{display: inline-block;margin-top: 20px;color: #20a0ff;cursor: pointer;}
  .text-button{color: #20a0ff;cursor: pointer;}
  .sellinfo-dialog-row{margin-bottom: 10px;text-align: left}
  .sellinfo-dialog-row span{display: inline-block;}
  .add-time-slot-select{width: 100px!important;}
  .sellinfo-dialog .el-dialog--tiny{width: 40%;}
</style>
