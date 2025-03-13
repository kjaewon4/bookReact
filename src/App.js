// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Router 관련 컴포넌트만 임포트
import Login from './Login';
import SignUp from './SignUp';
import Main from './Main';
import BookSearch from './BookSearch';
import BookDetail from './BookDetail';
import BookmarkedBooks from "./BookmarkedBooks";  // 북마크 목록 페이지

const App = () => {
  return (
    <Routes>  {/* Routes로 라우팅 설정 */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/" element={<Main />} />
      <Route path="/booksearch" element={<BookSearch />} /> {/* BookSearch 페이지 */}
      {/* 책 상세 페이지 경로: '/book/:bookIsbn' */}
      <Route path="/book/:bookIsbn" element={<BookDetail />} />
      <Route path="/bookmarks" element={<BookmarkedBooks />} />  {/* 북마크 목록 페이지 */}
      </Routes>
  );
};

export default App;
