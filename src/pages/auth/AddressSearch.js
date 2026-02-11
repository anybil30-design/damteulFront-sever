import React, { useEffect, useMemo, useState } from "react";
import api from "app/api/axios";
import { Link, useNavigate } from 'react-router-dom';
import './css/addressSearch.css';
// 돋보기 아이콘
import { FaSearch } from "react-icons/fa";
// 체크 아이콘
import { FaCheck } from "react-icons/fa";
import {closeMobileKeyboard} from "components/closeMobileKeyboard/closeMobileKeyboard";
/** ✅ 디바운스: 타이핑 멈춘 뒤에만 서버 호출 */
function useDebouncedValue(value, delay = 250) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return debounced;
}

export default function AddressSearch() {



  const navitgate = useNavigate();
  /** ✅ input 값 */
  const [query, setQuery] = useState("");

  /** ✅ 디바운스된 query(서버 호출용) */
  const debouncedQuery = useDebouncedValue(query, 250);

  /** ✅ 서버에서 받은 추천 리스트(연관검색어) */
  const [suggestions, setSuggestions] = useState([]);

  /** ✅ 로딩 표시 */
  const [loading, setLoading] = useState(false);

  // ✅ "한 번이라도 입력을 시작했는지" (첫 화면 문구 숨기기용)
  const [hasTyped, setHasTyped] = useState(false);

  /**
   * ✅ 사용자가 "선택 확정"한 항목
   * - 클릭했거나
   * - 검색(엔터/버튼) 했을 때 input이 추천 중 정확히 일치하는 경우
   */
  const [selected, setSelected] = useState(null);

  /**
   * ✅ “고정 표시 모드”
   * - true면 연관검색어 영역에는 selected 1개만 보여줌
   * - false면 suggestions 리스트 보여줌
   *
   * 네가 말한 “고정”은 UI 위치 고정 + 선택 후 1개만 남기는 느낌이라
   * 여기서는 "선택 확정" 상태를 fixedMode로 표현함.
   */
  const [fixedMode, setFixedMode] = useState(false);

  /**
   * ✅ 화면에 보여줄 리스트 결정
   * - 선택 확정 상태(fixedMode=true)면 selected 1개만
   * - 아니면 suggestions 목록
   */
  const listToShow = useMemo(() => {
    if (fixedMode && selected) return [selected];
    return suggestions;
  }, [fixedMode, selected, suggestions]);

  /** ✅ input 변경(타이핑) -> 선택 확정 해제하고 다시 추천 리스트 모드 */
  const onChangeQuery = (e) => {
    const v = e.target.value;
    setQuery(v);

    // ✅ 입력이 있으면 true, 전부 지우면 false(첫 화면 상태로)
    setHasTyped(v.trim().length > 0);

    // 사용자가 다시 타이핑 시작하면 "선택 확정"을 풀고 다시 리스트 모드
    if (fixedMode) setFixedMode(false);
    if (selected) setSelected(null);
  };
  
  /**
   * ✅ 자동완성 호출
   * - 선택 확정(fixedMode=true) 상태에서는 서버 호출 안 함
   */
  useEffect(() => {
    if (fixedMode) return;

    const q = debouncedQuery.trim();

    // 입력이 비면 추천 리스트 초기화
    if (!q) {
      setSuggestions([]);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        const res = await api.get(
          `/api/addresses?q=${encodeURIComponent(q)}&limit=10`
        );
        if (cancelled) return;
        setSuggestions(res.data?.items || []);
      } catch {
        if (!cancelled) setSuggestions([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, fixedMode]);

  /** ✅ 추천 리스트에서 클릭 선택 -> input 자동 채움 + 1개만 남기기 */
  const onPickSuggestion = (item) => {
    setQuery(item.full_name);   // 검색창에 선택한 full_name 자동 출력
    setSelected(item);          // 선택 확정
    setFixedMode(true);         // 연관검색어 영역에는 이 1개만 남김
    setSuggestions([]);         // 기존 리스트는 비움(안 비워도 되지만 깔끔하게)
  };

  /**
   * ✅ 검색 버튼/엔터
   * - 자동선택(첫번째 추천) 절대 안 함
   * - 단, "추천 중 full_name이 query와 정확히 같은 것"이 있으면 그걸 선택 확정
   */
  const onSubmit = (e) => {
    e.preventDefault();

    const q = query.trim();
    if (!q) return;

    // ✅ exact match만 허용
    // 정확히 일치할경우 exact에 담기
    const exact = suggestions.find((s) => s.full_name === q);

    if (exact) {
      // exact match면 선택 확정 처리
      onPickSuggestion(exact);
      return;
    }

    // exact match가 없으면 아무것도 확정하지 않음 (리스트는 그대로 유지)
    // 즉, 사용자가 계속 보고 클릭해서 선택하도록 유도
    closeMobileKeyboard();
  };
  
  // ✅ "연관검색어가 없습니다"를 보여줄지 결정
  // - 첫 화면(hasTyped=false)에서는 숨김
  // - 입력했고(hasTyped=true), 검색어가 있고, 로딩도 아니고, 결과가 0개면 표시
  const showEmptyMessage =
    !fixedMode &&
    hasTyped &&
    debouncedQuery.trim().length > 0 &&
    !loading &&
    listToShow.length === 0;
  return (
    <>
    <header className="authPageHeaderStyle">
      <h2>내 동네 찾기</h2>
    </header>
      <main className="authPageMainStyle">
        {/* ✅ 검색창 */}
        <form onSubmit={onSubmit} className="addressSearchBox">
          <label htmlFor="searchBox">검색</label>
          <input
            id='searchBox'
            value={query}
            onChange={onChangeQuery}
            placeholder="동네를 입력해주세요"
          />
          <button type="submit" className="searchBtn"><FaSearch /></button>
        </form>

        {/* ✅ “연관검색어 영역”은 항상 화면에 고정되어 존재 (드롭다운 X) */}
        <div className="addressValueWrap">
          <p className="neighbor">근처 동네</p>

          <div className="addressValue">
            {/* 로딩(선택 확정 모드에서는 안 뜸) */}
            {/* {!fixedMode && loading && (
            <div className="searchMessage">검색 중...</div>
          )} */}

            {/* ✅ 첫 화면에서는 아무것도 안 뜸 */}
            {showEmptyMessage && <div className="searchMessage">연관검색어가 없습니다.</div>}
            <ul>
              {/* 보여줄 항목이 없을 때 */}
              {listToShow.length > 0 &&
                listToShow.map((item) => (
                  <li className="value" key={item.addr_id ?? item.full_name}>
                    <button
                      type="button"
                      onClick={() => onPickSuggestion(item)}
                    >
                      {item.full_name}
                    </button>
                    {fixedMode && <div className="checkBtn"><FaCheck /></div>}
                  </li>
                ))
              }
            </ul>
          </div>
        </div>

        {/* 뒤로가기, 다음버튼 */}
        <div className="formButtonWrapper">
          <Link to='/intro' title='처음으로 돌아가기' replace>처음으로</Link>
          <button onClick={()=>navitgate("/register",{state:{address:query}})} style={fixedMode ? { color: '#fff', background: '#58A563' } : { color: '#fff', background: '#D7D7D7' }} disabled={fixedMode ? false : true}>완료</button>
        </div>
      </main>
    </>
  );
}
