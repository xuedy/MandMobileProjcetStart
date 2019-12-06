import Axios from 'axios'
 
// 设置后端api路径
if (process.env.NODE_ENV == 'development') {    
  Axios.defaults.baseURL = 'http://127.0.0.1:8080/api/sign';} 
else if (process.env.NODE_ENV == 'testing') {    
  Axios.defaults.baseURL = 'http://127.0.0.1:8080/api/sign';
} 
else if (process.env.NODE_ENV == 'production') {    
  Axios.defaults.baseURL = 'http://127.0.0.1:8080/api/sign';
}
Axios.defaults.timeout = 10000;
// Axios.defaults.headers['Access-Control-Allow-Origin'] = '*'
// Axios.defaults.headers['Access-Control-Allow-Methods'] = 'POST'
// Axios.defaults.headers['Access-Control-Allow-Headers'] = 'x-requested-with,content-type'
// 设置请求头
Axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
 
Axios.interceptors.request.use(config => {
//   config.headers['Accept-Key'] = Store.getters.key
  return config
}, error => {
  Promise.reject(error)
})
 
// 设置拦截 出现错误时提示 错误信息
Axios.interceptors.response.use(response => response, error => {
  return Promise.reject(error)
})
 
export default Axios
