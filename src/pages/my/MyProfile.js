import React, {useState} from 'react';
import { useEffect } from 'react';
import api from 'app/api/axios';
import './styles/myProfile.css';
import { CiCircleInfo } from "react-icons/ci";
import { Link } from 'react-router-dom';
import { getUserId } from '../../components/getUserId/getUserId';


function MyProfile(props) {

  const [userData, setUserData] = useState({});
	
	// profile.controllers에서 유저정보 가져오기
  useEffect(()=>{
    const userId = getUserId();
    const getProfile =async()=>{
      if(!userId) {
        console.error('로그인 정보가 없습니다.');
        return;
      }
      try{
        const res = await api.get(`/api/profile/${userId}`);
        console.log('API 응답 데이터:', res.data);
        setUserData(res.data);
      }catch(err){
        console.error('프로필 조회 실패:', err);
      }
    }; getProfile();
  },[]);;

	// 사용자 가입날짜 string 변경하기
	const formatData = (dateString) => {
		if (!dateString) return "";
		const date = new Date(dateString);
		const year = date.getFullYear();
		const month = date.getMonth()+1;
		const day = date.getDate();
		return `${year}년 ${month}월 ${day}일 가입`;
	}
	// 더미데이터 추후삭제예정
	const dummyData = [
  { id: 1, name: '빈티지 체어', price: '35,000원', img:`${process.env.PUBLIC_URL}/images/dummy/chair.jpg` },
  { id: 2, name: '중고 게이밍 키보드', price: '42,000원', img:`${process.env.PUBLIC_URL}/images/dummy/keyboard.jpg` },
  { id: 3, name: '감성 캠핑 랜턴', price: '18,500원', img:`${process.env.PUBLIC_URL}/images/dummy/lanturn.jpg` },
  { id: 4, name: '미개봉 무선 이어폰', price: '89,000원', img:`${process.env.PUBLIC_URL}/images/dummy/earset.jpg`},
  { id: 5, name: '원목 독서대', price: '12,000원', img:`${process.env.PUBLIC_URL}/images/dummy/bookstand.jpg`},
  { id: 6, name: '스마트 워치 스트랩', price: '5,500원', img:`${process.env.PUBLIC_URL}/images/dummy/watch.jpg`},
	];

	return (
		<main>
			<section className='myProfile'>
				<div className='myProfileCheck myContainer'>
					<h3>
            <img src={`${process.env.PUBLIC_URL}/images/defaultProfile.png`} alt='사용자 이미지'/>
          </h3>
					<div className='myProfileCheckAlign'>
								<p>{userData?.user_nickname}</p>
								<img
									src={userData?.level_code ? `${process.env.PUBLIC_URL}/images/level0${userData.level_code+1}.png` : `${process.env.PUBLIC_URL}/images/level01.png`}
									alt='사용등급'
									onError={(e)=>{ e.target.src = `${process.env.PUBLIC_URL}/images/level01.png`; }}
								/>
					</div>
					<p>{formatData(userData.created_at)}</p>
					<Link to='/myprofileedit' title='프로필 수정페이지로 이동'
					>프로필 수정</Link>
				</div>
				{/* 유저 사용등급 영역 */}
				<div className='myUserClass myContainer'>
					<CiCircleInfo />
					<img
						src={userData?.level_code ? `${process.env.PUBLIC_URL}/images/level0${userData.level_code+1}.png` : `${process.env.PUBLIC_URL}/images/level01.png`}
						alt='사용자 이미지'
						onError={(e)=>{ e.target.src = `${process.env.PUBLIC_URL}/images/level01.png`; }}
					/>
					<p>{userData?.user_nickname}님은 <span>준비된 이웃</span> 입니다</p>
				</div>
				{/* 판매물품 영역 */}
				<div className='myContainer mySell'>
					<h3>판매물품</h3>
					<div className='mySwipeContainer'>
						{dummyData.map((item)=>(
							<div className='mySwipeItem'
							key={item.id}>
							<img src={item.img} alt={item.name}/>
							<p>{item.name}</p>
							<p>{item.price}</p>
						</div>
						))}
						
					</div>
				</div>
				<div className='userReviewWrapper'>
					<h3>거래후기</h3>
					{/* CLASS userReview MAP */}
					<div className='userReview'>
						<img src={`${process.env.PUBLIC_URL}/images/dummy/profile1.jpg`} alt='리뷰어 이미지'/>
						<div className='userReviewContent'>
							<h4>유저네임</h4>
							<span>구매자</span>
							<p>온라인 티켓구매가 처음이었는데. 자세히 설명해주셔서 감사했어요.</p>
						</div>
					</div>
					<div className='userReview'>
						<img src={`${process.env.PUBLIC_URL}/images/dummy/profile2.jpg`} alt='리뷰어 이미지'/>
						<div className='userReviewContent'>
							<h4>유저네임</h4>
							<span>구매자</span>
							<p>다음번에도 구매할게요!</p>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}

export default MyProfile;