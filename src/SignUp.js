import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import axios from "axios";
import './main.css';
import Swal from 'sweetalert2';
import Nav from "./Nav";

// TODO : 아이디 중복이면 중복이라고 알려주기
const SignUp = () => {
    const [userName, setUserName] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState(""); // 비밀번호 확인 상태 추가
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // 비밀번호 확인 보이기 상태
    const [errorMessage, setErrorMessage] = useState("");
    const [passwordMatchError, setPasswordMatchError] = useState(""); // 비밀번호 일치 여부 확인

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userName || !userPassword || !confirmPassword) {
            setErrorMessage("모든 필드를 채워주세요.");
        } else if (userPassword !== confirmPassword) {
            setPasswordMatchError("비밀번호가 일치하지 않습니다.");
        } else {
            // 회원가입 API 요청
            try {
                const response = await axios.post("http://localhost:8080/signup", {
                    userName: userName,
                    userPassword: userPassword,
                });
                console.log("회원가입 성공: ", response.data);
                // TODO : 회원가입 성공 후 처리
                Swal.fire({
                    icon: "success",
                    title: "회원가입 성공!",
                    showConfirmButton: false,
                    timer: 1500
                });
                navigate("/login");
            } catch (error) {
                console.error("회원가입 실패: ", error);
                setErrorMessage("회원가입 실패! 다시 시도해 주세요.");
            }

        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <>
            <Nav></Nav>
            <div className="signup-container">
                <h2>회원가입</h2>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                {passwordMatchError && <p className="error-message">{passwordMatchError}</p>}
                <form onSubmit={handleSubmit} className="signup-form">
                    <div className="input-group">
                        <label htmlFor="userName">아이디</label>
                        <input
                            type="text"
                            id="userName"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="userPassword">비밀번호</label>
                        <div className="password-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="userPassword"
                                value={userPassword}
                                onChange={(e) => setUserPassword(e.target.value)}
                                required
                            />
                            <span className="password-eye-icon" onClick={togglePasswordVisibility}>
                                {showPassword ? <FiEyeOff /> : <FiEye />}
                            </span>
                        </div>
                    </div>
                    <div className="input-group">
                        <label htmlFor="confirmPassword">비밀번호 확인</label>
                        <div className="password-wrapper">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <span className="password-eye-icon" onClick={toggleConfirmPasswordVisibility}>
                                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                            </span>
                        </div>
                    </div>
                    <button type="submit" className="signup-btn">
                        회원가입
                    </button>
                </form>
            </div>
        </>
    );
};

export default SignUp;
