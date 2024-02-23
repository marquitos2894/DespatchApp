<template>
    <ProgressBar mode="indeterminate" style="height: .5em" v-if="pbloaddata" />   
    <BlockUI :blocked="blockedDocument1" fullScreen="false"></BlockUI>

    <Toast position="bottom-right" group="br" />
    <div class="flex align-items-center flex-column sm:flex-row">
    </div>
    <Sidebar v-model:visible="visibleBottom" :baseZIndex="10000" position="bottom">
        <div class="p-fluid grid formgrid">
            <div class="field col-12 md:col-3">
        
                <Dropdown v-model="selectedproveedor" :options="proveedorlist" optionLabel="nombre" :filter="true" placeholder="Select a Proveedor" :showClear="true">
                    <template #value="slotProps">
                        <div class="country-item country-item-value" v-if="slotProps.value">
                            <div>{{slotProps.value.nombre}}</div>
                        </div>
                        <span v-else>
                            {{slotProps.placeholder}}
                        </span>
                    </template>
                    <template #option="slotProps">
                        <div class="country-item">
                            <div>{{slotProps.option.nombre}}</div>
                        </div>
                    </template>
                </Dropdown>
            </div>
            <div class="field col-12 md:col-3">
            
                <Dropdown v-model="selectedequipo" :options="equipolist" optionLabel="Nombre_Equipo" :filter="true" placeholder="Select a Equipo" :showClear="true">
                    <template #value="slotProps">
                        <div class="country-item country-item-value" v-if="slotProps.value">
                            <div>{{slotProps.value.Nombre_Equipo}}</div>
                        </div>
                        <span v-else>
                            {{slotProps.placeholder}}
                        </span>
                    </template>
                    <template #option="slotProps">
                        <div class="country-item">
                            <div>{{slotProps.option.Nombre_Equipo}}</div>
                        </div>
                    </template>
                </Dropdown>
            </div>
            <div class="field col-12 md:col-2">
                <Button label="Filtrar" icon="pi pi-search" @click="filtrar()" />
            </div>
        </div>
    </Sidebar>


    <div class="card">
        <Button icon="pi pi-refresh" @click="refresh"  />
        <Chip :label="view_selectproveedor" v-if="view_selectproveedor" class="custom-chip mb-2" @remove="quitarprovedor()" removable />
        <Chip :label="view_selectequipo" v-if="view_selectequipo" class="custom-chip mb-2" @remove="quitarequipo()"  removable />
        <DataView  ref="dv" :value="listaordenes" loading="true"  :layout="layout" :lazy="true"  dataKey="id"  :paginator="true" :rows="9" 
        :totalRecords="totalRecords" @page="onPage($event)" filterDisplay="row"  :sortOrder="sortOrder" :sortField="sortField">
			<template #header>
                <div class="grid grid-nogutter">
                    <div class="col-5" style="text-align: left">
                        <div class="table-header-container">
                            <SelectButton @click="SelectStatus()" v-model="value_status" :options="StatusOptions" optionLabel="name" multiple aria-labelledby="multiple" />
                        </div>
                    </div>
                    <div class="col-3">
                        <div class="p-inputgroup">
                            <Button icon="pi pi-times" @click="reset" />
                            <InputText placeholder="Buscar oc" v-model="id_oc" />
                            <Button icon="pi pi-search" @click="buscar_oc"  class="p-button-primary"/>
                        </div>
                    </div>
                    <div class="col-2" style="text-align: right">
                        <Button icon="pi pi-filter-fill" @click="visibleBottom = true" class="mr-2" />
                    </div>
                    <div class="col-2" style="text-align: right">
                        <DataViewLayoutOptions v-model="layout"/>
                    </div>
                </div>
			</template>

			<template #list="slotProps">
				<div class="col-12">
					<div class="product-list-item">
						<!--img src="https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png" :alt="slotProps"/-->
						<div class="product-list-detail">
							<div class="product-name" maxLength="10" v-tooltip.bottom="slotProps.data.proveedor.nombre">{{LimitCaracter(slotProps.data.proveedor.nombre)}}</div>
							<div class="product-description">{{slotProps.data.referenciaoc}}</div>
							<div class="product-description">{{slotProps.data.miempresa.abrev}} | <span class="product-description">{{slotProps.data.equipo.Nombre_Equipo}}</span></div>
							<i class="pi pi-file"></i><span class="product-category">{{slotProps.data.id_oc}}</span>
                            
						</div>
						<div class="product-list-action">
							<span class="product-price">{{slotProps.data.sim_moneda}} {{slotProps.data.total}}</span>
						
                            <router-link :to="`/seguimiento?id_oc=${slotProps.data.id_oc}`"><i class="pi pi-arrow-circle-right" style="font-size: 2rem"></i></router-link>
                            <Tag :severity="slotProps.data.estado.color" >{{slotProps.data.estado.nombre}}</Tag>
                            <ProgressBar :value="slotProps.data.porcatencion" showValue="true" />
						</div>
					</div>
				</div>
			</template>

			<template #grid="slotProps">
				<div class="col-12 md:col-4">
					<div class="product-grid-item card">
						<div class="product-grid-item-top">
							<div>
								<i class="pi pi-file"></i>
								<span class="product-category"> {{slotProps.data.id_oc}}</span>
							</div>
                            <Tag severity="primary" >{{slotProps.data.fecha}}</Tag>
                            <Tag :severity="slotProps.data.estado.color" >{{slotProps.data.estado.nombre}}</Tag>
						</div>
						<div class="product-grid-item-content">
							<!--img src="https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png"/-->
							<div class="product-name" v-tooltip.bottom="slotProps.data.proveedor.nombre">{{LimitCaracter(slotProps.data.proveedor.nombre)}}</div>
							<div class="product-description">{{slotProps.data.referenciaoc}}</div>
                            <div class="product-grid-item-top">
                                <div>
                                    <span class="product-category">{{slotProps.data.miempresa.abrev}}</span>
                                </div>
							<span :class="'product-badge status-'+slotProps">{{slotProps.data.equipo.Nombre_Equipo}}</span>
						    </div>
							<ProgressBar :value="slotProps.data.porcatencion" showValue="true" /><!--para la barra estadistica de porcentaje de atecion-->
						</div>
						<div class="product-grid-item-bottom">
							<span class="product-price">{{slotProps.data.sim_moneda}} {{slotProps.data.total}}</span>
                            <router-link :to="`/seguimiento?id_oc=${slotProps.data.id_oc}`"><i class="pi pi-arrow-circle-right" style="font-size: 2rem"></i></router-link>

							<!--a :href="`/seguimiento?id=${slotProps.data.id_oc}`"  ><i class="pi pi-arrow-circle-right" style="font-size: 2rem"></i></a-->
                            
						</div>
					</div>
				</div>
			</template>
		</DataView>
	</div>


