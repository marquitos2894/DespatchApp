<template>
    <h1>Nueva Guia remision remitente</h1>
    <ProgressBar v-if="(loading)" mode="indeterminate" style="height: 6px"></ProgressBar>
    <div class="card">
        <Chip class="pl-0 pr-3">
            <span class="bg-primary border-circle w-2rem h-2rem flex align-items-center justify-content-center">1</span>
            <span class="ml-2 font-medium">Destinatario</span>
        </Chip>
        <hr>
        <div class="p-fluid formgrid grid">
            <div class="field col-12 md:col-4">
                <InputText v-model="destinatario" placeholder="Destinatario" disabled/>
            </div>
            <div class="field col-12 md:col-4">
                <Dropdown v-model="tipodoc" :options="[{id:'6', name:'RUC'}]" optionLabel="name" :editable="false" disabled/>
            </div>
            <div class="field col-12 md:col-4">
                <InputText v-model="documento" placeholder="nro documentos" maxlength="11" disabled/>
            </div>
        </div>
        <Chip ref="DatosdeEnvio" class="pl-0 pr-3">
            <span class="bg-primary border-circle w-2rem h-2rem flex align-items-center justify-content-center">2</span>
            <span class="ml-2 font-medium">Datos de envio</span>
        </Chip>
        <hr>
        <div class="p-fluid formgrid grid">
            <div class="field col-12 md:col-4">
                <label for="ssn">Motivo Traslado</label>
                <Dropdown v-model="motTraslado" :options="[{id:'04',name:'Traslado entre establecimientos de la misma empresa'}]" optionLabel="name" maxlength="35"/>
            </div>
            <div class="field col-12 md:col-4">
                <label for="ssn">Modalidad Traslado</label>
                <Dropdown v-model="modTraslado" :options="[{id:'01',name:'Transporte Publico'},{id:'02',name:'Transporte Privado'}]" optionLabel="name" maxlength="35"/>
            </div>
            <div class="field col-12 md:col-4">
                <label for="ssn">Fecha inicial Traslado</label>
                <Calendar v-model="fechainic" dateFormat="dd/mm/yy"  />
                <InlineMessage v-if="validate_fechainic">{{message_fechainic}}</InlineMessage>
            </div>
        </div>
        <div class="p-fluid formgrid grid">
            <div class="field col-12 md:col-4">
                <label for="ssn">Peso total</label>
                <InputNumber v-model="pesoTotal" placeholder="Peso total"  minFractionDigits="2" :maxFractionDigits="5"  invalid  />
                <InlineMessage v-if="validate_pesoTotal">{{message_pesoTotal}}</InlineMessage>
            </div>
            <div class="field col-12 md:col-4">
                <label for="ssn">Unidad de medida</label>
                <Dropdown v-model="unidadmedida" :options="[{id:'KGM',name:'Kilogramo'},{id:'TNE',name:'Tonelada'}]" optionLabel="name" />
            </div>
            <div class="field col-12 md:col-4">
                <label for="ssn">Area</label>
                <Dropdown v-model="areatrabajo" :options="[{name:'Mantenimiento'},{name:'Operaciones'}]" optionLabel="name" maxlength="35"/>
            </div>
        </div>
        <Chip id="chiptransportista" ref="DatosTranspista" class="pl-0 pr-3">
            <span class="bg-primary border-circle w-2rem h-2rem flex align-items-center justify-content-center">3</span>
            <span class="ml-2 font-medium">Datos de transportista</span>
        </Chip>
        <hr>
        <div class="p-fluid formgrid grid">
            <div class="col-fixed" style="width:30%">
                <div class="p-3 border-round-sm ">
                    <span  class="ml-2 font-medium font-bold">Vehiculo <Button label="Add" style="padding: .1em .5em;width:20%;height:20%" @click="modaladdvehiculo = true" /> </span>
                    <hr>
                    <div  v-if="vehiculo.length>0" class="p-fluid formgrid grid">
                        <div  class="field col-10 md:col-12">
                            <label for="ssn">Placa</label>
                            <InputText v-model="vehiculo[0].placa" readonly  placeholder="Placa"></InputText>
                           
                        </div>
                        <div class="field col-12 md:col-12">
                            <label for="ssn">MTC</label>
                            <InputText  v-model="vehiculo[0].mtcNroAutorizacion" readonly  placeholder="MTC" maxlength="20"/>
                        </div>
                    </div>
                    <Button type="button"  label="vehiculos"  icon="pi pi-car" :badge="(vehiculo.length<1)?'0':vehiculo.length" @click="toggle" />
                </div> 
            </div>
            <div class="col" >
                <div class="p-3 border-round-sm">
                    <span  class="ml-2 font-medium font-bold">Conductor <Button label="Add" style="padding: .1em .5em;width:15%;height:20%" @click="modaladdconductor = true" /> </span>  
                    <hr>
                    <div v-if="conductor.length>0" class="p-fluid formgrid grid">
                        <div class="field col-12 md:col-6">
                            <Dropdown v-model="conductor[0].tipoDoc" :options="[{id:'1',name:'DNI'}]" optionLabel="name" readonly maxlength="35"/>
                        </div>
                        <div class="field col-12 md:col-6">
                            <InputText v-model="conductor[0].nroDoc" placeholder="Nro Documento" readonly maxlength="20"/>
                            
                        </div>
                    </div>
                    <div v-if="conductor.length>0" class="p-fluid formgrid grid">
                        <div class="field col-12 md:col-6">
                            <InputText v-model="conductor[0].nombres" readonly placeholder="Nombre"/>
                            
                        </div>
                        <div class="field col-12 md:col-6">
            
                            <InputText v-model="conductor[0].apellidos" readonly placeholder="Apellidos" maxlength="20"/>
                            
                        </div>
                    </div> 
                    <div v-if="conductor.length>0"  class="p-fluid formgrid grid">
                        <div class="field col-12 md:col-12">
                            <InputText v-model="conductor[0].licencia" readonly placeholder="Licencia" maxlength="20"/>
                            
                        </div>
                    </div>
                    <Button type="button"  label="conductores"  icon="pi pi-users" :badge="(conductor.length<1)?'0':conductor.length" @click="toggleConductor" />              
                </div>
                
            </div>

            <div v-if="modTraslado.id == '01' " class="col">
                <div class="p-3 border-round-sm">
                    <span class="ml-2 font-medium font-bold">Transportista</span>
                    <hr>
                    <div class="p-fluid formgrid grid">
                        <div class="field col-12 md:col-4">
                            <Dropdown v-model="tipoDocTransp" :options="[{id:'6',name:'RUC'}]" optionLabel="name" :editable="false" maxlength="35"/>
                        </div>
                        <div class="field col-12 md:col-8">
                            <InputText v-model="numDocTransp" placeholder="Nro Documento" maxlength="20"/>
                            <InlineMessage v-if="validate_numDocTransp">{{message_numDocTransp}}</InlineMessage>
                        </div>
                    </div>
                    <div class="p-fluid formgrid grid">
                        <div class="field col-12 md:col-12">
                            <InputText v-model="rzSocialTransp" placeholder="Nombre o Razon social" maxlength="60"/>
                            <InlineMessage v-if="validate_rzSocialTransp">{{message_rzSocialTransp}}</InlineMessage>
                        </div>
                    </div> 
                    <div class="p-fluid formgrid grid">
                        <div class="field col-12 md:col-12">
                            <InputText v-model="nroMtcTransp" placeholder="MTC" maxlength="20"/>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <br>
        <Chip ref="DatosDireccionPartida" class="pl-0 pr-3">
            <span class="bg-primary border-circle w-2rem h-2rem flex align-items-center justify-content-center">4</span>
            <span class="ml-2 font-medium">Punto partida</span>
        </Chip>
        <Dropdown v-model="anexoPartida" @change="datosEnvio('partida')" :options="establecimientos"  optionLabel="nombre" placeholder="Unidad Partida" size="small" class="w-full md:w-14rem"/>
        <hr>
        <div class="p-fluid formgrid grid">
            <div class="field col-12 md:col-6">
                <label for="ssn">Direccion</label>
                <InputText v-model="direccionPartida" placeholder="Direccion partida" disabled/>
                <InlineMessage v-if="validate_direccionpartida">{{message_direccionpartida}}</InlineMessage>
            </div>
            <div class="field col-12 md:col-3">
                <label for="ssn">ubigeo</label>
                <InputText v-model="ubigeoPartida" placeholder="Ubigeo" maxlength="20" disabled/>
                <InlineMessage v-if="validate_ubigeopartida">{{message_ubigeopartida}}</InlineMessage>
            </div>
            <div class="field col-12 md:col-3">
                <label for="ssn">Und. Operativa</label>
                <InputText v-model="unidadMinPartida" placeholder="Unidad Minera" maxlength="20" disabled/>
            </div>
        </div>
        <Chip ref="DatosDireccionLlegada" class="pl-0 pr-3">
            <span class="bg-primary border-circle w-2rem h-2rem flex align-items-center justify-content-center">5</span>
            <span class="ml-2 font-medium">Punto Llegada</span>
        </Chip>
        <Dropdown v-model="anexoLlegada" @change="datosEnvio('llegada')" :options="establecimientos"  optionLabel="nombre" placeholder="Unidad Llegada" class="w-full md:w-14rem"/>
        <hr>
        <div class="p-fluid formgrid grid">
            <div class="field col-12 md:col-6">
                <label for="ssn">Direccion</label>
                <InputText v-model="direccionLlegada" placeholder="Direccion de llegada" disabled/>
                <InlineMessage v-if="validate_direccionllegada">{{message_direccionllegada}}</InlineMessage>
            </div>
            <div class="field col-12 md:col-3">
                <label for="ssn">ubigeo</label>
                <InputText v-model="ubigeoLlegada" placeholder="Ubigeo" maxlength="20" disabled/>
                <InlineMessage v-if="validate_ubigeollegada">{{message_ubigeollegada}}</InlineMessage>
            </div>
            <div class="field col-12 md:col-3">
                <label for="ssn">Und. Operativa</label>
                <InputText v-model="unidadMinLlegada" placeholder="Unidad Minera" maxlength="20" disabled/>
                
            </div>
        </div>
        <div class="p-fluid formgrid grid">
            <div class="field col-12 md:col-3">
                <Chip ref="DatosProductos" class="pl-0 pr-3">
                    <span class="bg-primary border-circle w-2rem h-2rem flex align-items-center justify-content-center">6</span>
                    <span class="ml-2 font-medium">Productos</span>
                </Chip>
            </div>
            <div class="field col-12 md:col-7">

            </div>
            <div class="field col-12 md:col-2">
                <Button label="Importar" icon="pi pi-upload" @click="visible = true" size="small" />    
            </div>
        </div>
            
        <div class="p-fluid formgrid grid">
            <div class="field col-12 md:col-12">
                <DataTable :value="products" size="small" tableStyle="width: 100%">
                    <Column field="" header="" style="width: 39%">
                        <template #body="slotProps">
                            <div class="p-inputgroup">
                                <InputText type="text" v-model="descripcion" placeholder="Producto"  />
                            </div>
                        </template>
                    </Column>
                    <Column field="" header="" style="width: 19%">
                        <template #body="slotProps">
                            <InputText type="text" v-model="codigo" placeholder="Codigo"  />
                        </template>
                    </Column>
                    <!--Column field="" header="" style="width: 15%">
                        <template #body="slotProps">
                           
                            <MultiSelect v-model="selectedEquipos" :options="ListEquipos" filter optionLabel="name" placeholder="Equipos"
                                :maxSelectedLabels="3"   />
                        </template>
                    </Column-->
                    <Column field="selectedEquipos" header="" style="width: 13%">
                        <template #body="slotProps">
                                <Dropdown v-model="selectedEquipos" showClear :options="ListEquipos" filter   optionLabel="name" placeholder="Equipo" />
                        </template>
                    </Column>
                    <Column field="" header="" style="width: 13%">
                        <template #body="slotProps">
                            <div class="p-inputgroup">
                                <Dropdown v-model="selectedumUnitario" :options="umUnitarioList" filter optionLabel="name" placeholder="Medida" />
                            </div>
                        </template>
                    </Column>
                    
                    <Column field="" header="" style="width: 14%">
                        <template #body="slotProps">
                            <div class="p-inputgroup">
                                <InputText type="number" v-model="cantidad" placeholder="qty" />
                                <Button icon="pi pi-plus" class="p-button p-button-success mr-2" @click="prevAddItem(slotProps.data)" />
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
        
        <DataTable id="table_details" :value="details" v-model:editingRows="editingRows" editMode="row" dataKey="id" @row-edit-save="onRowEditSave" size="small" tableStyle="width: 100%"
        :pt="{
                table: { style: 'min-width: 40rem' },
                column: {
                    bodycell: ({ state }) => ({
                        style:  state['d_editing']&&'padding-top: 0.6rem; padding-bottom: 0.6rem'
                    })
                }
            }"
        >
            <Column header="#" style="width: 5%">
                <template #body="slotProps">
                    {{ slotProps.index + 1 }}
                </template>
            </Column>
            <Column field="descripcion" header="DESCRIPCION" style="width: 14%">
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" />
                </template>
            </Column>
            <Column field="codigo" header="CODIGO" style="width: 12%">
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" />
                </template>   
            </Column>
            <Column field="equipo" header="EQUIPO" style="width: 12%">
                <template #editor="{ data, field }" #body="slotProps">
                    <Dropdown v-model="data[field]" showClear :options="ListEquipos" filter optionLabel="name" optionValue="name"  placeholder="Equipos" :maxSelectedLabels="3">
                        <template #option="slotProps">
                            <Tag :value="slotProps.option.name" />
                        </template>
                    </Dropdown>
                </template>
            </Column>
            <Column field="cantidad" header="QTY" style="width: 7%" >
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" style="width: 100%" />
                </template>   
            </Column>
            <Column field="unidad" header="UM" style="width: 12%">
                <template #editor="{ data, field }">
                    <Dropdown v-model="data[field]" :options="umUnitarioList" filter optionLabel="name" optionValue="id" placeholder="Medida" >
                        <template #option="slotProps">
                            <Tag :value="slotProps.option.name"  />
                        </template>
                    </Dropdown>
                </template>
            </Column>
            <Column field="Opc" header="OPC" style="width: 7%">
                <template #body="slotProps">
                    <div class="col-12 md:col-3">
                        <a href="#table_details" @click="RemoveItem(slotProps.data)" style="width: 80%"><i class="pi pi-times"></i></a>
                    </div>
                </template>
            </Column>
            <Column :rowEditor="true" style="width: 5%;" bodyStyle="text-align:center"></Column>
        </DataTable>
        <div class="p-fluid formgrid grid" style="display: flex; justify-content: center;">
            <img v-if="details.length<1" src="images/createdespatch/empty-box-big.svg" height="30%" width="30%" alt="" >
            <InlineMessage style="width: 100%" v-if="validate_detalleproductos">{{message_detalleproductos}}</InlineMessage>
        </div>
        <ProgressBar mode="indeterminate" v-if="(loading)" style="height: 6px"></ProgressBar>
    </div>
    
    <Button label="Guardar" severity="info" @click="showAlertPrev('Guia de Remision','Deseas guardar el documento?')" icon="pi pi-check" iconPos="right" />

    <Dialog v-model:visible="visible" modal header="Importar archivo excel" :style="{ width: '25rem' }">
        <input type="file" id="loadfilexcel" accept=".xlsx"><br>
        <Button  label="Cargar" icon="pi pi-upload" size="small" @click="readfile()" />  
    </Dialog>

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
            </div>
        </template>
    </Toast>

    <Dialog v-model:visible="modaladdvehiculo" modal header="Agregar vehiculo" :style="{ width: '25rem' }">
    
            <div class="p-fluid formgrid grid">
                <div class="field col-12 md:col-12">
                    <span class="font-medium text-900 block mb-2">Placa</span>
                    <InputText  v-model="placa" ></InputText>
                    <InlineMessage v-if="validate_placa">{{message_placa}}</InlineMessage>
                </div>
            </div>
            <div class="p-fluid formgrid grid">
                <div class="field col-12 md:col-12">
                    <span class="font-medium text-900 block mb-2">Autorizacion MTC</span>
                    <InputGroup>
                        <InputText v-model="mtcNroAutorizacion" ></InputText>
                    </InputGroup>
                </div>
            </div>
       
        <div class="flex justify-content-end gap-2">
            <Button type="button" label="Cancel"  severity="secondary" @click="modaladdvehiculo = false;validate_placa = false;placa ='';mtcNroAutorizacion = ''"></Button>
            <Button type="button" label="Agregar"  @click="addVehiculo()" ></Button>
        </div>
    </Dialog>


    <OverlayPanel ref="op" :style="{ width: '50rem' }">
        <DataTable id="table_details" :value="vehiculo" v-model:editingRows="editingRows" editMode="row" dataKey="id" @row-edit-save="onRowEditSave_vehiculo" size="small" tableStyle="width: 100%"
        :pt="{
                
                column: {
                    bodycell: ({ state }) => ({
                        style:  state['d_editing']&&'padding-top: 0.3rem; padding-bottom: 0.3rem'
                    })
                }
            }"
        >
            <Column header="#" style="width: 5%">
                <template #body="slotProps">
                    {{ slotProps.index + 1 }}
                </template>
            </Column>
            <Column field="placa" header="PLACA" style="width: 8%">
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" />
                </template>
            </Column>
            <Column field="mtcNroAutorizacion" header="MTC AUT." style="width: 8%">
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" />
                </template>   
            </Column>
            <Column field="tipo" header="TIPO" style="width: 8%"> 
            </Column>
            <Column field="Opc" header="OPC" style="width: 7%">
                <template #body="slotProps">
                    <div class="col-12 md:col-3">
                        <a href="javascript:void(0);" @click="removeitemvehiculo(slotProps.data)" style="width: 80%"><i class="pi pi-times"></i></a>
                    </div>
                </template>
            </Column>              
            <Column :rowEditor="true" style="width: 5%;" bodyStyle="text-align:center"></Column>
        </DataTable>
    </OverlayPanel>


    <Dialog v-model:visible="modaladdconductor" modal header="Agregar conductor" :style="{ width: '25rem' }">
        <div class="p-3 border-round-sm">
 
            <div class="p-fluid formgrid grid">
                <div class="field col-12 md:col-6">
                    <Dropdown v-model="tipodocConductor" :options="[{id:'1',name:'DNI'}]" optionLabel="name" :editable="false" maxlength="35"/>
                </div>
                <div class="field col-12 md:col-6">
                    <InputText v-model="nroDocConductor" placeholder="Nro Documento" maxlength="20"/>
                    <InlineMessage v-if="validate_nrodocConductor">{{message_nrodocConductor}}</InlineMessage>
                </div>
            </div>
            <div class="p-fluid formgrid grid">
                <div class="field col-12 md:col-6">
                    <InputText v-model="nombreConductor" placeholder="Nombre"/>
                    <InlineMessage v-if="validate_nombreConductor">{{message_nombreConductor}}</InlineMessage>
                </div>
                <div class="field col-12 md:col-6">
    
                    <InputText v-model="apellidosConductor" placeholder="Apellidos" maxlength="20"/>
                    <InlineMessage v-if="validate_apellidoConductor">{{message_apellidoConductor}}</InlineMessage>
                </div>
            </div> 
            <div  class="p-fluid formgrid grid">
                <div class="field col-12 md:col-12">
                    <InputText v-model="licenciaConductor" placeholder="Licencia" maxlength="20"/>
                    <InlineMessage v-if="validate_licenciaConductor">{{message_licenciaConductor}}</InlineMessage>
                </div>
            </div>
        </div>
        <div class="flex justify-content-end gap-2">
            <Button type="button" label="Cancel" severity="secondary" @click="cancelConductor()"></Button>
            <Button type="button" label="Agregar"  @click="addConductor()" ></Button>
        </div>
    </Dialog>

    <OverlayPanel ref="op_conductor" :style="{ width: '70rem' }">
        <DataTable  :value="conductor" v-model:editingRows="editingRows" editMode="row" dataKey="id" @row-edit-save="onRowEditSave_conductor" size="small" tableStyle="width: 100%"
        :pt="{
                
                column: {
                    bodycell: ({ state }) => ({
                        style:  state['d_editing']&&'padding-top: 0.3rem; padding-bottom: 0.3rem'
                    })
                }
            }"
        >
            <Column header="#" style="width: 5%">
                <template #body="slotProps">
                    {{ slotProps.index + 1 }}
                </template>
            </Column>
            <Column field="tipoDoc.name" header="DOCUMENTO" style="width: 8%">
            </Column>
            <Column field="nroDoc" header="# DOCUMENTO" style="width: 8%">
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" />
                </template>   
            </Column>
            <Column field="nombres" header="NOMBRES" style="width: 8%">
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" />
                </template>   
            </Column>
            <Column field="apellidos" header="APELLIDOS" style="width: 8%">
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" />
                </template>   
            </Column>
            <Column field="licencia" header="LICENCIA" style="width: 8%">
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" />
                </template>   
            </Column>
            <Column field="tipo" header="TIPO" style="width: 8%">
            </Column>
            <Column field="Opc" header="OPC" style="width: 7%">
                <template #body="slotProps">
                    <div class="col-12 md:col-3">
                        <a href="#chiptransportista" @click="removeitemconductor(slotProps.data)" style="width: 80%"><i class="pi pi-times"></i></a>
                    </div>
                </template>
            </Column>               
            <Column :rowEditor="true" style="width: 5%;" bodyStyle="text-align:center"></Column>
        </DataTable>
    </OverlayPanel>


    <BlockUI :blocked="blocked" fullScreen />

 </template>

