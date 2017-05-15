<template>
  <div class="content">
    <headerComponent></headerComponent>
    <el-row class="tac" :gutter="10">
      <el-col :span="4"><leftComponent></leftComponent></el-col>
      <el-col :span="20">
        <breadtitleComponent></breadtitleComponent>
        <!-- 页面输入内容 -->
        <el-row>
          <el-col :span="6">收益金总额：{{totalMoney}}元</el-col>
          <el-col :span="4" :offset="14">
            <el-row type="flex" justify="end">
              <el-button style="margin:-10px 10px 10px 0;" type="primary" :loading="false" @click="dialogVisible = true">报收益金表导出</el-button>
              <el-dialog
                  title="报表导出选项"
                  :visible.sync="dialogVisible"
                  size="tiny"
                  :before-close="handleClose">
                店铺选择
                <el-select class="el-data-select" v-model="shopvalue" placeholder="请选择">
                  <el-option
                      v-for="item in dataoptions"
                      :key="item.label"
                      :label="item.value"
                      :value="item.value">
                  </el-option>
                </el-select><br/>
                日期筛选 <el-date-picker v-model="daterange" format="yyyy/MM/dd" type="daterange" align="left" placeholder="选择日期范围"></el-date-picker>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="dialogVisible = false">取 消</el-button>
                  <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                </span>
              </el-dialog>
            </el-row>
          </el-col>
        </el-row>
        <el-table :data="moneylist" style="width: 100%">
          <el-table-column type="index" label="序号" width="160"></el-table-column>
          <el-table-column prop="name" label="门店名称"></el-table-column>
          <el-table-column prop="money" label="收益金"></el-table-column>
          <el-table-column prop="date" label="日期"></el-table-column>
        </el-table>
        <pageComponent :total="21" :callback="getCurrentPage"></pageComponent>
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
      totalMoney: '23523452.00',
      moneylist:[
        {
          name: '撒网',
          money: '1234',
          date: '2017/5/10'
        },
        {
          name: '撒网',
          money: '1234',
          date: '2017/5/10'
        },
      ],
      dialogVisible: false,
      dataoptions: [{
        value: '撒网',
        label: '0'
      }, {
        value: '哈哈',
        label: '1'
      }, {
        value: '呵呵',
        label: '2'
      }, {
        value: '哦哦',
        label: '3'
      }, {
        value: '恩恩',
        label: '4'
      }],
      daterange: [new Date(new Date().getTime() - 7 * 24 * 3600 * 1000), new Date()],
      shopvalue: '',
    }
  },
  methods: {
    getCurrentPage(page){
      console.log(page);
    },
    handleClose(done) {
      console.log('关闭弹窗');
      done();
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
  .el-data-select{margin: 20px 0;}
</style>
