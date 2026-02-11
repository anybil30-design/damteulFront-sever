import React, {useState} from 'react';
import { useLocation } from 'react-router-dom';
import './styles/myWishlist.css';
import GoodsList from 'components/GoodsList/GoodsList';

function MyWishlist(props) {
	const location =useLocation();
	const [type, setType] = useState(location.state?.activeTab ||'wishlist');
	const [toggle, setToggle] = useState('community');

	const dummyData = {
  // 커뮤니티 (community)
  community: [
    { num: 1, title: '우리 집 고슴도치 좀 보세요 ㅠㅠ', category: '자유게시판', status: '활동중', img: `${process.env.PUBLIC_URL}/images/dummy/hedgehog.jpg` },
    { num: 2, title: '층간소음 해결하신 분 계신가요?', category: '질문/답변', status: '답변대기', img: `${process.env.PUBLIC_URL}/images/dummy/2.jpg` },
    { num: 3, title: '금요일 밤 자전거 라이딩 하실 분!', category: '모임', status: '모집중', img: `${process.env.PUBLIC_URL}/images/dummy/3.jpg` },
    { num: 4, title: '베란다 상추 키우기 성공했습니다', category: '정보공유', status: '활동중', img: `${process.env.PUBLIC_URL}/images/dummy/4.jpg` },
    { num: 5, title: '집 앞 편의점 고양이 실종됐대요', category: '동네소식', status: '활동중', img: `${process.env.PUBLIC_URL}/images/dummy/5.jpg` }
  ],

  // 중고장터 (market)
  market: [
    { num: 11, title: '집들이 선물로 받은 미개봉 와인', status: '판매중', price: '35,000', img: `${process.env.PUBLIC_URL}/images/dummy/6.jpg` },
    { num: 12, title: '다이어트용 실내 자전거 (빨래걸이됨)', status: '예약중', price: '50,000', img: `${process.env.PUBLIC_URL}/images/dummy/7.jpg` },
    { num: 13, title: '이사 가서 책상 무료로 드립니다', status: '나눔중', price: '0', img: `${process.env.PUBLIC_URL}/images/dummy/8.jpg` },
    { num: 14, title: '제습기 작년 모델 팝니다', status: '판매중', price: '120,000', img: `${process.env.PUBLIC_URL}/images/dummy/10.jpg` },
    { num: 15, title: '캠핑용 화로대 (사용감 있음)', status: '판매완료', price: '15,000', img: `${process.env.PUBLIC_URL}/images/dummy/9.jpg` }
  ],

  // 최근 본 글 (recent)
  recent: [
    { num: 21, title: '헬스장 양도 받으실 분 구해요', category: '동네소식', status: '조회됨', img: `${process.env.PUBLIC_URL}/images/dummy/12.jpg` },
    { num: 22, title: '브라운 면도기 시리즈 9', status: '판매중', price: '210,000', img: `${process.env.PUBLIC_URL}/images/dummy/11.jpg` },
    { num: 23, title: '코인 노래방 같이 가실 동네 친구', category: '모임', status: '모집중', img: `${process.env.PUBLIC_URL}/images/dummy/13.jpg` },
    { num: 24, title: '유통기한 임박 간식 꾸러미', status: '판매중', price: '5,000', img: `${process.env.PUBLIC_URL}/images/dummy/14.jpg` },
    { num: 25, title: '오늘 점심 메뉴 투표 좀 해주세요', category: '자유게시판', status: '활동중', img: `${process.env.PUBLIC_URL}/images/dummy/15.jpg` }
  ]
};


	return (
		<main>
			<section className='myWishlist'>
				<ul className='tabMenu'>
					<li className={type === 'wishlist'?'active':''}
					onClick={()=>setType('wishlist')}>관심 목록</li>
					<li className={type === 'recent'?'active':''}
					onClick={()=>setType('recent')}>최근 본 글</li>
				</ul>
				{type === 'wishlist' &&
					<div className='btnContainer'>
					<button className={toggle === 'community'?'btnActive':''}
					onClick={()=>setToggle('community')}>커뮤니티</button>
					<button className={toggle === 'usedgoods'?'btnActive':''}
					onClick={()=>setToggle('usedgoods')}>중고장터</button>
					</div>
				}
				{toggle === 'community' ? (
					dummyData.community.map((item) => (
					<GoodsList key={item.num} title={item.title} status={item.category} img={item.img} />
				))
				) : type !== 'recent' ? (
					dummyData.market.map((item) => (
					<GoodsList key={item.num} title={item.title} status={item.category} img={item.img} />
				))
				) : (
					dummyData.recent.map((item) => (
					<GoodsList key={item.num} title={item.title} status={item.category} img={item.img} />
				))
				)}
			</section>
		</main>
	);
}

export default MyWishlist;