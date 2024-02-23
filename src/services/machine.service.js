import {http} from "./http.js";

export function ViewMachinesService(){
    return http().post('/machine/viewlist');
}