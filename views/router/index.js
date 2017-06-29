import Vue from 'vue';
import router from 'vue-router';

const routerView = { template: '<router-view></router-view>' };
Vue.use(router);

export default new router({
  routes: [
    //首页
    {
      path:'/',
      component: r => require.ensure([], () => r(routerView), 'home'),
      children:[
        {
          name:'首页',
          path:'/', //首页
          component: r => require.ensure([], () => r(require('components/home.vue')), 'home')
        },
        {
          path:'test', //首页
          component: r => require.ensure([], () => r(require('components/left.vue')), 'home')
        },
        {
          path:'dineshop', //门店管理
          component: r => require.ensure([], () => r(routerView), 'dineshop'),
          children:[
            {
              name:'门店列表',
              path:'/', //门店列表
              component: r => require.ensure([], () => r(require('components/dineshop/home.vue')), 'dineshop'),
            },
            {
              name:'门店信息新增/修改',
              path:'detail', //门店列表
              component: r => require.ensure([], () => r(require('components/dineshop/home-detail.vue')), 'dineshop'),
            },
            {
              name:'放号管理',
              path:'sellinfo', //放号管理
              component: r => require.ensure([], () => r(require('components/dineshop/sellinfo.vue')), 'dineshop')
            },
            {
              name:'折扣管理',
              path:'discount', //折扣管理
              component: r => require.ensure([], () => r(require('components/dineshop/discount.vue')), 'dineshop')
            },
            {
              name:'桌型管理',
              path:'deskinfo', //折扣管理
              component: r => require.ensure([], () => r(require('components/dineshop/deskinfo.vue')), 'dineshop')
            },
            {
              name:'推荐门店信息',
              path:'recomd', //折扣管理
              component: r => require.ensure([], () => r(require('components/dineshop/recomd.vue')), 'food')
            }
          ]
        },
        {
          path:'food', //菜肴
          component: r => require.ensure([], () => r(routerView), 'food'),
          children:[
            {
              path:'dishes',
              component: r => require.ensure([], () => r(routerView), 'dineshop'),
              children:[
                {
                  name:'菜肴信息',
                  path:'/', //菜肴信息
                  component: r => require.ensure([], () => r(require('components/food/dishes.vue')), 'food'),
                },
                {
                  name:'菜肴信息新增/修改',
                  path:'detail', //折扣管理
                  component: r => require.ensure([], () => r(require('components/food/dishes-detail.vue')), 'food')
                }
              ]
            },
            {
              name:'菜肴分类管理',
              path:'classify', //菜肴分类管理
              component: r => require.ensure([], () => r(require('components/food/classify.vue')), 'food')
            },
            {
              name:'推荐菜肴信息',
              path:'recomdishes', //折扣管理
              component: r => require.ensure([], () => r(require('components/food/dishes-recom.vue')), 'food')
            }
          ]
        },
        {
          path:'orders', //订单管理
          component: r => require.ensure([], () => r(routerView), 'orders'),
          children:[
            {
              name:'外卖订单',
              path:'/', //外卖订单
              component: r => require.ensure([], () => r(require('components/orders/takeout.vue')), 'orders')
            },
            {
              name:'食堂订单',
              path:'eatin', //食堂订单
              component: r => require.ensure([], () => r(require('components/orders/eatin.vue')), 'orders')
            }
          ]
        },
        {
          path:'money', //资金管理
          component: r => require.ensure([], () => r(routerView), 'money'),
          children:[
            {
              name:'押金/余额',
              path:'/', 
              component: r => require.ensure([], () => r(require('components/money/home.vue')), 'money')
            },
            {
              name:'店铺收益金',
              path:'lucre',
              component: r => require.ensure([], () => r(require('components/money/lucre.vue')), 'money')
            }
          ]
        },
        {
          path:'user', //用户管理
          component: r => require.ensure([], () => r(routerView), 'user'),
          children:[
            {
              name:'用户管理',
              path:'/', 
              component: r => require.ensure([], () => r(require('components/user/home.vue')), 'user')
            },
            {
              name:'门店用户管理',
              path:'admin', 
              component: r => require.ensure([], () => r(require('components/user/admin.vue')), 'user')
            },
            {
              name:'用户登录',
              path:'login', 
              component: r => require.ensure([], () => r(require('components/user/login.vue')), 'user')
            },
            {
              name:'权限管理',
              path:'power',
              component: r => require.ensure([], () => r(require('components/user/power.vue')), 'user')
            }
          ]
        },
      ]
    },
    //404
    {path:'*', name:'404', component: r => require.ensure([], () => r(require('components/404.vue')), '404') }
  ]
});
