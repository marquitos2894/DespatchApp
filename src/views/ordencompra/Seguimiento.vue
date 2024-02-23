<template>
    
    <BlockUI :blocked="blockedDocument1" :fullScreen="true"></BlockUI>
    <ProgressBar mode="indeterminate" style="height: .5em" v-if="pbloaddata" />   
    <Toast />
    <Toast position="bottom-right" group="br" />
    <div class="card">

        <Toast />
        <Button label="Carrito" icon="pi pi-shopping-bag" @click="openBasic2" v-model:badge="cantcarrito"  />

        <div class="table-header-container">
            <div class="grid grid-nogutter">
                <div class="col-5" style="text-align: left">
                    <div class="table-header-container" id="seleccionmultiple">
                        <SelectButton @click="SelectStatus($event)" v-model="value_status"  :options="StatusOptions" optionLabel="name" multiple aria-labelledby="multiple" />
                    </div>
                </div>
                <div class="col-4" style="text-align: right">
                    
                </div>

                <div class="col-2" style="text-align: right">
                    <Button icon="pi pi-clone" @click="loadCart" class="mr-2" :disabled="carrito.length?true:false" />
                </div>
            </div>          
        </div>

        <!-- MAIN ---------------AQUIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII  -->
        <DataTable :value="listaordenes" :rowClass="rowClass" v-model:expandedRows="expandedRows" dataKey="id" selectionMode="single"
            @rowExpand="onRowExpand"  responsiveLayout="scroll">
            <template #header  >
                
            </template>
            <Column :expander="true" headerStyle="width: 3rem"  />
            <Column field="id_oc" header="OC" sortable>
            </Column>

            <Column field="componente" header="COMPONENTE"  sortable  ></Column >
            <Column field="n_parte" header="NPARTE" sortable></Column>
            <Column field="cant" header="QTY" sortable></Column>
            <Column field="qty_atendida" header="ATEND." sortable></Column>
            <Column field="estado" header="ESTADO" sortable>
                <template #body="slotProps">
                    <div class="col-12 md:col-3"  >
                        <Tag :severity="slotProps.data.estado.color" >{{slotProps.data.estado.nombre}}</Tag>
                    </div>
                </template>
            </Column>
            <Column >
                <template #body="slotProps">
                    <div class="col-1 md:col-1"  >
                        <i :class="classselectcart(slotProps.data)" style="font-size: 1rem;color:blue;"></i>
                    </div> 
                </template>
            </Column>

            <Column field="param_qty" style="min-width:10rem">
                <template #body="slotProps"  >
                    
                    <div class="col-12 md:col-12">
                        <div class="p-inputgroup">
                            <InputNumber placeholder="qty"  v-model="slotProps.data[param_qty]"  :disabled="slotProps.data.cant == slotProps.data.qty_atendida?true:false" />
                            <Button icon="pi pi-plus" class="p-button p-button-success mr-2" @click="prevAddItem(slotProps.data)" :disabled="slotProps.data.cant == slotProps.data.qty_atendida?true:false" />
                        </div>
                    </div>
                </template>
            </Column>

            <template #expansion="slotProps">
                <div class="orders-subtable">
                    <h5>Orden de {{slotProps.data.componente}} -{{slotProps.data.n_parte}}</h5>
                    <DataTable :value="slotProps.data.historialordenes" responsiveLayout="scroll">
                        <Column field="detalleoc_id" header="Id" sortable></Column>
                        <Column field="qty" header="qty" sortable></Column>
                        <Column field="fecha" header="fecha" sortable></Column>
                        <Column field="documento" header="documento" sortable></Column>
                        <Column field="numero" header="numero" sortable> </Column>
                        <Column field="param_qty" style="min-width:10rem">
                            <template #body="slotProps" >
                                
                                <Button icon="pi pi-times" class="p-button-rounded p-button-danger p-button-text" @click="ElimiarItemHistorial(slotProps.data.id,$event)" />
                            </template>
                        </Column>
                    </DataTable>
                    <ProgressBar mode="indeterminate" style="height: .5em" v-if="pbdeleteitem" />   
                </div>
            </template>
            
        </DataTable>
	</div>



    <ConfirmPopup></ConfirmPopup>

    <Dialog header="Registro de componentes" v-model:visible="displayBasic2" :breakpoints="{'960px': '75vw', '640px': '90vw'}" :style="{width: '50vw'}">
        <div class="p-fluid formgrid grid">
            <div class="field col-12 md:col-4">
                <label for="basic">Documento(*)</label>
                <Dropdown v-model="documento" :options="[{name:'FACTURA'},{name:'GUIA'}]" optionLabel="name" :editable="true" maxlength="35"/>
                <InlineMessage v-if="validation[0].valor">{{validation[0].name}}</InlineMessage>
            </div>
            <div class="field col-12 md:col-4">
                <label for="ssn">Numero(*)</label>
                <InputText v-model="numero" placeholder="Z0000000" maxlength="20"/>
                <InlineMessage v-if="validation[1].valor">{{validation[1].name}}</InlineMessage>
            </div>
            <div class="field col-12 md:col-4">
                <label for="ssn">Fecha(*)</label>
                <Calendar v-model="fecha_r" dateFormat="dd/mm/yy" />
                <InlineMessage v-if="validation[2].valor">{{validation[2].name}}</InlineMessage>
            </div>

        </div>  
        
        <div>
            <DataTable :value="carrito" responsiveLayout="scroll">
                <Column field="componente" header="COMPONENTE"></Column>
                <Column field="nparte" header="NPARTE"></Column>
                <Column field="cant" header="CANT"></Column>
                <Column field="qty_restante" header="RES"></Column>
                <Column class="instock" field="qty_r" header="QTY reg." >
                    <template #body="slotProps">
                        <div :class="qtyregistrasclass(slotProps.data)">
                            {{slotProps.data.qty_r}}
                        </div>
                    </template>
                </Column>
                <Column field="Opc" header="OPC">
                    <template #body="slotProps">
                        <div class="col-12 md:col-3">
                            <a href="#" @click="RemoveItemCart(slotProps.data)"><i class="pi pi-times"></i></a>
                        </div>
                    </template>
                </Column>
            </DataTable>
            <div class="col-12 md:col-12">
                <InlineMessage :severity="mesg.severity">{{mesg.mensaje}}</InlineMessage>
            </div>
        </div>
        <ProgressBar mode="indeterminate" style="height: .5em" v-if="pbreg" />    
        <template #footer>
            <Button label="Vaciar" icon="pi pi-times" @click="ClearCarrito" class="p-button-text"/>
            <Button label="Registrar" icon="pi pi-check" @click="saveRegistros($event)" :disabled="disabledregistrar" autofocus />
        </template>
    </Dialog>

