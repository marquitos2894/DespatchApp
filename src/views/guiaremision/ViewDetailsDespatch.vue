<template>
    <h1>Movimientos</h1>
    <ProgressBar v-if="(loading)" mode="indeterminate" style="height: 6px"></ProgressBar>
    <div class="card p-fluid">
        <DataTable  ref="dt" :value="detailsview" v-model:filters="filters" lazy  :paginator="true" :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" tableStyle="min-width: 50rem" 
        :totalRecords="totalRecords" @filter="onFilter($event)" filterDisplay="row"
        :globalFilterFields="['descripcion']"
        @page="onPage($event)" >
            <Column field="serie" header="Serie-Numero">
                <template #body="slotProps">
                            {{slotProps.data.serie}}-{{slotProps.data.correlativo}}<br>
                            <tag>{{ slotProps.data.fechaEmision }}</tag>
                </template>
            </Column>
            <Column field="fecha" header="Fecha">
                <template #body="slotProps">
                            {{slotProps.data.fecTraslado}}
                </template>
            </Column>
            <Column field="descripcion" header="Descripcion" filterMatchMode="startsWith">
                <template #filter="{filterModel,filterCallback}">
                    <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter" placeholder="Buscar"/>
                </template>
                <template #body="slotProps">
                            {{slotProps.data.descripcion}}
                </template>
            </Column>
            <Column field="codigo" header="Codigo">
                <template #filter="{filterModel,filterCallback}">
                    <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter" placeholder="Buscar"/>
                </template>
                <template #body="slotProps">
                            {{slotProps.data.codigo}}
                </template>
            </Column>
            <Column field="cantidad" header="Cantidad">
                <template #body="slotProps">
                            {{slotProps.data.cantidad}} <tag>{{slotProps.data.unidad}}</tag>
                </template>
            </Column>
            <Column field="equipo" header="Equipo">
                <template #filter="{filterModel,filterCallback}">
                    <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter" placeholder="Buscar"/>
                </template>
                <template #body="slotProps">
                            {{slotProps.data.equipo}}
                </template>
            </Column>
            <Column field="partida" header="Partida">
                <template #body="slotProps">
                            {{slotProps.data.localPartida}}
                </template>
            </Column>
            <Column field="llegada" header="Llegada">
                <template #body="slotProps">
                            {{slotProps.data.localLlegada}}
                </template>
            </Column>
        </DataTable>
    </div>

    <BlockUI :blocked="blocked" fullScreen />

</template>


<script setup>
    import { ref, onMounted, resolveTransitionHooks } from 'vue';
    import ProgressBar from 'primevue/progressbar';
    import BlockUI from 'primevue/blockui';
    import * as guiaService from '@/services/guiaremision.service.js';

    const dt = ref();
    const loading = ref(false);
    const totalRecords = ref(0);
    const first = ref(0);
    const filters = ref({
    'descripcion': {value: '', matchMode: 'contains'},
    'codigo': {value: '', matchMode: 'contains'},
    'equipo': {value: '', matchMode: 'contains'}
    });

    const columns = ref([
        {field: 'descripcion', header: 'Descripcion'},
    ]);
    const lazyParams = ref({});
    const detailsview = ref();
    const blocked = ref(false);

//DespatchDetail

    onMounted( async ()=>{
        
        lazyParams.value = {
            first: 0,
            rows: dt.value.rows,
            sortField: null,
            sortOrder: null,
            filters: filters.value
        };

        DespatchDetail();
    });

    const DespatchDetail = async ()=>{
        blocked.value = true;
        loading.value = true;
        const resp  = await guiaService.DespatchDetailService(lazyParams.value);
        totalRecords.value = resp.data.total;
        detailsview.value = resp.data.data;
        loading.value = false;
        blocked.value = false;
        console.log(resp)
    }

    const onPage = (event) => {
        lazyParams.value = event;
        //lazyParams.value.filters =filtro.value
        console.log(lazyParams.value)
        DespatchDetail()
    };

    const onFilter = (event) => {
        lazyParams.value.filters = filters.value ;
        DespatchDetail();
    };

</script>