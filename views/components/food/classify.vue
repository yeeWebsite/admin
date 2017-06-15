<template>
  <div class="content">
    <headerComponent></headerComponent>
    <el-row class="tac" :gutter="10">
      <el-col :span="4"><leftComponent></leftComponent></el-col>
      <el-col :span="20">
        <breadtitleComponent></breadtitleComponent>
        <!-- 页面输入内容 -->
        <el-row type="flex">
          <el-col :span="24" class="searchbox">
            <span style="color: #FF4949; margin-left:20px; line-height:36px;">菜肴分类信息管理请谨慎删除，可能影响现有数据显示</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7" v-for="(el, index) in list" :offset="index > 0 ? 1 : 0">
            <el-card class="box-card">
              <div slot="header" class="clearfix" style="line-height:36px;">
                <span>{{el.name}}</span>
                <el-button style="float: right; margin:4px;" size="small" type="primary" @click.stop="addClassify(el.key)">添加</el-button>
                <el-input v-if="el.key=='cuisine'" v-model="cuisinename" style="width:120px;float: right;"></el-input>
                <el-input v-if="el.key=='classify'" v-model="classifyname" style="width:120px;float: right;"></el-input>
                <el-input v-if="el.key=='tastes'" v-model="tastesname" style="width:120px;float: right;"></el-input>
              </div>
              <div v-for="e in getListBykey(el.key)" class="text item" style="margin:8px 0px; border-bottom:1px solid #ccc; padding: 8px 0px;">
                <span style="line-height:28px;">{{getNameBykey(el.key, e)}}</span>
                <el-button style="float: right;" size="small" type="primary" @click.stop="delClassify(el.key,e.id)">删除</el-button>
                <el-button style="float: right; margin-right: 6px;" size="small" type="primary" @click.stop="modifyClassify(el.key, e)">修改</el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <!-- dialog弹层 -->
        <el-dialog class="discount-dialog" :title="dialogtitle" :visible.sync="showdialog" size="tiny" :close-on-click-modal="false">
          <div class="deskinfoDialog">
            <el-input v-model="dialogmodname" class="inlineinput"></el-input>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button size="small" type="primary" @click.stop="modifyClassify(dialogkey)">确 定</el-button>
          </span>
        </el-dialog>
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
      cuisinename: '',
      classifyname: '',
      tastesname: '',
      list: [
        { name: '菜系', key: 'cuisine' },
        { name: '菜肴分类', key: 'classify' },
        { name: '口味', key: 'tastes' },
      ],
      cuisinelist:[],
      classifylist:[],
      tasteslist:[],
      showdialog: false,
      dialogkey:'',
      dialogtitle: '',
      dialogmodname: '',
      dialogmodid: '',
    }
  },
  methods: {
    //获取基本信息
    getBaseInfo(){
      const urls = ['/admin/shop/getCuisineList', '/admin/dishes/getClassifyList','/admin/dishes/getTastesList'];
      const requests = urls.map(function(url){ return ajax.get(url, { params: {indicator:{async: true}} }); });
      ajax.all(requests).then(ajax.spread((cuisinelist, classifylist, tasteslist) => {
        if (cuisinelist.data && cuisinelist.data.code > 0) {
          this.cuisinelist = cuisinelist.data.list;
        }
        if (classifylist.data && classifylist.data.code > 0) {
          this.classifylist = classifylist.data.list;
        }
        if (tasteslist.data && tasteslist.data.code > 0) {
          this.tasteslist = tasteslist.data.list;
        }
      })).catch((e) => {
        this.$message.error(e.toString());
      });
    },
    //根据key获取菜系信息
    getListBykey(key){
      if(key == 'cuisine'){
        return this.cuisinelist;
      }else if(key == 'classify'){
        return this.classifylist;
      }else if(key == 'tastes'){ 
        return this.tasteslist;
      }else{
        return [];
      }
    },
    getNameBykey(key, info){
      if(key == 'cuisine'){
        return info['cuisinename'];
      }else if(key == 'classify'){
        return info['classname'];
      }else if(key == 'tastes'){ 
        return info['tastes'];
      }else{
        return '-';
      }
    },
    addClassify(key){
      let type = '';
      let cname = '';
      if(key == 'cuisine'){
        type = 1;
        if(!this.cuisinename){
          return this.$message.error('请输入要添加的菜系！');
        }
        cname = this.cuisinename;
      }else if(key == 'classify'){
        type = 2;
        if(!this.classifyname){
          return this.$message.error('请输入要添加的菜肴分类！');
        }
        cname = this.classifyname;
      }else if(key == 'tastes'){
        type = 3;
        if(!this.tastesname){
          return this.$message.error('请输入口味！');
        }
        cname = this.tastesname;
      }
      const params = { type: type, cname: cname };
      ajax.get('/admin/classify/addClassify', {params:params}).then((response) => {
        if (response.data && response.data.code > 0) {
          this.$message.success('添加成功'); 
          this.getBaseInfo();
        } else {
          return this.$message.error(response.data.msg);
        }
      }).catch((e) => {
        return this.$message.error(e.toString());
      });
    },
    modifyClassify(key, info){
      let type = '';
      let dialogtitle = '';
      if(key == 'cuisine'){
        type = 1;
        dialogtitle = '修改菜系';
      }else if(key == 'classify'){
        type = 2;
        dialogtitle = '修改菜肴分类';
      }else if(key == 'tastes'){
        type = 3;
        dialogtitle = '修改口味';
      }
      if(key && info){
        this.showdialog = true;
        this.dialogkey = key;
        this.dialogmodid = info.id;
        this.dialogtitle = dialogtitle;
        this.dialogmodname = this.getNameBykey(key, info);
      }else{
        const params = { type: type, cname: this.dialogmodname, cid: this.dialogmodid };
        ajax.get('/admin/classify/addClassify', {params:params}).then((response) => {
          this.showdialog = false;
          if (response.data && response.data.code > 0) {
            this.$message.success('修改成功'); 
            this.getBaseInfo();
          } else {
            return this.$message.error(response.data.msg);
          }
        }).catch((e) => {
          return this.$message.error(e.toString());
        });
      }
    },  
    delClassify(key, id){
      let type = '';
      if(key == 'cuisine'){
        type = 1;
      }else if(key == 'classify'){
        type = 2;
      }else if(key == 'tastes'){
        type = 3;
      }
      const params = { type: type, cid: id };
      this.$confirm('删除数据可能会影响数据完整性，是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ajax.get('/admin/classify/delClassify', {params:params}).then((response) => {
          if (response.data && response.data.code > 0) {
            this.getBaseInfo();
          } else {
            this.$message.error(response.data.msg);
          }
        }).catch((e) => {
          this.$message.error(e.toString());
        });
      }).catch(() => {
        this.$message.info('已取消删除');          
      });
    }
  },
  computed: {
    ...mapGetters({
      isysadmin: 'isysadmin',
      userinfo: 'userinfo',
      shopinfo: 'shopinfo',
      defshopid: 'defshopid'
    }),
  },
  created () {
    //获取基本信息
      this.getBaseInfo();
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
