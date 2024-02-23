<template>
    <ProgressBar v-if="(loading)" mode="indeterminate" style="height: 6px"></ProgressBar>
    <div class="card p-fluid">
        <Toast />

        <DataView :value="products" paginator :rows="5" >
            <template #list="slotProps">
                    <div v-for="(item, index) in slotProps.items" :key="index">
                        <div class="grid">
                            <div class="col-fixed" style="width:30%">
                                <div class="p-3 border-round-sm ">
                                    <span class="ml-2 font-medium font-bold">{{ item.fechaEmision }} </span>
                                    <hr>
                                    <div class="flex flex-column align-items-center sm:align-items-start gap-3">
                                        <div class="text-2xl font-bold text-900">{{ item.serie }} -{{ item.correlativo }} </div>
                                        <span class="font-semibold">{{ item.clients.razonsocial }}</span>
                                
                                        <div class="flex align-items-center gap-3">
                                            <span class="flex align-items-center gap-2">
                                                <i class="pi pi-tag"></i>
                                                <span class="font-semibold">SUNAT</span>
                                            </span>
                                            <div v-if="item.estcdrZip == '1'">
                                                <Tag icon="pi pi-check" severity="success" value="Aceptada"></Tag>
                                            </div>
                                            <div v-else>
                                                <Tag icon="pi pi-times" severity="danger" value="Pendiente"></Tag>
                                            </div>
                                        </div>     
                                    </div>
                                </div> 
                            </div>
                            <div class="col-fixed" style="width:50%">
                                <div class="p-3 border-round-sm ">
                                    <span class="ml-2 font-medium font-bold">Datos de envio</span>
                                    <hr>
                               
                                    <span class="flex align-items-center gap-2">
                                        <i class="pi pi-directions"></i>
                                        <span class="font-bold text-900">Punto Origen</span>
                                    </span>
                                    <span class="font-semibold">{{ item.data_sends[0].direccionPartida }}</span>
                                    
                                    <span class="flex align-items-center gap-2">
                                        <i class="pi pi-directions"></i>
                                        <span class="font-bold text-900">Punto Destino</span>
                                    </span>
                                    <span class="font-semibold">{{ item.data_sends[0].direccionLlegada }}</span>
                                </div> 
                                
                            </div>
                            <div class="col"  style="width:20%">
                                <ProgressBar v-if="(loading)" mode="indeterminate" style="height: 6px"></ProgressBar>
                                <div class="p-3 border-round-sm">
                                    <span class="ml-2 font-medium font-bold">Estado</span>
                                    <hr>
                   
                                    <div class="p-inputgroup" style="width:100%">
                                        <Button size="small" @click="pdf(item.id)" icon="pi pi-file-pdf" severity="danger" disabled/>
                                        <Button size="small" @click="pdf(item.id)" severity="danger"  label="PDF" disabled />
                                        <Button size="small" @click="pdf(item.id)" icon="pi pi-download" severity="danger" />
                                    </div>

                                    <br>
                                    <div v-if="item.estXml == '1'" class="p-inputgroup" style="width:100%">
                                        <Button size="small" icon="pi pi-check" severity="success" disabled />
                                        <Button size="small" severity="success"  label="XML" disabled />
                                        <Button size="small" icon="pi pi-download" severity="success"  />
                                    </div>
                                    <div v-else class="p-inputgroup" style="width:100%">
                                        <Button size="small" icon="pi pi-refresh"  @click="showAlertPrev(item.id,'XML','Deseas generar el XML?')" severity="secondary" />
                                        <Button size="small" severity="secondary"  label="XML" disabled />
                                    </div>
                                    <br>

                                    <div v-if="item.estcdrZip == '1'" class="p-inputgroup" style="width:100%">
                                        <Button size="small" icon="pi pi-check" severity="primary" disabled />
                                        <Button size="small" severity="primary" label="CDR" disabled  />
                                        <Button size="small" icon="pi pi-download" severity="primary"  />
                                    </div>
                                    <div v-else class="p-inputgroup" style="width:100%">
                                        <Button size="small" icon="pi pi-refresh"  @click="showAlertPrev(item.id,'CDR','Enviar documento a Sunat?')" severity="secondary" />
                                        <Button size="small" severity="secondary"  label="CDR" disabled />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!--InlineMessage v-show="stateMessage" severity="error">Error Message</InlineMessage-->
                        <hr>
                        
                    </div>
            </template>
        </DataView>

    </div>



    <Toast position="bottom-center" group="bc" @close="onClose">
        <template #message="slotProps">
            <div class="flex flex-column align-items-start" style="flex: 1">
                <div class="flex align-items-center gap-2">
                    <span class="font-bold text-900">{{ slotProps.message.title }} </span>
                </div>
                <div class="font-medium text-lg my-3 text-900">{{ slotProps.message.summary }}</div>
                <Button class="p-button-sm" severity="info" label="Enviar" @click="Accept()"></Button>
            </div>
        </template>
    </Toast>

    
    <Toast position="bottom-center" group="bc2" @close="onClose">
        <template #message="slotProps">
            <div class="flex flex-column align-items-start" style="flex: 1">
                <div class="flex align-items-center gap-2">
                    <span class="font-bold text-900">{{ slotProps.message.title }} </span>
                </div>
                <span class="font-medium text-lg my-3 text-900">{{ slotProps.message.summary}}</span>
                <span class="font-medium text-lg my-3 text-900">{{ slotProps.message.details}}</span>
            </div>
            
        </template>
    </Toast>


    <BlockUI :blocked="blocked" fullScreen />

