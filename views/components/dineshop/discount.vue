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
          <el-button style="margin:-10px 10px 10px 0;" type="primary" :loading="false" @click.stop="showTimeslot()">编辑时间段</el-button>
        </el-row>
        <el-tabs v-model="activename" @tab-click="handleClick">
          <el-tab-pane label="菜肴管理" name="food"></el-tab-pane>
          <el-tab-pane label="放号管理" name="sell"></el-tab-pane>
          <el-tab-pane label="折扣管理" name="discount">
            <el-table :data="shopdata" style="width: 100%" class="discount-table">
              <el-table-column prop="timeslot" label="时间段\日期"></el-table-column>
              <el-table-column v-for="(item, index) in this.datelist" :label="item.date">
                <template scope="discount">
                  <el-button size="small" @click.stop="toDetailDiscount(discount.row,index)">{{discount.row.discountdata[index].discount.length?'查看':'新增'}}</el-button>
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
        :before-close="handleClose">
      <div style="max-height: 300px;overflow: auto">
        <el-row class="editor-dialog-row" v-for="(item,index) in timesoltlist">
          <span>{{item.timeslot}}</span>
          <span class="text-button" @click.stop="deleteTimeSlot(item.id)">删除</span>
        </el-row>
      </div>
      <span class="editor-dialog-add-btn" @click.stop="addtimeslotdialogvisible=true">新增时间段</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click.stop="editordialogvisible = false">取 消</el-button>
        <el-button type="primary" @click.stop="confirmTimeSlot">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
        class="discount-dialog"
        title="折扣信息"
        :visible.sync="discountdialogvisible"
        size="tiny"
        :before-close="handleClose">
      <el-row class="discount-dialog-row">
        <span>2017-05-12&nbsp;&nbsp;&nbsp;&nbsp;10:00-11:00</span>
        <span class="text-button" style="float: right;" @click.stop="adddialogvisible=true">编辑</span>
      </el-row>
      <el-table :data="shopdata" :border="true">
        <el-table-column prop="name" label="菜品名称" align="center"></el-table-column>
        <el-table-column prop="discount" label="折扣" align="center"></el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog
        class="discount-dialog"
        title="折扣信息"
        :visible.sync="adddialogvisible"
        size="tiny"
        :before-close="handleClose">
      <el-row class="discount-dialog-row">
        <span>2017-05-12&nbsp;&nbsp;&nbsp;&nbsp;10:00-11:00</span>
        <span class="text-button" style="float: right;margin-left: 20px;" @click.stop="adddialogvisible = false">完成</span>
        <span class="text-button" style="float: right;" @click.stop="inputdialogvisible=true">新增</span>
      </el-row>
      <el-table :data="shopdata" border="true">
        <el-table-column prop="name" label="菜品名称" align="center"></el-table-column>
        <el-table-column prop="discount" label="折扣" align="center"></el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog
        title="新增折扣信息"
        :visible.sync="inputdialogvisible"
        size="tiny"
        :before-close="handleClose">
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
        <el-button type="primary" @click.stop="inputdialogvisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
        title="新增时间段"
        :visible.sync="addtimeslotdialogvisible"
        size="tiny"
        :before-close="handleClose">
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
        <el-button type="primary" @click.stop="addTimeSlot">确 定</el-button>
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
      shopdata:[
       {
          timeslot: "10:00-11:00",
          discountdata:[
           {
              date: "2017-05-16",
              discount:[]
            },
           {
              date: "2017-05-17",
              discount:[]
            },
           {
              date: "2017-05-18",
              discount:[]
            },
           {
              date: "2017-05-19",
              discount:[]
            },
           {
              date: "2017-05-20",
              discount:[]
            },
           {
              date: "2017-05-21",
              discount:[]
            },
           {
              date: "2017-05-22",
              discount:[]
            }
          ]
        },
       {
          timeslot: "11:00-12:00",
          discountdata:[
           {
              date: "2017-05-16",
              discount:[]
            },
           {
              date: "2017-05-17",
              discount:[]
            },
           {
              date: "2017-05-18",
              discount:[]
            },
           {
              date: "2017-05-19",
              discount:[]
            },
           {
              date: "2017-05-20",
              discount:[]
            },
           {
              date: "2017-05-21",
              discount:[]
            },
           {
              date: "2017-05-22",
              discount:[]
            }
          ]
        },
       {
          timeslot: "12:00-13:00",
          discountdata:[
           {
              date: "2017-05-16",
              discount:[
               {
                  id: "3",
                  dishesid: "3",
                  dishesname: "外婆菜",
                  type: "1",
                  disnum: "0.40",
                  addtime: "2017-05-14 18:04:25"
                }
              ]
            },
           {
              date: "2017-05-17",
              discount:[]
            },
           {
              date: "2017-05-18",
              discount:[]
            },
           {
              date: "2017-05-19",
              discount:[]
            },
           {
              date: "2017-05-20",
              discount:[]
            },
           {
              date: "2017-05-21",
              discount:[]
            },
           {
              date: "2017-05-22",
              discount:[]
            }
          ]
        },
       {
          timeslot: "13:00-14:00",
          discountdata:[
           {
              date: "2017-05-16",
              discount:[]
            },
           {
              date: "2017-05-17",
              discount:[]
            },
           {
              date: "2017-05-18",
              discount:[]
            },
           {
              date: "2017-05-19",
              discount:[]
            },
           {
              date: "2017-05-20",
              discount:[]
            },
           {
              date: "2017-05-21",
              discount:[]
            },
           {
              date: "2017-05-22",
              discount:[]
            }
          ]
        },
       {
          timeslot: "14:00-15:00",
          discountdata:[
           {
              date: "2017-05-16",
              discount:[]
            },
           {
              date: "2017-05-17",
              discount:[]
            },
           {
              date: "2017-05-18",
              discount:[]
            },
           {
              date: "2017-05-19",
              discount:[]
            },
           {
              date: "2017-05-20",
              discount:[]
            },
           {
              date: "2017-05-21",
              discount:[]
            },
           {
              date: "2017-05-22",
              discount:[]
            }
          ]
        },
       {
          timeslot: "15:00-16:00",
          discountdata:[
           {
              date: "2017-05-16",
              discount:[]
            },
           {
              date: "2017-05-17",
              discount:[
               {
                  id: "4",
                  dishesid: "4",
                  dishesname: "红烧鱼块",
                  type: "1",
                  disnum: "0.50",
                  addtime: "2017-05-14 18:04:26"
                }
              ]
            },
           {
              date: "2017-05-18",
              discount:[]
            },
           {
              date: "2017-05-19",
              discount:[]
            },
           {
              date: "2017-05-20",
              discount:[]
            },
           {
              date: "2017-05-21",
              discount:[
               {
                  id: "8",
                  dishesid: "1",
                  dishesname: "葱香油焖大虾",
                  type: "2",
                  disnum: "0.90",
                  addtime: "2017-05-14 18:04:36"
                }
              ]
            },
           {
              date: "2017-05-22",
              discount:[]
            }
          ]
        },
       {
          timeslot: "16:00-17:00",
          discountdata:[
           {
              date: "2017-05-16",
              discount:[]
            },
           {
              date: "2017-05-17",
              discount:[]
            },
           {
              date: "2017-05-18",
              discount:[
               {
                  id: "5",
                  dishesid: "5",
                  dishesname: "绝味炒田螺",
                  type: "1",
                  disnum: "0.60",
                  addtime: "2017-05-14 18:04:29"
                }
              ]
            },
           {
              date: "2017-05-19",
              discount:[]
            },
           {
              date: "2017-05-20",
              discount:[]
            },
           {
              date: "2017-05-21",
              discount:[]
            },
           {
              date: "2017-05-22",
              discount:[]
            }
          ]
        },
       {
          timeslot: "17:00-18:00",
          discountdata:[
           {
              date: "2017-05-16",
              discount:[]
            },
           {
              date: "2017-05-17",
              discount:[]
            },
           {
              date: "2017-05-18",
              discount:[]
            },
           {
              date: "2017-05-19",
              discount:[
               {
                  id: "6",
                  dishesid: "6",
                  dishesname: "干锅啤酒鸭",
                  type: "1",
                  disnum: "0.70",
                  addtime: "2017-05-14 18:04:32"
                }
              ]
            },
           {
              date: "2017-05-20",
              discount:[]
            },
           {
              date: "2017-05-21",
              discount:[]
            },
           {
              date: "2017-05-22",
              discount:[]
            }
          ]
        },
       {
          timeslot: "18:00-19:00",
          discountdata:[
           {
              date: "2017-05-16",
              discount:[]
            },
           {
              date: "2017-05-17",
              discount:[]
            },
           {
              date: "2017-05-18",
              discount:[]
            },
           {
              date: "2017-05-19",
              discount:[]
            },
           {
              date: "2017-05-20",
              discount:[
               {
                  id: "7",
                  dishesid: "7",
                  dishesname: "凉拌牛肉",
                  type: "1",
                  disnum: "0.80",
                  addtime: "2017-05-14 18:04:34"
                }
              ]
            },
           {
              date: "2017-05-21",
              discount:[]
            },
           {
              date: "2017-05-22",
              discount:[]
            }
          ]
        },
       {
          timeslot: "19:00-20:00",
          discountdata:[
           {
              date: "2017-05-16",
              discount:[]
            },
           {
              date: "2017-05-17",
              discount:[]
            },
           {
              date: "2017-05-18",
              discount:[]
            },
           {
              date: "2017-05-19",
              discount:[]
            },
           {
              date: "2017-05-20",
              discount:[]
            },
           {
              date: "2017-05-21",
              discount:[]
            },
           {
              date: "2017-05-22",
              discount:[]
            }
          ]
        },
       {
          timeslot: "20:00-21:00",
          discountdata:[
           {
              date: "2017-05-16",
              discount:[]
            },
           {
              date: "2017-05-17",
              discount:[]
            },
           {
              date: "2017-05-18",
              discount:[]
            },
           {
              date: "2017-05-19",
              discount:[]
            },
           {
              date: "2017-05-20",
              discount:[]
            },
           {
              date: "2017-05-21",
              discount:[]
            },
           {
              date: "2017-05-22",
              discount:[]
            }
          ]
        }
      ],
      editordialogvisible: false,
      discountdialogvisible: false,
      adddialogvisible: false,
      inputdialogvisible: false,
      addtimeslotdialogvisible: false,
      addtimeslot:{
        starttime:'',
        endtime:''
      },
      addedtimeslot:[],
      deletetimeslot:[],
      adddiscountdata:{
        name:'',
        discount:''
      },


      timesoltlist: [],
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    confirmTimeSlot() {
      this.editordialogvisible = false;
      let item = {};
      for(let i=0;this.addedtimeslot[i];i++){
        item.timeslot = this.addedtimeslot[i].timeslot;
        item.discountdata = [];
        for(let j=0;this.datelist[j];j++){
          item.discountdata.push({
            date: this.datelist[j].date,
            discount:[]
          });
        }
        this.shopdata.push(item);
      };
      this.addedtimeslot = [];
    },
    toDetailDiscount(data,index){
      let discountdata = data.discountdata[index].discount;
      console.log(JSON.stringify(discountdata));

    },
    handleClose(done) {
      console.log('关闭弹窗');
      done();
    },
    showTimeslot(){
      this.editordialogvisible = true;
      this.timesoltlist = [];
      ajax.get('/admin/shop/getDiscountTimeslot', {params:{ indicator:{async: true} }}).then((response) => {
        if (response.data && response.data.code > 0) {
          for (var i = 0; i < response.data.list.length; i++) {
            let timeslot = response.data.list[i];
            this.timesoltlist.push({id: timeslot.id, timeslot: timeslot.startime.slice(0,5)+'-'+timeslot.endtime.slice(0,5)});
          }
        } else {
          this.$message.error(response.data.msg);
        }
      }).catch((e) => {
        this.$message.error(e.toString());
      });
    },
    addTimeSlot(){
      this.addtimeslotdialogvisible = false;
      this.timesoltlist.push({
        timeslot:this.addtimeslot.starttime + '-' + this.addtimeslot.endtime
      });
      this.addedtimeslot.push({
        timeslot:this.addtimeslot.starttime + '-' + this.addtimeslot.endtime
      });
    },
    deleteTimeSlot(id){
      for (var i = 0; i < this.timesoltlist.length; i++) {
        if(this.timesoltlist[i].id == id) this.timesoltlist.splice(i,1);
      }
    },
  },
  computed: {
    ...mapGetters({

    }),
    datelist() {
      let date= [];
      for(let i=0;this.shopdata[0].discountdata[i];i++){
        date.push({
          date:this.shopdata[0].discountdata[i].date
        });
      };
      return date;
    }
  },
  created () {
    
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