</template>

<script>

 import { ref, onMounted, computed } from 'vue';
    import { useToast } from 'primevue/usetoast';
    import { useConfirm } from "primevue/useconfirm";
    import Chip from 'primevue/chip';
    import * as ordenService from '@/services/ordencompra.service.js';
    import Calendar from 'primevue/calendar';
    import BlockUI from 'primevue/blockui';
    
    export default{
        setup(){

            //const products = ref();
            //const productService = ref(new ProductService());
            const toast = useToast();
            const id_oc = ref();
            const visibleBottom = ref(false);
            const listaordenes = ref();
            const lazyParams = ref({});
            const totalRecords = ref();
            const layout = ref('grid');
            const sortKey = ref();
            const dv = ref();
            const loading = ref(true);
            const value_status = ref([]);//[ { "name": "Pendiente", "value": "1" }, { "name": "Parcial", "value": "2" }, { "name": "Completo", "value": "3" } ]
            const value_filtros = ref([]);
            const options = ref(['Off', 'On']);
            const StatusOptions = ref([
                {name: 'Pendiente', value: '1'},
                {name: 'Parcial', value: '2'},
                {name: 'Completo', value: '3'}
            ]);
            const selectedproveedor = ref();
            const proveedorlist = ref();
            const selectedequipo = ref();
            const equipolist = ref();
            const proveedor= ref();
            const equipo = ref();
            const view_selectproveedor = ref();
            const view_selectequipo = ref();
            const blockedDocument1 = ref(false)
            const pbloaddata = ref(false)
            

            onMounted(()=>{
                loading.value = true;
                lazyParams.value = {
                    first: 0,
                    rows: dv.value.rows,
                    sortField: null,
                    sortOrder: null,
                    //filters: filtro.value
                };

                getProveedor();
                getEquipo();
                getOrdenes();

            })

            const getOrdenes = async () =>{
                console.log('getOrdenes');
                loading.value = true;
                pbloaddata.value = true;
                blockedDocument1.value = true;

                if(selectedproveedor.value==undefined && selectedequipo.value==undefined){
                    const resp = await ordenService.listarOrdenCompra(lazyParams);
                    if(resp.status == 200){
                        listaordenes.value = resp.data.data;
                        totalRecords.value = resp.data.total;
                        loading.value = false;
                        console.log(resp);
                        pbloaddata.value = false;
                        blockedDocument1.value = false;
                    }else{
                        ToasAlert('error','Error en el servidor','Ha ocurrido un error en el servidor, contactar con soporte')
                        pbloaddata.value = false;
                        blockedDocument1.value = false;
                    }
 
                }else{//mientras tenga los parametros de filtros ejecutara la funcion filtrar hasta que se eliminen
                    filtrar() 
                }
            }

            const getProveedor = async ()=>{
                const resp = await ordenService.select_proveedor()
                console.log(resp.data)
                proveedorlist.value=resp.data;
            }

            const getEquipo = async ()=>{
                const resp = await ordenService.select_equipo()
                console.log(resp.data)
                equipolist.value = resp.data;
            }

            const quitarequipo = async ()=>{
                console.log("delete equipo");
                selectedequipo.value=undefined;
                view_selectequipo.value=undefined;
                await getOrdenes();
            }

            const quitarprovedor = async ()=>{
                selectedproveedor.value=undefined;
                view_selectproveedor.value=undefined;
                await getOrdenes();

            }

            const SelectStatus = async ()=>{//capturar el evento y solo seleccionar los botones
                
                if(value_status.value.length==0){
                   return getOrdenes();
                }
                //add parametros de filtros
                pbloaddata.value = true;
                blockedDocument1.value = true;
                const resp = await ordenService.Status_filter_oc(value_status.value,lazyParams,proveedor.value,equipo.value)
                if(resp.status == 200){
                    console.log(resp.data);
                    listaordenes.value = resp.data.data;
                    totalRecords.value = resp.data.total; 
                    pbloaddata.value = false;
                    blockedDocument1.value = false;
                }else{
                    ToasAlert('error','Error en el servidor','Ha ocurrido un error en el servidor, contactar con soporte')
                    pbloaddata.value = false;
                    blockedDocument1.value = false;
                }
   
           }

            const buscar_oc = async ()=>{
                pbloaddata.value = true;
                blockedDocument1.value = true;
                const resp = await ordenService.buscaroc(id_oc.value);
                if(resp.status == 200){
                    console.log(resp)
                    listaordenes.value = resp.data;
                    pbloaddata.value = false;
                    blockedDocument1.value = false;
                }else{
                    ToasAlert('error','Error en el servidor','Ha ocurrido un error en el servidor, contactar con soporte')
                    pbloaddata.value = false;
                    blockedDocument1.value = false;
                }
              
            }

            const filtrar = async()=>{
                //console.log(selectedproveedor.value.id)
                value_filtros.value=[];
                proveedor.value = (selectedproveedor.value==undefined)?'':selectedproveedor.value.id_prove;
                equipo.value = (selectedequipo.value==undefined)?'':selectedequipo.value.Id_Equipo;
 
                view_selectproveedor.value= (selectedproveedor.value==undefined)?'':selectedproveedor.value.nombre;
                view_selectequipo.value= (selectedequipo.value==undefined)?'':selectedequipo.value.Nombre_Equipo;

                pbloaddata.value = true;
                blockedDocument1.value = true;

                const resp = await ordenService.filtrar(proveedor.value,equipo.value,lazyParams)
          
                if(resp.status == 200){
                    pbloaddata.value = false;
                    blockedDocument1.value = false;
                    return listaordenes.value = resp.data.data;
                }else{
                    ToasAlert('error','Error en el servidor','Ha ocurrido un error en el servidor, contactar con soporte')
                    pbloaddata.value = false;
                    blockedDocument1.value = false;
                }       
            }

            const LimitCaracter = (element)=>{

                let texto = element.slice(0,21)

                if(element.length>=21){
                    texto = texto+'...'
                }
                return texto = texto.toUpperCase()
            }


            const ToasAlert = (severity,titlesummary,mensaje) => {
                toast.add({severity:severity, summary: titlesummary, detail:mensaje, group: 'br', life: 4000});
            }

            const onPage = (event) => {
                lazyParams.value = event;
                //lazyParams.value.filters =filtro.value
                if(value_status.value.length==0){
                   getOrdenes();
                }else{
                    SelectStatus();
                }
          
            };

            const reset = ()=>{

                selectedequipo.value=undefined;
                view_selectequipo.value=undefined;
                selectedproveedor.value=undefined;
                view_selectproveedor.value=undefined;
                value_status.value =''
                id_oc.value ='';
                getOrdenes();
                
            }

            const refresh = ()=>{
                 getOrdenes();
            }

            return {LimitCaracter,quitarequipo,quitarprovedor,getProveedor,getEquipo,refresh,reset,blockedDocument1,pbloaddata,ToasAlert,
                selectedequipo,equipolist,id_oc,buscar_oc,filtrar,view_selectproveedor,view_selectequipo,proveedor,equipo,
                dv,lazyParams,totalRecords,onPage,loading,visibleBottom,proveedorlist,selectedproveedor,
                listaordenes, layout, sortKey,SelectStatus,StatusOptions,value_status,options
            }
        },
        components: {
            BlockUI
        }   
    }

