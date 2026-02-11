import React, { useEffect, useState, useCallback } from 'react';
import '../admin/styles/PostAdminPage.css'; // 관리자 페이지 공통 스타일
import { IoSettingsOutline } from "react-icons/io5";
import api from "app/api/axios";


/* ===========================
   2️⃣ CommunityAdminPage
=========================== */

const CommunityAdminPage = () => {
  const [community, setCommunity] = useState([]);
  const [error, setError] = useState('');

  const fetchCommunity = useCallback(async () => {
    try {
      setError('');
      const { data } = await api.get('/api/admin/community');

      if (!data?.success) {
        setError(data?.message || "커뮤니티 정보 조회 실패");
        setCommunity([]);
        return;
      }

      setCommunity(Array.isArray(data.community) ? data.community : []);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "거래 데이터를 불러오지 못했어요."
      );
      setCommunity([]);
    }
  }, []);

  // ✅ 최초 1회 조회
  useEffect(() => {
    fetchCommunity();
  }, [fetchCommunity]);

  // ✅ 상세(새창)에서 오는 "삭제완료" 메시지 받으면 재조회
  useEffect(() => {
    const onMessage = (event) => {
      // 같은 도메인에서만 받도록(보안)
      if (event.origin !== window.location.origin) return;

      if (event.data?.type === "DELETED") {
        fetchCommunity(); // ✅ 삭제 후 재조회
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [fetchCommunity]);

  /* ===========================
     🔹 입력용 상태 (타이핑만)
  =========================== */
  const [inputKeyword, setInputKeyword] = useState('');
  const [inputStatus, setInputStatus] = useState('');

  /* ===========================
     🔹 실제 검색 적용 상태
     (검색 버튼 클릭 시에만 변경)
  =========================== */
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  /* ===========================
     🔹 페이지네이션 상태
  =========================== */
  const [currentPage, setCurrentPage] = useState(1);

  /* ===========================
   🔹 선택된 커뮤니티 (모달용)
=========================== */

  const communitiesPerPage = 10;

  /* ===========================
     3️⃣ 검색 버튼 클릭 로직
     - 검색 조건 적용
     - 페이지 1로 초기화
  =========================== */
  const handleSearch = () => {
    setKeyword(inputKeyword);
    setStatusFilter(inputStatus);
    setCurrentPage(1);
  };

  /* ===========================
     5️⃣ 필터링 로직
     - 상태 필터
     - 제목/카테고리 검색
  =========================== */
  const filteredCommunities = community.filter(item => {
    const matchStatus = statusFilter
      ? item.status === statusFilter
      : true;

    const matchKeyword = keyword
      ? item.title.includes(keyword) ||
      item.category.includes(keyword)
      : true;

    return matchStatus && matchKeyword;
  });

  /* ===========================
     6️⃣ 페이지네이션 계산
  =========================== */
  const indexOfLast = currentPage * communitiesPerPage;
  const indexOfFirst = indexOfLast - communitiesPerPage;
  const currentCommunities = filteredCommunities.slice(
    indexOfFirst,
    indexOfLast
  );
  const totalPages = Math.ceil(
    filteredCommunities.length / communitiesPerPage
  );

  return (
    <div className="adminPageContainer">
      {/* 헤더 */}
      <div className="adminHeader">
        <h2 className="adminTitle">커뮤니티 관리</h2>
        <span className="adminDesc">
          커뮤니티 게시글과 모임 상태를 관리합니다
        </span>
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
            placeholder=" 카테고리 / 제목 검색"
            value={inputKeyword}
            onChange={(e) => setInputKeyword(e.target.value)}
          />
        </div>


        {/* 🔹 검색 버튼 클릭 시에만 실제 검색 */}
        <button onClick={handleSearch}>검색</button>

        {/* 🔹 입력값 + 검색 조건 + 페이지 초기화 */}
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
         📋 커뮤니티 테이블
      =========================== */}
      <table className="adminTable">
        <thead>
          <tr>
            <th>ID</th>
            <th>카테고리</th>
            <th>제목</th>
            <th>작성일</th>
            <th>작성자</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {currentCommunities.length === 0 ? (
            <tr>
              <td colSpan="6">게시글이 없습니다.</td>
            </tr>
          ) : (
            currentCommunities.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.category}</td>
                <td>{item.title}</td>
                <td>{item.created_at}</td>
                <td>{item.user}</td>
                <td>
                  <button
                    className="btn-sm"
                    onClick={() => {
                      const url = `${window.location.origin}/admin/community/detail/${item.id}`;
                      window.open(url, '_blank', 'width=1000,height=800');
                    }}
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
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          {'<'}
        </button>
        <span>{currentPage} / {totalPages || 1}</span>
        <button
          onClick={() =>
            setCurrentPage(prev => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          {'>'}
        </button>
      </div>
    </div>
  );
};

export default CommunityAdminPage;
