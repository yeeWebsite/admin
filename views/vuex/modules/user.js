import * as types from '../mutation-types'

const setCookie = function(name, value){
  var exp = new Date();
  exp.setTime(exp.getTime() + 2*60*60*1000); //2小时过期
  document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString()+';domain=.enlottery.com;path=/;';
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
}

// getters
const getters = {
  userinfo: state => state,
  platform: state => state.platform,
  islogin: (state, getters) => {
    if(state.userck && state.userid){
      return true;
    }else return false;
  }
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
    //更新缓存信息
    commit(types.setUserLogout)
  },
  setPlatform({commit}, platform){
    //更新缓存信息
    commit(types.setPlatform, platform)
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
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
