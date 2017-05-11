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