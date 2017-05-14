<template lang="html">
  <el-select v-model="value" placeholder="请选择">
      <el-option
          v-for="item in options"
          :key="item.label"
          :label="item.value"
          :value="item.value">
      </el-option>
    </el-select>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
//import ElSelect from "../../node_modules/element-ui/packages/select/src/select";

export default {
  data(){
    return {
      value: '',
    }
  },
  props: ['options'],
  methods:{

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

</style>