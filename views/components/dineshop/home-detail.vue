<template>
  <div class="content">
    <headerComponent></headerComponent>
    <el-row class="tac" :gutter="10">
      <el-col :span="4">
        <leftComponent path="/dineshop/"></leftComponent>
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
            <el-upload action="/admin/upload/images" :multiple="false" name="file" :file-list="filelist" :on-success="uploadSuccess" list-type="picture-card">
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
            月销量：<el-input v-model="shopinfo.sales" placeholder="月销量" style="width:120px"></el-input>
            人均消费：<el-input v-model="shopinfo.preconsume" placeholder="人均消费" class="inlineinput">
              <template slot="append">元/人</template>
            </el-input>
          </el-form-item>
          <el-form-item label="可否预订">
            <el-switch on-text="" off-text="" v-model="shopinfo.isbooking" on-value="1" off-value="0"></el-switch>
          </el-form-item>
          <el-form-item label="可否外卖">
            <el-switch on-text="" off-text="" v-model="shopinfo.isaway" on-value="1" off-value="0" style="margin-right:10px;"></el-switch>
            配送费：<el-input v-show="shopinfo.isaway == '1'" v-model="shopinfo.deliveryfee" placeholder="配送费" class="inlineinput"><template slot="append">元</template></el-input>&nbsp;&nbsp;
            起送金额：<el-input v-show="shopinfo.isaway == '1'" v-model="shopinfo.minprice" placeholder="最低配送金额" class="inlineinput"><template slot="append">元</template></el-input>
          </el-form-item>
          <el-form-item label="营业时间" prop="opentime" required>
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
  import { timefilter } from "@/filters/timefilter"

  export default {
    data() {
      return {
        //菜系列表
        cuisinelist:[],
        //页面data数据源
        takeoutpricevisible: false,
        shopinfo: {
          shopid: '', //店铺ID
          shopname: '', //店铺名称
          shopdesc: '', //店铺描述
          shopicon: '', //店铺图标
          cuisineid: '1', //菜系ID
          maplon:'', //经度坐标
          maplat:'', //纬度坐标
          sales:'', //月销量
          deliveryfee:'', //配送费
          minprice:'', //最低配送金额
          preconsume:'', //人均消费
          isbooking:1, //是否可预订
          isaway:1, //是否支持外卖
          opentime: [timefilter(new Date, 'yyyy-mm-dd ')+'09:00:00', timefilter(new Date, 'yyyy-mm-dd ')+'23:00:00' ], //营业时间
          shophone:'', //联系电话
          address: '', //店铺地址 
        },
        rules: {
          shopname: [{ required: true, message: '请输入店铺名称', trigger: 'blur' }],
          shopicon: [{ required: true, message: '请先上传店铺图标', trigger: 'blur' }],
          cuisineid: [{ required: true, message: '请选择菜系', trigger: 'blur' }],
          shophone: [{ required: true, message: '请输入店铺联系电话', trigger: 'blur' }],
          address: [{ required: true, message: '请输入店铺地址', trigger: 'blur' }],
        },
        filelist: [],
      }
    },
    methods: {
      getShopinfo(){
        ajax.get('/admin/shop/getDineshopInfo', { params: {shopid: this.shopinfo.shopid} }).then((response) => {
          if (response.data && response.data.code > 0) {
            const info = response.data.info;
            //解析营业时间
            let opentime = info.opentime.split('-');
	    console.log(opentime);
            for (var i = 0; i < opentime.length; i++) {
	      let tempStr = opentime[i].trim();
	      if (tempStr == '0NaN:0NaN'){console.log('0NaN:0NaN');
		 if (i == 0){
		    tempStr = '09:00';
		 }else if (i == 1){
		    tempStr = '23:00';
		 }
	      }
              opentime[i] = timefilter(new Date, 'yyyy-mm-dd ')+tempStr+':00';
            }
            this.filelist = [{url: info.shopicon}];
            this.shopinfo.shopname = info.shopname;
            this.shopinfo.shopdesc = info.shopdesc;
            this.shopinfo.shopicon = info.shopicon;
            this.shopinfo.cuisineid = info.cuisineid;
            this.shopinfo.maplon = info.maplon;
            this.shopinfo.maplat = info.maplat;
            this.shopinfo.sales = info.sales;
            this.shopinfo.deliveryfee = info.deliveryfee;
            this.shopinfo.minprice = info.minprice;
            this.shopinfo.preconsume = info.preconsume;
            this.shopinfo.isbooking = info.isbooking;
            this.shopinfo.isaway = info.isaway;
            this.shopinfo.opentime = opentime;
            this.shopinfo.shophone = info.shophone;
            this.shopinfo.address = info.address;
          } else {
            this.$message.error(response.data.msg);
          }
        }).catch((e) => {
          this.$message.error(e.toString());
        });
      },
      addDineshop(form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            let opentimestr = '';
            const opentime = this.shopinfo.opentime;
            if(opentime){
              opentimestr = timefilter(opentime[0], 'hh:ii')+'-'+timefilter(opentime[1], 'hh:ii');
            }
	    console.log(opentime);
	    console.log(opentimestr);
            const params = {
              adduser: this.userinfo.userid,
              shopid: this.shopinfo.shopid,
              shopname: this.shopinfo.shopname, //店铺名称
              shopdesc: this.shopinfo.shopdesc, //店铺描述
              shopicon: this.shopinfo.shopicon, //店铺图标
              cuisineid: this.shopinfo.cuisineid, //菜系ID
              maplon: this.shopinfo.maplon, //经度坐标
              maplat: this.shopinfo.maplat, //纬度坐标
              sales: this.shopinfo.sales, //月销量
              deliveryfee: this.shopinfo.deliveryfee, //配送费
              minprice: this.shopinfo.minprice, //最低配送金额
              preconsume: this.shopinfo.preconsume, //人均消费
              isbooking: this.shopinfo.isbooking, //是否可预订
              isaway: this.shopinfo.isaway, //是否支持外卖
              opentime: opentimestr, //营业时间
              shophone: this.shopinfo.shophone, //联系电话
              address: this.shopinfo.address, //店铺地址 
              indicator: {async:true}
            };
            ajax.get('/admin/shop/addDineshop', { params: params }).then((response) => {
              if (response.data && response.data.code > 0) {
                this.$alert('操作成功！', '', {
                  confirmButtonText: '确定',
                  callback: action => {
                    this.$router.push('/dineshop/');
                  }
                });
              } else {
                this.$message.error(response.data.msg);
              }
            }).catch((e) => {
              this.$message.error(e.toString());
            });
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
      uploadSuccess(response, file, filelist){
        if(filelist.length > 1){
          filelist.splice(0, 1);
        }
        console.log(filelist);
        if (response.code > 0 && response.info.imgpath) {
          this.shopinfo.shopicon = response.info.imgpath;
        }
      }
    },
    computed: {
      ...mapGetters({
        userinfo: 'userinfo'
      }),
    },
    created () {
      //获取菜系列表
      this.getCuisinelist();
      //判断是否修改
      const query = this.$route.query;
      if(query.shopid){
        this.shopinfo.shopid = query.shopid;
        this.getShopinfo();
      }
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
