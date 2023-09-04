/**
 * Import client function in the api.ts file
 */

import {client} from './client'
/**
 * 
 * @returns - Used to return the data to the FormCOmponent
 */

export const getDynamicDetails = ()=>{
    return client('getDynamicDetails', {method:'GET'});
}
    
/**
 * Pseudo COde No. : F_PC_09,02
 * @param insertData Used to get the bodyData as a parameter from the Formcomponent and pass it to the client
 * @returns If response comes return it to the Formcomponent
 */

export const insertDetails=(insertData:any)=>{
    return client(`insertDetails`,{method:'POST',body:insertData})
}

/**
 * Pseudo COde No. : F_PC_13,20
 * @param id -Used to get the candidate id as a parameter from the Formcomponent and pass it to the client
 * @returns -If response comes return it to the Formcomponent
 */

export const getDetailsForEdit=(id:any)=>{
    return client(`getDetailsForEdit/${id}`,{method:'get'})
}

/**
 * Pseudo COde No. : G_PC_05,12
 * @param bodyData --Used to get the candidate details as a parameter from the Formcomponent and pass it to the client
 * @returns If response comes return it to the Gridcomponent
 */

export const getGridDetails=(bodyData:any)=>{
    return client(`getGridDetails`,{method:'post',body:bodyData})
}

/**
 * Pseudo COde No. : G_PC_30,37
 * @param id -Used to get the candidate id as a parameter from the Formcomponent and pass it to the client
 * @returns -If response comes return it to the Gridcomponent
 */

export const deleteDetails=(id:any)=>{
    return client(`deleteDetails/${id}`,{method:'put'})
}


export const errorLog=(insertData:any)=>{
    return client(`errorLog`,{method:'POST',body:insertData})
}