<template>
  <div class="content">
    <headerComponent></headerComponent>
    <el-row class="tac" :gutter="10">
      <el-col :span="4"><leftComponent></leftComponent></el-col>
      <el-col :span="20">
        <breadtitleComponent></breadtitleComponent>
        <!-- 页面输入内容 -->
        <el-table :data="desklist"  :default-sort="{prop:'orderid',order:'descending'}" empty-text="暂无数据..." style="width: 100%" id="loading">
          <el-table-column type="index" label="序号" width="120"></el-table-column>
          <el-table-column prop="deskid" label="桌型ID"></el-table-column>
          <el-table-column prop="deskname" label="桌型名称"></el-table-column>
          <el-table-column prop="desknum" label="放号数量"></el-table-column>

          <el-table-column label="操作" width="200">
            <template scope="scope">
              <el-button size="small"  @click.stop="">修改</el-button>
              <el-button size="small" @click.stop="">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
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
      desklist:[
        {deskid: 1, deskname: 2, desknum: 20},
        {deskid: 2, deskname: 3, desknum: 30},
        {deskid: 3, deskname: 4, desknum: 40},
        {deskid: 4, deskname: 5, desknum: 50}
      ]
    }
  },
  methods: {
    
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
  },
  watch: {
    
  }
}
</script>

<style type="text/css">
  
</style>
