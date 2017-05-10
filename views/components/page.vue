<template lang="html">
  <el-pagination class="pagecontent" :page-size="20" :page-sizes="[20]" layout="->, sizes, prev, pager, next,  total, slot" :total="total" @current-change="handleCurrentChange"></el-pagination>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data(){
    return {
      
    }
  },
  props: ['total', 'callback'],
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