</template>

<script>
    import { ref, onMounted, computed } from 'vue';
    import { useToast } from 'primevue/usetoast';
    import { useConfirm } from "primevue/useconfirm";
    import * as ordenService from '@/services/ordencompra.service.js';
    import Calendar from 'primevue/calendar';
    import { useRoute } from 'vue-router'
    import BlockUI from 'primevue/blockui';
 

    export default{

        setup(){
            const route = useRoute()
            const confirm = useConfirm();
            const toast = useToast();
            const listaordenes = ref();
            const listaHistorial = ref();
            const expandedRows = ref([]);
            const param_qty = ref(0);
            const carrito = ref([]);
            const displayBasic2 = ref(false);
            const documento = ref();
            const numero = ref();
            const fecha_r = ref(new Date());
            const id_oc = ref()
            //const value_status = ref([ { "name": "Pendiente", "value": "1" }, { "name": "Parcial", "value": "2" }, { "name": "Completo", "value": "3" } ]);
            const value_status = ref([]);
            const options = ref(['Off', 'On']);
            const StatusOptions = ref([
                {name: 'Pendiente', value: '1'},
                {name: 'Parcial', value: '2'},
                {name: 'Completo', value: '3'}
            ]);

            const mesg = ref({severity:'',mensaje:''})
            const validation = ref([
                {name:'documento requerido',valor:false},
                {name:'numero requerido',valor:false},
                {name:'fecha requerido',valor:false}
            ])

            const disabledregistrar = ref(false);
            const pbreg = ref(false);
            const pbdeleteitem = ref(false);

            const blockedDocument1 = ref(false);
            const pbloaddata = ref(false)
 
            onMounted(()=>{
               // var url_string = window.location.href;
                //var url = new URL(url_string);

                //once its ready we can access the query params
                //console.log(route.query.id_oc)
                id_oc.value = route.query.id_oc;
                //id_oc.value = route.params.idoc;
                //var id_fact = url.searchParams.get("factura");
                getDetalleOrden();  

            });

            const prevAddItem = async (data) =>{
                //console.log(data);
                selectadd(data.id);
               //await rowClass(lista,1586);

                let qty_restante= data.cant - data.qty_atendida
                if(data[0]>qty_restante){
                    
                    return ToasAlert('error','Cantidad > Restante','La cantidad a ingresar es superior');   
                }

                //find = (carrito.value.find(e=>e.id==data.id))?true:false;

                let find =  undefined || carrito.value.find(e=>e.id==data.id);

                if(find){
                    console.log(find);
                    return ToasAlert('error','Item repetido',`El producto ${data.componente}-${data.nparte} ya esta en el carrito`); 
                }

                carrito.value.push({
                    qty_r:  (isNaN(parseInt(data[0])))?data.cant - data.qty_atendida :parseInt(data[0]),
                    id:data.id,
                    oc: data.id_oc,
                    componente:data.componente,
                    nparte:data.n_parte,
                    cant:data.cant,
                    qty_restante
                });  
            };

            const saveRegistros = async (event) =>{
                //formatfecha(fecha_r.value);
                
                if(carrito.value.length==0){
                    return InlineMessage('error','El carrito esta vacio!');
                }

                documento.value = (documento.value.name===undefined) ? documento.value : documento.value.name;
                if(documento.value==undefined || blankclean(documento.value)==''){
                    console.log('vacio')
                    return validation.value[0].valor=true;   
                }
                validation.value[0].valor=false;
                if(numero.value==undefined || blankclean(numero.value)==''){
                    console.log('vacio')
                    return validation.value[1].valor=true;
                }
                validation.value[1].valor=false;

                /*if(fecha_r.value==undefined || blankclean(fecha_r.value)==''){
                    console.log('vacio')
                    return validation.value[2].valor=true;
                }
                validation.value[2].valor=false;*/
                

                //console.log(resp);
               
                confirm.require ({ /// HACER PROGRESS BAR PARA EL BOTON REGISTAR 04/10/2022 *listo 04/10/2022
                    target: event.currentTarget,
                    message: 'Seguro que desea proceder?',
                    icon: 'pi pi-exclamation-triangle',
                    accept: async () => {
                        disabledregistrar.value = true;
                        pbreg.value = true;
                        blockedDocument1.value = true;
                        let fecha = `${fecha_r.value.getFullYear()}-${fecha_r.value .getMonth() + 1}-${fecha_r.value.getDate()}`;
                        
                        const resp = await ordenService.saveRegistros(carrito.value,documento.value,numero.value,fecha,id_oc.value);
                        console.log(resp)
                        if(resp.status == 200){
                        ToasAlert('success','Registro exitoso!','Los datos han sido registrados.')
                        ClearCarrito();
                        carrito.value = [];
                        getDetalleOrden();
                        disabledregistrar.value = false;
                        pbreg.value = false;
                        blockedDocument1.value = false;

                        }else{
                            ToasAlert('error','Error','Error al guardar registros');
                            disabledregistrar.value = false;
                            pbreg.value = false;
                            blockedDocument1.value = false;
                        }

                    },
                    reject: () => {
                        toast.add({severity:'error', summary:'Rejected', detail:'You have rejected', life: 3000});
                    }                  
                });
            }

            const getDetalleOrden = async () =>{
                pbloaddata.value = true;
                blockedDocument1.value = true;
                const resp = await ordenService.listarOrdenCompraPorId2(id_oc.value);

                if(resp.status == 200){
                    listaordenes.value = resp.data;
                    console.log(listaordenes.value)

                    for(let i of listaordenes.value){
                        i.seleccion = 0;
                        i.carrito = 0;
                    }

                    pbloaddata.value = false;
                    blockedDocument1.value = false;
                    return listaordenes.value;
                }else{
                    ToasAlert('error','Error en el servidor','Ha ocurrido un error en el servidor, contactar con soporte')
                    pbloaddata.value = false;
                    blockedDocument1.value = false;
                }

            }

            const getDetalleHistorial = async (id) =>{
                const resp = await ordenService.listarHistorialPorId(id);
                //listaHistorial.value = await resp.data
                //console.log(listadetordenes.value)
                console.log(resp.data)
                return resp.data;
            }

            const SelectStatus = async (e)=>{//capturar el evento y solo seleccionar los botones
                console.log(e.srcElement.role)
                
                if(e.srcElement.role!='group'){
                    if(value_status.value.length==0){
                        return getDetalleOrden();
                    }
                    console.log(value_status.value[0].name)
                    
                    pbloaddata.value = true;
                    blockedDocument1.value = true;
                    const resp = await ordenService.Status_filter(value_status.value,id_oc.value)
                    if(resp.status == 200){
                        pbloaddata.value = false;
                        blockedDocument1.value = false;
                        console.log(resp)
                        listaordenes.value = resp.data;
                    }else{
                        ToasAlert('error','Error en el servidor','Ha ocurrido un error en el servidor, contactar con soporte')
                        pbloaddata.value = false;
                        blockedDocument1.value = false;
                    }
                }
   
                /*for(let s of value_status.value){
                    console.log(s.name);
                }*/
            }

            const loadCart = async ()=>{

                for(let i of listaordenes.value){          
                    if(i.cant != i.qty_atendida){
                        carrito.value.push({
                        qty_r: i.cant - i.qty_atendida,
                        id:i.id,
                        oc: i.id_oc,
                        componente:i.componente,
                        nparte:i.n_parte,
                        cant:i.cant,
                        qty_restante:i.cant - i.qty_atendida,
                        carrito:1,
          
  
                        })

                        i.carrito = 1;
                        //listaordenes.value;
                    }
                    
                }

                return listaordenes.value;

                /*for(let i of listaordenes.value){
                    for(let c of carrito.value){
                        if(c.id == i.id){

                        }
                    }
                }*/ //completar el codigo, trata de validar que no se duplique los item al carrito

            }

            const RemoveItemCart=(prod)=>{
                console.log(prod);
                for(let list of listaordenes.value){
                    if(list.id==prod.id){
                        list.carrito = 0;
                        listaordenes.value;
                        return carrito.value.splice(carrito.value.indexOf(prod),1);
                    }
                }
            }

            const ClearCarrito = ()=>{
                carrito.value = [];
                closeModalCart();

                for(let list of listaordenes.value){
                    list.carrito = 0;
                }
                documento.value='';
                numero.value='';

                return listaordenes.value;
            }

            //const rowClass2 = (data) => {// probar con metodo de seleccion
                //id =  id || 1584;
                //return data.cant === 'Accessories' ? 'row-accessories': null;
                /*console.log(id);
                let find = carrito.value.find(e=>e.id==id);
                console.log(find);
                if(find===undefined){
                    console.log('undefined')
                }else{
                    console.log(find.id);
                    //return find.id === id ? 'row-accessories': null;
                    return  'row-accessories';
                }*/
                //id_selection.value = 1584;
                //data = listaordenes.value;
                /*console.log(id_selection.value);
                console.log(data);
                return data.id === id_selection.value ? 'row-accessories': null
            };*/

            const ElimiarItemHistorial = async (id,event)=>{
                console.log(id);
                
                confirm.require ({ /// HACER PROGRESS BAR PARA EL BOTON REGISTAR 04/10/2022 *listo 04/10/2022
                    target: event.currentTarget,
                    message: 'Seguro que desea eliminar el item?',
                    icon: 'pi pi-exclamation-triangle',
                    accept: async () => {
  
                        pbdeleteitem.value = true;
                        blockedDocument1.value = true;
      
                        const resp = await ordenService.DeleteItemHistorial(id);
                        if(resp.status == 200){
                            ToasAlert('success','Eliminacion Existosa!','Los datos han sido eliminados.')
                            pbdeleteitem.value = false;
                            blockedDocument1.value = false;
                            getDetalleOrden();

                        }else{
                            toast({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Error al guardar registros'
                            });
                            pbdeleteitem.value = false;
                            blockedDocument1.value = false;
                        }
                    },
                    reject: () => {
                        toast.add({severity:'error', summary:'Rejected', detail:'You have rejected', life: 3000});
                    }                  
                });
                
            }

            const rowClass = (data) => {
                return data.seleccion === 1 ? 'row-accessories': null;
            };

            const classselectcart = (data) => {
                return data.carrito === 1 ? 'pi pi-shopping-bag': null;
            };

            const selectadd=(id)=>{
                
                for(let list of listaordenes.value){
                    list.seleccion = 0;
                }

                for(let list of listaordenes.value){
                    if(list.id==id){
                        console.log(list.id)
                        list.seleccion = 1;
                        list.carrito = 1;
                        console.log(listaordenes.value);
                        //classselectcart();
                        //pi-cart-plus
                        return listaordenes.value;
                        //AGREGAR UNA NUEVA VARIABLE A LA LISTA Y CAMBIAR EN CADA SELECCION
                    }
                }
            }

            const InlineMessage = (severity,message)=>{
                mesg.value.severity = severity;
                mesg.value.mensaje = message;
            }

            const hiddenInlineMessage = ()=>{
                mesg.value.severity = '';
                mesg.value.mensaje = ''
            }

            const openBasic2 = () => {
                displayBasic2.value = true;
            };
            const closeModalCart = () => {
                displayBasic2.value = false;
            };
  
            const onRowExpand = async (event) => {
                //getDetalleOrden(925)
                //listaHistorial.value = await getDetalleHistorial(event.data.id);
                //toast.add({severity: 'info', summary: 'Product Expanded', detail: event.data.name, life: 3000});
            };
        
            const ToasAlert = (severity,titlesummary,mensaje) => {
                toast.add({severity:severity, summary: titlesummary, detail:mensaje, group: 'br', life: 4000});
            }

            const blankclean = (text)=>{
                let regEx = new RegExp(' ','g');//busca y selecciona los espacios en blancos
                return text.replace(regEx,'')//remplaza los espacios en blanco
            }

            const qtyregistrasclass = (data)=>{
                return [
                    {
                        'qtyreg_minor':data.qty_r<data.qty_restante,
                        'qtyreg_equals':data.qty_r === data.qty_restante
                    }
                ]
            }

            const cantcarrito = computed(()=>{
                if(carrito.value.length>0){
                    hiddenInlineMessage()
                }
                return carrito.value.length;
            });



            return {ElimiarItemHistorial,blockedDocument1,pbdeleteitem,pbloaddata,
                pbreg,disabledregistrar,qtyregistrasclass,blankclean,validation,hiddenInlineMessage,InlineMessage,mesg,loadCart,
                ClearCarrito,classselectcart,selectadd,rowClass,ToasAlert,RemoveItemCart,SelectStatus,StatusOptions,value_status,
                options,cantcarrito,numero,documento,saveRegistros,fecha_r,closeModalCart,openBasic2,displayBasic2,carrito,prevAddItem,
                listaordenes,listaHistorial, expandedRows, onRowExpand, getDetalleOrden,getDetalleHistorial,param_qty }

        },
        components: {
            BlockUI
        }   

  
   

    }


</script>


<style lang="scss" scoped>

.p-panel p {
    line-height: 1.5;
    margin: 0;
}

button {
    margin-right: .5rem;
}
.product-image {
    width: 50px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)
}

.orders-subtable {
    padding: 1rem;
}


@media screen and (max-width: 960px) {
    button {
        width: 100%;
        margin-bottom: .5rem;
    }
}

::v-deep(.qtyreg_equals){
    font-weight: 800;
    color: #66BB6A;
 
}

::v-deep(.qtyreg_minor){
    font-weight: 800;
    color: #FF5252;
}

::v-deep(.row-accessories) {
    background-color: rgba(0,0,0,.15) !important;
}


</style>    