<script setup>

    import * as guiaService from '@/services/guiaremision.service.js';
    import * as machineService from '@/services/machine.service.js';
    import { ref, onMounted } from 'vue'
    import SelectButton from 'primevue/selectbutton';
    import { useToast } from "primevue/usetoast";
    import { useConfirm } from "primevue/useconfirm";
    import FileUpload from 'primevue/fileupload';
    import readXlsxFile from 'read-excel-file'
    import ProgressBar from 'primevue/progressbar';
    import BlockUI from 'primevue/blockui';

    const editingRows = ref([]);

    const visible = ref(false);
    const visibleAlert = ref(false);

    const confirm = useConfirm();
    const toast = useToast();
    const op = ref(); const op_conductor = ref();

    const value = ref('Off');
    const options = ref(['Off', 'On']);

    //const fechaactual = new Date();

    let fechaEmision = ref(new Date(Date.now()));
    const hoy = new Date(new Date(Date.now()).toISOString());

    const id_artificial = ref(0);//id para agregar al objecto details

    //Tipo de documento: 09 GUIA DE REMISION datos duros
    let tipos_doc_auth = ref('09');
    let version = ref('2022');
    let serie = ref('T001');//Dato duro, sucursal taller chorrillos

    var datos_company = ref(JSON.parse(localStorage.getItem("company")));
    var datos_AddressCompany = ref(JSON.parse(localStorage.getItem("addressCompany")));
    var datos_sucursal = ref(JSON.parse(localStorage.getItem("sucursal")));


    //Surcusal que emite: Surquillo : 1 | Chorrillos : 0
    let idsucursal = ref(datos_sucursal.value['0'].id);

    //company
    let idCompany = ref(datos_company.value['id']);
    let companyname = ref(datos_company.value['razon_social']);
    let companyruc = ref(datos_company.value['ruc']);
    //let companynamecomercial = ref();

    let companyubigeo = ref(datos_AddressCompany.value[0].ubigeo);
    let companydepartamento = ref(datos_AddressCompany.value[0].departamento);
    let companyprovincia = ref(datos_AddressCompany.value[0].provincia);
    let companydistrito = ref(datos_AddressCompany.value[0].distrito);
    let companyurbanizacion = ref(datos_AddressCompany.value[0].urbanizacion);
    let companydireccion = ref(datos_AddressCompany.value[0].direccion);
    let companycodLocal = ref(datos_AddressCompany.value[0].codLocal);


    let correlativo = ref('180')
    //1 Destinatario o Cliente
    let idclient = ref('1')
    let destinatario = ref('Corimayo Servicios Mineros SAC');
    let tipodoc = ref({id:'6', name:'RUC'});
    let documento = ref(20513963085);

    //2 Datos de envio
    let motTraslado = ref({id:'04',name:'Traslado entre establecimientos de la misma empresa'});
    let modTraslado = ref({id:'02',name:'Transporte Privado'});
    let fechainic = ref(hoy);

    let pesoTotal = ref(1.00);
    let unidadmedida = ref({id:'KGM',name:'Kilogramo'},{id:'TNE',name:'Tonelada'});
    let areatrabajo = ref({name:'Mantenimiento'});        

    //3 Datos de trasnportista
    //privado
    // 3.1 vehiculo
    let placa = ref('');
    let mtcNroAutorizacion = ref('');
    // 3.2 conductor
    let tipodocConductor = ref({id:'1',name:'DNI'});
    let nroDocConductor = ref();
    let nombreConductor = ref();
    let apellidosConductor = ref('');
    let licenciaConductor = ref('');
    //publico
    let tipoDocTransp = ref({id:'6', name:'RUC'});
    let numDocTransp = ref('');
    let rzSocialTransp = ref('');
    let nroMtcTransp = ref('');

    let tipodocTransp = ref({id:'1',name:'DNI'});
    let nroDocTransp = ref('');
    let licenciaTransp = ref('');
    let nombreTransp = ref('');
    let apellidosTransp = ref('');

    let placaTransp = ref('');
    let mtcTransp = ref('');   

    //4 Puntos de partida
    let anexoPartida = ref('');

    let direccionPartida = ref('');
    let ubigeoPartida = ref('');
    let unidadMinPartida = ref('');
    let codLocalpartida = ref('');
    let rucPartida = ref('');

    //5 Puntos de llegada
    let anexoLlegada = ref('');
    let direccionLlegada = ref('');
    let ubigeoLlegada = ref('');
    let unidadMinLlegada = ref('');
    let codLocalLlegada = ref('');
    let rucLlegada = ref('');

    //6 Productos
    let details = ref([]);

    //**** Validaciones ******/
    //** Datos de envio
    const DatosdeEnvio = ref(null);
    const validate_pesoTotal = ref(false);
    const message_pesoTotal = ref('');

    const validate_fechainic = ref(false);
    const message_fechainic = ref('');
    // Datos de envio **//

    const DatosTranspista = ref(null);
    const validate_placa = ref(false);
    const message_placa = ref('');


    const validate_nrodocConductor = ref(false);
    const message_nrodocConductor = ref('');

    const validate_nombreConductor = ref(false);
    const message_nombreConductor = ref('');

    const validate_apellidoConductor = ref(false);
    const message_apellidoConductor = ref('');

    const validate_licenciaConductor = ref(false);
    const message_licenciaConductor = ref('');

    const validate_numDocTransp = ref(false);
    const message_numDocTransp = ref('');

    const validate_rzSocialTransp = ref(false);
    const message_rzSocialTransp = ref('');


    const DatosDireccionPartida = ref(false)
    const validate_direccionpartida = ref(false);
    const message_direccionpartida = ref('');

    const validate_ubigeopartida = ref(false);
    const message_ubigeopartida = ref('');

    const DatosDireccionLlegada = ref(false)
    const validate_direccionllegada = ref(false);
    const message_direccionllegada = ref('');

    const validate_ubigeollegada = ref(false);
    const message_ubigeollegada = ref('');

    const DatosProductos = ref(false);
    const validate_detalleproductos = ref(false);
    const message_detalleproductos = ref('');

    /*****************************/
    let data_send = ref({})
    let data_create = ref({})

    const param_qty = ref(0);

    let products = ref([]);
    let vehiculo = ref([]);
    let conductor = ref([]);

    const modaladdvehiculo = ref(false);
    const modaladdconductor = ref(false);


    const ListEquipos = ref([]);
    const selectedEquipos = ref();

    const umUnitarioList = ref([
            {id:'NIU',name:'UNIDAD'},
            {id:'PR',name:'PAR'},
            {id:'CY',name:'CILINDRO'},
            {id:'PL',name:'BALDE'},
            {id:'GLL',name:'GALON'},
            {id:'BX',name:'CAJA'},
            {id:'MTR',name:'METRO'},
            {id:'RO',name:'ROLLO'},
            {id:'BG',name:'BOLSA'},
            {id:'PK',name:'PAQUETE'},
            {id:'SA',name:'SACO'}
        ]);

    const selectedumUnitario = ref({id:'NIU',name:'UNIDAD'});

    const blocked = ref(false);
    const loading = ref(false);

    const descripcion = ref();
    const codigo = ref();
    const cantidad = ref();

    products = [
        {          
            codigo: "",
            descripcion: "",
            selectEquipos: "",
            cantidad: 0,
            unidad: ""
        }
    ]

    let establecimientos =ref([
        { 
            codLocal: "0011",direccion: "CAL.ALBERT EINSTEIN NRO. 334 URB. LA CALERA DE LA MERCED LIMA - LIMA - SURQUILLO",
            ubigeo: "150141", nombre: "Oficina Surquillo" , ruc:'20513963085'
        },
        { 
            codLocal: "0006",direccion: "CAL.MACHU PICCHU MZA. L LOTE. 09 URB. SAN JUAN BAUTISTA DE VILL LIMA - LIMA - CHORRILLOS",
            ubigeo: "150108", nombre: "Almacen Chorrillos" , ruc:'20513963085'
        },
        { 
            codLocal: "0010",direccion: "CAR.CHAGUAL NRO. S/N LA LIBERTAD - PATAZ - PATAZ",
            ubigeo: "130809", nombre: "Unidad Poderosa", ruc:'20513963085'
        },
        { 
            codLocal: "0007",direccion: "CAR. TAYABAMBA NRO. S/N ANX. RETAMAS LA LIBERTAD - PATAZ - PARCOY",
            ubigeo: "130808", nombre: "Unidad Horizonte",ruc:'20513963085'
        },
        { 
            codLocal: "0008",direccion: "JR. TUPAC AMARU NRO. S/N LIMA - YAUYOS - ALIS",
            ubigeo: "151002", nombre: "Unidad Corona",ruc:'20513963085'
        },
        { 
            codLocal: "0009",direccion: "CAR. LIRCAY NRO. 10 HUANCAVELICA - HUANCAVELICA - HUACHOCOLPA",
            ubigeo: "090106", nombre: "Unidad Kolpa",ruc:'20513963085'
        }
    ]);

    onMounted(async ()=>{
        machineList()
    });

    const toggle = (event) => {
        op.value.toggle(event);
    }

    const toggleConductor = (event) => {
        op_conductor.value.toggle(event);
    }

    const onRowEditSave = (event) => {
        let { newData, index, field } = event;
        console.log(newData)
        //console.log(newData.nuevo_equipo)
        
        /*if(newData.nuevo_equipo !== undefined) {
            let arr_nuevoequipo = newData.nuevo_equipo.map(function (data){return data.name.toString()})
            console.log(arr_nuevoequipo.toString());
            newData.equipo = arr_nuevoequipo.toString();
            console.log(newData)
        }*/
        details.value[index] = newData;
        //VALIDAR QUE EL CAMPO NO SEA VACIO   
    };

    const onRowEditSave_vehiculo = (event) => {
        let { newData, index, field } = event;
        vehiculo.value[index] = newData;
        //VALIDAR QUE EL CAMPO NO SEA VACIO   
    };

    const onRowEditSave_conductor = (event) => {
        let { newData, index, field } = event;
        conductor.value[index] = newData;
        //VALIDAR QUE EL CAMPO NO SEA VACIO   
    };



    const savedespatch = async () =>{
        validateClean();
        var regex = new RegExp("^[A-Z0-9]+$");
        var regexNum = new RegExp("^[0-9]+$");
        var regexAlf = new RegExp("^[A-Z]+$");




        // VALIDACIONES
        if (pesoTotal.value == 0 || pesoTotal.value.length < 1){
            DatosdeEnvio.value.$el.scrollIntoView()   
            message_pesoTotal.value = `El peso debe ser mayor que "0" `;        
            return validate_pesoTotal.value = true;
        }

        let p_fechaEmision = format_fecha(fechaEmision.value)
        let p_fechainic = format_fecha(fechainic.value)
    
        if(p_fechainic < p_fechaEmision) {
            DatosdeEnvio.value.$el.scrollIntoView() 
            console.error('La fecha de inicio del traslado debe ser mayor o igual a la fecha de emisión del documento.');
            message_fechainic.value = 'La fecha de inicio del traslado debe ser mayor o igual a la fecha de emisión del documento.';
            return validate_fechainic.value = true;
        }   
        


        // SI MODALIDAD DE TRASLADO ES PUBLICO
        if(modTraslado.value.id == '01'){
            if(numDocTransp.value.length != 11 || !regexNum.test(numDocTransp.value)){
                DatosTranspista.value.$el.scrollIntoView()   
                message_numDocTransp.value = '(*) Campo obligatorio: El RUC no es valido o esta vacio';        
                return validate_numDocTransp.value = true;
            }

            if(numDocTransp.value == companyruc.value ){
                DatosTranspista.value.$el.scrollIntoView()   
                message_numDocTransp.value = 'Transportista  no debe ser igual al remitente o destinatario.';        
                return validate_numDocTransp.value = true;
            }

            if(rzSocialTransp.value.length < 1){
                DatosTranspista.value.$el.scrollIntoView()   
                message_rzSocialTransp.value = '(*) Campo obligatorio: Ingresar el nombre de razon social del transportista';        
                return validate_rzSocialTransp.value = true;
            }
            console.log('publico')
        }


        //DIRECCION de partida DatosDireccionPartida
        console.log(direccionPartida.value.length);
        if(direccionPartida.value.length<1){
            DatosDireccionPartida.value.$el.scrollIntoView()
            message_direccionpartida.value = '(*) Campo obligatorio: Ingresar Direccion correctamente.';
            return validate_direccionpartida.value = true; 
        }

        console.log(ubigeoPartida.value.length);
        if(ubigeoPartida.value.length<1){
            DatosDireccionPartida.value.$el.scrollIntoView()
            message_ubigeopartida.value = '(*) Campo obligatorio:Ingresar el ubigeo correcto';
            return validate_ubigeopartida.value = true; 
        }

        //DIRECCION de Llegada DatosDireccionLlegada
        console.log(direccionLlegada.value.length);
        if(direccionLlegada.value.length<1){
            DatosDireccionLlegada.value.$el.scrollIntoView()
            message_direccionllegada.value = '(*) Campo obligatorio: Ingresar Direccion correctamente.';
            return validate_direccionllegada.value = true; 
        }

        console.log(ubigeoLlegada.value.length);
        if(ubigeoLlegada.value.length<1){
            DatosDireccionLlegada.value.$el.scrollIntoView()
            message_ubigeollegada.value = '(*) Campo obligatorio: El nro de licencia debe ser Alfanumerico y de 9 a 10 caracteres';
            return validate_ubigeollegada.value = true; 
        }

        console.log(details.value.length);
        if(details.value.length<1){
            DatosProductos.value.$el.scrollIntoView()
            message_detalleproductos.value = '(*) No hay productos para registrar';
            return validate_detalleproductos.value = true; 
        }



        //return console.log("save")
        // VALIDACIONES END //

        blocked.value = true;
        loading.value = true;

        let fecha_emision = format_fechaEmision(fechaEmision.value)
        let fechatrasl = format_fechaEmision(fechainic.value);
        console.log(fecha_emision);
        console.log(fechatrasl);

        data_create = {
            version: version.value,
            tipoDoc:tipos_doc_auth.value,
            serie:serie.value,
            correlativo:correlativo.value,
            fechaEmision:fecha_emision,
            idsucursal:idsucursal.value,
            areatrabajo:areatrabajo.value.name,
            company:{
                idCompany:idCompany.value,
                ruc:companyruc.value,
                razonSocial:companyname.value,
                nombreComercial:"Corimayo",
                address:{
                    ubigeo:companyubigeo.value,
                    departamento:companydepartamento.value,
                    provincia:companyprovincia.value,
                    distrito:companydistrito.value,
                    urbanizacion:companyurbanizacion.value,
                    direccion:companydireccion.value,
                    codLocal:companycodLocal.value,
                }
            },
            destinatario:{
                idclient: idclient.value,
                tipoDoc:tipodoc.value.id,
                numDoc:documento.value,
                rzSocial:destinatario.value,
                address:{
                    ubigeo:"150141",
                    departamento:"LIMA",
                    provincia:"LIMA",
                    distrito:"SURQUILLO",
                    urbanizacion:"-",
                    direccion:"Calle Albert Einstein 334",
                    codLocal:"0008"
                }
            },
        
            envio:{
                codtraslado:motTraslado.value.id,
                modtraslado:modTraslado.value.id,
                fecTraslado: fechatrasl,
                pesoTotal: pesoTotal.value,
                undPesoTotal: unidadmedida.value.id,
                llegada:{
                    ubigeo :ubigeoLlegada.value,
                    direccion: direccionLlegada.value,
                    codLocal: codLocalLlegada.value,
                    nomlocal: unidadMinLlegada.value,
                    ruc: rucLlegada.value

                },
                partida:{
                    ubigeo:ubigeoPartida.value,
                    direccion: direccionPartida.value,
                    codLocal: codLocalpartida.value,
                    nomlocal: unidadMinPartida.value,
                    ruc: rucPartida.value
                 
                },
                choferes:[
                    conductor.value
                ],
                vehiculos:[
                    vehiculo.value
                ],

                transportista:{
                    tipoDoc:tipoDocTransp.value.id,
                    numDoc: numDocTransp.value,
                    rzSocial: rzSocialTransp.value,
                    nroMtc: nroMtcTransp.value,
                }
            },

            details           
        };

     

        const resp = await guiaService.SaveDespatch(data_create);

        console.log(resp.request['status']);
        console.log(resp.request);
        console.log(resp.data);
        if(resp.request.status == 200) {
            blocked.value = false;
            loading.value = false;
            resetform();
            showAlert('success',resp.data.mensaje,'Guia de remision registrada con exito');

        }else if(resp.request.status == 500){
            blocked.value = false;
            loading.value = false;
            showAlert('error','Error en el servidor','Algo sucedio, no se puede registrar la guia de remision');
        }else{
            blocked.value = false;
            loading.value = false;
            showAlert('error','Error desconocido','No se logro registrar la guia de remision, ocurrio un erro comuniquese con soporte');
        }

        console.log('save');
        blocked.value = false;
            loading.value = false;

    }
    

    const prevAddItem = async (data) =>{
        validateClean();

        if(descripcion.value == undefined || descripcion.value.length<1 || selectedumUnitario.value.id.length<1 || (cantidad.value.length<1 || cantidad.value <1 || cantidad.value == undefined) ){
            validate_detalleproductos.value = true
            return message_detalleproductos.value = "Campos incompletos, ingresar descripcion, seleccionar equipos y cantidad mayor a 0 "
        }

        //let arrayEquipos = selectedEquipos.value.map(function (data){return data.name.toString()})
        
        id_artificial.value = id_artificial.value + 1; 
        details.value.push({
            id: id_artificial.value,
            cantidad:cantidad.value,
            unidad:selectedumUnitario.value.id,
            //equipo: arrayEquipos.toString(),
            equipo: (selectedEquipos.value)?selectedEquipos.value.name:'',
            descripcion:descripcion.value,
            codigo:codigo.value
        });

        selectedEquipos.value = {name:null};
        descripcion.value = ""; //CAMBIAR VARIABLE, DECLARARLA COMO INDEPENDIENTE
        codigo.value = "";
        cantidad.value = "";
        selectedumUnitario.value = {id:'NIU',name:'UNIDAD'};
    }

    const RemoveItem = async (data) =>{
        console.log(data);
        for(let list of details.value){
            if(list.id==data.id){
                console.log(list);
                return details.value.splice(details.value.indexOf(data),1);
            }
        }
    }

    const addVehiculo = async () =>{
        var regex = new RegExp("^[A-Z0-9]+$");
        var regexNum = new RegExp("^[0-9]+$");
        if((placa.value.length>=9 || placa.value.length<=5) || !regex.test(placa.value)) {
            message_placa.value = '(*) Campo obligatorio:Sólo alfanumérico de 6 a 8 caracteres (solo se permiten letras mayúsculas y números, no espacios en blanco ni guion, tampoco se permite solamente ceros).';
            return validate_placa.value = true;
        }

        vehiculo.value.push({
            placa: placa.value,
            mtcNroAutorizacion:mtcNroAutorizacion.value,
            tipo:(vehiculo.value.length<1)?'PRINCIPAL':'SECUNDARIO'
        });

        placa.value ='';
        validate_placa.value = false
        modaladdvehiculo.value = false
    }

    const removeitemvehiculo = async (data) =>{
        console.log(data);
        for(let list of vehiculo.value){
            if(list.id==data.id){
                console.log(list);

                return vehiculo.value.splice(vehiculo.value.indexOf(data),1);
            }
        }
        
      
    }
    
    const addConductor = async () =>{
        var regex = new RegExp("^[A-Z0-9]+$");
        var regexNum = new RegExp("^[0-9]+$");

        if(tipodocConductor.value.name == 'DNI' && nroDocConductor.value == undefined || ( nroDocConductor.value.length <= 7 || nroDocConductor.value.length >= 9 ) || !regexNum.test(nroDocConductor.value) ){
            console.log('validacion 1 ')
            message_nrodocConductor.value = '(*) Campo obligatorio: El dni debe tener 8 caracteres y solo numeros';
            cleanvalidate_conductor();
            return validate_nrodocConductor.value = true; 
        }else if(tipodocConductor.value.name !== 'DNI' || nroDocConductor.value == undefined && (nroDocConductor.value.length <= 7 || nroDocConductor.value.length >= 10 ) || !regexNum.test(nroDocConductor.value)){
            message_nrodocConductor.value = '(*) Campo obligatorio: El nro de documento no debe ser vacio y solo numero';
            cleanvalidate_conductor();
            return validate_nrodocConductor.value = true;
        }
        //NOMBRE Y APELLIDO DE CONDUCTOR
        if( nombreConductor.value == undefined){
            message_nombreConductor.value = '(*) Campo obligatorio:Ingresar el nombre del conductor';
            cleanvalidate_conductor();
            return validate_nombreConductor.value = true; 
        }

        if(apellidosConductor.value.length<1){
            message_apellidoConductor.value = '(*) Campo obligatorio:Ingresar el apellido del conductor';
            cleanvalidate_conductor();
            return validate_apellidoConductor.value = true; 
        }   

        //LICENCIA CONDUCTOR
        console.log(licenciaConductor.value,licenciaConductor.value.length);
        if(licenciaConductor.value.length <= 8 || licenciaConductor.value.length >= 11 || !regex.test(licenciaConductor.value) ){
            
            message_licenciaConductor.value = '(*) Campo obligatorio: El nro de licencia debe ser Alfanumerico y de 9 a 10 caracteres';
            cleanvalidate_conductor();
            return validate_licenciaConductor.value = true; 
        }


        conductor.value.push({
            tipoDoc: tipodocConductor.value,
            nroDoc:nroDocConductor.value,
            nombres:nombreConductor.value,
            apellidos:apellidosConductor.value,
            licencia:licenciaConductor.value,
            tipo:(conductor.value.length<1)?'PRINCIPAL':'SECUNDARIO'
        });

        cleanvalidate_conductor();

        nroDocConductor.value="";
        nombreConductor.value="";
        apellidosConductor.value="";
        licenciaConductor.value="";

        modaladdconductor.value = false
    } 
    
    const cleanvalidate_conductor = () => {
        validate_nrodocConductor.value = false
        validate_licenciaConductor.value = false
        validate_nombreConductor.value = false
        validate_apellidoConductor.value = false
    }

    
    const cancelConductor = ()=>{

        validate_nrodocConductor.value = false
        validate_licenciaConductor.value = false
        validate_nombreConductor.value = false
        validate_apellidoConductor.value = false

        nroDocConductor.value="";
        nombreConductor.value="";
        apellidosConductor.value="";
        licenciaConductor.value="";

        modaladdconductor.value = false
    }

    const removeitemconductor = async (data) =>{
        console.log(data);
        for(let list of conductor.value){
            if(list.id==data.id){
                console.log(list);
                return conductor.value.splice(conductor.value.indexOf(data),1);
            }
        }

     }
    

       
    const format_fecha = (date) => {

        let tzoffset = (new Date(date)).getTimezoneOffset() * 60000;
        let localISOTime   = (new Date(date - tzoffset)).toISOString().slice(0, -1);//offset in milliseconds
        let fecha = new Date(localISOTime);
        return `${fecha.getFullYear()}-${fecha.getMonth()}-${fecha.getDate()}`
    }

    const format_fechaEmision = (date) => {
        let tzoffset = (new Date(date)).getTimezoneOffset() * 60000;
        let localISOTime   = (new Date(date - tzoffset)).toISOString().slice(0, -1);//offset in milliseconds
        return localISOTime;
    }
      
    const datosEnvio= (valor) => {

        console.log(motTraslado.value['id'], valor)
       
        //direccionPartida.value = anexoPartida.value['direccion']

       if(motTraslado.value['id'] == '04' && valor == 'partida') {
            console.log('partida');
            direccionPartida.value = anexoPartida.value['direccion'];
            ubigeoPartida.value = anexoPartida.value['ubigeo'];
            unidadMinPartida.value = anexoPartida.value['nombre'];
            codLocalpartida.value = anexoPartida.value['codLocal'];
            rucPartida.value = anexoPartida.value['ruc'];
        }else if(motTraslado.value['id'] == '04' && valor == 'llegada'){

            direccionLlegada.value = anexoLlegada.value['direccion']
            ubigeoLlegada .value = anexoLlegada.value['ubigeo']
            unidadMinLlegada.value = anexoLlegada.value['nombre']
            codLocalLlegada.value = anexoLlegada.value['codLocal']
            rucLlegada.value = anexoLlegada.value['ruc'];

        }

        console.log(direccionPartida.value);
    }

    const machineList = async () =>{
        const resp = await machineService.ViewMachinesService();
        //ListEquipos.value = resp.data; 
        ListEquipos.value = resp.data.map(function (data) {
            return { name: data.alias}
        })

        console.log(ListEquipos.value);
    };


    const readfile =() =>{
        const input = document.getElementById('loadfilexcel')
        console.log(input);
        readXlsxFile(input.files[0]).then((rows) => {
            // `rows` is an array of rows
            // each row being an array of cells.
            rows.map((row,index) =>{
                id_artificial.value = id_artificial.value + 1; 
                console.log(index);
                console.log(row);
                details.value.push({
                    id:id_artificial.value,
                    cantidad:row[3],
                    unidad:row[4],
                    equipo: row[2],
                    descripcion:row[0],
                    codigo:row[1]
                });
            });
            console.log(details.value);
            visible.value = false;
        })
    }

    const showAlertPrev= (title,message) => {
        if (!visibleAlert.value) {
            toast.add({ severity:"info",title:title ,summary: message, group: 'bc' });
            visibleAlert.value = true;
            //accion.value = title;
        
        } 
    };

    const Accept = async () => {
        savedespatch();
        toast.removeGroup('bc');
        visibleAlert.value = false;
    }

    const onClose = () => {
        visibleAlert.value = false;
    }

    const showAlert= (severity,title,message,details) => {
        if (!visibleAlert.value) {
            toast.add({ severity:severity,title:title ,summary: message, group: 'bc2',details:details });
            visibleAlert.value = true;
        } 
    };

    const validateClean = () =>{
        console.log('clean')
        validate_pesoTotal.value = false
        validate_fechainic.value = false
        validate_placa.value = false

        validate_direccionpartida.value = false
        validate_ubigeopartida.value = false
        validate_direccionllegada.value = false
        validate_ubigeollegada.value = false
        validate_detalleproductos.value = false

        validate_numDocTransp.value = false
        validate_rzSocialTransp.value = false
        
    }

    const resetform = () =>{
        pesoTotal.value = "";
        placa.value = "";
        mtcNroAutorizacion.value="";
       
        numDocTransp.value="";
        rzSocialTransp.value="";
        nroMtcTransp.value="";
        direccionPartida.value="";
        ubigeoPartida.value="";
        unidadMinPartida.value="";
        codLocalpartida.value="";
        rucPartida.value="";
        direccionLlegada.value="";
        ubigeoLlegada.value="";
        unidadMinLlegada.value="";
        codLocalLlegada.value="";
        rucLlegada.value="";
        anexoPartida.value="";
        anexoLlegada.value="";
        details.value={};
    }

</script>

<style>

@keyframes p-progress-spinner-color {
    100%,
    0% {
        stroke: #d62d20;
    }
    40% {
        stroke: #0057e7;
    }
    66% {
        stroke: #008744;
    }
    80%,
    90% {
        stroke: #ffa700;
    }
}

</style>
