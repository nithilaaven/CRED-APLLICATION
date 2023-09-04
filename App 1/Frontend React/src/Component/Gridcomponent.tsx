/*

  Ref No. : Denotes Pseudo Code Reference Number.

  This component is Gridcomponent . To Show details to candidate
  This component is used for Create, View details,Delete


  App Name : Candidate Info
  Author : Dharmadurai R
  Created Date : 04/04/2022
  
*/


/**
 * Ref No. :G_PC_01
 * Used to import the packages
 */
import React, { useState, useEffect } from 'react'
import sup from './img/sup.png'
import filter from './img/reg.png'
import search from './img/search.png'
import { getGridDetails, deleteDetails, getDynamicDetails, errorLog } from '../Service/api';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import Pagination from 'react-paginate'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';



export function Gridcomponent() {

  /**
   * Ref No. :G_PC_02
   * Creating the state variables for store the grid data, sort,filter,Pagination
   */
  let tableData: any[] = []
  const [tableObject, setTableObject]: any = useState(tableData)

  const [pageCountState, setPageCountState] = useState(0)

  const [delte, setDelete] = useState("")

  const [searchData, setSearchData] = useState("")
  const [offSet, setOffSet] = useState(0)
  const [sortName, setSortName] = useState("candidateForm.formID")
  const [sortOrder, setSortOrder] = useState("desc")
  const [pageNumber, setPageNumber]: any = useState(0)
  const [noRecord, setNoRecord] = useState("none")
  const [noRecPage, setNoRecPage] = useState("block")

  const [reload, setReload] = useState(false);

  let arrFilterConditions: any = { Admission: "", Course: 0, Name: "" }
  const [FilterConditions, setFilterConditions]: any = useState(arrFilterConditions)

  const [filterCLear, setFIlterCLear] = useState(false)

  let arrCourse = { courseID: "", courseName: "" };
  let arrCourseDetails = [arrCourse];
  const [dropDownCourse, setDropDownCourse] = useState(arrCourseDetails);

  let arrAdmission = { adID: "", adName: "" };
  let arrAdmissionDetails = [arrAdmission];
  const [radioAdmission, setRadioAdmission] = useState(arrAdmissionDetails);

  const [filterOpen, setFilterOpen] = useState(false);

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  useEffect(() => {
    importData();
    getDynamic()
  }, [delte, offSet, sortName, sortOrder, filterCLear, reload])


  /**
   * Ref No. :G_PC_04,13
   * Used to get data from the DB and setState
   */
  const importData = async () => {
    try {
      let body = {
        search: searchData,
        sortName: sortName,
        sortOrder: sortOrder,
        offset: offSet,
        fA: FilterConditions.Admission,
        fC: FilterConditions.Course,
        fN: FilterConditions.Name
      }
      var response = await getGridDetails(body);

      setTableObject(response.data.result.recordsets[0])
      setPageCountState(response.data.candidateLength[0] / 10)
      console.log(response.data.candidateLength[0])
      if (response.data.candidateLength[0] === 0) {
        setNoRecord("block");
        setNoRecPage("none");
        console.log("inside page count hide")
      }
      else {
        setNoRecord("none");
        setNoRecPage("block");
      }
    } catch (e) {
      console.log(e)
      let bodyData = {
        module: "GridComponent",
        method: "importData",
        des: e
      }
      await errorLog(bodyData);
    }

  }


  /**
   * Ref No. :G_PC_16
   * used to get the course drop down and admission mode radio button data from DB
   */
  const getDynamic = async () => {

    var data = await getDynamicDetails();
    console.log(data)
    setDropDownCourse(data.data.recordsets[0])
    setRadioAdmission(data.data.recordsets[1])
  }
  var dobObject1 = "";

  /**
   * Ref No. :G_PC_014
   * @returns - used to return the tag from where it is called
   * used to bind the Tbale in the HTML
   */
  const bindGridDetails = () => {
    debugger

    return tableObject.map((value: any, i: any) => {
      dobObject1 = value.dob.split("T")
      debugger;
      return <tr className="">
        <td className="second">
          <a style={{ 'color': 'blue', 'textDecoration': 'none', 'textAlign': 'left' }} href={"/form?cid=" + value.formID + "&mode=view"}>{value.formID}</a></td>
        <td className="second">{value.firstname} {value.lastname}</td>
        <td className="second">{dobObject1[0]}</td>
        <td className="second">{value.courseName}</td>
        <td className="second">{value.adName}</td>
        <td className="second">{value.facilityName}</td>
        <td className='action'>
          <a href={"/form?cid=" + value.formID}>
            <EditIcon width={"20px"} marginTop={"-10px"} id={value.formID} />
          </a>
          <DeleteIcon width={"20px"} marginTop={"-10px"} id={value.formID} onClick={() => deleteFunction(value.formID)} />

        </td>
      </tr>

    })
  }

  /**
   * Ref No. :G_PC_26
   * @returns-used to return the tag from where it is called
   * Used to bind Course Drop down in HTML
   */
  const bindCourse = () => {
    try {
      return dropDownCourse.map((value, index) => {
        return <option className="lineHeight" value={value.courseID}>{value.courseName}</option>
      })
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * Ref No. :G_PC_27
   * @returns-used to return the tag from where it is called
   * Used to bind Admission mode radio button in HTML
   */
  const bindAdmission = () => {
    try {
      return radioAdmission.map((value, index) => {
        return <label><input type="radio" className="radio" name="Admission" onChange={onSetFilterValue} value={value.adID} />{value.adName}</label>
      })
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * Ref No. :G_PC_29,39
   * @param id used to get id of the row
   * Used to delete the Candidate details
   */
  const deleteFunction = async (id: any) => {
    try {
      var cid = id;
      await deleteDetails(cid);
      setDelete(cid);
    } catch (e) {
      console.log(e)
    }
  }
  /**
   * Ref No. :G_PC_40
   * @param e - Used to get the value of the control
   * When user Enter anything on search bar
   */
  const searchValue = (e: any) => {
    try {
      setSearchData(e.target.value);
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * Ref No. :G_PC_41a
   * When user click on the search button
   */
  const searchFunction = () => {
    try {
      setSortName("candidateForm.formID");
      setSortOrder("desc");
      setOffSet(0)
      setPageNumber(0)
      setReload(!reload)
    } catch (e) {
      console.log(e)
    }
  }
  
  /**
   * Ref No. :G_PC_42
   * @param e - used to get value of the control
   * When user click on the page number
   */
  const pagination = (e: any) => {
    try {
      setPageNumber(e.selected)
      setOffSet(e.selected * 10)
    } catch (e) {
      console.log(e)
    }
  }

  /**
     * Ref No. :G_PC_43
     * @param e - used to get value of the control
     * When user click on the sort icon
     */
  const sortClick = (e: any) => {
    debugger
    try {
      let value1 = e.target.id
      let value = value1.split('@');
      let pageNum = 0;
      setPageNumber(0)
      setSortName(value[0])
      setSortOrder(value[1])
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * Ref No. :G_PC_44
   * When user click on the filter icon
   */
  const filterIconOnClick = () => {
    try {
      if (filterOpen == false) {
        setFilterOpen(true);
      }
      else {
        setFilterOpen(false);
      }
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * Ref No. :G_PC_45
   * @param e - used to get value of the control
   * When user "User type or choose anything on the filter conditions"
   */
  const onSetFilterValue = (e: any) => {
    try {
      setFilterConditions({ ...FilterConditions, [e.target.name]: e.target.value });
      console.log(FilterConditions, e.target.name, e.target.value)
    } catch (e) {
      console.log(e)
    }

  }
  /**
   * Ref No. :G_PC_46
   * User Click on the filter button
   */
  const filterButtonOnClick = () => {
    try {
      setSortName("candidateForm.formID");
      setSortOrder("desc");
      setPageNumber(0);
      setOffSet(0)
      setSearchData("")
      setReload(!reload)
      setFilterOpen(false)
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * Ref No. :G_PC_47
   * When user click on the clear button
   */
  const filterClearOnClick = async () => {
    try {
      setFilterConditions({ Admission: "", Course: 0, Name: "" })
      setFilterOpen(false)
      debugger
      setSearchData("")
      setSortName("candidateForm.formID");
      setSortOrder("desc");
      setPageNumber(0)
      setOffSet(0)
      setFIlterCLear(!filterCLear)
    } catch (e) {
      console.log(e)
      let bodyData = {
        module: "GridComponent",
        method: "filterClearOnClick",
        des: e
      }
      await errorLog(bodyData);
    }
  }



  return (
    <div style={{ 'width': '100%', 'position': 'relative' }}>
      <h1 className='head-can'>CANDIDATE INFORMATION</h1>
      <div className="btn-new-div">
        <Link to='/form'><button className='btn-new'>+</button></Link>
        {<img src={filter} className="filter" onClick={filterIconOnClick} />}
        <div>

          <div className="search-box" >
            <input className="search-input" type="search" value={searchData} placeholder="Search By Name..." onChange={searchValue} />

            {<img src={search} className="search-img" onClick={searchFunction} />}
          </div>
          <div style={{ display: 'block', padding: 30 }}>
            <Modal
              open={filterOpen}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box >
                
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <div className="filter-div">
                <div className='filter-title'>
                  <h1 className='filter-h'>FILTER</h1>
                </div>

                <div className="filter-row" style={{ 'marginBottom': '41px' }}>
                  <div className="filter-left">
                    <input type="checkbox" checked={FilterConditions.Name !== "" ? true : false} /><label>Name</label>
                  </div>
                  <div className="filter-right">
                    <input type="text" className='filter-Name' placeholder='Enter Name...' name="Name" value={FilterConditions.Name} onChange={onSetFilterValue} />
                  </div>
                </div>
                <div className="filter-row">
                  <div className="filter-left">
                    <input type="checkbox" checked={FilterConditions.Admission !== "" ? true : false} /><label>Gender</label>
                  </div>
                  <div className="filter-right">
                    {bindAdmission()}
                  </div>
                </div>
                <div className="filter-row" style={{ 'marginTop': '131px' }}>
                  <div className="filter-left">
                    <input type="checkbox" checked={FilterConditions.Course !== 0 ? true : false} /><label>College</label>
                  </div>
                  <div className="filter-right">
                    <select name="Course" value={FilterConditions.Course} onChange={onSetFilterValue} className="filter-input-drop" >
                      <option value={0}>Select College Name</option>
                      {bindCourse()}
                    </select>
                  </div>
                </div>
                <div>
                  <button className='btn-filter' onClick={filterButtonOnClick}>Filter</button>
                  <button className='btn-filtercancel' onClick={filterClearOnClick}>Clear</button>
                </div>
              </div>
                </Typography>
              </Box>
            </Modal>

          </div>

        </div>

      </div>

      <table className="tableDiv">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name
              <div className='btn-div'>
                <button className='btn-up'>
                  <img src={sup} className='up' id={"candidateForm.firstname@asc"} onClick={sortClick} alt="up" /></button>
                <button className='btn-down'>
                  <img src={sup} id={"candidateForm.firstname@desc"} className='down' onClick={sortClick} alt="down" /></button>
              </div>
            </th>


            <th>Date Of Birth
              <div className='btn-div'>
                <button className='btn-up'>
                  <img src={sup} className='up' id={"candidateForm.dob@asc"} onClick={sortClick} alt="up" /></button>
                <button className='btn-down'>
                  <img src={sup} id={"candidateForm.dob@desc"} className='down' onClick={sortClick} alt="up" /></button>
              </div>
            </th>
            <th>Course
              <div className='btn-div'>
                <button className='btn-up'>
                  <img src={sup} className='up' id={"courseDetails.courseName@asc"} onClick={sortClick} alt="up" /></button>
                <button className='btn-down'>
                  <img src={sup} id={"courseDetails.courseName@desc"} className='down' onClick={sortClick} alt="up" /></button>
              </div>
            </th>
            <th>Admission Mode
              <div className='btn-div'>
                <button className='btn-up'>
                  <img src={sup} className='up' id={"admission.adName@asc"} onClick={sortClick} alt="up" /></button>
                <button className='btn-down'>
                  <img src={sup} id={"admission.adName@desc"} className='down' onClick={sortClick} alt="up" /></button>
              </div>
            </th>
            <th>Facility Needed
              <div className='btn-div'>
                <button className='btn-up'>
                  <img src={sup} className='up' id={"facilityName@asc"} onClick={sortClick} alt="up" /></button>
                <button className='btn-down'>
                  <img src={sup} id={"facilityName@desc"} className='down' onClick={sortClick} alt="up" /></button>
              </div>
            </th>

            <th>Action</th>
          </tr>
        </thead>
        <tbody id="tblbody" >
          {bindGridDetails()}
        </tbody>
      </table>
      <div style={{ 'display': `${noRecord}` }} className="noRecdiv">
        <h1 className='noRec'>No Record Found</h1>
      </div>

      <div style={{ 'display': `${noRecPage}` }}>
        <Pagination
          previousLabel={"❮"}
          nextLabel={"❯"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={10}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={pagination}
          forcePage={pageNumber}
          containerClassName={"pagination"}
          activeClassName={"active"} />
      </div>
    </div>
  );
}