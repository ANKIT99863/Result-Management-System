import React from 'react';
import "./home.css";
import admin from '../images/index.js';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        // backgroundImage: `url('https://shikshaview.com/wp-content/uploads/2020/05/graphic-era-1024x424.jpg')`,
        background: `linear-gradient(to right, rgba(0, 0, 0, 1), transparent), url('https://shikshaview.com/wp-content/uploads/2020/05/graphic-era-1024x424.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 1,
        minHeight: '100vh',
      }}
    >
    <div className="position-absolute top-0 start-0 p-4 text-white">
            <h1 className="text-medium">Graphic Era Global School</h1>
          </div>
      <div className="container">
        <div className="row justify-content-between">
          <div className="col-md-5">
            <div
              className="card d-flex flex-column align-items-center justify-content-center mx-5 my-4 my-md-0 card-hover"
              style={{
                height: '350px', // Adjust the height as desired
                width: '300px', // Adjust the width as desired
                backgroundColor: 'rgba(255, 255, 255, 0.8)', // Adjust the transparency as desired
              }}
              onClick={()=>{
                navigate("/student")
              }}
            >
              <img
                className="card-img-top mx-2 my-4"
                src="https://i.pinimg.com/originals/51/90/10/519010d9ee8167bfe445e616f260f758.png"
                alt="Student"
                style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain' }}
              />
              <div className="card-body text-center">
                <h2 className="card-title">Student</h2>
              </div>
            </div>
          </div>
          <div className="col-md-5">
            <div
              className="card d-flex flex-column align-items-center justify-content-center mx-5 my-4 my-md-0 card-hover"
              style={{
                height: '350px', 
                width: '300px', 
                backgroundColor: 'rgba(255, 255, 255, 0.8)', 
              }}
              onClick={()=>{
                navigate("/login")
              }}
            >
              <img
                className="card-img-top mx-2 my-4"
                src={admin}
                alt="Admin"
                style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain' }}
              />
              <div className="card-body text-center">
                <h2 className="card-title">Admin</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}