const { request } = require('express');
const { response } = require('express');
const express=require('express')
const query=require('./Queries/query')
const app=express()
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "OPTIONS, GET, POST, PUT, PATCH, DELETE"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

app.use(express.json())
const port=8080;
/**
 * Pseudo Code No.:F_PC_04
 */
//GRID
//Get Course and Admission Mode 
app.get('/getDynamicDetails',query.getDynamicDetails) 

//Get Details for edit
/**Pseudo Code No.:F_PC_15
 * 
 */
app.get(`/getDetailsForEdit/:id`,query.getDetailsForEdit)

//Insert New Data
app.post('/insertDetails',query.insertDetails)

/**Pseudo Code No.:F_PC_25
 * 
 */
//TABLE
//Get Deatils for Grid Bind
app.post('/getGridDetails',query.getGridDetails)

//Delete Details
app.put('/deleteDetails/:id',query.deleteDetails)

//Error Log
app.post('/errorLog',query.errorLog)


app.listen(port,()=>{
    console.log(`App Running in the port- ${port}`)
})