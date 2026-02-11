import React, { useEffect, useMemo, useState } from 'react';
import api from 'app/api/axios';
import './styles/main.css';
import WriteBtn from 'components/writeBtn/WriteBtn';
import GoodsList from 'components/GoodsList/GoodsList';
import { useLocation } from 'react-router-dom';
import SearchBar from 'components/SearchBar/SearchBar';

const LOGIN_WELCOME_KEY = 'loginWelcomeShown';

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const HomePage = () => {
  const location = useLocation();

  const [loginSuccess, setLoginSuccess] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  // ✅ 로그인 성공 메시지: 1회성(새로고침해도 다시 안 뜸)
  useEffect(() => {
    const alreadyShown = localStorage.getItem(LOGIN_WELCOME_KEY);
    if (alreadyShown) return;

    if (location.state?.showWelcome) {
      setLoginSuccess(true);
      setFadeOut(false);

      const fadeTimer = setTimeout(() => setFadeOut(true), 2000);

      const removeTimer = setTimeout(() => {
        setLoginSuccess(false);
        localStorage.setItem(LOGIN_WELCOME_KEY, 'true');
      }, 2500);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [location.state?.showWelcome]);

  // 전체/최신글 상태변수
  const [filter, setFilter] = useState('all');

  // DB데이터 상태변수
  const [list, setList] = useState([]);
  const [shuffledList, setShuffledList] = useState([]); // ✅ 랜덤 결과 저장

  useEffect(() => {
    const fetchGoods = async () => {
      try {
        const res = await api.get('/api/goods');
        if (res.data.ok) {
          console.log('API /api/goods 응답 샘플:', res.data.list && res.data.list.length ? res.data.list[0] : res.data.list);
          setList(res.data.list);
        }
      } catch (err) {
        console.error("목록 로드 실패 : ", err);
      }
    };
    fetchGoods();
  }, []);

  // ✅ list가 바뀔 때(=처음 로드/데이터 갱신)만 1회 섞기
  useEffect(() => {
    setShuffledList(shuffle(list));
  }, [list]);

  // ✅ 최신글은 "랜덤"이 아니라 "정렬"로 고정
  const latestList = useMemo(() => {
    // created_at 같은 컬럼이 있으면 그걸로 정렬하는 게 베스트
    // 없으면 goods_id 기준으로 내림차순(대체)
    return [...list].sort((a, b) => (b.goods_id ?? 0) - (a.goods_id ?? 0));
  }, [list]);

  const viewList = filter === 'all' ? shuffledList : latestList;

  return (
    <main>
      {loginSuccess && (
        <p className={`loginMessage ${fadeOut ? 'fadeOut' : ''}`}>
          로그인 성공
        </p>
      )}

      <section className='homePage'>
        <SearchBar />
        <div className='btnContainer'>
          <button
            className={filter === 'all' ? 'btnActive' : ''}
            onClick={() => setFilter('all')}
          >
            전체
          </button>
          <button
            className={filter === 'latest' ? 'btnActive' : ''}
            onClick={() => setFilter('latest')}
          >
            최신글
          </button>
        </div>

        {viewList.length > 0 ? (
          viewList.map((item) => (
            <GoodsList
              key={item.goods_id}
              title={item.title}
              status={item.condition_type === '0' ? '중고상품' : '새상품'}
              price={Number(item.price).toLocaleString()}
              linkTo={`/goodsdetail/${item.goods_id}`}
              img={item.image}
            />
          ))
        ) : (
          <p style={{ textAlign: 'center', marginTop: '20px' }}>
            등록된 매물이 없습니다.
          </p>
        )}

        <WriteBtn />
      </section>
    </main>
  );
};

export default HomePage;
