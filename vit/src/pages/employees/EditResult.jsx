import React, { useEffect } from "react";
import PageTitle from "../../components/PageTitle";
import { useNavigate } from "react-router-dom";
import { Modal, Table } from "antd";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/alerts";

import { useParams } from "react-router-dom";

function ResultInfo() {
  const [obtainedMarks, setObtainedMarks] = React.useState(null);
  const [selectedStudent, setSelectedStudent] = React.useState(null);
  const [showStudentsModal, setShowStudentsModal] = React.useState(false);
  const [students, setStudents] = React.useState([]);
  const params = useParams();
  const [result, setResult] = React.useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const getResult = async (values) => {
    try {
      dispatch(ShowLoading());
      const response = await axios.post(
        `/api/results/get-result/${params.resultId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(HideLoading());
      if (response.data.success) {
        setResult(response.data.data);
        const tempObtainedMarks = {};
        response.data.data.subjects.forEach((subject) => {
          tempObtainedMarks[subject.name] = 0;
        });
        setObtainedMarks(tempObtainedMarks);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      toast.error(error.message);
    }
  };

  const getStudents = async (values) => {
    try {
      dispatch(ShowLoading());
      const response = await axios.post(
        "/api/student/get-all-students",
        {
          class: result.class,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
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

  const saveStudentResult = async (values) => {
    let verdict = "pass";
    Object.keys(obtainedMarks).forEach((key) => {
      const subjectName = key;
      const marks = obtainedMarks[key];
      const passMarks = result.subjects.find(
        (subject) => subject.name === subjectName
      ).passMarks;
      if (Number(marks) < Number(passMarks)) {
        verdict = "fail";
      }
      return;
    });
    try {
      dispatch(ShowLoading());
      const response = await axios.post(
        "/api/results/save-student-result",
        {
          resultId: params.resultId,
          examination: result.examination,
          studentId: selectedStudent._id,
          obtainedMarks: obtainedMarks,
          verdict,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(HideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        setObtainedMarks(null);
        setSelectedStudent(null);
        getStudents();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      toast.error(error.message);
    }
  };
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
  ];

  useEffect(() => {
    if (!result) {
      getResult();
    }
  }, []);

  useEffect(() => {
    if (result) {
      getStudents();
    }
  }, [result]);

  return (
    <>
    <Toaster />
    <div>
      <PageTitle title="Result Info" />
      {result && (
        <>
          <div className="mt-3 mx-4">
            <h1 className="text-md fs-4">Name : {result.examination}</h1>
            <h1 className="text-medium fs-4">Class : {result.class}</h1>
            <h1 className="text-medium fs-4">Date : {result.date}</h1>
          </div>
          <hr />
          {!selectedStudent ? (
            <button
              className="btn btn-primary text-white px-3 mx-4"
              onClick={() => {
                setShowStudentsModal(true);
              }}
            >
              Add Student
            </button>
          ) : (
            <>
              <div className="d-flex justify-content-between align-items-center card flex-row p-2 mx-3">
                <h1 className="text-medium fs-3">
                  Student Name : {selectedStudent?.firstName}{" "}
                  {selectedStudent?.lastName}
                </h1>
                <button type="button" class="btn-close" aria-label="Close" onClick={() => {
                    const tempObtainedMarks = {};
                    result.subjects.forEach((subject) => {
                      tempObtainedMarks[subject.name] = 0;
                    });
                    setObtainedMarks(tempObtainedMarks);
                    setSelectedStudent(null);
                  }}></button>
              </div>

              <table className="table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Total Marks</th>
                    <th>Obtained Marks</th>
                  </tr>
                </thead>
                <tbody>
                  {result?.subjects?.map((subject, index) => (
                    <tr>
                      <td>{subject?.name}</td>
                      <td>{subject?.totalMarks}</td>
                      <td>
                        <input
                          type="text"
                          className="w-25 form-control"
                          value={obtainedMarks[subject?.name]}
                          onChange={(e) => {
                            const tempObtainedMarks = { ...obtainedMarks };
                            tempObtainedMarks[subject.name] = e.target.value;
                            console.log(tempObtainedMarks);
                            setObtainedMarks(tempObtainedMarks);
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button
                onClick={saveStudentResult}
                className="btn btn-primary primary px-5 text-white mb-4 mx-3"
              >
                SAVE
              </button>
            </>
          )}
        </>
      )}

      <Modal
        title="Select Student"
        visible={showStudentsModal}
        onCancel={() => {
          setShowStudentsModal(false);
        }}
      >
        <Table
          columns={columns}
          dataSource={students}
          onRow={(record) => {
            return {
              onClick: () => {
                setSelectedStudent(record);
                const resultExists = record.results.find(
                  (result) => result.resultId === params.resultId
                );
                if (resultExists) {
                  setObtainedMarks(resultExists.obtainedMarks);
                }
                setShowStudentsModal(false);
              },
            };
          }}
        />
      </Modal>
    </div>
    </>
  );
}

export default ResultInfo;