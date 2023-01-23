
import React, { useEffect, useState, useMemo } from "react";
import styled from 'styled-components'
import TableContainer from "./TableContainer.js";
import "./style.css"
import { useNavigate } from "react-router";

const Styles = styled.div`
 table {
   border-spacing: 0;
   width: 100%;
   border: 1px solid black;

   tr {
     :last-child {
       td {
         border-bottom: 0;
       }
     }
   }

   th,
   td {
     padding: 0.5rem;
     border-bottom: 1px solid black;
     border-right: 1px solid black;

     :last-child {
       border-right: 0;
     }
   }
  
   th {
     background: blue;
     border-bottom: 3px solid blue;
     color: white;
     fontWeight: bold;
   }
 }
`
const Table = () => {
  const navigate = useNavigate()
  const [tableData, setTableData] = useState([]);
  const [filter, setFilter] = useState({});

  const handleInputChange = (e) => {
    const { value } = e.currentTarget;
    setFilter(prev => ({ ...prev, [e.target.name]: value }));
  };
  const handleTypeChange = (e) => {
    const { value } = e.currentTarget;
    setFilter(prev => ({ ...prev, [e.target.name]: value }));
  }
  const handleIdChange = (e) => {
    const { value } = e.currentTarget;
    setFilter(prev => ({ ...prev, [e.target.name]: value }));
  }
  const handleActionChange = (e) => {
    const { value } = e.currentTarget;
    setFilter(prev => ({ ...prev, [e.target.name]: value }));
  }
  const handleStartDate = (e) => {
    const { value } = e.currentTarget;
    setFilter(prev => ({ ...prev, [e.target.name]: value }));
  }
  const handleEndDate = (e) => {
    const { value } = e.currentTarget;
    setFilter(prev => ({ ...prev, [e.target.name]: value }));
  }

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://run.mocky.io/v3/a2fbc23e-069e-4ba5-954c-cd910986f40f"
      );
      const data = await response.json();
      setTableData(data.result.auditLog);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchData();
    navigate(`/`)
  }, []);
  const rowData = useMemo(
    () => tableData,
    [tableData]
  );
  const columns = useMemo(
    () => [
      { accessor: "logId", Header: "Log ID" },
      { accessor: "applicationType", Header: "Application Type" },
      { accessor: "applicationId", Header: "Application ID" },
      { accessor: "actionType", Header: "Action" },
      { Header: "Date", accessor: "creationTimestamp" }
    ],
    []
  );
  const typeOptions = rowData.filter((ele, ind) => ind === rowData.findIndex(elem => elem.applicationType === ele.applicationType))
  const IdOptions = rowData.filter((ele, ind) => ind === rowData.findIndex(elem => elem.applicationId === ele.applicationId))

  return (
    <>
      <div style={{ display: "flex", height: "5rem" }}>
        <input
          name="logId"
          className='inputStyle'
          value={filter.logId || ""}
          onChange={handleInputChange}
          placeholder={"Search Log ID"}
        ></input>
        <select
          name="applicationType"
          className='inputStyle'
          id="custom-select"
          type="select"
          value={filter.applicationType || ""}
          onChange={handleTypeChange}
        >
          <option value="">Search Application Type</option>
          {typeOptions.map((option) => (
            <option key={option.applicationType} value={option.applicationType}>
              {option.applicationType}
            </option>
          ))}
        </select>
        <select
          name="applicationId"
          className='inputStyle'
          id="custom-select"
          type="select"
          value={filter.applicationId || ""}
          onChange={handleIdChange}
        >
          <option value="">Search Application ID</option>
          {IdOptions.map((option) => (
            <option key={option.applicationId} value={option.applicationId}>
              {option.applicationId}
            </option>
          ))}
        </select>

        <input
          name="actionType"
          className='inputStyle'
          value={filter.actionType || ""}
          onChange={handleActionChange}
          placeholder={"Search Action Type"}

        ></input>
        <input
          name="creationTimestamp1"
          className='inputStyle'
          //min={min.toISOString().slice(0, 10)}
          onChange={handleStartDate}
          type="date"
          value={filter.creationTimestamp1 || ""}
        />
        <div style={{ marginTop: "28px" }}>
          To
        </div>
        <input
          className='inputStyle'
          name="creationTimestamp2"
          //max={max.toISOString().slice(0, 10)}
          onChange={handleEndDate}
          type="date"
          value={filter.creationTimestamp2?.slice(0, 10) || ""}
        />

      </div>
      <Styles>
        <TableContainer columns={columns} data={rowData} filter={filter} />
      </Styles>
    </>
  )
};

export default Table;
