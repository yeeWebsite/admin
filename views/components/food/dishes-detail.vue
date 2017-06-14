<template>
  <div class="content">
    <headerComponent></headerComponent>
    <el-row class="tac" :gutter="10">
      <el-col :span="4">
        <leftComponent path="/food/dishes/"></leftComponent>
      </el-col>
      <el-col :span="20">
        <breadtitleComponent></breadtitleComponent>
        <el-form :rules="rules" ref="dineshopform" :model="dishinfo" label-width="120px" label-position="right">
          <el-form-item label="菜肴名称" prop="dishname">
            <el-input v-model="dishinfo.dishname"></el-input>
          </el-form-item>
          <el-form-item label="菜肴描述">
            <el-input type="textarea" v-model="dishinfo.dishdesc"></el-input>
          </el-form-item>
          <el-form-item label="菜肴图标" prop="dishicon">
            <el-upload action="/admin/upload/images" :multiple="false" name="file" :data="{filetype:'dishicon'}" :file-list="filelist" :on-success="uploadSuccess" list-type="picture-card">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500KB</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="菜肴口味" prop="tastesid">
            <el-checkbox-group v-model="dishinfo.tastesid">
              <el-checkbox :label="tastes.id" name="tastesid" v-for="tastes in tasteslist">{{tastes.tastes}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="分类" required>
            <el-col :span="8">
              <el-form-item prop="cuisineid">
                一级分类：
                <el-select v-model="dishinfo.cuisineid" placeholder="一级分类">
                  <el-option v-for="cuisine in cuisinelist" :key="cuisine.id" :label="cuisine.cuisinename" :value="cuisine.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="classid">
                二级分类：
                <el-select v-model="dishinfo.classid" placeholder="二级分类">
                  <el-option v-for="classify in classifylist" :key="classify.id" :label="classify.classname" :value="classify.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="价格" prop="price" :rules="[{required:true,message:'请输入菜肴价格'},{type:'number',message:'菜肴价格必须为数字值'}]">
              <el-input v-model.number="dishinfo.price" auto-complete="off" class="inlineinput">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="默认折扣" prop="discount" :rules="[{required:true,message:'请输入菜肴价格'},{type:'number',message:'菜肴价格必须为数字值'}]">
            <el-input v-model.number="dishinfo.discount" class="inlineinput" style="width:220px;"><template slot="append">折（请输入1~10整数）</template></el-input>
          </el-form-item>
	        <el-form-item label="菜肴月销量">
            <el-input v-model="dishinfo.salenum" placeholder="10" class="inlineinput"><template slot="append">份</template> </el-input>
          </el-form-item>
          <el-form-item label="所属店铺">{{dishinfo.shopname}}</el-form-item>
          <el-form-item>
            <router-link to="/food/dishes/" style="margin-right:15px;text-decoration:none;color:#48576a;">返回</router-link>
            <el-button type="primary" @click="addDishes('dineshopform')">提交</el-button>
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
        tasteslist:[], //口味列表
        cuisinelist:[], //菜系列表
        classifylist:[], //分类列表
        shoplist:[], //店铺列表
        //页面data数据源
        dishinfo: {
          dishid: '', //菜肴ID
          dishname: '', //菜肴名称
          dishdesc: '', //菜肴描述
          dishicon: '', //菜肴图标
          price: 0, //价格
          discount: 10, //默认折扣
          tastesid: [], //口味ID
          cuisineid: '', //菜系ID
          classid: '', //分类ID
	  salenum:0, //菜肴月销量
          shopid: '', //所属店铺
          shopname: '', //所属店铺
        },
        rules: {
          dishname: [{ required: true, message: '请输入菜肴名称', trigger: 'blur' }],
          dishicon: [{ required: true, message: '请先上传菜肴图标', trigger: 'blur' }],
          tastesid: [{ type: 'array', required: true, message: '请至少选择一种菜肴口味', trigger: 'change' }],
          cuisineid: [{ required: true, message: '请选择一级分类', trigger: 'blur' }],
          classid: [{ required: true, message: '请选择二级分类', trigger: 'blur' }],
        },
        filelist: [],
      }
    },
    methods: {
      //获取基本信息
      getBaseInfo(){
        const urls = ['/admin/dishes/getTastesList', '/admin/shop/getCuisineList', '/admin/dishes/getClassifyList'];
        const requests = urls.map(function(url){ return ajax.get(url, { params: {indicator:{async: true}} }); });
        ajax.all(requests).then(ajax.spread((tasteslist, cuisinelist, classifylist) => {
          if (tasteslist.data && tasteslist.data.code > 0) {
            this.tasteslist = tasteslist.data.list;
          }
          if (cuisinelist.data && cuisinelist.data.code > 0) {
            this.cuisinelist = cuisinelist.data.list;
          }
          if (classifylist.data && classifylist.data.code > 0) {
            this.classifylist = classifylist.data.list;
          }
        })).catch((e) => {
          this.$message.error(e.toString());
        });
      },
      getDishinfo(){
        ajax.get('/admin/dishes/getDishesInfo', { params: {dishid: this.dishinfo.dishid} }).then((response) => {
          if (response.data && response.data.code > 0) {
            const info = response.data.info;
            this.filelist = [{url: info.dishicon}];
            this.dishinfo.dishname = info.dishname; //菜肴名称
            this.dishinfo.dishdesc = info.dishdesc; //菜肴描述
            this.dishinfo.dishicon = info.dishicon; //菜肴图标
            this.dishinfo.price = parseFloat(info.dishprice); //价格
            this.dishinfo.discount = info.defdiscount * 10; //默认折扣
            this.dishinfo.tastesid = info.tastesid.split(','); //口味ID
            this.dishinfo.cuisineid = info.cuisineid; //菜系ID
            this.dishinfo.classid = info.classid; //分类ID
	    this.dishinfo.salenum = info.salenum;//月销量
          } else {
            this.$message.error(response.data.msg);
          }
        }).catch((e) => {
          this.$message.error(e.toString());
        });
      },
      addDishes(form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            if(this.dishinfo.discount > 10 || this.dishinfo.discount < 1){
              return this.$message.error('折扣力度必须在1~10之间!');
            }
            const params = {
              adduser: this.userinfo.userid,
              dishid: this.dishinfo.dishid, //菜肴ID
              dishname: this.dishinfo.dishname, //菜肴名称
              dishdesc: this.dishinfo.dishdesc, //菜肴描述
              dishicon: this.dishinfo.dishicon, //菜肴图标
              price: this.dishinfo.price, //价格
              discount: this.dishinfo.discount/10, //默认折扣
              tastesid: this.dishinfo.tastesid.join(','), //口味ID
              cuisineid: this.dishinfo.cuisineid, //菜系ID
              classid: this.dishinfo.classid, //分类ID
              shopid: this.shopinfo.fontshopid, //所属店铺 添加到前端，则这里显示的是前端店铺ID
	      salenum: this.dishinfo.salenum,//月销量
              indicator: {async:true}
            };
            ajax.get('/admin/dishes/addDishes', { params: params }).then((response) => {
              if (response.data && response.data.code > 0) {
                this.$alert('操作成功！', '', {
                  confirmButtonText: '确定',
                  callback: action => {
                    this.$router.push('/food/dishes/');
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
      uploadSuccess(response, file, filelist){
        if(filelist.length > 1){
          filelist.splice(0, 1);
        }
        if (response.code > 0 && response.info.imgpath) {
          this.dishinfo.dishicon = response.info.imgpath;
        }
      }
    },
    computed: {
      ...mapGetters({
        userinfo: 'userinfo',
        shopinfo: 'shopinfo',
      }),
    },
    created () {
      //获取基本信息
      this.getBaseInfo();
      //判断是否修改
      const query = this.$route.query;
      if(query.dishid){
        this.dishinfo.dishid = query.dishid;
        this.getDishinfo();
      }
      if(query.shopid) this.dishinfo.shopid = query.shopid;
      if(query.shopname) this.dishinfo.shopname = query.shopname;
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
