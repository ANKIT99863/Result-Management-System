import React, { useEffect } from "react";
import PageTitle from "../../components/PageTitle";
import { useNavigate } from "react-router-dom";
import { Table } from "antd";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/alerts";
import { RiDeleteBinLine, RiPencilLine } from 'react-icons/ri';


function Results() {
  const dispatch = useDispatch();
  const [results, setResults] = React.useState([]);
  const navigate = useNavigate();
  const getResults = async (values) => {
    try {
      dispatch(ShowLoading());
      const response = await axios.post(
        "/api/results/get-all-results",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(HideLoading());
      if (response.data.success) {
        setResults(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      toast.error(error.message);
    }
  };

  const deleteStudent = async (rolNo) => {
    try {
      dispatch(ShowLoading());
      console.log(rolNo);
      const response = await axios.post(
        `/api/student/delete-student/${rolNo}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(HideLoading());
      if (response.data.success) {
        getResults();
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getResults();
  }, []);

  const columns = [
    {
      title: "Examination",
      dataIndex: "examination",
      key: "examination",
    },
    {
      title: "Class",
      dataIndex: "class",
      key: "class",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <div className="d-flex gap-3">
        <span className="icon-wrapper">
          <RiDeleteBinLine
              size={18} 
              onClick={() => {
                deleteStudent(record.rollNo);;
              }}
            />
            </span>
            <span className="icon-wrapper">
          <RiPencilLine
              size={18} 
              onClick={() => {
                navigate(`/employee/results/edit/${record._id}`);
              }}
            />
          </span>
        </div>
      ),
    },
  ];
  return (
    <>
    <Toaster />
    <div>
      <PageTitle title="Results" />
      <div className="d-flex justify-content-between align-items-center my-3 mx-3">
        <input
          type="text"
          className="w-300 px-2 form-control"
          placeholder="search results"
          style={{width: "250px"}}
        />
        <button
          className="btn btn-primary primary text-white px-3 mx-3"
          onClick={() => {
            navigate("/employee/results/add");
          }}
        >
          Add Result
        </button>
      </div>
      <div className="table-responsive px-3">
      <Table columns={columns} dataSource={results} />
      </div>
    </div>
    </>
  );
}

export default Results;