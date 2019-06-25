import wepy from 'wepy'

//服务器地址
const host = 'http://larabbs.app/api'

//普通请求
const request = async (options,showLoding=true)=>{
    //j简化开发，如果传入字符串则转成对象
    if(typeof options === 'string'){
        options = {
            url:options
        }
    }

    //显示加载中
    if(showLoding){
       wepy.showLoading({'title':'加载中...'})
    }

    //拼接请求地址
    options.url = host+'/'+options.url
    //调用小程序 request 方法
    let respongse = await wepy.request(options);
    if(showLoding){
        wepy.hideLoading();
    }
    if(request.statusCode===500){
       wepy.showModal({
           'title':'登陆',
           'content':'服务器出错'
       })
    }
    return respongse;
}

//登陆
const login = async (params={})=>{
    // code 只能使用一次，所以每次单独调用
    let loginData = await wepy.login()

    //参数中增加code
    params.code = loginData.code;

    let authResponse = await request({
        url:'weapp/authorizations',
        data:params,
        method:'POST'
    })
   
    //登陆成功，登记token信息
    if(authResponse.statusCode===201){
       wepy.setStorageSync('access_token',authResponse.data.access_token);
       wepy.setStorageSync('access_token_expired_at', new Date().getTime() + authResponse.data.expires_in * 1000)
    }

    return authResponse;

}

export default{
    request,
    login
}