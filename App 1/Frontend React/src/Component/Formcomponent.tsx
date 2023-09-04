/*

  Pseudo Code No. : Denotes Pseudo Code Reference Number.

  This component is Formcomponent . To Get details from candidate
  This component is used for Create,Update and View details


  App Name : Candidate Info
  Author : Dharmadurai R
  Created Date : 30/03/2022
  
*/

import { getValue } from '@testing-library/user-event/dist/utils';
import { useState, useEffect } from 'react'
import { BrowserRouter, Route, Routes, Link, useParams } from 'react-router-dom';
import { getDynamicDetails, insertDetails, getDetailsForEdit } from '../Service/api';
import { Spinner } from '@chakra-ui/react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
export function Formcomponent() {

  let a: any[] = [];

  /** 
  Pseudo Code No. : F_PC_01

  importing the react, react-router-dom package.
  import the methods from api.ts

  Initialize the let and state variables for set state the Facility Checkbox and 
  Admission mode Radio and Course dropdown values adn formObject for set state the form control values.
*/

  let obj = { firstName: "", lastName: "", dob: "", courseID: 0, adID: "201", issues: "", facilityID: a, loginMode: "" };
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
  const [alertUserMode, setUserAlert] = useState("");
  const [viewMode, setViewMode] = useState(false);
  const [candidateFormID, setCandidateFormID] = useState("");
  const [spinnerShow, setSpinnerShow] = useState(true)

  let arrLoginID = { loginMode: "", passwordUser: "" }
  const [loginID, setLoginID] = useState(arrLoginID)

  const [userModeCheck, setUserModeCheck]: any = useState("");

  const [userDetailsHide, setUserDetailsHide] = useState("none");
  const [userModeCheckBoxHide, setUserModeCheckBoxHide] = useState("none");

  //useEffct for Dynamic Binding and Used to get details for Edit
  useEffect(() => {
    getDynamicDetailsForm();
    getEditDetails();
  }, [])


  const handleClose = () => {
    setSpinnerShow(false);
  };
  const handleToggle = () => {
    setSpinnerShow(!spinnerShow);
  };


  //load data COllge and Gender
  const getDynamicDetailsForm = async () => {
    var data = await getDynamicDetails();

    //Set state the values in state variable.
    setDropDownCourse(data.data.recordsets[0]);
    setRadioAdmission(data.data.recordsets[1]);
    setCheckBoxFacility(data.data.recordsets[2]);
    setSpinnerShow(false)
  }

  const bindCourse = () => {
    return dropDownCourse.map((value, index) => {
      return <option className="lineHeight" value={value.courseID}>{value.courseName}</option>
    })
  }

  const bindAdmission = () => {
    return radioAdmission.map((value, index) => {
      return <label><input type="radio" className="radio" disabled={viewMode} name="adID" onChange={onSetValue} checked={value.adID == formObject.adID ? true : false} value={value.adID} />{value.adName}</label>
    })
  }

  const bindFacility = () => {
    return checkBoxFacility.map((value, index) => {
      return (
        <span style={{ 'width': '35%', 'float': 'left' }}>
          <input type="checkbox" disabled={viewMode} id={value.facilityID} className="facility-input" value={value.facilityID} name="facilityID" />
          <label htmlFor={value.facilityID}>{value.facilityName}
          </label>
        </span>)
    })
  }

  const getEditDetails = async () => {
    let editData = window.location.search;
    let cid = new URLSearchParams(editData).get("cid");
    let mode = new URLSearchParams(editData).get("mode");
    if (cid != undefined) {
      console.log(cid);

      setCandidateFormID(cid);
      if (mode == "view") {
        setViewMode(true);
      }


      let respone = await getDetailsForEdit(cid);
      console.log(respone)

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
        facilityID: facilityValues
      }
      console.log(editDetails);

      setFormObject(editDetails);


      editDetails.facilityID.map((obj: any) => {
        let check: any = document.getElementsByName("facilityID");
        debugger;
        for (var i = 0; i < check.length; i++) {
          debugger;
          if (check[i].id == obj.facilityID) {
            check[i].checked = true;
          }
        }
      })
      setSpinnerShow(false)
    }
  }

  const onSetValue = async (e: any) => {
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
    if (formObject.loginMode !== "") {
      setUserAlert("");
    }

    setFormObject({ ...formObject, [e.target.name]: e.target.value });
    console.log(e.target.name, e.target.value)
  }

  const validation = () => {
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
    if (formObject.loginMode == "" && userModeCheck === "admin") {
      setUserAlert("Please choose User Mode...");
      flag = 1;
    }
    debugger
    if (flag == 0) {
      debugger
      submit();
    }

  }

  const submit = async () => {

    formObject.facilityID = [];
    console.log(formObject);
    let check: any = document.getElementsByName("facilityID");
    debugger;
    for (var i = 0; i < check.length; i++) {
      debugger
      if (check[i].checked == true) {
        formObject.facilityID.push(check[i].value);
      }

    }
    console.log(formObject)

    debugger
    let insertData = {
      FormID: candidateFormID,
      Firstname: formObject.firstName,
      Lastname: formObject.lastName,
      dob: formObject.dob,
      courseID: formObject.courseID,
      adID: formObject.adID,
      issues: formObject.issues,
      facilityID: formObject.facilityID,
      userLoginMode: formObject.loginMode
    }
    console.log(insertData)
    let resData = await insertDetails(insertData);
    console.log(resData)

    console.log(userModeCheck)
    debugger
    if (resData.status == 200) {
      window.location.href = "/?mode=submit"
     
    }

  }

  const clear = () => {
    debugger;
    let data = { firstName: "", lastName: "", dob: "", courseID: "", adID: "201", issues: "" }
    setFormObject(data)
    window.location.href = "/"
  }




  return (
    <div className="main" >
      <div style={{ 'position': 'relative' }} className="parent" id="formreg">
        <form className="relation">
          <div>
            <div>
              <h2 className="head-style">UNIVERSITY CANDIDATE FORM</h2>
            </div>
            <Backdrop
              sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={spinnerShow}
              onClick={handleClose}
            >
              <CircularProgress color="inherit" />
            </Backdrop>

          </div>

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
              <div className="child" style={{ 'display': `${userModeCheckBoxHide}` }}>
                <label className="lables">User Mode</label>
                <label><input type="radio" className="radio" disabled={viewMode} name="loginMode" onClick={onSetValue} value={0} />User</label>
                <label><input type="radio" className="radio" disabled={viewMode} name="loginMode" onClick={onSetValue} value={1} />Admin</label>
                <label className="alert">{alertUserMode}</label>


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
            <input type="button" className="btn-can" style={{ 'backgroundColor': 'red' }} defaultValue="Update" hidden={userModeCheck === "User" && viewMode == true ? false : true} onClick={() => setViewMode(false)} />
            <input type="button" className="btn-can" defaultValue="Cancel" onClick={clear} />
            <input type="button" className="btn-sum" id="btn-check" onClick={validation} hidden={viewMode} defaultValue="Submit" />
          </div>
        </form>
      </div>
    </div>

  );
}