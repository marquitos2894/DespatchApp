import {http} from "./http.js";

export function CreateDespatch(){

    let datos = new Object();

    datos = {
        version: "2022",
        tipoDoc:"09",
        serie:"T001",
        correlativo:"178",
        fechaEmision:"2023-11-18T00:00:00-05:00",
        company:{
            ruc:20513963085,
            razonSocial:"Corimayo Servicios Mineros SAC",
            nombreComercial:"CORIMAYO",
            address:{
                ubigueo:"150141",
                departamento:"LIMA",
                provincia:"LIMA",
                distrito:"SURQUILLO",
                urbanizacion:"-",
                direccion:"Calle Albert Einstein 334",
                codLocal:"0008"
            }
        },
        destinatario:{
            tipoDoc:"6",
            numDoc:20451460570,
            rzSocial:"Contratistas mineros y civiles del Peru SAC",
            address:{
                ubigueo:"150141",
                departamento:"LIMA",
                provincia:"LIMA",
                distrito:"SURQUILLO",
                urbanizacion:"-",
                direccion:"Calle Albert Einstein 334",
                codLocal:"0008"
            }
           
        },
    
        envio:{
            codtraslado:"01",
            modtraslado:"02",
            fecTraslado: "2023-11-18T00:00:00-05:00",
            pesoTotal: 12.5,
            undPesoTotal: "KGM",
            llegada:{
                ubigueo :150101,
                direccion: "Av. los horizontes 5265"
            },
            partida:{
                ubigueo:150101,
                direccion: "Ca Machu Picchu Mz L lt 9"
            },
            choferes:[
                {
                    tipoDoc : "1",
                    nroDoc: "21461100",
                    licencia: "Q21461100",
                    nombres: "Vicente",
                    apellidos: "Chacaliaza" 
                }
            ],
            vehiculos:[
                {
                    placa : "AUN921"
                }
            ]
        },
        details:[
            {   
                cantidad:2,
                unidad:"ZZ",
                descripcion:"PRODUCTO 1",
                codigo:"P001"
            }
        ]
    };
    
    //return console.log(datos['company']);

    //data = JSON.stringify(data);

    return http().post('/despatches/send',{datos})

    

}

export function SaveDespatch(data_create){


    let bodyFormData = new FormData();
    bodyFormData.append('data',data_create);


    return http().post('/despatches/store', data_create ,{ 
    headers: {
        'Content-Type': 'multipart/form-data',
        'Content-Type': 'application/json'  
        }
        //'responseType': 'blob'
    })
    .then(response =>{
        if(response.status === 200){
            console.log(response)
            return response;
        }
    })
    .catch(err =>{
        console.log(err);
    })

}

export function SendDespatch(data_create){

    //return console.log(data_create);

    //data = JSON.stringify(data);
    let bodyFormData = new FormData();
    bodyFormData.append('data',data_create);



    return http().post('/despatches/send', data_create ,{ 
    headers: {
        'Content-Type': 'multipart/form-data',
        'Content-Type': 'application/json'  
        }
        //'responseType': 'blob'
    })
    .then(response =>{
        if(response.status === 200){
            /*const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'test.pdf');
            document.body.appendChild(link);
            link.click();*/
            console.log(response)
            return response;
        }
    })
    .catch(err =>{
        console.log(err);
    })

}

export function XmlDespatch(data_create){

    //return console.log(data_create);

    //data = JSON.stringify(data);
    let bodyFormData = new FormData();
    bodyFormData.append('data',data_create);



    return http().post('/despatches/xml', data_create ,{ 
    headers: {
        'Content-Type': 'multipart/form-data',
        'Content-Type': 'application/json'  
        },
        //'responseType': 'blob'
    })
    .then(response =>{
        if(response.status === 200){
            /*const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            //link.setAttribute('download', 'test.pdf');
            document.body.appendChild(link);
            link.click();*/

            return response;
        }
    })
    .catch(err =>{
        console.log(err);
    })

}

export function DownloadDespatch(data_create){

    //return console.log(data_create);

    //data = JSON.stringify(data);
    let bodyFormData = new FormData();
    bodyFormData.append('data',data_create);



    return http().post('/despatches/pdf', data_create ,{ 
    headers: {
        'Content-Type': 'multipart/form-data',
        'Content-Type': 'application/json'  
        },
        'responseType': 'blob'
    })
    .then(response =>{
        if(response.status === 200){
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'test.pdf');
            document.body.appendChild(link);
            link.click();
        }
    })
    .catch(err =>{
        console.log(err);
    })

}

export function ViewDespatchesService(){
    return http().post('/despatches/viewlist');
}

export function ViewDespatchIdService(data){
    return http().post('/despatches/viewguia',data);
}

export function DownloadDespatch2(){

    let datos = new Object();

    datos = {
        version: "2022",
        tipoDoc:"09",
        serie:"T001",
        correlativo:"178",
        fechaEmision:"2023-11-18T00:00:00-05:00",
        company:{
            ruc:20513963085,
            razonSocial:"Corimayo Servicios Mineros SAC",
            nombreComercial:"CORIMAYO",
            address:{
                ubigueo:"150141",
                departamento:"LIMA",
                provincia:"LIMA",
                distrito:"SURQUILLO",
                urbanizacion:"-",
                direccion:"Calle Albert Einstein 334",
                codLocal:"0008"
            }
        },
        destinatario:{
            tipoDoc:"6",
            numDoc:20451460570,
            rzSocial:"Contratistas mineros y civiles del Peru SAC",
            address:{
                ubigueo:"150141",
                departamento:"LIMA",
                provincia:"LIMA",
                distrito:"SURQUILLO",
                urbanizacion:"-",
                direccion:"Calle Albert Einstein 334",
                codLocal:"0008"
            }
           
        },
    
        envio:{
            codtraslado:"01",
            modtraslado:"02",
            fecTraslado: "2023-11-18T00:00:00-05:00",
            pesoTotal: 12.5,
            undPesoTotal: "KGM",
            llegada:{
                ubigueo :150101,
                direccion: "Av. los horizontes 5265"
            },
            partida:{
                ubigueo:150101,
                direccion: "Ca Machu Picchu Mz L lt 9"
            },
            choferes:[
                {
                    tipoDoc : "1",
                    nroDoc: "21461100",
                    licencia: "Q21461100",
                    nombres: "Vicente",
                    apellidos: "Chacaliaza" 
                }
            ],
            vehiculos:[
                {
                    placa : "AUN921"
                }
            ]
        },
        details:[
            {   
                cantidad:2,
                unidad:"ZZ",
                descripcion:"PRODUCTO 1",
                codigo:"P001"
            }
        ]
    };
    
    //return console.log(datos['company']);

    //data = JSON.stringify(data);

    return http().post('/despatches/pdf', FormData ,{ 
        headers: {
            'Content-Type': 'multipart/form-data'     
            },
            'responseType': 'blob'
    })
    .then(response =>{
        if(response.status === 200){
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'test.pdf');
            document.body.appendChild(link);
            link.click();
        }
    })
    .catch(err =>{
        console.log(err);
    })
    
    
    
}


