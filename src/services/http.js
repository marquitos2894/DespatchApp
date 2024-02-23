import axios from "axios";


export const urlbase = 'http://corimayoapi_greenter.test/api/';
//export const urlbase = 'http://localhost/corimayoapi_greenter/public/api/';

export function http(){

    let token = localStorage.getItem('access_token');
    console.log(token);
    
    //const toast = useToast(); 
    //axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    const interceptor = axios.create({
        baseURL: urlbase,
        headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token

        
        //'Authorization': none
        //'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        timeout: 15000
    });

    interceptor.interceptors.response.use(
        
        (response)=>{
            //toast.add({severity:'error', summary: 'error de registros', detail:'mensaje', group: 'br', life: 4000})
            return response;
        },
        (error)=>{

            
            console.log("******* INTERCEPTANDO **********");
            console.log("****** ERROR EN INTER",error.response);
            if(error.response.status === 422){
                console.log("****** ERROR EN INTER 422");
                window.location.href = "/login";
            }

            return error.response.status;
            
        }
    )

         
 
    return interceptor;



}