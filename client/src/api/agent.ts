import axios, { AxiosError, AxiosResponse } from "axios";


import "../../node_modules/react-toastify/dist/ReactToastify.css"
import { toast } from 'react-toastify';
import { history } from './../index';
import { store, useAppSelector } from "../store/configureStore";
import { PaginationResponse } from "../models/pagination";
import { RequestPageSharp } from "@mui/icons-material";



axios.defaults.baseURL = process.env.NODE_ENV === 'development' ? "http://localhost:16310/api/" : "/api/"

//axios.defaults.baseURL = process.env.REACT_APP_API_URL

//axios.defaults.baseURL = "http://localhost:16310/api/"

axios.defaults.withCredentials = true

const resBody = (response: AxiosResponse) => response.data

const sleep = () => new Promise(resolve => setTimeout(resolve,500))

axios.interceptors.request.use(config => {
    const token = store.getState().account.user?.token
    if(token) config.headers!.Authorization = `Bearer ${token}`
    return config
})


axios.interceptors.response.use(async response =>{
  //  if(process.env.NODE_ENV === 'development') await sleep()
  await sleep()
        

    const pagination = response.headers['pagination']
  
    if(pagination){
        response.data = new  PaginationResponse(response.data, JSON.parse(pagination))
        return response

    }
    return response


  
},(error:AxiosError) => {
    const {data, status} = error.response as any

    switch(status){
        case 400: 
        if(data.errors){
            const modelStateErrors : string [] = []
            for(const key in  data.errors){
                if(data.errors[key]){
                    modelStateErrors.push(data.errors[key])
                }       
            }
    
            throw modelStateErrors.flat()
            
        }
        toast.error(data.title)
        
        break
        case 404: 
        history.push('/not-found')
        break
        
        case 500: 
        // history.push('/server-error')
        history.push({
            pathname: '/server-error',
            state : {error: data}
        }
        )
        break
        
        case 401: toast.error(data.title)
        break

        default: break

    }
   // toast.error(data.title)

    return Promise.reject(error.response)
}
    )

const request = {
    // get : (url : string, params?:URLSearchParams) => axios.get(url, {params}).then(resBody),
    get : (url:string, params?:URLSearchParams) => axios.get(url, {params}).then(resBody),
    post : (url:string, body:{}) => axios.post(url, body).then(resBody),
    put : (url:string, body:{}) => axios.put(url, body).then(resBody),
    delete: (url:string) => axios.delete(url).then(resBody),
    postForm : (url:string, data: FormData) => axios.post(url, data, {
        headers : {'Content-type':'multipart/form-data'}
    }).then(resBody),
    putForm : (url:string, data: FormData) => axios.put(url, data, {
        headers : {'Content-type':'multipart/form-data'}
    }).then(resBody)
}

const catalog = {
     list : (params:URLSearchParams)=>  request.get('Products',params),
    //  list : () => request.get(`Products?OrderBy=name&SerachItem=v&PageNumber=1&PageSize=6`),
                            
    details : (id:number) => request.get(`products/${id}`),
    fetchfilters : ()=> request.get('products/filters')
}


const basket = {
    get : ()=> request.get('Basket'),
    addItem : (productId : number, quantity = 1)=> request.post(`basket?productId=${productId}&quantity=${quantity}`, {}),
    removeItem : (productId : number, quantity = 1)=> request.delete(`basket?productId=${productId}&quantity=${quantity}`)
}

const testErrors = {
    get400error: ()=>request.get('buggy/bad-request').catch(error => console.log(error)),
    get401error: ()=> request.get('buggy/unauthorised').catch(error=>console.log(error)),
    get404error: ()=> request.get('buggy/not-found').catch(error => console.log(error)),
    get500error: ()=> request.get('buggy/server-error').catch(error => console.log(error)),
    getvalidationerror: ()=> request.get('buggy/validation-error')
}


const account = {
    login: (values:any) => request.post('account/login', values),
    register: (values:any) => request.post('account/register',values),
    currentUser : ()=> request.get('account/currentUser'),
    fetchAddress: ()=> request.get('account/saveAddress')
}

const orders ={
    list: ()=> request.get('orders'),
    fetch : (id:number) => request.get(`orders${id}`),
    create : (values:any) => request.post('orders', values),
   
}

const payment= {
    createPaymentIntent : ()=> request.post('payment', {})
}

const createFormData = (item:any) => {
    let formData = new FormData()
    for (const key in item){
        formData.append(key, item[key])
    }
    return formData
}

const admin  ={
    createProduct: (product:any) => request.postForm('products', createFormData(product)),
    updateProduct: (product:any) => request.putForm('products', createFormData(product)),
    deleteProduct: (id:number) => request.delete(`products/${id}`),
}

const agent = {
    catalog,
    testErrors,
    basket,
    account,
    orders,
    payment,
    admin
}

export default agent;