/*

  Pseudo Code No. : Denotes Pseudo Code Reference Number.

  This component is Formcomponent . To Get details from candidate
  This component is used for Create,Update and View details


  App Name : Candidate Info
  Author : Dharmadurai R
  Created Date : 30/03/2022
  
*/

import { useState, useEffect } from 'react'
import { getDynamicDetails, insertDetails, getDetailsForEdit ,errorLog} from '../Service/api';
export function Formcomponent() {

  let a: any[] = [];

  /** 
  Pseudo Code No. : F_PC_01

  importing the react, react-router-dom package.
  import the methods from api.ts

  Initialize the let and state variables for set state the Facility Checkbox and 
  Admission mode Radio and Course dropdown values adn formObject for set state the form control values.
*/

  let obj = { firstName: "", lastName: "", dob: "", courseID: 0, adID: "201", issues: "", facilityID: a };
  let arrCourse = { courseID: "", courseName: "" };
  let arrCourseDetails = [arrCourse];
  let arrAdmission = { adID: "", adName: "" };
  let arrAdmissionDetails = [arrAdmission];
  let facilityArray = { facilityID: "", facilityName: "" };
  let facilityArrayFinal = [facilityArray];

  const [formObject, setFormObject]: any = useState(obj);

  //Used to set Course Drop Down values
  const [dropDownCourse, setDropDownCourse] = useState(arrCourseDetails);
  //Used to set Admission Mode Radio button values
  const [radioAdmission, setRadioAdmission] = useState(arrAdmissionDetails);
  //Used to set Facility Check box values
  const [checkBoxFacility, setCheckBoxFacility] = useState(facilityArrayFinal);
  //Used to set Alert message
  const [alertFirstName, setAlertFirstName] = useState("");
  const [alertLastName, setAlertLastName] = useState("");
  const [alertDOB, setAlertDOB] = useState("");
  const [alertCourse, setAlertCourse] = useState("");
  const [viewMode, setViewMode] = useState(false);
  const [candidateFormID, setCandidateFormID] = useState("");


  //useEffct for Dynamic Binding and Used to get details for Edit
  useEffect(() => {
    getDynamicDetailsForm();
    getEditDetails();
  }, [])

  //load data COllge and Gender
  const getDynamicDetailsForm = async() => {
    try {
      var data = await getDynamicDetails();

      //Set state the values in state variable.
      setDropDownCourse(data.data.recordsets[0]);
      setRadioAdmission(data.data.recordsets[1]);
      setCheckBoxFacility(data.data.recordsets[2]);
    } catch (e) {
      console.log(e);
      let bodyData = {
        module: "FromComponent",
        method: "getDynamicDetailsForm",
        des: e
      }
      await errorLog(bodyData);
    }
  }

  /*
    Pseudo COde No. : F_PC_35
  
    Bind the Course Dropdown in the HTML using mapping the state variable
    
  */
  const bindCourse = async() => {
    try {
      return dropDownCourse.map((value, index) => {
        return <option className="lineHeight" value={value.courseID}>{value.courseName}</option>
      })
    } catch (e) {
      console.log(e);
      let bodyData = {
        module: "FormComponent",
        method: "bindCourse",
        des: e
      }
      await errorLog(bodyData);
    }
  }

  /*
    Pseudo COde No. : F_PC_36
  
    Bind the  Admission Mode radio button  in the HTML using mapping the state variable
    
  */

  const bindAdmission = async() => {
    try {
      return radioAdmission.map((value, index) => {
        return <label><input type="radio" className="radio" disabled={viewMode} name="adID" onChange={onSetValue} checked={value.adID == formObject.adID ? true : false} value={value.adID} />{value.adName}</label>
      })
    } catch (e) {
      console.log(e);
      let bodyData = {
        module: "FormComponent",
        method: "bindAdmission",
        des: e
      }
      await errorLog(bodyData);
    }
  }

  /*
    Pseudo COde No. : F_PC_37
  
    Bind the Facility Needed Check Box in the HTML using mapping the state variable
    
  */

  const bindFacility = async() => {
    try {
      return checkBoxFacility.map((value, index) => {
        return (
          <span style={{ 'width': '35%', 'float': 'left' }}>
            <input type="checkbox" disabled={viewMode} id={value.facilityID} className="facility-input" value={value.facilityID} name="facilityID" />
            <label htmlFor={value.facilityID}>{value.facilityName}
            </label>
          </span>)
      })
    } catch (e) {
      console.log(e);
      let bodyData = {
        module: "FormComponent",
        method: "bindFacility",
        des: e
      }
      await errorLog(bodyData);
    }
  }


  /**
   * @param cid-used to the formID to the api.ts as a Parameter
   * Pseudo COde No. : F_PC_12

    If id Passed in the url Then go to the database and get the data using the id and bind it in the formObject
  
   */
  const getEditDetails = async () => {
    try {
      let editData = window.location.search;
      let cid = new URLSearchParams(editData).get("cid");
      let mode = new URLSearchParams(editData).get("mode");
      if (cid != undefined) {
        console.log(cid);
        setCandidateFormID(cid);
        if (mode == "view") {
          setViewMode(true);
        }
        else {
          setViewMode(false);
        }

        let respone = await getDetailsForEdit(cid);
        let editDetails1 = respone.data.recordsets[0][0];
        let facilityValues = respone.data.recordsets[1];
        var date = editDetails1.dob.split("T");
        let editDetails: any = {
          firstName: editDetails1.firstname,
          lastName: editDetails1.lastname,
          dob: date[0],
          courseID: editDetails1.courseID,
          adID: editDetails1.adID,
          issues: editDetails1.issues,
          facilityID: []
        }
        setFormObject(editDetails);
        facilityValues.map((obj: any) => {
          let check: any = document.getElementsByName("facilityID");
          debugger;
          for (var i = 0; i < check.length; i++) {
            debugger;
            if (check[i].id == obj.facilityID) {
              check[i].checked = true;
            }
          }
        })

      }
    } catch (e) {
      console.log(e);
      let bodyData = {
        module: "FormComponent",
        method: "getEditDetails",
        des: e
      }
      await errorLog(bodyData);
    }
  }
  /**
   * Pseudo COde No. : F_PC_34
   * @param e - Using e we can get the control data and use it incide the function.
   * Using onchange function if user Enter or Choose anything save it in the state variable "formObject"
    If the formObject value is not empty set the alert state variable value as empty
    Then set State the value in state variable object
  
   */

  const onSetValue = async (e: any) => {
    try {
      if (formObject.firstName.trim() !== "") {
        setAlertFirstName("");
      }
      if (formObject.lastName.trim() !== "") {
        setAlertLastName("");
      }
      if (formObject.dob.trim() !== "") {
        setAlertDOB("");
      }
      if (formObject.courseID !== 0) {
        setAlertCourse("");
      }
      debugger
      setFormObject({ ...formObject, [e.target.name]: e.target.value });
    } catch (e) {
      console.log(e);
      let bodyData = {
        module: "FormComponent",
        method: "onSetValue",
        des: e
      }
      await errorLog(bodyData);
    }
  }

  /*
    Pseudo COde No. : F_PC_23
  
    If user click on the sumit button Validation() function
    If all the values are not empty then Sumit Function Will be invoked
    
  */


  const validation = async() => {
    try {
      var flag = 0;
      if (formObject.firstName.trim() == "") {
        setAlertFirstName("Please Enter First Name...");
        flag = 1;
      }
      if (formObject.lastName.trim() == "") {
        setAlertLastName("Please Enter Last Name...");
        flag = 1;
      }
      if (formObject.dob.trim() == "") {
        setAlertDOB("Please Enter Date Of Birth...");
        flag = 1;
      }
      if (formObject.courseID == 0) {
        setAlertCourse("Please choose Your Course...");
        flag = 1;
      }
      if (flag == 0) {
        submit();
      }
    } catch (e) {
      console.log(e);
      let bodyData = {
        module: "FormComponent",
        method: "validation",
        des: e
      }
      await errorLog(bodyData);
    }
  }

  /*
  Pseudo COde No. : F_PC_23 and F_PC_32

  If all the values are not empty then Sumit Function Will be invoked
  Here we just assigning the object values into the let variable and passing it the api.ts as a parameter
  
*/
  const submit = async () => {
    try {

      formObject.facilityID = [];
      console.log(formObject);
      let check: any = document.getElementsByName("facilityID");
      console.log(check, "fghjkgh");
      debugger;
      for (var i = 0; i < check.length; i++) {
        debugger
        if (check[i].checked == true) {
          formObject.facilityID.push(check[i].value);
        }

      }
      console.log(formObject)

      let insertData = {
        FormID: candidateFormID,
        Firstname: formObject.firstName,
        Lastname: formObject.lastName,
        dob: formObject.dob,
        courseID: formObject.courseID,
        adID: formObject.adID,
        issues: formObject.issues,
        facilityID: formObject.facilityID
      }
      var data = await insertDetails(insertData)
      if (data.status == 200) {
        
        window.location.href = "/";

      }
    } catch (e) {
      console.log(e);
      let bodyData = {
        module: "FormComponent",
        method: "submit",
        des: e
      }
      await errorLog(bodyData);
    }

  }

  /*
  Pseudo COde No. : F_PC_33

  If user click on the cancel button clear() function Will be invoked
  Here we just clearing all the feilds and navigate to grid.
  
*/
  const clear = async() => {
    try {
      debugger;
      let data = { firstName: "", lastName: "", dob: "", courseID: "", adID: "201", issues: "" }
      setFormObject(data)
      window.location.href = "/";
    } catch (e) {
      console.log(e);
      let bodyData = {
        module: "FormComponent",
        method: "clear",
        des: e
      }
      await errorLog(bodyData);
    }
  }


  return (
    <div className="main" >
      <div className="parent" id="formreg">
        <form className="relation">
          <h2 className="head-style">UNIVERSITY CANDIDATE FORM</h2>
          <div className='form-div'>
            <div className="sub-parent">
              <div className="child">
                <label className="lables">First Name<p className="imp">*</p></label>
                <input type="text" className="text-box" id="firstname" value={formObject.firstName} name="firstName" onChange={onSetValue} placeholder="Enter First Name" disabled={viewMode} />
                <label className="alert">{alertFirstName}</label>
              </div>
              <div className="child">
                <label className="lables">Last Name<p className="imp">*</p></label>
                <input type="text" className="text-box" id="lastname" value={formObject.lastName} name="lastName" onChange={onSetValue} placeholder="Enter Last Name" disabled={viewMode} />
                <label className="alert">{alertLastName}</label>
              </div>
            </div>
            <div className="sub-parent">
              <div className="child">
                <label className="lables">Date Of Birth<p className="imp">*</p></label>
                <input type="date" className="text-box" disabled={viewMode} name="dob" value={formObject.dob} placeholder="Please" onChange={onSetValue} />
                <span className="alert">{alertDOB}</span>
              </div>

              <div className="child">
                <label className="lables">Course<p className="imp">*</p></label>
                <select name="courseID" className="text-box-dept" value={formObject.courseID} disabled={viewMode} onChange={onSetValue}>
                  <option value={0}>Select Course of study</option>
                  {bindCourse()}
                </select>
                <label className="alert">{alertCourse}</label>
              </div>
            </div>
            <div className="sub-parent">

              <div className="child">
                <label className="lables">Admission Mode<p className="imp">*</p></label>
                <span>{bindAdmission()}</span>
              </div>
              <div className="child">
                <label className="lables">Facility</label>
                <span>{bindFacility()}</span>
              </div>
            </div>
            <div className="sub-parent">
              <div className="child">
                <label className="lables">Any Issues</label>
                <textarea className='text-area' name='issues' value={formObject.issues} disabled={viewMode} onChange={onSetValue} placeholder='Enter short description about your issues will reach you shortly'></textarea>
              </div>
            </div>
          </div>
          <div className="btn" id="sumit">
            <input type="button" className="btn-can" defaultValue="Cancel" onClick={clear} />
            <input type="button" className="btn-sum" id="btn-check" onClick={validation} hidden={viewMode} defaultValue="Submit" />
          </div>
        </form>
      </div>
    </div>

  );
}