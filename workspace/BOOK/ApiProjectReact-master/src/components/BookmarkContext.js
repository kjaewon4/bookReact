// BookmarkContext.js
import React, { createContext, useReducer, useContext, useEffect } from "react";
import axios from "axios";

const BookmarkContext = createContext();

const initialState = {
  bookmarks: [], // 북마크된 책의 ISBN 배열
  loading: false,
  error: null,
};

const bookmarkReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_BOOKMARKS_START":
      console.log("[BookmarkContext] FETCH_BOOKMARKS_START");
      return { ...state, loading: true, error: null };
    case "FETCH_BOOKMARKS_SUCCESS":
      console.log("[BookmarkContext] FETCH_BOOKMARKS_SUCCESS", action.payload);
      return { ...state, loading: false, bookmarks: action.payload };
    case "FETCH_BOOKMARKS_FAILURE":
      console.error("[BookmarkContext] FETCH_BOOKMARKS_FAILURE", action.payload);
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export const BookmarkProvider = ({ children }) => {
  const [state, dispatch] = useReducer(bookmarkReducer, initialState);

  // 북마크 목록을 서버에서 불러오는 함수
  const fetchBookmarks = async () => {
    console.log("[BookmarkContext] fetchBookmarks: 시작");
    dispatch({ type: "FETCH_BOOKMARKS_START" });
    try {
      const response = await axios.get("http://localhost:8080/api/bookmarks", {
        withCredentials: true,
      });
      console.log("[BookmarkContext] fetchBookmarks: 응답 데이터", response.data);
      // 예: 응답 데이터 [{ bookIsbn: "book1" }, { bookIsbn: "book2" }]
      const bookmarkedIsbns = response.data.map((item) => item.bookIsbn);
      console.log("[BookmarkContext] fetchBookmarks: 추출된 ISBN들", bookmarkedIsbns);
      dispatch({ type: "FETCH_BOOKMARKS_SUCCESS", payload: bookmarkedIsbns });
      console.log("[BookmarkContext] fetchBookmarks: 완료");
    } catch (error) {
      console.error("[BookmarkContext] fetchBookmarks: 에러", error);
      dispatch({ type: "FETCH_BOOKMARKS_FAILURE", payload: error });
    }
  };

  // 북마크 추가/삭제 토글 함수
  const toggleBookmark = async (bookIsbn) => {
    console.log(`[BookmarkContext] toggleBookmark: 시작 (ISBN: ${bookIsbn})`);
    try {
      if (state.bookmarks.includes(bookIsbn)) {
        console.log(`[BookmarkContext] toggleBookmark: 삭제 시도 (ISBN: ${bookIsbn})`);
        // 북마크 삭제: DELETE 요청 (요청 본문에 ISBN 포함)
        await axios.delete(`http://localhost:8080/api/bookmarks/${bookIsbn}`, {
          data: `"${bookIsbn}"`,
          withCredentials: true,
        });
        console.log(`[BookmarkContext] toggleBookmark: 삭제 성공 (ISBN: ${bookIsbn})`);
      } else {
        console.log(`[BookmarkContext] toggleBookmark: 추가 시도 (ISBN: ${bookIsbn})`);
        // 북마크 추가: POST 요청 (요청 본문에 ISBN 문자열 전달)
        await axios.post(
          `http://localhost:8080/api/bookmarks/${bookIsbn}`,
          `"${bookIsbn}"`,
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        console.log(`[BookmarkContext] toggleBookmark: 추가 성공 (ISBN: ${bookIsbn})`);
      }
      // 토글 후 최신 북마크 목록을 다시 불러옴
      console.log("[BookmarkContext] toggleBookmark: 최신 북마크 목록 재조회 시작");
      await fetchBookmarks();
      console.log("[BookmarkContext] toggleBookmark: 최신 북마크 목록 재조회 완료");
    } catch (error) {
      console.error("[BookmarkContext] toggleBookmark: 에러", error);
    }
  };

  // 컴포넌트 마운트 시 한 번 북마크 목록을 가져옴
  useEffect(() => {
    console.log("[BookmarkContext] Provider 마운트됨, fetchBookmarks 호출");
    fetchBookmarks();
  }, []);

  return (
    <BookmarkContext.Provider
      value={{
        bookmarks: state.bookmarks,
        loading: state.loading,
        error: state.error,
        fetchBookmarks,
        toggleBookmark,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmarks = () => useContext(BookmarkContext);
