import {api} from "../../api"

// const eStudy=JSON.parse(localStorage.getItem("eStudy"))||{};
const state = {
    loggedIn:false,
    info:{}
}
const getters = {

}
const mutations = {
    login(state,data){
        state.loggedIn=true;
        state.info=data;
        api.defaults.headers.common["Token"]=state.info.token
        // localStorage.setItem("eStudy",JSON.stringify({loggedIn:true,info:JSON.stringify(data)}))
    },
    updateToken(state,token){
        state.info.token=token;
    },
    logout(state){
        state.info={};
        state.loggedIn=false;
        api.defaults.headers.common["Token"]=""
    }
}
const actions = {
    login({commit},form){
        api.post("/auth/login",form).then(result=>{
            commit("login",result)
        })
    },
    logout({commit}){
        commit("logout")
    },
    //自动登陆Token续期
    checkedLogin({commit,state,dispatch}){
        api.defaults.headers.common["Token"]=state.info.token
        api.post("/auth/refreshToken",{},{_slient:true}).then((token)=>{
            commit("updateToken",token)
        }).catch(err=>{
            dispatch("logout");
        })

    },
}
export default {
    namespaced: true, //独立命名空间
    state,
    getters,
    mutations,
    actions
}