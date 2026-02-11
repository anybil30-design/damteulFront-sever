import React, { useState, useCallback, useEffect } from 'react';
import '../admin/styles/PostAdminPage.css';
// import PostAdminModal from './PostAdminModal';
// import { samplePosts } from './data/samplePosts';
import { IoSettingsOutline } from "react-icons/io5";
import api from "app/api/axios";
/* ===========================
   2️⃣ PostAdminPage 컴포넌트
=========================== */

const PostAdminPage = () => {

  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');

  // ✅ 목록 재조회 함수로 분리
  const fetchPosts = useCallback(async () => {
    try {
      setError('');
      const { data } = await api.get('/api/admin/posts');

      if (!data?.success) {
        setError(data?.message || "유저 조회 실패");
        setPosts([]);
        return;
      }

      setPosts(Array.isArray(data.posts) ? data.posts : []);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "게시판 데이터를 불러오지 못했어요."
      );
      setPosts([]);
    }
  }, []);

  // ✅ 최초 1회 조회
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // ✅ 상세(새창)에서 오는 "삭제완료" 메시지 받으면 재조회
  useEffect(() => {
    const onMessage = (event) => {
      // 같은 도메인에서만 받도록(보안)
      if (event.origin !== window.location.origin) return;

      if (event.data?.type === "DELETED") {
        fetchPosts(); // ✅ 삭제 후 재조회
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [fetchPosts]);

  /* ===========================
    🔹 검색 입력용 상태 (입력만)
  =========================== */
  const [inputKeyword, setInputKeyword] = useState('');
  const [inputStatus, setInputStatus] = useState('');

  /* ===========================
     🔹 실제 검색 적용 상태 (버튼 클릭 시)
  =========================== */
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  /* ===========================
     🔹 페이지네이션 상태
  =========================== */
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  /* ===========================
     3️⃣ 검색 버튼 클릭 시 실행
  =========================== */
  const handleSearch = () => {
    setKeyword(inputKeyword);       // 제목 검색어 적용
    setStatusFilter(inputStatus);   // 상태 필터 적용
    setCurrentPage(1);              // 검색 시 항상 1페이지로 초기화
  };

  /* ===========================
     4️⃣ 필터링된 게시글
  =========================== */
  const filteredPosts = [...posts].filter(post => {
    const matchStatus = statusFilter ? post.product_state === statusFilter : true;
    const matchKeyword = keyword
      ? post.title.includes(keyword)
      : true;

    return matchStatus && matchKeyword;
  });

  /* ===========================
     5️⃣ 페이지네이션 처리
  =========================== */
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const goToPage = (page) => setCurrentPage(page);

  return (
    <div className="adminPageContainer">
      {/* 헤더 */}
      <div className="adminHeader">
        <h2 className="adminTitle">게시글 관리</h2>
        <span className="adminDesc">중고 거래 게시글을 관리합니다</span>
      </div>

        {/* 에러 표시 */}
        {error && (
          <div style={{ marginBottom: 12, color: "crimson" }}>
            {error}
          </div>
        )}

      {/* ===========================
         🔍 검색 / 필터 영역
      =========================== */}
      <div className="filterBar">
        <div className="searchBox">
          <input
            type="text"
            placeholder=" 제목 검색"
            value={inputKeyword}
            onChange={(e) => setInputKeyword(e.target.value)}
          />
        </div>

        <select
          value={inputStatus}
          onChange={(e) => setInputStatus(e.target.value)}
        >
          <option value="">전체 상태</option>
          <option value="새상품">새상품</option>
          <option value="중고상품">중고상품</option>
          <option value="나눔중">나눔중</option>
          <option value="나눔완료">나눔완료</option>
        </select>

        {/* 🔹 검색 버튼 클릭 시에만 실제 검색 적용 */}
        <button onClick={handleSearch}>검색</button>

        {/* 🔹 입력/검색 상태 모두 초기화 */}
        <button
          onClick={() => {
            setInputKeyword('');
            setInputStatus('');
            setKeyword('');
            setStatusFilter('');
            setCurrentPage(1);
          }}
        >
          초기화
        </button>
      </div>

      {/* ===========================
         📋 게시글 테이블
      =========================== */}
      <table className="adminTable">
        <thead>
          <tr>
            <th>ID</th>
            <th>카테고리</th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
            <th>상품 상태</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {currentPosts.length === 0 ? (
            <tr>
              <td colSpan="7">게시글이 없습니다.</td>
            </tr>
          ) : (
            currentPosts.map(post => (
              <tr key={post.id}>
                <td>{post.id}</td>
                <td>{post.category}</td>
                <td className="postTitle">{post.title}</td>
                <td>{post.author}</td>
                <td>{post.created_at}</td>
                <td>
                  <span
                    className={`statusBadge ${post.product_state === '새상품' || post.product_state==='나눔중' ? 'new' : 'used'
                      }`}
                  >
                    {post.product_state}
                  </span>
                </td>

                <td>
                  <button
                    className="btn-sm"
                    onClick={() => {
                      const cate = post.category==='나눔'?'nanum':'goods';
                      const url = `/admin/${cate}/detail/${post.id}`;
                      window.open(url, '_blank', 'width=1000,height=800'); // 새 창
                    }}
                    title="관리"
                    aria-label="관리"
                  >
                    <IoSettingsOutline />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ===========================
         📄 페이지네이션
      =========================== */}
      <div className="pagination">
        <button onClick={() => goToPage(Math.max(1, currentPage - 1))}>{'<'}</button>
        <span>{currentPage} / {totalPages || 1}</span>
        <button onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}>{'>'}</button>
      </div>


      {/* {selectedPost && (
        <PostAdminModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onDelete={(id) => console.log('삭제', id)}
          onHide={(id) => console.log('숨김', id)}
        />
      )} */}
    </div>
  );
};

export default PostAdminPage;
