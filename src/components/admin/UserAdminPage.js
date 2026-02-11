import React, { useEffect, useMemo, useState, useCallback } from 'react';
import '../admin/styles/PostAdminPage.css';
import { gradeInfo } from './constants/gradeInfo';
import { statusInfo } from './constants/statusInfo';
import api from "app/api/axios";
import { IoSettingsOutline } from "react-icons/io5";

const UserAdminPage = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  // ==============================
  // DB에서 유저 목록 가져오기 (1회)
  // ==============================
// ✅ 목록 재조회 함수로 분리
  const fetchUsers = useCallback(async () => {
    try {
      setError('');
      const { data } = await api.get('/api/admin/users');

      if (!data?.success) {
        setError(data?.message || "유저 조회 실패");
        setUsers([]);
        return;
      }

      setUsers(Array.isArray(data.users) ? data.users : []);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "유저 데이터를 불러오지 못했어요."
      );
      setUsers([]);
    }
  }, []);

  // ✅ 최초 1회 조회
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // ✅ 상세(새창)에서 오는 "삭제완료" 메시지 받으면 재조회
  useEffect(() => {
    const onMessage = (event) => {
      // 같은 도메인에서만 받도록(보안)
      if (event.origin !== window.location.origin) return;

      if (event.data?.type === "DELETED") {
        fetchUsers(); // ✅ 삭제 후 재조회
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [fetchUsers]);

  // ==============================
  // 필터 입력 상태
  // ==============================
  const [inputKeyword, setInputKeyword] = useState('');
  const [inputGrade, setInputGrade] = useState('');
  const [inputUserStatus, setInputUserStatus] = useState('');

  // 적용된 검색 조건
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchGrade, setSearchGrade] = useState('');
  const [searchUserStatus, setSearchUserStatus] = useState('');

  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // ==============================
  // 검색/필터 버튼 이벤트
  // ==============================
  const handleSearch = () => {
    setSearchKeyword(inputKeyword.trim());
    setSearchGrade(inputGrade);
    setSearchUserStatus(inputUserStatus);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setInputKeyword('');
    setInputGrade('');
    setInputUserStatus('');
    setSearchKeyword('');
    setSearchGrade('');
    setSearchUserStatus('');
    setCurrentPage(1);
  };

  // ==============================
  // 정렬 + 필터링 (useMemo로 최적화)
  // ==============================
  const filteredUsers = useMemo(() => {
    // ✅ 최신 user_id가 위로 오도록 내림차순 정렬
    // user_id가 숫자 INT라면 숫자 정렬이 안전
    const usersDescending = [...users].sort((a, b) => {
      const aId = Number(a.user_id);
      const bId = Number(b.user_id);

      // 숫자면 숫자 정렬
      if (!Number.isNaN(aId) && !Number.isNaN(bId)) return bId - aId;

      // 혹시 문자열이면 문자열 정렬
      return String(b.user_id).localeCompare(String(a.user_id));
    });

    return usersDescending.filter((user) => {
      const idStr = String(user.user_id ?? '');
      const nickStr = String(user.user_nickname ?? '');

      const matchKeyword =
        searchKeyword === '' ||
        idStr.includes(searchKeyword) ||
        nickStr.includes(searchKeyword);

      // ✅ level_code 타입이 숫자/문자 섞일 수 있으니 String으로 통일 비교
      const matchGrade = searchGrade ? String(user.level_code) === String(searchGrade) : true;

      const matchStatus = searchUserStatus ? String(user.status) === searchUserStatus : true;

      return matchKeyword && matchGrade && matchStatus;
    });
  }, [users, searchKeyword, searchGrade, searchUserStatus]);

  // ==============================
  // 페이지네이션 계산
  // ==============================
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage) || 1;
  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);

  return (
    <div className="userStatusWrapper">
      <div className="adminPageContainer">
        {/* ==============================
          헤더
        ============================== */}
        <div className="adminHeader">
          <h2 className="adminTitle">사용자 관리</h2>
          <span className="adminDesc">사용자 정보 및 계정 상태를 관리합니다</span>
        </div>

        {/* 에러 표시 */}
        {error && (
          <div style={{ marginBottom: 12, color: "crimson" }}>
            {error}
          </div>
        )}

        {/* ==============================
          필터바
        ============================== */}
        <div className="filterBar">
          <div className="searchBox">
            <input
              type="text"
              placeholder="ID / 닉네임 검색"
              value={inputKeyword}
              onChange={(e) => setInputKeyword(e.target.value)}
            />
          </div>

          {/* ✅ gradeInfo의 key가 level_code와 일치해야 정상 작동 */}
          <select value={inputGrade} onChange={(e) => setInputGrade(e.target.value)}>
            <option value="">전체 등급</option>
            {Object.keys(gradeInfo).map((gradeKey) => (
              <option key={gradeKey} value={gradeKey}>
                {gradeKey}
              </option>
            ))}
          </select>

          <select value={inputUserStatus} onChange={(e) => setInputUserStatus(e.target.value)}>
            <option value="">전체 상태</option>
            <option value="0">활동중</option>
            <option value="1">정지</option>
            <option value="2">탈퇴</option>
          </select>

          <button onClick={handleSearch}>검색</button>
          <button onClick={handleReset}>초기화</button>
        </div>

        {/* ==============================
          테이블
        ============================== */}
        <table className="adminTable">
          <thead>
            <tr>
              <th>ID</th>
              <th>닉네임</th>
              <th>등급</th>
              <th>신고 점수</th>
              <th>가입일</th>
              <th>상태</th>
              <th>관리</th>
            </tr>
          </thead>

          <tbody>
            {currentUsers.length === 0 ? (
              <tr>
                <td colSpan="7">사용자가 없습니다.</td>
              </tr>
            ) : (
              currentUsers.map((user) => {
                const level = gradeInfo[user.level_code];
                const status = statusInfo[user.status];
                return (
                  <tr key={user.user_id}>
                    <td>{user.user_id}</td>
                    <td>{user.user_nickname}</td>

                    <td>
                      {level ? (
                        <div className="gradeContainer">
                          <img src={level.img} alt={level.name} />
                          <div>{String(level.name)}</div>
                        </div>
                      ) : (
                        <span>{String(user.level_code ?? '-')}</span>
                      )}
                    </td>

                    {/* ✅ 백엔드 필드명 reported_count 사용 */}
                    <td>{user.reported_count ?? 0} / 15</td>

                    {/* ✅ 백엔드 필드명 created_at 사용 */}
                    <td>{user.created_at ? String(user.created_at).slice(0, 10) : '-'}</td>

                    <td>
                      <span className={`statusBadge ${status.statusEng}`}>{status.statusKor}</span>
                    </td>

                    <td>
                      <button
                        className="btn-sm gearButton"
                        onClick={(e) => {
                          e.stopPropagation();
                          // ✅ user.id가 아니라 user.user_id
                          window.open(
                            `/admin/users/detail/${user.user_id}`,
                            '_blank',
                            'width=1000,height=800'
                          );
                        }}
                        title="회원 관리"
                      >
                        <IoSettingsOutline />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* ==============================
          페이지네이션
        ============================== */}
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            {'<'}
          </button>

          <span>
            {currentPage} / {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            {'>'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserAdminPage;
