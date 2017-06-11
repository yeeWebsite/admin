<template>
  <div class="content">
    <headerComponent></headerComponent>
    <el-row class="tac" :gutter="10">
      <el-col :span="4"><leftComponent></leftComponent></el-col>
      <el-col :span="20">
        <breadtitleComponent></breadtitleComponent>
        <!-- 页面输入内容 -->
        <el-row>
          <el-col :span="5">押金总额：{{AtotalMoney}}元</el-col>
          <el-col :span="5">余额总额：{{BtotalMoney}}元</el-col>
          <el-col :span="4" :offset="10">
            <el-row type="flex" justify="end">
              <el-button style="margin:-10px 10px 10px 0;" type="primary" :loading="false" @click="dialogVisible = true">退款设置</el-button>
            </el-row>
          </el-col>
        </el-row>
        <el-table :data="moneylist" style="width: 100%">
          <el-table-column type="index" label="序号" width="160"></el-table-column>
          <el-table-column prop="phone" label="手机号"></el-table-column>
          <el-table-column prop="deposit" label="押金"></el-table-column>
          <el-table-column prop="balance" label="余额"></el-table-column>
        </el-table>
        <pageComponent :page="page" :pagesize="pagesize" :total="allnum" :callback="getCurrentPage"></pageComponent>
      </el-col>
    </el-row>
    <el-dialog
        title="退款设置"
        :visible.sync="dialogVisible"
        size="tiny"
        :before-close="handleClose">
      <span>退款批准时长，退款申请后</span>
      <el-select class="el-data-select" v-model="value" placeholder="请选择">
        <el-option
            v-for="item in dataoptions"
            :key="item.label"
            :label="item.value"
            :value="item.value">
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
                  <el-button @click="dialogVisible = false">取 消</el-button>
                  <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                </span>
    </el-dialog>
  </div>
</template>

<script>
import { ajax } from "@/libs/ajax"
import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      page: 1,
      pagesize: 20,
      allnum: 3,
      AtotalMoney:'3593405.00',
      BtotalMoney:'3593405.00',
      moneylist: [
        {
          phone: '13800000000',
          deposit: '1000.00',
          balance: '1000.00'
        },
        {
          phone: '13800000000',
          deposit: '1000.00',
          balance: '1000.00'
        },
        {
          phone: '13800000000',
          deposit: '1000.00',
          balance: '1000.00'
        },
      ],
      dialogVisible: false,
      dataoptions: [{
        value: '即时',
        label: '0'
      }, {
        value: '12小时',
        label: '1'
      }, {
        value: '1天',
        label: '2'
      }, {
        value: '2天',
        label: '3'
      }, {
        value: '3天',
        label: '4'
      }],
      value: '',
    }
  },
  methods: {
    getCurrentPage(page){
      console.log(page);
    },
    handleClose(done) {
      console.log('关闭弹窗');
      done();
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
  .el-data-select{margin-top: 10px;}
</style>
