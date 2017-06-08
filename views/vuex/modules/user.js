import * as types from '../mutation-types'

const setCookie = function(name, value){
  var exp = new Date();
  exp.setTime(exp.getTime() + 2*60*60*1000); //2小时过期
  document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString()+';path=/;';
}
const getCookie = function(name){
  var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
  if(arr = document.cookie.match(reg))
    return unescape(arr[2]); 
  else 
    return null; 
}
const delCookie = function(name){
  var exp = new Date(); 
  exp.setTime(exp.getTime() - 1); 
  var old = getCookie(name); 
  if(old != null) document.cookie= name + "="+old+";expires="+exp.toGMTString(); 
}


// initial state
// shape: [{ id, quantity }]
const state = {
  userid: '',
  userck: '',
  platform: 4, //2 android, 3 ios, 5 H5
  shopinfo: '', //门店用户设置对应的门店信息
}

// getters
const getters = {
  userinfo: state => state,
  platform: state => state.platform,
  islogin: (state, getters) => {
    if(state.userck && state.userid){
      return true;
    }else return false;
  },
  isysadmin: (state, getters) => {
    return state.userid == 10001;
  },
  shopinfo: state => state.shopinfo
}

// actions
const actions = {
  setUserLogin({commit}, userinfo){
    if(!getCookie('userid')){
      setCookie('userid', userinfo.userid);
    }
    if(!getCookie('userck')){
      setCookie('userck', userinfo.userck);
    }
    //更新缓存信息
    commit(types.setUserLogin, userinfo)
  },
  setUserLogout({commit}){
    if(getCookie('userid')){
      delCookie('userid');
    }
    if(getCookie('userck')){
      delCookie('userck');
    }
    //更新缓存信息
    commit(types.setUserLogout)
    commit(types.clearShopinfo)
  },
  setPlatform({commit}, platform){
    //更新缓存信息
    commit(types.setPlatform, platform)
  },
  //设置门店信息
  setShopinfo({commit}, shopinfo){
    commit(types.setShopinfo, shopinfo)
  },
  //清除门店信息
  clearShopinfo({commit}){
    commit(types.setShopinfo)
  }
}

// mutations
const mutations = {
  [types.setUserLogin] (state, userinfo){
    state.userck = userinfo.userck || '';
    state.userid = userinfo.userid || '';
  },
  [types.setUserLogout] (state){
    state.userck = '';
    state.userid = '';
    state.platform = 4;
  },
  [types.setPlatform] (state, platform){
    state.platform = platform || 4;
  },
  [types.setShopinfo] (state, shopinfo){
    state.shopinfo = shopinfo;
  },
  [types.clearShopinfo] (state){
    state.shopinfo = '';
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
