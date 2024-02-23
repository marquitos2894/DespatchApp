import {http} from './http.js';

export function listarOrdenCompra(params){
    console.log(params,' ---- ')
    let pages = parseInt(params.value.page)+1;
    let rows = parseInt(params.value.rows);
    //let name = params.value.filters.nombre;
    console.log(params.value);
    //return http().get('/producto?page='+pages+'&rows='+rows+'&nombre='+name);
    return http().get('oc?page='+pages+'&rows='+rows);
}

export function buscaroc(id_oc){
    console.log(id_oc)
    return http().get('oc/'+id_oc);
}

export function filtrar(proveedor,equipo,params){
    console.log(proveedor,equipo)
    let page = parseInt(params.value.page)+1;
    let rows = parseInt(params.value.rows);

    return http().post('FiltrarOrden',{proveedor,equipo,page,rows})
}

export function Status_filter_oc(status,params,proveedor,equipo){
    console.log(status);
    let page = parseInt(params.value.page)+1;
    let rows = parseInt(params.value.rows);
    console.log(proveedor,equipo);
    return http().post('ocFilterStatus',{status,proveedor,equipo,page,rows});
} 

/*
export function listarOrdenCompraPorId(id){

    console.log(id)
    return http().get('/detalleoc/'+id);
}*/

export function listarHistorialPorId(id){
    console.log(id)
    
    return http().get('historialordenes/'+id);
}

export function DeleteItemHistorial(id){
    //Csrf.getCookie();
    //http.csrf().disable()
    console.log(id);
    return http().delete('historialordenes/'+id);
}

export function saveRegistros(carrito,documento,numero,fecha,id_oc){
    return http().post('historialordenes',{carrito,documento,numero,fecha,id_oc});
}

export function Status_filter(status,id_oc){
    console.log(status,id_oc);
    return http().post('DetalleocFilterStatus',{status,id_oc});
} 

export function listarOrdenCompraPorId2(id_oc){
    return http().get('detalleoc/'+id_oc);
}

//Proveedor
export function select_proveedor(){
    return http().get('/proveedor_select')
}

//Equipo
export function select_equipo(){
    return http().get('/equipo_select')
}
