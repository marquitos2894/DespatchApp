import {http} from "./http.js";

export function login(email, password) {
    console.log(email, password);
    return http().post("login", {email, password});
}

/*
export function getPerfil(){
    return http().get("/auth/perfil");
}*/


export function logout(){
    return http().post("/auth/logout");
}

/*
export function editpersona(){
    return http().put("persona/1");
}*/