</template>

<script setup>

    import * as guiaService from '@/services/guiaremision.service.js';
    
    import { ref, onMounted, resolveTransitionHooks } from 'vue';
    import { FilterMatchMode } from 'primevue/api';
    import DataView from 'primevue/dataview';
    import Tag from 'primevue/tag';
    import { useToast } from "primevue/usetoast";
    import ProgressSpinner from 'primevue/progressspinner';
    import BlockUI from 'primevue/blockui';


    const toast = useToast();
    const visible = ref(false);
    const products = ref([]);
    const menu = ref();
    const idguia = ref();
    const loading = ref(false);
    const blocked = ref(false);

    const accion =ref('');

    onMounted( async ()=>{
        loading.value = true ;
        DespatchesViews();
    });

    const pdf = async (data) => {
        blocked.value = true;
        loading.value = true;
        const resp = await guiaService.ViewDespatchIdService(data);
        let datos = resp['data']['0'];


        let data_create = {
            version: datos.version,
            tipoDoc:datos.tipoDoc,//Tipo de documento: 09 GUIA DE REMISION datos duros
            serie:datos.serie,
            correlativo:datos.correlativo,
            fechaEmision:datos.fechaEmision,
            company:{
                ruc:datos.companies.ruc,
                razonSocial:datos.companies.razon_social,
                nombreComercial:datos.companies.razon_social,
                address:{
                    ubigueo:datos.companies.address.ubigueo,
                    departamento:datos.companies.address.departamento,
                    provincia:datos.companies.address.provincia,
                    distrito:datos.companies.address.distrito,
                    urbanizacion:datos.companies.address.urbanizacion,
                    direccion:datos.companies.address.direccion,
                    codLocal:datos.companies.address.codLocal,
                }
            },
            destinatario:{
                tipoDoc:datos.clients.tipoDoc,
                numDoc:datos.clients.numDoc,
                rzSocial:datos.clients.razonsocial,
                address:{
                    ubigueo:datos.clients.address.ubigueo,
                    departamento:datos.clients.address.departamento,
                    provincia:datos.clients.address.provincia,
                    distrito:datos.clients.address.distrito,
                    urbanizacion:datos.clients.address.urbanizacion,
                    direccion:datos.clients.address.direccion,
                    codLocal:datos.clients.address.codLocal,
                }
            },
        
            envio:{
                codtraslado:datos.data_sends[0].codtraslado,
                modtraslado:datos.data_sends[0].modtraslado,
                fecTraslado:datos.data_sends[0].fecTraslado,
                pesoTotal: datos.data_sends[0].pesoTotal,
                undPesoTotal: datos.data_sends[0].undPesoTotal,
                llegada:{
                    ubigueo :datos.data_sends[0].ubigueollegada,
                    direccion: datos.data_sends[0].direccionLlegada,
                    codLocal: datos.data_sends[0].codLocalLlegada,
                    ruc: datos.data_sends[0].rucLlegada
                },
                partida:{
                    ubigueo :datos.data_sends[0].ubigueoPartida,
                    direccion: datos.data_sends[0].direccionPartida,
                    codLocal: datos.data_sends[0].codLocalPartida,
                    ruc: datos.data_sends[0].rucPartida
                },
                choferes:[
                    {
                        tipoDoc : datos.data_sends[0].tipoDocChofer,
                        nroDoc: datos.data_sends[0].nroDocChofer,
                        licencia: datos.data_sends[0].licenciaChofer,
                        nombres: datos.data_sends[0].nombresChofer,
                        apellidos: datos.data_sends[0].apellidosChofer
                    }
                ],
                vehiculos:[
                    {
                        placa : datos.data_sends[0].placaVehiculo,
                        mtc : datos.data_sends[0].mtcCirculacion 
                    }
                ],
                transportista:{
                    tipoDoc:datos.data_sends[0].tipoDocTransp,
                    numDoc: datos.data_sends[0].numDocTransp,
                    rzSocial: datos.data_sends[0].rzSocialTransp,
                    nroMtc: datos.data_sends[0].nroMtcTransp,
                    placa : datos.data_sends[0].placaVehiculo,
                    mtc : datos.data_sends[0].mtcCirculacion, 
                    choferTipoDoc : datos.data_sends[0].tipoDocChofer,
                    choferDoc: datos.data_sends[0].nroDocChofer
                }
            },

            details:datos.details,           
        };

        const pdf = await guiaService.DownloadDespatch(data_create);
        blocked.value = false;
        loading.value = false;

        console.log(pdf);
    }

    const xml = async (data) => {
        blocked.value = true;
        loading.value = true;
        console.log("click pdf",data );
        const resp = await guiaService.ViewDespatchIdService(data);
        let datos = resp['data']['0'];
        
        let data_create = {
            version: datos.version,
            tipoDoc:datos.tipoDoc,//Tipo de documento: 09 GUIA DE REMISION datos duros
            serie:datos.serie,
            correlativo:datos.correlativo,
            fechaEmision:datos.fechaEmision,
            company:{
                ruc:datos.companies.ruc,
                razonSocial:datos.companies.razon_social,
                nombreComercial:datos.companies.razon_social,
                address:{
                    ubigueo:datos.companies.address.ubigueo,
                    departamento:datos.companies.address.departamento,
                    provincia:datos.companies.address.provincia,
                    distrito:datos.companies.address.distrito,
                    urbanizacion:datos.companies.address.urbanizacion,
                    direccion:datos.companies.address.direccion,
                    codLocal:datos.companies.address.codLocal,
                }
            },
            destinatario:{
                tipoDoc:datos.clients.tipoDoc,
                numDoc:datos.clients.numDoc,
                rzSocial:datos.clients.razonsocial,
                address:{
                    ubigueo:datos.clients.address.ubigueo,
                    departamento:datos.clients.address.departamento,
                    provincia:datos.clients.address.provincia,
                    distrito:datos.clients.address.distrito,
                    urbanizacion:datos.clients.address.urbanizacion,
                    direccion:datos.clients.address.direccion,
                    codLocal:datos.clients.address.codLocal,
                }
            },
        
            envio:{
                codtraslado:datos.data_sends[0].codtraslado,
                modtraslado:datos.data_sends[0].modtraslado,
                fecTraslado:datos.data_sends[0].fecTraslado,
                pesoTotal: datos.data_sends[0].pesoTotal,
                undPesoTotal: datos.data_sends[0].undPesoTotal,
                llegada:{
                    ubigueo :datos.data_sends[0].ubigueollegada,
                    direccion: datos.data_sends[0].direccionLlegada,
                    codLocal: datos.data_sends[0].codLocalLlegada,
                    ruc: datos.data_sends[0].rucLlegada
                },
                partida:{
                    ubigueo :datos.data_sends[0].ubigueoPartida,
                    direccion: datos.data_sends[0].direccionPartida,
                    codLocal: datos.data_sends[0].codLocalPartida,
                    ruc: datos.data_sends[0].rucPartida
                },
                choferes:[
                    {
                        tipoDoc : datos.data_sends[0].tipoDocChofer,
                        nroDoc: datos.data_sends[0].nroDocChofer,
                        licencia: datos.data_sends[0].licenciaChofer,
                        nombres: datos.data_sends[0].nombresChofer,
                        apellidos: datos.data_sends[0].apellidosChofer
                    }
                ],
                vehiculos:[
                    {
                        placa : datos.data_sends[0].placaVehiculo,  
                    }
                ],
                
                transportista:{
                    tipoDoc:datos.data_sends[0].tipoDocTransp,
                    numDoc: datos.data_sends[0].numDocTransp,
                    rzSocial: datos.data_sends[0].rzSocialTransp,
                    nroMtc: datos.data_sends[0].nroMtcTransp,
                    placa : datos.data_sends[0].placaVehiculo,
                    mtc : datos.data_sends[0].mtcCirculacion,
                    choferTipoDoc : datos.data_sends[0].tipoDocChofer,
                    choferDoc: datos.data_sends[0].nroDocChofer,   //AGREGAR LO RESTANTE DOCCHOFER NRODOC NROCIRCULACION(agregar a la clase)
                },
            
            },

            details:datos.details,           
        };

        const xmlresponse = await guiaService.XmlDespatch(data_create);

        console.log(xmlresponse);

        let state, code, title, message,details;

        details = `${data_create['serie'] } - ${data_create['correlativo'] }`;
        state = (xmlresponse['data']['hash'].length) ? true : false;
        console.log(state)
        if(state){
            blocked.value = false;
            loading.value = false;
            //code = cdrresponse.data['sunatResponse']['cdrResponse']['code'];
            title =  `Respuesta xml : documento firmado`;
            //message = await cdrresponse.data['sunatResponse']['notes']['0'];
            message = xmlresponse['data']['hash'];
         
            showAlert('success',title,message,details);
          
        }else{
            //code = cdrresponse.data['sunatResponse']['error'].code;
            blocked.value = false;
            loading.value = false;
            title = await `Respuesta xml : Error al firmar`;
            message = `No se logro firmar el documento`;
 
            showAlert('error',title,message,details);
    
        }


        await DespatchesViews()
    }

    const cdr = async (data) => {
        blocked.value = true;
        loading.value = true;
        console.log("click pdf",data );
        const resp = await guiaService.ViewDespatchIdService(data);
        let datos = resp['data']['0'];
        
        let data_create = {
            version: datos.version,
            tipoDoc:datos.tipoDoc,//Tipo de documento: 09 GUIA DE REMISION datos duros
            serie:datos.serie,
            correlativo:datos.correlativo,
            //fechaEmision:'2024-01-09T05:00:00.000Z',
            fechaEmision:datos.fechaEmision,
            company:{
                ruc:datos.companies.ruc,
                razonSocial:datos.companies.razon_social,
                nombreComercial:datos.companies.razon_social,
                address:{
                    ubigueo:datos.companies.address.ubigueo,
                    departamento:datos.companies.address.departamento,
                    provincia:datos.companies.address.provincia,
                    distrito:datos.companies.address.distrito,
                    urbanizacion:datos.companies.address.urbanizacion,
                    direccion:datos.companies.address.direccion,
                    codLocal:datos.companies.address.codLocal,
                }
            },
            destinatario:{
                tipoDoc:datos.clients.tipoDoc,
                numDoc:datos.clients.numDoc,
                rzSocial:datos.clients.razonsocial,
                address:{
                    ubigueo:datos.clients.address.ubigueo,
                    departamento:datos.clients.address.departamento,
                    provincia:datos.clients.address.provincia,
                    distrito:datos.clients.address.distrito,
                    urbanizacion:datos.clients.address.urbanizacion,
                    direccion:datos.clients.address.direccion,
                    codLocal:datos.clients.address.codLocal,
                }
            },
        
            envio:{
                codtraslado:datos.data_sends[0].codtraslado,
                modtraslado:datos.data_sends[0].modtraslado,
                fecTraslado:datos.data_sends[0].fecTraslado,
                pesoTotal: datos.data_sends[0].pesoTotal,
                undPesoTotal: datos.data_sends[0].undPesoTotal,
                llegada:{
                    ubigueo :datos.data_sends[0].ubigueollegada,
                    direccion: datos.data_sends[0].direccionLlegada,
                    codLocal: datos.data_sends[0].codLocalLlegada,
                    ruc: datos.data_sends[0].rucLlegada
                },
                partida:{
                    ubigueo :datos.data_sends[0].ubigueoPartida,
                    direccion: datos.data_sends[0].direccionPartida,
                    codLocal: datos.data_sends[0].codLocalPartida,
                    ruc: datos.data_sends[0].rucPartida
                },
                choferes:[
                    {
                        tipoDoc : datos.data_sends[0].tipoDocChofer,
                        nroDoc: datos.data_sends[0].nroDocChofer,
                        licencia: datos.data_sends[0].licenciaChofer,
                        nombres: datos.data_sends[0].nombresChofer,
                        apellidos: datos.data_sends[0].apellidosChofer
                    }
                ],
                vehiculos:[
                    {
                        placa : datos.data_sends[0].placaVehiculo,
                        mtc : datos.data_sends[0].mtcCirculacion  
                    }
                ],

                transportista:{
                    tipoDoc:datos.data_sends[0].tipoDocTransp,
                    numDoc: datos.data_sends[0].numDocTransp,
                    rzSocial: datos.data_sends[0].rzSocialTransp,
                    nroMtc: datos.data_sends[0].nroMtcTransp,
                    placa : datos.data_sends[0].placaVehiculo,
                    mtc : datos.data_sends[0].mtcCirculacion,
                    choferTipoDoc : datos.data_sends[0].tipoDocChofer,
                    choferDoc: datos.data_sends[0].nroDocChofer, 
                }
            },

            details:datos.details,           
        };

        let state, code, title, message,details;

        const cdrresponse = await guiaService.SendDespatch(data_create);

        details = `${data_create['serie'] } - ${data_create['correlativo'] }`;

        state = cdrresponse.data['sunatResponse'].success;
        if(state){
            blocked.value = false;
            loading.value = false;
            //code = cdrresponse.data['sunatResponse']['cdrResponse']['code'];
            title =  `Respuesta Sunat Code :${cdrresponse.data['sunatResponse']['cdrResponse']['description']}`;
            //message = await cdrresponse.data['sunatResponse']['notes']['0'];
            message = "Documento aceptado con exito.";
            
            showAlert('success',title,message,details);
   
        }else{
            blocked.value = false;
            loading.value = false;
            code = cdrresponse.data['sunatResponse']['error'].code;
            title = await `Respuesta Sunat Code:${code}`;
            message = await cdrresponse.data['sunatResponse']['error'].message;
            showAlert('error',title,message,details);

        }

        await DespatchesViews()
    
    }

    const DespatchesViews = async ()=>{
        //loading.value = true;
        const resp  = await guiaService.ViewDespatchesService();
        loading.value = false ;
        products.value = resp.data;
        
     
    }

    const showAlertPrev= (data,title,message) => {
        if (!visible.value) {
            toast.add({ severity:"info",title:title ,summary: message, group: 'bc' });
            visible.value = true;
            idguia.value = data;
            accion.value = title;
            console.log(idguia.value, accion.value);
        } 
    };

    
    const showAlert= (severity,title,message,details) => {
        if (!visible.value) {
            toast.add({ severity:severity,title:title ,summary: message, group: 'bc2',details:details });
            visible.value = true;
        } 
    };


    const Accept = async () => {
        if(accion.value == "CDR"){
            cdr(idguia.value);
        }else if(accion.value === "XML"){
            xml(idguia.value);
        }else{
            console.log('error');
        }
       
        toast.removeGroup('bc');
        visible.value = false;
    }

    const onClose = () => {
        visible.value = false;
    }

    const show = (severity,summary,detail) => {
        toast.add({ severity: severity, summary: summary, detail: detail, life: 5000 });
    };

    const machineList = async () =>{
        const resp = await machineService.ViewMachinesService();
        console.log(resp);
    };


</script>