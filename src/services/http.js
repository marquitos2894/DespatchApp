import axios from "axios";
import { useToast } from 'primevue/usetoast';

export const urlbase = 'https://apiapporderseg.appconmiciv.com/api';

export function http(){
    
    //const toast = useToast(); 
    
    const interceptor = axios.create({
        baseURL: urlbase,
        headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
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