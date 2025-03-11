import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import axios from "axios";
import './main.css';
import Swal from 'sweetalert2';
import Nav from "./Nav";

const SignUp = () => {
    const [userUuid, setUserUuid] = useState("");
    const [userNickname, setUserNickname] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [passwordMatchError, setPasswordMatchError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userUuid || !userNickname || !userPassword || !confirmPassword) {
            setErrorMessage("모든 필드를 채워주세요.");
        } else if (userPassword !== confirmPassword) {
            setPasswordMatchError("비밀번호가 일치하지 않습니다.");
        } else {
            try {
                const response = await axios.post("http://localhost:8080/signup", {
                    userUuid: userUuid,
                    userNickname: userNickname,
                    userPassword: userPassword,
                });
                console.log("회원가입 성공: ", response.data);
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

    return (
        <>
            <Nav />
            <div className="signup-container">
                <h2>회원가입</h2>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                {passwordMatchError && <p className="error-message">{passwordMatchError}</p>}
                <form onSubmit={handleSubmit} className="signup-form">
                    <div className="input-group">
                        <label htmlFor="userUuid">아이디</label>
                        <input
                            type="text"
                            id="userUuid"
                            value={userUuid}
                            onChange={(e) => setUserUuid(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="userNickname">닉네임</label>
                        <input
                            type="text"
                            id="userNickname"
                            value={userNickname}
                            onChange={(e) => setUserNickname(e.target.value)}
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
                            <span className="password-eye-icon" onClick={() => setShowPassword(!showPassword)}>
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
                            <span className="password-eye-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                            </span>
                        </div>
                    </div>
                    <button type="submit" className="signup-btn">
                        회원가입
                    </button>
                </form>
                <div className="signup-link">
                    <p>아이디가 있으신가요? <Link to="/login">로그인</Link></p>
                </div>
            </div>
        </>
    );
};

export default SignUp;
