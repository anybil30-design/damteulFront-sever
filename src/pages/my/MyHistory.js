import React, {useState} from 'react';
import { Link,useLocation } from 'react-router-dom';
import './styles/myHistory.css';
import GoodsList from 'components/GoodsList/GoodsList';

// 확인용 더미데이터 추후 삭제예정
const dummyData = {
  // 커뮤니티 작성글 (community)
  community: [
    { num: 1, title: '오늘 하늘 보셨나요? 진짜 예쁘네요', category: '자유게시판', price: null, img:`${process.env.PUBLIC_URL}/images/dummy/sky.jpg` },
    { num: 2, title: '동네 맛집 추천해주세요!', category: '질문/답변', price: null, img:`${process.env.PUBLIC_URL}/images/dummy/pizza.jpg` },
    { num: 3, title: '이번 주말에 플로깅 하실 분 구합니다', category: '모임', price: null, img:`${process.env.PUBLIC_URL}/images/dummy/jogging.jpg` }
  ],
  
  // 중고거래 작성글 (usedgoods)
  usedgoods: [
    { num: 10, title: '에어팟 맥스 실버 풀박스 판매합니다', category: '디지털기기', price: '450,000',img:`${process.env.PUBLIC_URL}/images/dummy/airpods.jpg` },
    { num: 11, title: '이케아 서랍장 나눔해요', category: '가구/인테리어', price: '0',img:`${process.env.PUBLIC_URL}/images/dummy/drawer.jpg` },
    { num: 12, title: '캠핑용 의자 2개 세트', category: '스포츠/레저', price: '30,000',img:`${process.env.PUBLIC_URL}/images/dummy/camping.jpg` }
  ]
};

function MyHistory(props) {
	const location = useLocation();
	const [type, setType] = useState(location.state?.activeTab ||'mypost');
	const [toggle, setToggle] = useState('community');


	return (
		<main>
			<section className='myHistory'>
				<ul className='mymyTabMenu'>
					<li className={type === 'mypost'?'active':''}
							onClick={()=>setType('mypost')}>
						작성글
					</li>
					<li className={type === 'mycomment'?'active':''}
					onClick={()=>setType('mycomment')}>
						작성댓글
					</li>
				</ul>
				{/* className='btnContainer는 home의 main.scss 첨부 */}
				{type === 'mypost'&&
					<div className='btnContainer'>
						<button className={toggle === 'community'?'btnActive':''}
						onClick={()=>setToggle('community')}>커뮤니티</button>
						<button className={toggle === 'usedgoods'?'btnActive':''}
						onClick={()=>setToggle('usedgoods')}>중고장터</button>
				</div>
				}
				{/* 작성글 토글 시 하단 리스트 컴포넌트 표시 */}
				{type === 'mypost' &&
					dummyData[toggle].map((item)=>(
						<GoodsList 
						key={item.num}
						status={item.category}
						title={item.title}
						price={item.price}
						img={item.img}
						// 링크값은 수정필요
						// linkTo={`/${item.num}`}
						/>
					))
				}
				{/* 작성댓글 토글 시 하단 리스트로 맵만 돌리면 됨 */}
				{type === 'mycomment' &&
					<Link to='/' title='작성 댓글'
					className='myComment'>
					<div>
					<img src={`${process.env.PUBLIC_URL}/images/dummy/airpods.jpg`} alt='제품이미지'/>
					<div>
						<p>지은마켓님이 댓글을 남겼습니다</p>
						<p>그거 어디서 구매가능?</p>
					</div>
					</div>
					
					<p>36분 전</p>
					</Link>					
				}
				
				

			</section>
		</main>
	);
}

export default MyHistory;