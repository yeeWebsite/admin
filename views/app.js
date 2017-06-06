import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './vuex/store'
import 'element-ui/lib/theme-default/index.css'
import ElementUI from 'element-ui'

Vue.use(ElementUI)

//全局判断登录函数
router.beforeEach((to, from, next) => {
  //验证页面登录
  if (to.matched.some(record => record.meta.checkAuth)) {
    const islogin = store.getters.islogin;
    if(!islogin){
      next({
        path: '/account/login/',
        query: { backurl: to.fullPath }
      });
      next();
    }else{
      next();
    }
  } else {
    next() 
  }
})

new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
});
