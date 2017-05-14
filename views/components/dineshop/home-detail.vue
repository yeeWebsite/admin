<template>
  <div class="content">
    <headerComponent></headerComponent>
    <el-row class="tac" :gutter="10">
      <el-col :span="4">
        <leftComponent></leftComponent>
      </el-col>
      <el-col :span="20">
        <breadtitleComponent></breadtitleComponent>
        <el-form ref="shopform" :model="shopform" label-width="80px" label-position="right">
          <el-form-item label="店铺名称">
            <el-input v-model="shopform.name"></el-input>
          </el-form-item>
          <el-form-item label="店铺图标">
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
          <el-form-item label="店铺描述">
            <el-input type="textarea" v-model="shopform.desc"></el-input>
          </el-form-item>
          <el-form-item label="餐位费">
            <el-input v-model="shopform.price" class="inlineinput">
              <template slot="append">元/人</template>
            </el-input>
          </el-form-item>
          <el-form-item label="可否外卖">
            <el-radio-group v-model="shopform.takeout" class="radiogroup">
              <el-radio label="0">否</el-radio>
              <el-radio label="1">是</el-radio>
            </el-radio-group>
            <el-input v-show="shopform.takeout == '1'" v-model="shopform.takeoutprice" class="inlineinput">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="所属区域">
            <el-cascader
                class="districtcascader"
                :options="districtoptions"
                v-model="selecteddistrictoptions"
                @change="handleDistrictChange">
            </el-cascader>
          </el-form-item>
          <el-form-item label="详细地址">
            <el-input type="textarea" v-model="shopform.detailaddress"></el-input>
          </el-form-item>
          <el-form-item label="营业时间">
            <el-time-picker
                is-range
                v-model="shopform.businesstime"
                format="HH:mm"
                placeholder="选择时间范围">
            </el-time-picker>
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input v-model="shopform.phone" class="inlineinput"></el-input>
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
  import {ajax} from "@/libs/ajax"
  import {mapGetters, mapActions} from 'vuex'

  export default {
    data() {
      return {
        //页面data数据源
        takeoutpricevisible: false,
        shopform: {
          name: '',
          desc: '',
          price: '',
          takeout: '0',
          takeoutprice: '',
          detailaddress:'',
          businesstime:'',
          phone:''
        },
        fileList: [{
          name: 'food.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        }],
        districtoptions: [
          {
            value: 'zhinan',
            label: '指南',
            children: [{
              value: 'shejiyuanze',
              label: '设计原则',
              children: [{
                value: 'yizhi',
                label: '一致'
              }, {
                value: 'fankui',
                label: '反馈'
              }, {
                value: 'xiaolv',
                label: '效率'
              }, {
                value: 'kekong',
                label: '可控'
              }]
            }, {
              value: 'daohang',
              label: '导航',
              children: [{
                value: 'cexiangdaohang',
                label: '侧向导航'
              }, {
                value: 'dingbudaohang',
                label: '顶部导航'
              }]
            }]
          }, {
            value: 'zujian',
            label: '组件',
            children: [{
              value: 'basic',
              label: 'Basic',
              children: [{
                value: 'layout',
                label: 'Layout 布局'
              }, {
                value: 'color',
                label: 'Color 色彩'
              }, {
                value: 'typography',
                label: 'Typography 字体'
              }, {
                value: 'icon',
                label: 'Icon 图标'
              }, {
                value: 'button',
                label: 'Button 按钮'
              }]
            }, {
              value: 'form',
              label: 'Form',
              children: [{
                value: 'radio',
                label: 'Radio 单选框'
              }, {
                value: 'checkbox',
                label: 'Checkbox 多选框'
              }, {
                value: 'input',
                label: 'Input 输入框'
              }, {
                value: 'input-number',
                label: 'InputNumber 计数器'
              }, {
                value: 'select',
                label: 'Select 选择器'
              }, {
                value: 'cascader',
                label: 'Cascader 级联选择器'
              }, {
                value: 'switch',
                label: 'Switch 开关'
              }, {
                value: 'slider',
                label: 'Slider 滑块'
              }, {
                value: 'time-picker',
                label: 'TimePicker 时间选择器'
              }, {
                value: 'date-picker',
                label: 'DatePicker 日期选择器'
              }, {
                value: 'datetime-picker',
                label: 'DateTimePicker 日期时间选择器'
              }, {
                value: 'upload',
                label: 'Upload 上传'
              }, {
                value: 'rate',
                label: 'Rate 评分'
              }, {
                value: 'form',
                label: 'Form 表单'
              }]
            }, {
              value: 'data',
              label: 'Data',
              children: [{
                value: 'table',
                label: 'Table 表格'
              }, {
                value: 'tag',
                label: 'Tag 标签'
              }, {
                value: 'progress',
                label: 'Progress 进度条'
              }, {
                value: 'tree',
                label: 'Tree 树形控件'
              }, {
                value: 'pagination',
                label: 'Pagination 分页'
              }, {
                value: 'badge',
                label: 'Badge 标记'
              }]
            }, {
              value: 'notice',
              label: 'Notice',
              children: [{
                value: 'alert',
                label: 'Alert 警告'
              }, {
                value: 'loading',
                label: 'Loading 加载'
              }, {
                value: 'message',
                label: 'Message 消息提示'
              }, {
                value: 'message-box',
                label: 'MessageBox 弹框'
              }, {
                value: 'notification',
                label: 'Notification 通知'
              }]
            }, {
              value: 'navigation',
              label: 'Navigation',
              children: [{
                value: 'menu',
                label: 'NavMenu 导航菜单'
              }, {
                value: 'tabs',
                label: 'Tabs 标签页'
              }, {
                value: 'breadcrumb',
                label: 'Breadcrumb 面包屑'
              }, {
                value: 'dropdown',
                label: 'Dropdown 下拉菜单'
              }, {
                value: 'steps',
                label: 'Steps 步骤条'
              }]
            }, {
              value: 'others',
              label: 'Others',
              children: [{
                value: 'dialog',
                label: 'Dialog 对话框'
              }, {
                value: 'tooltip',
                label: 'Tooltip 文字提示'
              }, {
                value: 'popover',
                label: 'Popover 弹出框'
              }, {
                value: 'card',
                label: 'Card 卡片'
              }, {
                value: 'carousel',
                label: 'Carousel 走马灯'
              }, {
                value: 'collapse',
                label: 'Collapse 折叠面板'
              }]
            }]
          }, {
            value: 'ziyuan',
            label: '资源',
            children: [{
              value: 'axure',
              label: 'Axure Components'
            }, {
              value: 'sketch',
              label: 'Sketch Templates'
            }, {
              value: 'jiaohu',
              label: '组件交互文档'
            }]
          }],
        selecteddistrictoptions: [],
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
      handleDistrictChange(value) {
        console.log(value);
      }
    },
    computed: {
      ...mapGetters({}),
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
    watch: {}
  }
</script>

<style type="text/css">
  .inlineinput {width: 150px;}
  .radiogroup {margin-right: 20px;}
  .districtcascader{width: 300px;}
  .el-time-panel__content::after, .el-time-panel__content::before{margin-top: -6px;}
</style>
