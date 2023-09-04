const { set } = require('express/lib/application')
const sql = require('mssql')
/**
 * Pseudo Code No.:F_PC_0.2
 */
const sqlconfig = {
    user: 'sa',
    password: 'admin',
    database: 'candidateFormDB',
    server: 'localhost',
    options: {
        trustServerCertificate: true
    }
}

//GRID
//Get COurse and Admission 
/**
 * Pseudo Code No.:F_PC_07
 * @param {*} request - Used to get Request details
 * @param {*} response- Used to send response
 */
async function getDynamicDetails(request, response) {
    try {
        let db = await sql.connect(sqlconfig)
        let result = await sql.query(`select * from courseDetails;select * from admission;select * from facility`)
        response.status(200).json(result);
    } catch (e) {
        console.log(e);
        let db = await sql.connect(sqlconfig)
        let result = await sql.query(`insert into errorLog (moduleName,methodName,errorDescription) values ('Query.js Node','getDynamicDetails','${e}');`)
    }

}
/**
 * Pseudo Code No.:F_PC_18
 * @param {*} request - Used to get Request details
 * @param {*} response- Used to send response
 */
//Get Details for edit
async function getDetailsForEdit(request, response) {
    try {
        let id = request.params.id;
        let db = await sql.connect(sqlconfig)
        let result = await sql.query(`select * from candidateForm where formID=${id} and isActive=0 ;select * from facilityMap where formID=${id}`)
        response.status(200).json(result);
    } catch (e) {
        console.log(e);
        let db = await sql.connect(sqlconfig)
        let result = await sql.query(`insert into errorLog (moduleName,methodName,errorDescription) values ('Query.js Node','getDynamicDetails','${e}');`)
    }
}
/**
 * Pseudo Code No.:F_PC_27
 * @param {*} request - Used to get Request details
 * @param {*} response- Used to send response
 */
//Insert New Data
async function insertDetails(request, response) {
    try {
        let data = request.body;
        let db = await sql.connect(sqlconfig)
        if (data.FormID != "") {
            var query = `update candidateForm set firstname='${data.Firstname}',lastname='${data.Lastname}',dob='${data.dob}',courseID=${data.courseID},
        adID=${data.adID},issues='${data.issues}' where formID=${data.FormID}`;

            let result = await sql.query(query)

            var query1 = `delete from facilityMap where formID=${data.FormID}`
            let result1 = await sql.query(query1)
            for (let obj of data.facilityID) {
                var query = `insert into facilityMap (formID,facilityID) values(${data.FormID},${obj})`
                let result = await sql.query(query)
            }
            response.status(200).json({ "Status": "Success" });
        }
        else {
            var query = `insert into candidateForm(firstname,lastname,dob,courseID,adID,issues) 
        values('${data.Firstname}','${data.Lastname}','${data.dob}',${data.courseID},${data.adID},'${data.issues}'); select @@IDENTITY AS FormID`

            let result = await sql.query(query)
            const FormID = result.recordset[0].FormID;
            for (let obj of data.facilityID) {
                var query = `insert into facilityMap (formID,facilityID) values(${FormID},${obj})`
                let result = await sql.query(query)
            }
            response.status(200).json({ "Status": "Success" });
        }
    } catch (e) {
        console.log(e);
        let db = await sql.connect(sqlconfig)
        let result = await sql.query(`insert into errorLog (moduleName,methodName,errorDescription) values ('Query.js Node','getDynamicDetails','${e}');`)
    }
}



/**
 * Pseudo Code No.:F_PC_07
 * @param {*} request - Used to get Request details
 * @param {*} response- Used to send response
 */
//TABLE
//Delete Details
async function deleteDetails(request, response) {
    try {
        let id = request.params.id;
        let db = await sql.connect(sqlconfig)
        console.log(id)
        let result = await sql.query(`update candidateForm set isActive=1 where formID=${id};`)
        console.log(result)
        response.status(200).json({ "Message": "Success" });
    } catch (e) {
        console.log(e);
        let db = await sql.connect(sqlconfig)
        let result = await sql.query(`insert into errorLog (moduleName,methodName,errorDescription) values ('Query.js Node','getDynamicDetails','${e}');`)
    }
}
/**
 * 
 * @param {*} request - Used to get Request details
 * @param {*} response- Used to send response
 */
//Get Deatils for Grid Bind
async function getGridDetails(request, response) {
    try {
        let db = await sql.connect(sqlconfig)
        console.log(request.body);

        var filterCourse = "";
        var filterAdmission = "";
        var filterName = "";

        { request.body.fC !== 0 ? filterCourse = ` and candidateForm.courseID=${request.body.fC} ` : filterCourse = "" }
        { request.body.fA !== "" ? filterAdmission = ` and candidateForm.adID=${request.body.fA} ` : filterAdmission = "" }
        { request.body.fN !== "" ? filterName = ` and candidateForm.firstname='${request.body.fN}' ` : filterName = "" }

        let query = `select string_agg(ISNULL(facility.facilityName,''),', ')as facilityName,candidateForm.formID,candidateForm.firstname,candidateForm.lastname,courseDetails.courseName,admission.adName ,candidateForm.dob,candidateForm.issues
            from candidateForm
            inner join facilityMap on candidateForm.formID=facilityMap.formID 
            inner join facility on facility.facilityID=facilityMap.facilityID
            inner join admission on candidateForm.adID=admission.adID
            inner join courseDetails on candidateForm.courseID=courseDetails.courseID  
            where candidateForm.isActive=0 and candidateForm.firstname like '%${request.body.search}%' ${filterAdmission} ${filterCourse} ${filterName}
            group by candidateForm.formID,candidateForm.firstname,candidateForm.lastname,courseDetails.courseName,admission.adName,candidateForm.dob,candidateForm.issues 
            order by ${request.body.sortName} ${request.body.sortOrder} offset ${request.body.offset} rows fetch next 10 rows only`;

            console.log(query)
        let result = await sql.query(query)
        console.log("offset",result.rowsAffected)

        let lengthQuery = `select * from candidateForm
    where candidateForm.isActive=0 and candidateForm.firstname like '%${request.body.search}%' ${filterAdmission} ${filterCourse} ${filterName} `;
        let result0 = await sql.query(lengthQuery)

        let candidateLength = result0.rowsAffected
        console.log(result0.rowsAffected)

        response.status(200).json({ result, candidateLength });
    } catch (e) {
        console.log("----------------------------Error Log------------------------")
        console.log(e);
        let db = await sql.connect(sqlconfig)
        let result = await sql.query(`insert into errorLog (moduleName,methodName,errorDescription) values ('Query.js Node','getDynamicDetails','${e}');`)
    }
}



//error Log
async function errorLog(request, response) {
    try {
        let db = await sql.connect(sqlconfig)
        let result = await sql.query(`insert into errorLog (moduleName,methodName,errorDescription) values ('${request.body.module}','${request.body.method}','${request.body.des}');`)
        console.log(result)
        response.status(200).json(result);
    } catch (e) {
        console.log(e);
        let db = await sql.connect(sqlconfig)
        let result = await sql.query(`insert into errorLog (moduleName,methodName,errorDescription) values ('Query.js Node','getDynamicDetails','${e}');`)
    }
}


module.exports = {
    getDynamicDetails,
    getDetailsForEdit,
    insertDetails,
    deleteDetails,
    getGridDetails,
    errorLog
}