</script>

<style lang="scss" scoped>

    .p-dropdown {
        width: 14rem;
    }

    .country-item {
        img {
            width: 17px;
            margin-right: 0.5rem;
        }
    }
    .card {
        background: #ffffff;
        padding: 2rem;
        box-shadow: 0 2px 1px -1px rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12);
        border-radius: 4px;
        margin-bottom: 2rem;
    }
    .p-dropdown {
        width: 14rem;
        font-weight: normal;
    }
    
    .product-name {
        font-size: 1.5rem;
        font-weight: 700;
    }
    
    .product-description {
        margin: 0 0 1rem 0;
    }
    
    .product-category-icon {
        vertical-align: middle;
        margin-right: .5rem;
    }
    
    .product-category {
        font-weight: 600;
        vertical-align: middle;
    }
    
    ::v-deep(.product-list-item) {
        display: flex;
        align-items: center;
        padding: 1rem;
        width: 100%;
    
        img {
            width: 50px;
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
            margin-right: 2rem;
        }
    
        .product-list-detail {
            flex: 1 1 0;
        }
    
        .p-rating {
            margin: 0 0 .5rem 0;
        }
    
        .product-price {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: .5rem;
            align-self: flex-end;
        }
    
        .product-list-action {
            display: flex;
            flex-direction: column;
        }
    
        .p-button {
            margin-bottom: .5rem;
        }
    }
    
    ::v-deep(.product-grid-item) {
        margin: .5rem;
        border: 1px solid var(--surface-border);
    
        .product-grid-item-top,
        .product-grid-item-bottom {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
    
        img {
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
            margin: 2rem 0;
        }
    
        .product-grid-item-content {
            text-align: center;
        }
    
        .product-price {
            font-size: 1.5rem;
            font-weight: 600;
        }
    }
    
    @media screen and (max-width: 576px) {
        .product-list-item {
            flex-direction: column;
            align-items: center;
    
            img {
                margin: 2rem 0;
            }
    
            .product-list-detail {
                text-align: center;
            }
    
            .product-price {
                align-self: center;
            }
    
            .product-list-action {
                display: flex;
                flex-direction: column;
            }
    
            .product-list-action {
                margin-top: 2rem;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                width: 100%;
            }
        }
    }

    .p-chip.custom-chip {
    background: var(--primary-color);
    color: var(--primary-color-text);
    }
    </style>