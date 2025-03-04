import React, { useEffect } from "react";
import PageTitle from "../../components/PageTitle";
import { useNavigate } from "react-router-dom";
import { Table } from "antd";
import axios from "axios";
import toast, {Toaster} from "react-hot-toast";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/alerts";
import { RiDeleteBinLine, RiPencilLine } from 'react-icons/ri';
import "./student.css";

export default function Students() {
  const dispatch = useDispatch();
  const [students, setStudents] = React.useState([]);
  const navigate = useNavigate();
  const getStudents = async (values) => {
    try {
      dispatch(ShowLoading());
      const response = await axios.post(
        "/api/student/get-all-students",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response);
      dispatch(HideLoading());
      if (response.data.success) {
        setStudents(response.data.data);
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
        getStudents();
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
    getStudents();
  }, []);

  const columns = [
    {
      title: "Class",
      dataIndex: "class",
      key: "class",
    },
    {
      title: "Roll No",
      dataIndex: "rollNo",
      key: "rollNo",
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
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
                deleteStudent(record.rollNo);
              }}
            />
          </span>
          <span className="icon-wrapper">
            <RiPencilLine
              size={18} 
              onClick={() => {
                navigate(`/employee/students/edit/${record.rollNo}`);
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
        <PageTitle title="Students" />
      <div className="d-flex justify-content-between align-items-center my-3 mx-3">
        <input
          type="text"
          className="w-300 px-2 form-control"
          placeholder="search students"
          style={{width: "250px"}}
        />
        <button
          className="btn btn-primary primary text-white px-3 mx-3"
          onClick={() => {
            navigate("/employee/students/add");
          }}
        >
          Add Student
        </button>
      </div>
      <div className="table-responsive px-3">
        <Table columns={columns} dataSource={students} />
      </div>
    </div>
    </>
  )
}