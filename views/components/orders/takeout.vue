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
            选择时间段：<el-time-picker is-range v-model="timerange" format="HH:mm" placeholder="选择时间范围"></el-time-picker>&nbsp;&nbsp;&nbsp;&nbsp;
            输入菜肴：<el-input class="searchinput" placeholder="菜肴名" icon="search" v-model="searchname"></el-input>&nbsp;&nbsp;
            <el-button type="primary" :loading="false" @click.stop="searchAction">搜索</el-button>
          </el-col>
        </el-row>
        <el-table :data="orderlist" empty-text="暂无数据..." style="width: 100%">
          <el-table-column type="index" label="序号" width="64"></el-table-column>
          <el-table-column prop="orderid" label="订单号" width="160"></el-table-column>
          <el-table-column label="菜肴名称" width="200" class-name="noticeinfo">
            <template scope="scope"><span v-html="scope.row.dishinfo"></span></template>
          </el-table-column>
          <el-table-column prop="paytime" label="付款时间" width="176"></el-table-column>
          <el-table-column prop="allmoney" label="价格" class-name="noticeinfo" width="90"></el-table-column>
          <el-table-column prop="mobile" label="手机账号" width="130"></el-table-column>
          <el-table-column prop="addressinfo" label="配送信息" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column :formatter="handleMode" label="状态" width="96"></el-table-column>
          <el-table-column label="操作" width="100">
            <template scope="scope">
              <el-button size="small" @click="handleEdit(scope.$index, scope.row)">派单配送</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pageComponent :total="21" :callback="getCurrentPage"></pageComponent>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ajax } from "@/libs/ajax"
import { timefilter } from "@/filters/timefilter"
import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      //UI组件数据
      daterange: [new Date(new Date().getTime() - 7 * 24 * 3600 * 1000), new Date()],
      timerange: [new Date(timefilter(new Date(), 'yyyy/mm/dd')+' 11:00:00'), new Date(timefilter(new Date(), 'yyyy/mm/dd')+' 13:00:00')],
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
      orderlist: [{
        orderid: '201405101123001',
        dishinfo: '酸菜鱼（超辣）x1<br>小炒肉（微辣）x1<br>小炒肉（微辣）x1<br>小炒肉（微辣）x1',
        paytime: '2017-05-10 11:20:20',
        allmoney: '￥113',
        mobile: '18018738562',
        addressinfo: '邹先生 广东省深圳市龙岗区横岗康乐路天颂雅苑3栋1715',
        orderstatus: '1'
      },{
        orderid: '201405101123001',
        dishinfo: '酸菜鱼（超辣）x1<br>小炒肉（微辣）x1',
        paytime: '2017-05-10 11:20:20',
        allmoney: '￥113',
        mobile: '18018738562',
        addressinfo: '邹先生 广东省深圳市龙岗区横岗康乐路天颂雅苑3栋1715',
        orderstatus: '1'
      },{
        orderid: '201405101123001',
        dishinfo: '酸菜鱼（超辣）x1<br>小炒肉（微辣）x1',
        paytime: '2017-05-10 11:20:20',
        allmoney: '￥113',
        mobile: '18018738562',
        addressinfo: '邹先生 广东省深圳市龙岗区横岗康乐路天颂雅苑3栋1715',
        orderstatus: '1'
      }]
    }
  },
  methods: {
    getCurrentPage(page){
      console.log(page);
    },
    handleMode(row, column) {
      return row.orderstatus;
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    searchAction(){
      const startdate = timefilter(this.daterange[0], 'yyyy/mm/dd');
      const endate = timefilter(this.daterange[1], 'yyyy/mm/dd');
      const startime = timefilter(this.timerange[0], 'hh:ii');
      const endtime = timefilter(this.timerange[1], 'hh:ii');
      const params = { startdate: startdate, endate: endate, startime: startime, endtime: endtime };
      ajax.get('/data/order/getOrderlist', {params: params}).then((response) => {
        if (response.data && response.data.code > 0) {
          this.delayLoad(response.data['info'], response.data['list']);
        } else {
          console.log(response.data.msg);
        }
      }).catch((e) => {
        console.log(e.toString());
      });
    }, 
    delayLoad(info, list){
      console.log(info, list);
    }
  },
  computed: {
    ...mapGetters({

    }),
  },
  created () {
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
