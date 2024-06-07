<template>
    <h1>Guia remision remitente</h1>
    <ProgressBar v-if="(loading)" mode="indeterminate" style="height: 6px"></ProgressBar>
    <div class="card p-fluid" >
        <div class="p-fluid formgrid grid">
            <div class="field col-12 md:col-1">
                <InputText v-model="serie" placeholder="Serie" disabled/>
            </div>
            <div class="field col-12 md:col-2">
                <InputText v-model="correlativo"  placeholder="Correlativo"  />
                <InlineMessage v-if="validate_correlativo">{{message_correlativo}}</InlineMessage>
            </div>
            <div class="field col-12 md:col-2">
                <Button type="button" label="Buscar" icon="pi pi-search" :loading="loadingbuttonbuscar" @click="buscarguia" />
            </div>
            <div class="field col-12 md:col-2">
                <Chip :label="serie_correlativo" v-if="chips_seriecorr" class="custom-chip mb-2" @remove="quitar()" removable />
            </div>


        </div>
    </div>
    <BlockUI :blocked="blockedlista">
        <div class="card p-fluid">
            <Toast />
        
            <DataView :value="products" paginator :rows="5"  >
                <template #list="slotProps">
                        <div v-for="(item, index) in slotProps.items" :key="index">
                            <div class="grid">
                                <div class="col-fixed" style="width:30%">
                                    <div class="p-3 border-round-sm ">
                                        <span class="ml-2 font-medium font-bold">{{ format_fechaemision(item.fechaEmision) }} </span>
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
                                                    <Tag icon="pi pi-check" v-tooltip.bottom="{ value: item.cdrResponse }" severity="success" value="Aceptada"></Tag>
                                                </div>
                                                <div v-else>
                                                    <Tag v-if="item.ticket" v-tooltip.bottom="{ value: `${item.ticket} | ${item.cdrResponse}` }"  icon="pi pi-refresh" severity="warning" value="En Proceso"></Tag>
                                                    <Tag v-if="!item.ticket" icon="pi pi-times" severity="danger" value="Pendiente"></Tag>
                                                    
                                                </div>
                                            </div>     
                                        </div>
                                    </div> 
                                </div>
                                <div class="col-fixed" style="width:50%">
                                    <div class="p-3 border-round-sm ">
                                        <span class="ml-2 font-medium font-bold">Datos de envio: {{ format_fechatraslado(item.data_sends[0].fecTraslado) }}</span>
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
                                            <Button size="small" icon="pi pi-download" severity="success" @click="downloadXML(item.xml,item.serie,item.correlativo)" download />
                                        </div>
                                        <div v-else class="p-inputgroup" style="width:100%">
                                            <Button size="small" icon="pi pi-refresh"  @click="showAlertPrev(item.id,'XML','Deseas generar el XML?')" severity="secondary" />
                                            <Button size="small" severity="secondary"  label="XML" disabled />
                                        </div>
                                        <br>

                                        <div v-if="item.estcdrZip == '1'" class="p-inputgroup" style="width:100%">
                                            <Button size="small" icon="pi pi-check" severity="primary" disabled />
                                            <Button size="small" severity="primary" label="CDR" disabled  />
                                            <Button size="small" icon="pi pi-download" severity="primary" @click="downloadCDR(item.cdrZip)"  />
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
    </BlockUI>
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
    import {useDateFormat} from '@vueuse/core';
    import html2pdf from 'html2pdf.js';


    const toast = useToast();
    const visible = ref(false);
    const products = ref([]);
    const menu = ref();
    const idguia = ref();
    const loading = ref(false);
    const blocked = ref(false);
    const blockedlista = ref(false);
    const loadingbuttonbuscar = ref(false);

    const serie = ref('T001');
    const correlativo = ref();
    const serie_correlativo = ref();

    const validate_correlativo= ref(false);
    const message_correlativo= ref()

    //chips
    const chips_seriecorr = ref(false)


    const accion =ref('');

    onMounted( async ()=>{
        loading.value = true ;
        DespatchesViews();
    });

    const buscarguia = async () => {
        validate_correlativo.value = false

        console.log(correlativo.value.length);
        if(correlativo.value.length < 1){
            validate_correlativo.value = true
            return message_correlativo.value = "Ingrese correlativo a buscar"
        }
        blockedlista.value = true
        loadingbuttonbuscar.value = true;

        let data = {
            serie : serie.value,
            correlativo : correlativo.value
        }

        const resp = await guiaService.SearchDespatchBasic(data);
        console.log(resp.data);
        products.value = resp.data;
        serie_correlativo.value = `${serie.value}-${correlativo.value}`
        chips_seriecorr.value = true;
        loadingbuttonbuscar.value = false;
        blockedlista.value = false
    };

    const pdf = async (data) => {
        blocked.value = true;
        loading.value = true;
        const resp = await guiaService.ViewDespatchIdService(data);
        let datos = resp['data']['0'];

        console.log(datos)

        let data_create = {
            version: datos.version,
            tipoDoc:datos.tipoDoc,//Tipo de documento: 09 GUIA DE REMISION datos duros
            serie:datos.serie,
            correlativo:datos.correlativo,
            fechaEmision:datos.fechaEmision,
            areatrabajo:datos.areatrabajo,
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
                    datos.data_sends[0].conductores
                ],
                vehiculos:[
                    datos.data_sends[0].vehiculos
                ],
                transportista:{
                    tipoDoc:datos.data_sends[0].tipoDocTransp,
                    numDoc: datos.data_sends[0].numDocTransp,
                    rzSocial: datos.data_sends[0].rzSocialTransp,
                    nroMtc: datos.data_sends[0].nroMtcTransp
                }
            },

            details:datos.details,           
        };

        console.log(data_create);

        const pdf = await guiaService.DownloadDespatch(data_create);
        blocked.value = false;
        loading.value = false;

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
            areatrabajo:datos.areatrabajo,
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
                    datos.data_sends[0].conductores
                ],
                vehiculos:[
                    datos.data_sends[0].vehiculos
                ],
                
                transportista:{
                    tipoDoc:datos.data_sends[0].tipoDocTransp,
                    numDoc: datos.data_sends[0].numDocTransp,
                    rzSocial: datos.data_sends[0].rzSocialTransp,
                    nroMtc: datos.data_sends[0].nroMtcTransp

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

        if(!chips_seriecorr.value) {
            await DespatchesViews();
        }else{
            await load();
        }
        
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
            areatrabajo:datos.areatrabajo,
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
                    datos.data_sends[0].conductores
                ],
                vehiculos:[
                    datos.data_sends[0].vehiculos
                ],

                transportista:{
                    tipoDoc:datos.data_sends[0].tipoDocTransp,
                    numDoc: datos.data_sends[0].numDocTransp,
                    rzSocial: datos.data_sends[0].rzSocialTransp,
                    nroMtc: datos.data_sends[0].nroMtcTransp,
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
            code = cdrresponse.data['sunatResponse']['cdrResponse']['code'];
            title =  `Respuesta Sunat Code ${code} :${cdrresponse.data['sunatResponse']['cdrResponse']['description']}`;
            //message = await cdrresponse.data['sunatResponse']['notes']['0'];
            message = "Documento aceptado con exito.";
            
            showAlert('success',title,message,details);
   
        }else{
            
            if(cdrresponse.data['sunatResponse']['error']){
                blocked.value = false;
                loading.value = false;
                code = cdrresponse.data['sunatResponse']['error'].code;
                title = await `Respuesta Sunat Code:${code}`;
                message = await cdrresponse.data['sunatResponse']['error'].message;
                showAlert('error',title,message,details);
            }else{
                blocked.value = false;
                loading.value = false;
                showAlert('error',cdrresponse.data['sunatResponse']['code'],cdrresponse.data['sunatResponse']['message'],details);
            }
    
        }

        if(!chips_seriecorr.value) {
            await DespatchesViews();
        }else{
            await load();
        }
    
    }

    const quitar = async () =>{
        blockedlista.value = true;
        chips_seriecorr.value = false;
        correlativo.value = "";
        await DespatchesViews();
        blockedlista.value = false;
        

    }

    const DespatchesViews = async ()=>{
        loading.value = true;
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

    const format_fechatraslado = (fecha) => {
        console.log(fecha);
        const formatDate = useDateFormat(fecha, '(ddd) DD, MMMM YYYY', { locales: 'es-PE' })
        return formatDate.value     
    };

    const format_fechaemision = (fecha) => {
        console.log(fecha);
        const formatDate = useDateFormat(fecha, '(ddd) DD, MMMM YYYY HH:mm:ss', { locales: 'es-PE' })
        return formatDate.value     
    };

    const downloadXML = (dataxml,serie,correlativo) => {
        
        //convertir texto a xml
        //var doc = new DOMParser().parseFromString(dataxml, 'application/xml')
        //console.log(doc);
        console.log(dataxml);

        var filename = `${serie}-${correlativo}.xml`;
        var pom = document.createElement('a');
        var bb = new Blob([dataxml], {type: 'text/plain'});

        pom.setAttribute('href', window.URL.createObjectURL(bb));
        pom.setAttribute('download', filename);

        pom.dataset.downloadurl = ['text/plain', pom.download, pom.href].join(':');
        pom.draggable = true; 
        pom.classList.add('dragout');

        pom.click();
        
    }

    const downloadCDR =  async (dataCDR)  => {
        console.log(dataCDR);

        var filename = `cdr.zip`;
        var pom = document.createElement('a');
        //var bb = new Blob([dataCDR], {type: 'text/plain'});
        //const base64Response = await fetch(`data:text/plain;base64,${dataCDR}`);

        var file = dataURLtoFile(`data:text/plain;base64,${dataCDR}`);
        console.log(file);

        pom.setAttribute('href', window.URL.createObjectURL(file));
        pom.setAttribute('download', filename);

        pom.dataset.downloadurl = ['text/plain', pom.download, pom.href].join(':');
        pom.draggable = true; 
        pom.classList.add('dragout');

        pom.click();
    }

    const dataURLtoFile= (dataurl, filename) => {
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[arr.length - 1]), 
            n = bstr.length, 
            u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type:mime});
    }

    


</script>