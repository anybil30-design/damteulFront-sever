import React, { useEffect, useState, useCallback} from 'react';
import '../admin/styles/PostAdminPage.css';
import { IoSettingsOutline } from "react-icons/io5";
import api from "app/api/axios";

const TradeAdminPage = () => {
  const [trades, setTrades] = useState([]);
  const [error, setError] = useState('');

  const fetchTrades = useCallback(async () => {
    try {
      setError('');
      const { data } = await api.get('/api/admin/trades');

      if (!data?.success) {
        setError(data?.message || "거래 정보 조회 실패");
        setTrades([]);
        return;
      }

      setTrades(Array.isArray(data.trades) ? data.trades : []);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "거래 데이터를 불러오지 못했어요."
      );
      setTrades([]);
    }
  }, []);

  // ✅ 최초 1회 조회
  useEffect(() => {
    fetchTrades();
  }, [fetchTrades]);

  // ✅ 상세(새창)에서 오는 "삭제완료" 메시지 받으면 재조회
  useEffect(() => {
    const onMessage = (event) => {
      // 같은 도메인에서만 받도록(보안)
      if (event.origin !== window.location.origin) return;

      if (event.data?.type === "DELETED") {
        fetchTrades(); // ✅ 삭제 후 재조회
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [fetchTrades]);

  /* =================================================
     1️⃣ 입력 전용 상태 (UI 상태)
     - input에만 바인딩
     - 아직 검색에 사용 ❌
  ================================================= */
  const [inputKeyword, setInputKeyword] = useState('');
  const [inputStatus, setInputStatus] = useState('');

  /* =================================================
     2️⃣ 실제 검색 상태 (검색 버튼 클릭 시만 변경)
  ================================================= */
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchStatus, setSearchStatus] = useState('');

  /* =================================================
     3️⃣ 페이지네이션 상태
  ================================================= */
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;

  /* =================================================
     4️⃣ 검색 버튼 클릭 핸들러
     - 입력 상태 → 검색 상태로 복사
     - 페이지는 반드시 1로 초기화
  ================================================= */
  const handleSearch = () => {
    setSearchKeyword(inputKeyword);
    setSearchStatus(inputStatus);
    setCurrentPage(1);
  };

  /* =================================================
     5️⃣ 초기화 버튼
  ================================================= */
  const handleReset = () => {
    setInputKeyword('');
    setInputStatus('');
    setSearchKeyword('');
    setSearchStatus('');
    setCurrentPage(1);
  };



  /* =================================================
     7️⃣ 필터링 (⚠️ search 상태 기준)
  ================================================= */
  const filteredTransactions = trades.filter(trx => {
    const matchStatus = searchStatus
      ? trx.completed === searchStatus
      : true;

    const matchKeyword =
      trx.product.includes(searchKeyword) ||
      trx.buyer.includes(searchKeyword) ||
      trx.seller.includes(searchKeyword);

    return matchStatus && matchKeyword;
  });

  /* =================================================
     8️⃣ 페이지네이션 계산
  ================================================= */
  const indexOfLast = currentPage * transactionsPerPage;
  const indexOfFirst = indexOfLast - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirst,
    indexOfLast
  );
  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);

  return (
    <div className="tradeStatusWrapper">
      <div className="adminPageContainer">

        {/* -------------------- 헤더 -------------------- */}
        <div className="adminHeader">
          <h2 className="adminTitle">거래 관리</h2>
          <span className="adminDesc">거래 내역 및 상태를 관리합니다</span>
        </div>
        {/* 에러 표시 */}
        {error && (
          <div style={{ marginBottom: 12, color: "crimson" }}>
            {error}
          </div>
        )}
        {/* -------------------- 검색 / 필터 -------------------- */}
        <div className="filterBar">
          <div className="searchBox">
            <input
              type="text"
              placeholder=" 상품명 / 구매자 / 판매자 검색"
              value={inputKeyword}
              onChange={(e) => setInputKeyword(e.target.value)}
            />
          </div>


          <button onClick={handleSearch}>검색</button>
          <button onClick={handleReset}>초기화</button>
        </div>

        {/* -------------------- 테이블 -------------------- */}
        <table className="adminTable">
          <thead>
            <tr>
              <th>ID</th>
              <th>상품명</th>
              <th>구매자</th>
              <th>판매자</th>
              <th>거래 방식</th>
              <th>거래 일시</th>
              <th>금액</th>
              <th>관리</th>
            </tr>
          </thead>

          <tbody>
            {currentTransactions.length === 0 ? (
              <tr>
                <td colSpan="8">거래 내역이 없습니다.</td>
              </tr>
            ) : (
              currentTransactions.map(trx => (
                <tr key={trx.id}>
                  <td>{trx.id}</td>
                  <td>{trx.product}</td>
                  <td>{trx.buyer}</td>
                  <td>{trx.seller}</td>
                  <td>{trx.method}</td>
                  <td>{trx.created_at}</td>
                  <td>{trx.price.toLocaleString()}원</td>
                  <td>
                    <button
                      className="btn-sm gearButton"
                      onClick={() =>
                        window.open(
                          `/admin/trades/detail/${trx.id}`,
                          '_blank',
                          'width=1000,height=800'
                        )
                      }
                      title="거래 관리"
                    >
                      <IoSettingsOutline />
                    </button>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* -------------------- 페이지네이션 -------------------- */}
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            {'<'}
          </button>

          <span>{currentPage} / {totalPages || 1}</span>

          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            {'>'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TradeAdminPage;
