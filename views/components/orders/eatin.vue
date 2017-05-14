<template>
  <div class="content">
    <headerComponent></headerComponent>
    <el-row class="tac" :gutter="10">
      <el-col :span="4"><leftComponent></leftComponent></el-col>
      <el-col :span="20">
        <breadtitleComponent></breadtitleComponent>
        <el-row>
          <el-col :span="24" class="searchbox">
            选择日期范围：<el-date-picker v-model="daterange" format="yyyy/MM/dd" type="daterange" align="right" placeholder="选择日期范围" :picker-options="datePickerOptions"></el-date-picker>&nbsp;&nbsp;&nbsp;&nbsp;
            输入店铺名：<el-input class="searchinput" placeholder="店铺名" icon="search" v-model="searchname"></el-input>&nbsp;&nbsp;
            <el-button type="primary" :loading="false" @click.stop="getOrderlist">搜索</el-button>
          </el-col>
        </el-row>
        <el-table :data="orderlist" empty-text="暂无数据..." style="width: 100%" id="loading">
          <el-table-column type="index" label="序号" width="64"></el-table-column>
          <el-table-column prop="orderid" label="订单号" width="120"></el-table-column>
          <el-table-column label="菜肴名称" width="200" class-name="noticeinfo">
            <template scope="scope"><span v-html="scope.row.orderdetail"></span></template>
          </el-table-column>
          <el-table-column prop="addtime" label="订单时间" width="176"></el-table-column>
          <el-table-column prop="allmoney" label="价格" class-name="noticeinfo" width="110"></el-table-column>
          <el-table-column label="就餐信息" :show-overflow-tooltip="true">
            <template scope="scope"><span v-html="scope.row.eatinfo"></span></template>
          </el-table-column>
          <el-table-column prop="statustr" label="状态" width="96"></el-table-column>
          <el-table-column label="操作" width="100">
            <template scope="scope">
              <span>-</span>
            </template>
          </el-table-column>
        </el-table>
        <pageComponent v-if="orderlist.length>0" :page="page" :pagesize="pagesize" :total="allnum" :callback="getCurrentPage"></pageComponent>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ajax } from "@/libs/ajax"
import { timefilter } from "@/filters/timefilter"
import { currency } from "@/filters/currency"
import { getOrderStatus } from "@/libs/order"
import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      //UI组件数据
      daterange: [new Date(new Date().getTime() - 7 * 24 * 3600 * 1000), new Date()],
      searchname: '',
      datePickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      //页面data数据源
      page: 1,
      pagesize: 20,
      allnum: 0,
      orderlist: [],
      distriplist: [],
    }
  },
  methods: {
    getCurrentPage(page){
      this.page = page;
      this.getOrderlist();
    },
    //获取订单列表
    getOrderlist(){
      const startime = timefilter(this.daterange[0], 'yyyy/mm/dd');
      const endtime = timefilter(this.daterange[1], 'yyyy/mm/dd');
      const params = { startime: startime, endtime: endtime, shopname: this.searchname, page: this.page, pagesize: this.pagesize, ordertype:2 };
      ajax.get('/admin/order/getOrderlist', {params:params}).then((response) => {
        if (response.data && response.data.code > 0) {
          this.delayLoad(response.data['info'], response.data['list']);
        } else {
          this.$message.error(response.data.msg);
        }
      }).catch((e) => {
        this.$message.error(e.toString());
      });
    }, 
    delayLoad(info, list){
      this.allnum = info.allnum || list.length;
      if(list && list.length > 0){
        this.orderlist = [];
        for (var i = list.length - 1; i >= 0; i--) {
          let orderinfo = {};
          orderinfo['showpopover'] = false;
          orderinfo['shopid'] = list[i].shopid;
          orderinfo['orderid'] = list[i].orderid;
          orderinfo['orderdetail'] = this.formatOrderlist(list[i].orderlist);
          orderinfo['addtime'] = list[i].addtime?timefilter(new Date(list[i].addtime), 'yyyy/mm/dd hh:ii:ss'):'';
          orderinfo['allmoney'] = currency(list[i].allmoney);
          orderinfo['eatinfo'] = '就餐人数：'+list[i].mealsnum+'<br>就餐时间：'+timefilter(new Date(list[i].startime), 'yyyy/mm/dd hh:ii:ss')+' - '+timefilter(new Date(list[i].endtime), 'yyyy/mm/dd hh:ii:ss');
          orderinfo['status'] = list[i].status;
          orderinfo['statustr'] = getOrderStatus(list[i].status);
          this.orderlist.push(orderinfo);
        }
      }
    },
    formatOrderlist(order){
      const orderlist = [];
      for (var i = order.length - 1; i >= 0; i--) {
        orderlist.push(order[i].dishesname+' x'+order[i].num);
      }
      return orderlist.join('<br>');
    }
  },
  computed: {
    ...mapGetters({

    }),
  },
  created () {
    //初始获取数据
    this.getOrderlist();
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
.searchinput{width: 200px;}
.searchbox{padding:12px 6px;margin-bottom: 10px;background-color: #f2f2f2; }
.searchbox .el-date-editor--timerange{width: 136px;}
</style>
