import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "./components.css";
import axios from "axios";

const styles = {
  wrapper: {
    backgroundColor: "white",
    padding: "10px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  btn: {
    background: "none",
    border: "none",
    padding: 0,
    margin: 0,
    color: "inherit",
    font: "inherit",
    cursor: "pointer",
  }
};

function Header() {
  const [search, setSearch] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // ✅ 로그인 상태 확인
  useEffect(() => {
    axios.post("http://localhost:8080/api/user/status", null, {
      withCredentials: true,
    })
    .then((res) => {
      setIsLoggedIn(true);
      console.log("✅ 로그인 사용자:", res.data.userUuid);
    })
    .catch(() => {
      setIsLoggedIn(false);
    });
  }, []);

  // 🔓 로그아웃 처리
  const handleLogout = () => {
    const logout = async () => {
      try {
        await axios.post("http://localhost:8080/api/user/logout", {
          withCredentials: true,
        });
        setIsLoggedIn(false);
        alert("로그아웃 되었습니다.");
        navigate("/login");
      } catch (error) {
        console.error("로그아웃 실패:", error);
        alert("로그아웃 중 오류가 발생했습니다.");
      }
    };

    logout();
  };

  // 🔍 검색 실행
  const executeSearch = () => {
    if (search.trim()) {
      navigate(`/booksearch?search=${search}`);
    }
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      executeSearch();
    }
  };

  const handleIconClick = () => {
    executeSearch();
  };

  return (
    <header className="header" style={styles.wrapper}>
      <h1>
        <Link to="/">책 좀 읽어라</Link>
      </h1>
      <ul className="nav-menu">
        <li className="nav-item">
          <Link to="/category/economic">경제</Link>
        </li>
        <li className="nav-item">
          <Link to="/category/politics">정치</Link>
        </li>
        <li className="nav-item">
          <Link to="/category/sports">스포츠</Link>
        </li>
        <li className="nav-item">
          <Link to="/category/society">사회</Link>
        </li>
        <li className="nav-item">
          <Link to="/category/world">국제</Link>
        </li>
        <li className="nav-item">
          <Link to="/books">도서목록</Link>
        </li>
      </ul>

      <nav className="nav">
        <div className="search-container">
          <input
            type="text"
            placeholder="검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            className="search-input"
          />
          <Search className="search-icon" size={18} onClick={handleIconClick} />
        </div>
        <div className="nav-links">
          {isLoggedIn ? (
            <button onClick={handleLogout} className="nav-link" style={styles.btn}>
              <p>로그아웃</p>
            </button>
          ) : (
            <Link to="/login" className="nav-link">
              <p>로그인/회원가입</p>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
