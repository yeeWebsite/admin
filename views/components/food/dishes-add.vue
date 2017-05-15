<template>
  <div class="content">
    <headerComponent></headerComponent>
    <el-row class="tac" :gutter="10">
      <el-col :span="4"><leftComponent></leftComponent></el-col>
      <el-col :span="20">
        <breadtitleComponent></breadtitleComponent>
        <!-- 页面输入内容 -->
        <el-form ref="dishesform" :model="dishesform" label-width="80px" label-position="right">
          <el-form-item label="菜肴名称">
            <el-input v-model="dishesform.name"></el-input>
          </el-form-item>
          <el-form-item label="菜肴图片">
            <el-upload
                :multiple="false"
                action="https://jsonplaceholder.typicode.com/posts/"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :file-list="fileList"
                list-type="picture-card">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="菜肴描述">
            <el-input type="textarea" v-model="dishesform.desc"></el-input>
          </el-form-item>
          <el-form-item label="口味分类">
            <el-tag
                class="tastetag"
                :key="tag"
                v-for="tag in dynamicTags"
                :closable="true"
                :close-transition="false"
                @close="handleCloseTag(tag)"
            >
              {{tag}}
            </el-tag>
            <el-input
                class="input-new-tag"
                v-if="taginputvisible"
                v-model="taginputvalue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm(tag)"
            >
            </el-input>
            <el-button v-else @click="showInput">+ 添加</el-button>
          </el-form-item>
          <el-form-item label="菜肴分类">
            <el-select v-model="firstdishclassify" placeholder="一级分类">
              <el-option
                  v-for="item in dishesform.firstclassifylist"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
            <el-select v-model="seconddishclassify" clearable placeholder="二级分类">
              <el-option
                  v-for="item in dishesform.secondclassifylist"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属店铺">
            <el-select v-model="dishshop" placeholder="请选择">
              <el-option
                  v-for="item in dishesform.shoplist"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="价格">
            <el-input v-model="dishesform.price" class="inlineinput">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button>返回</el-button>
            <el-button type="primary" @click="onSubmit">提交</el-button>
          </el-form-item>
        </el-form>
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
      dishesform: {
        name: '',
        desc: '',
        price: '',
        shoplist:[
          {
            value: '选项1',
            label: 'aaa'
          },
          {
            value: '选项2',
            label: 'bbb'
          },
          {
            value: '选项3',
            label: 'ccc'
          },
        ],
        firstclassifylist:[
          {
            value: '111',
            label: '111'
          },
          {
            value: '222',
            label: '222'
          },
          {
            value: '333',
            label: '333'
          },
        ],
        secondclassifylist:[
          {
            value: 'aaa',
            label: 'aaa'
          },
          {
            value: 'bbb',
            label: 'bbb'
          },
          {
            value: 'ccc',
            label: 'ccc'
          },
        ]
      },
      fileList: [{
        name: 'food.jpeg',
        url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
      }],
      dishshop:'',
      firstdishclassify:'',
      seconddishclassify:'',
      taginputvisible: false,
      taginputvalue: '',
      dynamicTags: ['辣'],
    }
  },
  methods: {
    onSubmit() {
      console.log('submit!');
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleCloseTag(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },
    showInput() {
      this.taginputvisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.taginputvalue;
      if (inputValue) {
        this.dynamicTags.push(inputValue);
      }
      this.taginputvisible = false;
      this.taginputvalue = '';
    },
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
  .input-new-tag{display: inline-block!important;width: auto;}
  .tastetag{margin: 0 5px;}
</style>
