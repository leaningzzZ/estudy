import axios from "axios"
import Vue from "vue"
const api = axios.create({
    baseURL: "http://sandbox_api.estudy.chanke.xyz"
    // 登陆接口
})
api.defaults.headers.post["Content-Type"] = "application/json"

// 拦截器
api.interceptors.response.use(response => {
        return response.data.data
    },
    error => {
        // 错误提示
        const config=err.config;
        const response = error.response;
        if(!config._client){    //重新设置token时取消通知
            // console.log(response)
            Vue.$notification.error({
            message: "Api Error",
            description: response.data.errorMessage,
        })
        }
        return Promise.reject(error);
        // alert(response.data.errorMessage);
    })
export {
    api
}