<template>
    <div class="card">
        <Toast/>
        <h1>Ordenes de Compra</h1>
        <DataTable ref="dt" :value="listaordenes" :lazy="true"  dataKey="id_oc" :loading="loading" 
            :paginator="true" :rows="3"   filterDisplay="row" :totalRecords="totalRecords"  
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
            :rowsPerPageOptions="[5,10,25]"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" responsiveLayout="scroll">
        
            <template #header>
                <div class="table-header flex flex-column md:flex-row md:justiify-content-between">
                    <h5 class="mb-2 md:m-0 p-as-md-center">Gestion de Productos</h5>
                    <span class="p-input-icon-left">
                        <i class="pi pi-search" />
                        <InputText  placeholder="Search..." />
                    </span>
                </div>
            </template>

            <Column field="id_oc" header="OC" :sortable="true" style="min-width:12rem"></Column>
            <Column field="miempresa.nombre" header="EMPRESA" :sortable="true" style="min-width:8rem"></Column>
            <Column field="proveedor.nombre" header="PROVEEDOR" :sortable="true" style="min-width:8rem"></Column>
            <Column field="referenciaoc" header="REFERENCIA" :sortable="true" style="min-width:8rem"></Column>
            <Column field="equipo.Nombre_Equipo" header="EQUIPO" :sortable="true" style="min-width:10rem"></Column>
            <Column field="subtotal" header="SUB" :sortable="true" style="min-width:8rem"></Column>
            
            <Column :exportable="false" style="min-width:8rem">
                <template #body="slotProps">
                    <Button icon="pi pi-sign-in" class="p-button-rounded p-button-success mr-2" @click="editProduct(slotProps.data)" />
                    
                </template>
            </Column>
        </DataTable>  
    </div>

</template>

<script>
    import { ref, onMounted } from 'vue';
    import * as ordenService from '@/services/ordencompra.service.js';
    import { useToast } from 'primevue/usetoast';

    export default{
        setup(){
            const listaordenes = ref();
            const loading = ref(false);
            const lazyParams = ref({});
            const totalRecords = ref(0);
            const dt = ref();

            onMounted(async ()=>{

                loading.value = true;
                lazyParams.value = {
                    first: 0,
                    rows: dt.value.rows,
                    sortField: null,
                    sortOrder: null,
                    //filters: filtro.value
                };

                getOrdenes();
            });


            const getOrdenes = async () =>{
                const resp = await ordenService.listarOrdenCompra();
                console.log(resp);
                listaordenes.value = resp.data;
                console.log(resp.data);
                loading.value = false;
            }

            return {
            
                listaordenes,
                loading,
                lazyParams,
                totalRecords,
                dt
            }

        }



    }


</script>

    <style lang="scss" scoped>
    .table-header {
        display: flex;
        align-items: center;
        justify-content: space-between;

        @media screen and (max-width: 960px) {
            align-items: start;
        }
    }

    .product-image {
        width: 50px;
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
    }

    .p-dialog .product-image {
        width: 50px;
        margin: 0 auto 2rem auto;
        display: block;
    }

    .confirmation-content {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    @media screen and (max-width: 960px) {
        ::v-deep(.p-toolbar) {
            flex-wrap: wrap;
            
            .p-button {
                margin-bottom: 0.25rem;
            }
        }
    }
</style>