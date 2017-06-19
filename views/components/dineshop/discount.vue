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
            <el-button type="primary" :loading="false" @click.stop="searchDineshop()">搜索</el-button>
            <span style="margin-left:20px;">门店：{{shopname?shopname:'-'}}</span>
            <el-button type="primary" style="float: right; margin-right: 16px;" @click.stop="showTimeslot()">编辑时间段</el-button>
          </el-col>
          <el-col :span="24" class="searchbox" v-else>
            <span style="margin-left:20px; line-height:36px;">门店：{{shopname?shopname:'-'}}</span>
            <el-button type="primary" style="float: right; margin-right: 16px;" @click.stop="showTimeslot()">编辑时间段</el-button>
          </el-col>
        </el-row>
        <el-table :data="shopdata" style="width: 100%" class="discount-table" id="loading">
          <el-table-column prop="timeslot" label="时间段\日期"></el-table-column>
          <el-table-column v-for="(item, index) in this.datelist" :label="item.date">
            <template scope="scope">
              <el-badge :value="scope.row.discountdata[index].discount.length" class="item" v-if="scope.row.discountdata[index].discid">
                <el-button size="small" @click.stop="toDetailDiscount(scope.row,index)">查看</el-button>
              </el-badge>
              <el-badge v-else class="item">
                <el-button size="small" @click.stop="toDetailDiscount(scope.row,index)">新增</el-button>
              </el-badge>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-dialog class="discount-dialog" title="折扣信息" :visible.sync="discountdialogvisible"
        size="tiny"
        :close-on-click-modal="false">
      <el-row class="discount-dialog-row">
        <span>{{currentdate.replace(/-/g, '/')}} ({{currenttimeslot.timeslot}})</span>
        <span class="text-button" size="small" style="float: right;" @click.stop="discountdialogvisible=false; modifydialogvisible=true;">编辑</span>
        <span class="text-button" size="small" style="float: right; margin-right: 10px;" @click.stop="discountdialogvisible=false; inputdialogvisible=true;">新增</span>
      </el-row>
      <el-table :data="currentdiscountdishlist.discountdishlist">
        <el-table-column prop="dishname" label="菜品名称" align="center"></el-table-column>
        <el-table-column :formatter="formatterDiscount" label="折扣" align="center"></el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog class="discount-dialog" title="编辑折扣信息" :visible.sync="modifydialogvisible" size="tiny" :close-on-click-modal="false">
      <el-row class="discount-dialog-row">
        <span>{{currentdate.replace(/-/g, '/')}} ({{currenttimeslot.timeslot}})</span>
        <span class="text-button" size="small" style="float: right;margin-left: 20px;" @click.stop="modifyDiscountList()">完成</span>
      </el-row>
      <el-table :data="currentdiscountdishlist.discountdishlist" ref="editdiscount">
        <el-table-column prop="dishname" label="菜品名称" align="center"></el-table-column>
        <el-table-column label="折扣" align="center">
          <template scope="scope" align="center">
            <el-input v-model="scope.row.num" size="mini"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="-" align="center">
          <template scope="scope"><span class="el-icon-circle-cross" style="color:#FF4949; cursor:pointer;" @click.stop="delDiscount(scope.row.dishid)"></span></template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog title="新增折扣信息" :visible.sync="inputdialogvisible" size="tiny" :close-on-click-modal="false">
      <el-row class="discount-dialog-row">
        <span style="margin-bottom: 10px;">{{currentdate.replace(/-/g, '/')}} ({{currenttimeslot.timeslot}})</span>
      </el-row>
      <el-form ref="adddiscountdata" :model="adddiscountdata" label-width="80px" label-position="right">
        <el-form-item label="菜品名称:">
          <el-select v-model="adddiscountdata.dishid" placeholder="请选择">
            <el-option v-for="dish in shopdishlist" :key="dish.id" :label="dish.dishesname" :value="dish.id" :disabled="checkHasDish(currenttimeslot.slotid, currentdate, dish.id)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="折扣:">
          <el-input v-model="adddiscountdata.num" placeholder="请输入折扣（1~10整数）"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click.stop="inputdialogvisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click.stop="addDiscountDish(currenttimeslot.slotid, currentdate)">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="新增时间段" :visible.sync="addtimeslotdialogvisible" size="tiny" :close-on-click-modal="false">
      <el-row>
        新增时间段:
        <el-time-select class="add-time-slot-select" placeholder="起始时间" v-model="addtimeslot.starttime" :picker-options="{start: '00:00', step: '01:00', end: '23:00', maxTime: addtimeslot.endtime }">
        </el-time-select>
        <el-time-select class="add-time-slot-select" placeholder="结束时间" v-model="addtimeslot.endtime" :picker-options="{ start: '00:00', step: '01:00', end: '23:00', minTime: addtimeslot.starttime }">
        </el-time-select>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click.stop="addtimeslotdialogvisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click.stop="addTimeSlot()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog class="discount-dialog" title="编辑时间段" :visible.sync="editordialogvisible" size="tiny" :close-on-click-modal="false">
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
      fontshopid: "",
      shopname: "",
      shopdishlist: [],
      activename: 'discount',
      shopdata: [],
      datelist: [],
      discount: {}, //解析后的折扣信息
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
        dishid: '',
        name:'',
        num:''
      },
      timesoltlist: [],
      currentdiscountdishlist:{
        discid: '',
        discountdishlist: []
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
            this.fontshopid = info.fontshopid;
            this.shopname = info.shopname;
            this.shopdishlist = info.disheslist;
            this.getDineshopDiscount();
          } else {
            this.$message.error(response.data.msg);
          }
        }).catch((e) => {
          this.$message.error(e.toString());
        });
      }
    },
    //获取折扣信息
    getDineshopDiscount(){
      this.datelist = [];
      this.shopdata = [];
      if(this.shopid){
        ajax.get('/admin/shop/getDineshopDiscount', {params:{ shopid:this.shopid}}).then((response) => {
          if (response.data && response.data.code > 0) {
            this.shopdata = response.data.list;
            for(let i=0;i<7;i++){
              this.datelist.push({
                date:timefilter(new Date().getTime() + i*1000*60*60*24, 'yyyy/mm/dd')
              });
            };
            //解析折扣字段信息
            const discount = {};
            for (var i = 0; i < this.shopdata.length; i++) {
              const info = this.shopdata[i];
              for (var j = 0; j < info.discountdata.length; j++) {
                const data = info.discountdata[j];
                if(data.discid){
                  discount[info.slotid+'|'+data.date] = {
                    "discid": data.discid,
                    "discount": data.discount,
                  }
                }
              }
            }
            this.discount = discount;
            console.log(this.discount);
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
      this.getDineshopDiscount();
    },
    toDetailDiscount(data,index){
      let discountdata = data.discountdata[index];
      this.currentdate = discountdata.date;
      this.currenttimeslot.slotid = data.slotid;
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
      this.$confirm('此操作将永久删除该数据，且会同时删除该时间段的所有折扣信息，是否继续？', '提示', {
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
    formatterDiscount(row){
      return row.num;
    },
    //根据时间段ID，日期，菜品ID判断当前菜单是否已经添加
    checkHasDish(slotid, date, dishid){
      let isresult = false;
      if(slotid && date && dishid){
        if(this.discount[slotid+'|'+date]){
          const discount = this.discount[slotid+'|'+date].discount;
          for (var i = 0; i < discount.length; i++) {
            if(discount[i].dishid == dishid){
              isresult = true;
              break;
            }
          }
        }
      }
      return isresult;
    },
    //添加菜品信息
    addDiscountDish(){
      const num = parseInt(this.adddiscountdata.num);
      const dishid = this.adddiscountdata.dishid;
      if(!dishid) {
        this.$message.error('请先选择菜品信息');
        return false;
      }
      if(num == NaN || num < 1 || num > 10){
        this.$message.error('折扣力度格式错误');
        return false;
      }
      const params = { shopid:this.fontshopid,date:this.currentdate,slotid:this.currenttimeslot.slotid,discount:dishid+'|1@'+num/10 }
      ajax.get('/admin/shop/addDineshopDiscount', {params:params}).then((response) => {
        if (response.data && response.data.code > 0) {
          this.inputdialogvisible = false;
          this.getDineshopDiscount();
          //this.getDineshopInfo(this.shopid);
        } else {
          this.$message.error(response.data.msg);
        }
      }).catch((e) => {
        this.$message.error(e.toString());
      });
    },
    //删除菜品信息
    delDiscount(dishid){
      let list = this.currentdiscountdishlist.discountdishlist;
      for (var i = 0; i < list.length; i++) {
        if(dishid == list[i].dishid){
          list.splice(i, 1);
          break;
        }
      }
      this.currentdiscountdishlist.discountdishlist = list;
    },
    //修改折扣信息
    modifyDiscountList(){
      const params = {"id": this.currentdiscountdishlist.discid};
      const list = this.currentdiscountdishlist.discountdishlist;
      const discount = [];
      for (var i = 0; i < list.length; i++) {
        const num = parseInt(list[i].num);
        if(num == NaN || num < 1 || num > 10){
          this.$message.error('折扣力度格式错误');
          return false;
          break;
        }
        discount.push(list[i].dishid+'|1@'+(list[i].num/10));
      }
      params.discount = discount.join('$');
      ajax.get('/admin/shop/modDineshopDiscount', {params:params}).then((response) => {
        if (response.data && response.data.code > 0) {
          this.modifydialogvisible = false;
          this.getDineshopDiscount();
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
  .discount-shop-name{margin: 10px;font-weight: bold;}
  .discount-table tr{height: 60px;}
  .discount-table .cell{line-height: 60px;}
  .discount-table .el-badge{line-height: 24px;}
  .discount-dialog{text-align: center;}
  .editor-dialog-row{border-bottom: 1px solid #ccc;padding: 10px 0;}
  .editor-dialog-row span{display: inline-block;width: 40%;}
  .editor-dialog-add-btn{display: inline-block;margin-top: 20px;color: #20a0ff;cursor: pointer;}
  .text-button{color: #20a0ff;cursor: pointer;}
  .discount-dialog-row{margin-bottom: 10px;text-align: left}
  .discount-dialog-row span{display: inline-block;}
  .add-time-slot-select{width: 100px!important;}
</style>
