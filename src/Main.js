import React, { useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom";
import Nav from './Nav';
import axios from "axios";


function Main() {
  const navigate = useNavigate();


  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get("http://localhost:8080/", {
      headers: {
        Authorization: `Bearer ${token}`  // JWT 토큰을 헤더에 포함
      }
    })
      .then(response => {
        console.log("응답:", response.data);
      })
      .catch(error => {
        console.error("인증 실패:", error);
        navigate("/login");
      });
  })

  return (
    <div>
      <Nav></Nav>
      메인임
    </div>
  )
}

export default Main
