import * as types from './mutation-types'

export const setLogin = ({ commit }, userinfo) => {
  if(userinfo.ck && userinfo.uid){
    commit(types.setUserLogin, userinfo);
  }
}
