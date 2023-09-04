import React from 'react';
import axios from 'axios';


/**
 *  Pseudo COde No. : F_PC_03
 * @param endpoint- Used to get the router from the api.ts
 * 
 * @returns - Used to return the response to the api.ts
 */
export async function client(
    endpoint : string ,
    {requestType, body, ...customConfig} : any = {} ,
)
{
    debugger;
    const header : any ={
        'Content-Type' : 'application/json; charset=UTF-8'
    };
    const requestConfig : any = {
        method: requestType,

        ...customConfig,
        header:{
            ...header,
            ...customConfig.headers
        }
    };

    if(body){
        requestConfig.data= body;
        console.log("incide body",requestConfig.data)

    }
    console.log(endpoint,requestConfig.method)
    const url=`http://localhost:8080/${endpoint}`;
    /**
     * 
     */
    console.log(requestConfig);
    
    const apiResponse= await axios(url, requestConfig);
    return apiResponse;
}