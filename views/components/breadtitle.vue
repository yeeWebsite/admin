<template lang="html">
  <el-breadcrumb separator="/" class="breadtitle">
    <el-breadcrumb-item :to="{ path: '/' }">管理首页</el-breadcrumb-item>
    <el-breadcrumb-item v-if="breadOption && typeof breadOption == 'string'">{{breadOption}}</el-breadcrumb-item>
    <el-breadcrumb-item v-else-if="breadOption && typeof breadOption == 'object'" v-for="val in breadOption" :to="{path: val.path}">{{val.name}}</el-breadcrumb-item>
    <el-breadcrumb-item v-else>{{defaultBreadOption}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data(){
    return {
      defaultBreadOption: ''
    }
  },
  props: ['breadOption'],
  methods:{
    
  },
  created(){
    this.defaultBreadOption = this.$route.name;
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
.breadtitle{padding: 16px 8px;}
</style>