<template>
    
    <div class="surface-card p-4 shadow-2 border-round w-full lg:w-6">
        <div class="text-center mb-5">
            <img src="/images/blocks/logos/hyper.svg" alt="Image" height="50" class="mb-3" />
            <div class="text-900 text-3xl font-medium mb-3">Welcome Back</div>
            <span class="text-600 font-medium line-height-3">Don't have an account?</span>
            <a class="font-medium no-underline ml-2 text-blue-500 cursor-pointer">Create today!</a>
        </div>

        <div>
            <label for="email1" class="block text-900 font-medium mb-2">Email</label>
            <InputText v-model="email" type="text" class="w-full mb-3" />

            <label for="password1" class="block text-900 font-medium mb-2">Password</label>
            <InputText v-model="password" type="password" class="w-full mb-3" />



            <Button label="Sign In" @click="ingresar($event)" icon="pi pi-user" class="w-full"></Button>
        </div>
    </div>

</template>

<script>
    import { ref, onMounted, computed } from 'vue';
    import * as authService from "@/services/auth.service.js";
    import  router from '@/router';


    export default {
        setup(){

            //const router = UseRouter()


            const email = ref();    
            const password = ref();

            //const usuario = ref()


            const ingresar = async (event)=> {
                try{

                    console.log(email.value,password.value);
                    const {data} = await authService.login(email.value,password.value)
                    console.log(data)
                    let token =data.access_token;
                    let company = data.company;
                    let sucursal = data.sucursal;
                    let addressCompany = data.addressCompany;
                    localStorage.setItem('access_token',token)
                    localStorage.setItem('company',JSON.stringify(company))
                    localStorage.setItem('sucursal',JSON.stringify(sucursal))
                    localStorage.setItem('addressCompany',JSON.stringify(addressCompany))
                    
                    //this.$store.dispatch('ingresarVuex', data)
                    router.push('/guiaremisioncreate')
                
                }catch(error){
                    console.log("*******:",error)
                }
                
            };

            return {
                ingresar,email,password,router
            }
        }
    
    }

</script>