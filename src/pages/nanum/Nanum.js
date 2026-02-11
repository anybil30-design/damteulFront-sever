import GoodsList from 'components/GoodsList/GoodsList';
import SearchBar from 'components/SearchBar/SearchBar';
import WriteBtn from 'components/writeBtn/WriteBtn';
import React, {useState, useEffect} from 'react';
import api from 'app/api/axios';

const Nanum = () => {



    // DB데이터 상태변수
    const [list, setList] = useState([]);
    // 나눔/이벤트 상태변수
    const [filter, setFilter] = useState('nanum');
  
    // 서버에서 데이터 가져오기
    useEffect(()=>{
      const fetchData = async()=>{
        try{
          // filter값으로 나눔 or 이벤트 구분
          const url = filter ==='nanum'
          ?'/api/nanum'
          :'/api/event';
          const res = await api.get(url);
          console.log(`${filter}데이터: `,res.data)
          setList(res.data);
        }catch(err){
          console.error("목록 로드 실패 : ", err);
          setList([]);
        }
      };
      fetchData();
    },[filter]);

    // 타이머 설정
    const getRemainingTime = (endTime) =>{
      const remain = new Date(endTime) - new Date();
      if (remain <= 0) return "종료됨";

      const hours = Math.floor(remain / (1000*60*60));
      const minutes = Math.floor((remain % (1000*60*60)) / (1000*60));
      return `${hours}시간 ${minutes}분 남음`;
    }

  return (
    <main>
      <section style={{marginTop:'60px', marginBottom:'80px', paddingBottom:'60px'}}>
        <SearchBar/>
          <div className='btnContainer'>
						<button className={filter === 'nanum'?'btnActive':''}
            onClick={()=>{setList([]);setFilter('nanum');}}>나눔</button>
						<button className={filter === 'event'?'btnActive':''}
            onClick={()=>{setList([]);setFilter('event');}}>이벤트</button>
					</div>
          {list && list.length > 0 ? (
          list.map((item) => (
            <GoodsList
              key={`${filter}-${filter === 'nanum' ? item.nanum_id : item.event_id}`}
              linkTo={filter === 'nanum'
                ? `/nanumdetail/${item.nanum_id}`
                : `/eventdetail/${item.event_id}`}
              title={item.title}
              status={filter === 'nanum' ? '무료나눔' : '이벤트'}
              timer={filter === 'nanum' ? getRemainingTime(item.end_nanum) : ""}
              img={item.image}
            />
          ))
        ) : (
          <p style={{ textAlign: 'center', marginTop: '20px' }}>등록된 글이 없습니다.</p>
        )}
          <WriteBtn />
      </section>
    </main>
  );
};

export default Nanum;