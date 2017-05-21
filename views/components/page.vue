<template lang="html">
  <el-pagination class="pagecontent" :page-size="pagesize" :page-sizes="[pagesize]" layout="->,sizes,prev,pager,next,total,slot" :total="total" :current-page="page" @current-change="handleCurrentChange"></el-pagination>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data(){
    return {
      
    }
  },
  props: ['page', 'pagesize', 'total', 'callback'],
  methods:{
    handleCurrentChange(val){
      if(this.callback && typeof this.callback == 'function'){
        this.callback(val);
      } 
    }
  },
  created(){
    if(!this.page) this.page = 1;
    if(!this.pagesize) this.pagesize = 20;
    if(!this.total) this.total = 0;
  },
  computed: {
    ...mapGetters({
      
    })
  },
  components: {

  }
}
</script>

<style type="text/css">
.pagecontent{margin: 10px 0px;}
</style>