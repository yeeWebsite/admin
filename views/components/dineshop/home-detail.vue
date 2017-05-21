<template>
  <div class="content">
    <headerComponent></headerComponent>
    <el-row class="tac" :gutter="10">
      <el-col :span="4">
        <leftComponent></leftComponent>
      </el-col>
      <el-col :span="20">
        <breadtitleComponent></breadtitleComponent>
        <el-form :rules="rules" ref="dineshopform" :model="shopinfo" label-width="120px" label-position="right">
          <el-form-item label="店铺名称" prop="shopname">
            <el-input v-model="shopinfo.shopname"></el-input>
          </el-form-item>
          <el-form-item label="店铺描述">
            <el-input type="textarea" v-model="shopinfo.shopdesc"></el-input>
          </el-form-item>
          <el-form-item label="店铺图标" prop="shopicon">
            <el-upload :multiple="false" action="https://jsonplaceholder.typicode.com/posts/" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList" list-type="picture-card">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500KB</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="菜系" prop="cuisineid">
            <el-select v-model="shopinfo.cuisineid" placeholder="请选择菜系">
              <el-option v-for="cuisine in cuisinelist" :key="cuisine.id" :label="cuisine.cuisinename" :value="cuisine.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="经纬度坐标">
            <el-input v-model="shopinfo.maplon" placeholder="经度坐标" style="width:120px"></el-input>
            <el-input v-model="shopinfo.maplat" placeholder="纬度坐标" style="width:120px"></el-input>
          </el-form-item>
          <el-form-item label="店铺基本信息">
            <el-input v-model="shopinfo.sales" placeholder="月销量" style="width:120px"></el-input>
            <el-input v-model="shopinfo.preconsume" placeholder="人均消费" class="inlineinput">
              <template slot="append">元/人</template>
            </el-input>
          </el-form-item>
          <el-form-item label="可否预订">
            <el-switch on-text="" off-text="" v-model="shopinfo.isbooking" on-value="1" off-value="0"></el-switch>
          </el-form-item>
          <el-form-item label="可否外卖">
            <el-switch on-text="" off-text="" v-model="shopinfo.isaway" on-value="1" off-value="0" style="margin-right:10px;"></el-switch>
            <el-input v-show="shopinfo.isaway == '1'" v-model="shopinfo.deliveryfee" placeholder="配送费" class="inlineinput"><template slot="append">元</template></el-input>
            <el-input v-show="shopinfo.isaway == '1'" v-model="shopinfo.minprice" placeholder="最低配送金额" class="inlineinput"><template slot="append">元</template></el-input>
          </el-form-item>
          <el-form-item label="营业时间" prop="opentime">
            <el-time-picker is-range v-model="shopinfo.opentime" format="HH:mm" placeholder="选择时间范围"></el-time-picker>
          </el-form-item>
          <el-form-item label="联系电话" prop="shophone">
            <el-input v-model="shopinfo.shophone" style="width:192px;"></el-input>
          </el-form-item>
          <el-form-item label="详细地址" prop="address">
            <el-input type="textarea" v-model="shopinfo.address"></el-input>
          </el-form-item>
          <el-form-item>
            <router-link to="/dineshop/" style="margin-right:15px;text-decoration:none;color:#48576a;">返回</router-link>
            <el-button type="primary" @click="addDineshop('dineshopform')">提交</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {ajax} from "@/libs/ajax"
  import {mapGetters, mapActions} from 'vuex'

  export default {
    data() {
      return {
        //菜系列表
        cuisinelist:[],
        //页面data数据源
        takeoutpricevisible: false,

        shopinfo: {
          shopname: '', //店铺名称
          shopdesc: '', //店铺描述
          shopicon: '', //店铺图标
          cuisineid: '', //菜系ID
          maplon:'', //经度坐标
          maplat:'', //纬度坐标
          sales:'', //月销量
          deliveryfee:'', //配送费
          minprice:'', //最低配送金额
          preconsume:'', //人均消费
          isbooking:1, //是否可预订
          isaway:1, //是否支持外卖
          opentime:'', //营业时间
          shophone:'', //联系电话
          address: '', //店铺地址 
        },
        rules: {
          shopname: [{ required: true, message: '请输入店铺名称', trigger: 'blur' }],
          shopicon: [{ required: true, message: '请先上传店铺图标', trigger: 'blur' }],
          cuisineid: [{ required: true, message: '请选择菜系', trigger: 'blur' }],
          opentime: [{ type:'date', required: true, message: '请选择营业时间', trigger: 'change' }],
          shophone: [{ required: true, message: '请输入店铺联系电话', trigger: 'blur' }],
          address: [{ required: true, message: '请输入店铺地址', trigger: 'blur' }],
        },
        fileList: [{
          name: 'food.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        }],
        selecteddistrictoptions: [],
      }
    },
    methods: {
      addDineshop(form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            console.log('submit!');
          }else {
            return false;
          }
        });
      },
      //获取菜系列表
      getCuisinelist(){
        ajax.get('/admin/shop/getCuisineList', { params: { indicator:{async:true} } }).then((response) => {
          if (response.data && response.data.code > 0) {
            this.cuisinelist = response.data.list;
          } else {
            this.$message.error(response.data.msg);
          }
        }).catch((e) => {
          this.$message.error(e.toString());
        });
      },
      handlePreview(){

      },
      handleRemove(){

      }
    },
    computed: {
      ...mapGetters({}),
    },
    created () {
      //获取菜系列表
      this.getCuisinelist();
    },
    destroyed(){

    },
    components: {
      headerComponent: require('components/header.vue'),
      leftComponent: require('components/left.vue'),
      breadtitleComponent: require('components/breadtitle.vue'),
    },
    watch: {}
  }
</script>

<style type="text/css">
  .inlineinput {width: 150px;}
  .radiogroup {margin-right: 20px;}
  .districtcascader{width: 300px;}
  .el-time-panel__content::after, .el-time-panel__content::before{margin-top: -6px;}
</style>
