import qs from 'qs'
import axios from 'axios'
import { Loading } from 'element-ui';

export const ajax = axios;

let loadingInstance;

// 添加请求拦截器
ajax.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  //请求默认配置
  config.timeout = 30000,
  config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
  //ajax请求默认参数配置
  const fields = {};
  let vuex = window.localStorage.vuex;
  if(vuex){
    vuex = JSON.parse(vuex);
    if(vuex.user){
      if(vuex.user.userid) fields.uid = vuex.user.userid;
      if(vuex.user.userck) fields.userck = vuex.user.userck;
      if(vuex.user.platform) fields.platform = vuex.user.platform;
    }
  }
  //设置post，get请求参数
  let indicator = {};
  if(config.method == 'post'){
    if(config.data && config.data.indicator){
      indicator = config.data.indicator;
    }
    config.data = qs.stringify(addFields(config.data, fields));
  }else{
    if(config.params && config.params.indicator){
      indicator = config.params.indicator;
    }
    config.params = addFields(config.params, fields);
  }
  //异步处理不显示加载中....
  config.headers['Indicator.async'] = indicator.async?indicator.async:false;
  config.headers['Indicator.duration'] = indicator.duration?indicator.duration:0;
  if(!config.headers['Indicator.async']){
    const target = document.getElementById('loading')?document.getElementById('loading'):document.body;
    loadingInstance = Loading.service({target:target, text:'正在加载...'});
  }
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
ajax.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  //异步处理不显示加载中....
  if(!response.config.headers['Indicator.async']){
    if(response.config.headers['Indicator.duration'] > 0){
      setTimeout(()=>{
        loadingInstance.close();
      }, response.config.headers['Indicator.duration']);
    }else{
      loadingInstance.close();
    }
  }
  return response;
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});

//所有请求添加附加字段
function addFields(param, obj){
  if(!param) param = {};
  for(var key in obj){
    if(!param[key]){
      param[key] = obj[key];
    }
  }
  if(param.indicator) delete param.indicator;
  return param;
}
