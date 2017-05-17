<template>
  <div class="content">
    <headerComponent></headerComponent>
    <el-row class="tac" :gutter="10">
      <el-col :span="4"><leftComponent></leftComponent></el-col>
      <el-col :span="20">
        <breadtitleComponent></breadtitleComponent>
        <!-- 页面输入内容 -->
        <el-row class="discount-shop-name">门店：{{shopinfo.shopname}}</el-row>
        <el-row type="flex" justify="end">
          <el-button style="margin:-10px 10px 10px 0;" type="primary" @click.stop="showTimeslot()">编辑时间段</el-button>
        </el-row>
        <el-tabs v-model="activename" @tab-click="handleClick">
          <el-tab-pane label="菜肴管理" name="food"></el-tab-pane>
          <el-tab-pane label="放号管理" name="sell"></el-tab-pane>
          <el-tab-pane label="折扣管理" name="discount">
            <el-table :data="shopdata" style="width: 100%" class="discount-table">
              <el-table-column prop="timeslot" label="时间段\日期"></el-table-column>
              <el-table-column v-for="(item, index) in this.datelist" :label="item.date">
                <template scope="scope">
                  <el-button size="small" @click.stop="toDetailDiscount(scope.row,index)">{{scope.row.discountdata[index].discid?'查看':'新增'}}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="桌型管理" name="table"></el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    <el-dialog
        class="discount-dialog"
        title="编辑时间段"
        :visible.sync="editordialogvisible"
        size="tiny"
        :close-on-click-modal="false">
      <div style="max-height: 300px;overflow: auto">
        <el-row class="editor-dialog-row" v-for="(item,index) in timesoltlist">
          <span>{{item.timeslot}}</span>
          <span class="text-button" @click.stop="deleteTimeSlot(item.id)">删除</span>
        </el-row>
      </div>
      <span class="editor-dialog-add-btn" @click.stop="addtimeslotdialogvisible=true">新增时间段</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click.stop="confirmTimeSlot()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
        class="discount-dialog"
        title="折扣信息"
        :visible.sync="discountdialogvisible"
        size="tiny"
        :close-on-click-modal="false">
      <el-row class="discount-dialog-row">
        <span>{{currentdate}}&nbsp;&nbsp;&nbsp;&nbsp;{{currenttimeslot.timeslot}}</span>
        <span class="text-button" style="float: right;" @click.stop="discountdialogvisible=false,modifydialogvisible=true">编辑</span>
      </el-row>
      <el-table :data="currentdiscountdishlist.discountdishlist">
        <el-table-column prop="dishname" label="菜品名称" align="center"></el-table-column>
        <el-table-column :formatter="formatterDiscount" label="折扣" align="center"></el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog
        class="discount-dialog"
        title="编辑折扣信息"
        :visible.sync="modifydialogvisible"
        size="tiny"
        :close-on-click-modal="false">
      <el-row class="discount-dialog-row">
        <span>{{currentdate}}&nbsp;&nbsp;&nbsp;&nbsp;{{currenttimeslot.timeslot}}</span>
        <span class="text-button" style="float: right;margin-left: 20px;" @click.stop="modifyDiscountList()">完成</span>
        <span class="text-button" style="float: right;" @click.stop="inputdialogvisible=true">新增</span>
      </el-row>
      <el-table :data="currentdiscountdishlist.discountdishlist">
        <el-table-column prop="dishname" label="菜品名称" align="center"></el-table-column>
        <el-table-column :formatter="formatterDiscount" label="折扣" align="center"></el-table-column>
        <el-table-column align="center">
          <template><el-icon name="circle-cross"></el-icon></template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog
        title="新增折扣信息"
        :visible.sync="inputdialogvisible"
        size="tiny"
        :close-on-click-modal="false">
      <el-row class="discount-dialog-row">
        <span style="margin-bottom: 10px;">{{currentdate}}&nbsp;&nbsp;&nbsp;&nbsp;{{currenttimeslot.timeslot}}</span>
      </el-row>
      <el-form ref="adddiscountdata" :model="adddiscountdata" label-width="80px" label-position="right">
        <el-form-item label="菜品名称:">
          <el-input v-model="adddiscountdata.name" placeholder="请输入菜品名称"></el-input>
        </el-form-item>
        <el-form-item label="折扣:">
          <el-input v-model="adddiscountdata.discount" placeholder="请输入折扣"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click.stop="inputdialogvisible = false">取 消</el-button>
        <el-button type="primary" @click.stop="addDiscountDish()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
        title="新增时间段"
        :visible.sync="addtimeslotdialogvisible"
        size="tiny"
        :close-on-click-modal="false">
      <el-row>
        新增时间段:
        <el-time-select
          class="add-time-slot-select"
          placeholder="起始时间"
          v-model="addtimeslot.starttime"
          :picker-options="{
            start: '00:00',
            step: '01:00',
            end: '23:00',
            maxTime: addtimeslot.endtime
          }">
        </el-time-select>
        <el-time-select
          class="add-time-slot-select"
          placeholder="结束时间"
          v-model="addtimeslot.endtime"
          :picker-options="{
            start: '00:00',
            step: '01:00',
            end: '23:00',
            minTime: addtimeslot.starttime
          }">
        </el-time-select>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click.stop="addtimeslotdialogvisible = false">取 消</el-button>
        <el-button type="primary" @click.stop="addTimeSlot()">确 定</el-button>
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
      shopinfo:{
        shopid: "1",
        shopname: "深运潮州粥",
        shopicon: "http://p1.meituan.net/200.0/deal/15c8885d14f18774938a88752f08bb1e49194.jpg@118_0_466_466a%7C267h_267w_2e_90Q",
        shopaddress: "中银花园1号楼B-8（中银大厦旁）"
      },
      activename: 'discount',
      shopdata: [],
      datelist: [],
      editordialogvisible: false,
      discountdialogvisible: false,
      modifydialogvisible: false,
      inputdialogvisible: false,
      addtimeslotdialogvisible: false,
      addtimeslot:{
        starttime:'',
        endtime:''
      },
      adddiscountdata:{
        name:'',
        discount:''
      },
      timesoltlist: [],
      currentdiscountdishlist:{},
      currentdate:'',
      currenttimeslot:{}
    }
  },
  methods: {
    getDineshopDiscount(){
      ajax.get('/admin/shop/getDineshopDiscount', {params:{ shopid:this.shopinfo.shopid}}).then((response) => {
        if (response.data && response.data.code > 0) {
          this.shopdata = response.data.list;
          for(let i=0;this.shopdata[0].discountdata[i];i++){
            this.datelist.push({
              date:this.shopdata[0].discountdata[i].date
            });
          };
        } else {
          this.$message.error(response.data.msg);
        }
      }).catch((e) => {
        this.$message.error(e.toString());
      });
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    confirmTimeSlot() {
      this.editordialogvisible = false;
      this.shopdata = [];
      getDineshopDiscount();
    },
    toDetailDiscount(data,index){
      let discountdata = data.discountdata[index];
      this.currentdate = discountdata.date;
      this.currenttimeslot.id = data.id;
      this.currenttimeslot.timeslot = data.timeslot;
      if(discountdata.discid){
        this.currentdiscountdishlist.discid = discountdata.discid;
        this.currentdiscountdishlist.discountdishlist=discountdata.discount;
        this.discountdialogvisible=true;
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
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
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
    formatterDiscount(row,column){
      return row.num * 10;
    },
    addDiscountDish(){
      ajax.get('/admin/shop/addDineshopDiscount', {params:{ shopid:this.shopinfo.shopid,date:this.currentdate,timeslot:this.currenttimeslot.id,discount:this.adddiscountdata.discount+'|1'}}).then((response) => {
        if (response.data && response.data.code > 0) {
          this.inputdialogvisible = false;
          getDineshopDiscount();
        } else {
          this.$message.error(response.data.msg);
        }
      }).catch((e) => {
        this.$message.error(e.toString());
      });
    },
    modifyDiscountList(){
      ajax.get('/admin/shop/modDineshopDiscount', {params:{id:this.currentdiscountdishlist.discid,discount:''}}).then((response) => {
        if (response.data && response.data.code > 0) {
          this.modifydialogvisible = false;
          getDineshopDiscount();
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

    }),
  },
  created () {
    
  },
  destroyed(){
    
  },
  mounted(){
    ajax.get('/admin/shop/getDineshopDiscount', {params:{ shopid:this.shopinfo.shopid}}).then((response) => {
      if (response.data && response.data.code > 0) {
        this.shopdata = response.data.list;
        for(let i=0;this.shopdata[0].discountdata[i];i++){
          this.datelist.push({
            date:this.shopdata[0].discountdata[i].date
          });
        };
      } else {
        this.$message.error(response.data.msg);
      }
    }).catch((e) => {
      this.$message.error(e.toString());
    });
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
  .discount-shop-name{margin: 10px;font-weight: bold;}
  .discount-table tr{height: 60px;}
  .discount-dialog{text-align: center;}
  .editor-dialog-row{border-bottom: 1px solid #ccc;padding: 10px 0;}
  .editor-dialog-row span{display: inline-block;width: 40%;}
  .editor-dialog-add-btn{display: inline-block;margin-top: 20px;color: #20a0ff;cursor: pointer;}
  .text-button{color: #20a0ff;cursor: pointer;}
  .discount-dialog-row{margin-bottom: 10px;text-align: left}
  .discount-dialog-row span{display: inline-block;}
  .add-time-slot-select{width: 100px!important;}
</style>
