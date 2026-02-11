import React,{useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import api from 'app/api/axios';
import { API_ORIGIN } from 'app/api/apiOrigin';
import { Link } from 'react-router-dom';
import { IoIosMore } from 'react-icons/io';
import { getUserId } from 'components/getUserId/getUserId';
import { FaUser } from "react-icons/fa";
import './styles/nanumDetail.css';

function NanumDetail(props) {

		// 더보기버튼 상태변수
		const [isOpen, setIsOpen] = useState(false);
		// 응모완료 상태변수
		const [clearIsOpen, setClearIsOpen] = useState(false);

		const {nanum_id} = useParams();
		const [post, setPost] = useState(null);
		const myUserId = Number(getUserId());

		// 현재 게시글 나눔인지 이벤트인지 판단
		const isEvent = post && post.event_id !== undefined;

		//응모 남은 시간 상태변수
		const [timeLeft, setTimeLeft] = useState("");
	// 남은 시간 타이머
	const getRemainingTimer = (endTime) => {
		const total = new Date(endTime) - new Date();
		
		if (total <= 0) return "00:00:00";

		// 시, 분, 초 계산
		const seconds = Math.floor((total / 1000) % 60);
		const minutes = Math.floor((total / 1000 / 60) % 60);
		const hours = Math.floor((total / (1000 * 60 * 60)));

		// 두 자릿수 유지 (padStart 사용)
		const h = String(hours).padStart(2, '0');
		const m = String(minutes).padStart(2, '0');
		const s = String(seconds).padStart(2, '0');

		return `${h}:${m}:${s}`;
	};

	//게시 시간 타이머
	const getTimeDiff = (date) => {
		const start = new Date(date);
		const now = new Date();
		const diff = (now - start) / 1000 / 60; // 분 단위 차이

		if (diff < 60) {
			return `${Math.floor(diff)}분 전`;
		} else if (diff < 1440) {
			return `${Math.floor(diff / 60)}시간 전`;
		}else{
			return `${Math.floor(diff / 1440)}일 전`;
		}
	};

	// 응모 처리 함수
	const handleApply = async () => {
		try {
			const user_id = "11"; // 로그인 세션에서 가져오거나 임시 ID 사용
			const response = await api.post("/api/nanum/apply", {
				nanum_id: nanum_id,
				user_id: user_id
			});

			if (response.status === 200) {
				setClearIsOpen(true); // 성공 시 모달 오픈
			}
		} catch (err) {
			console.error("응모 실패 : ", err);
			alert("이미 응모했거나 응모 처리 중 오류가 발생했습니다.");
		}
	};

	const handleDelete = async () => {
		if (!window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) return;
		try {
			const res = await api.delete(`/api/nanum/${nanum_id}`);
			if (res.data?.ok || res.status === 200) {
				alert('삭제되었습니다.');
				window.location.href = '/';
			} else {
				console.error('삭제 실패 응답:', res.data);
				alert('삭제에 실패했습니다.');
			}
		} catch (err) {
			console.error('삭제 실패 : ', err);
			alert('삭제 중 오류가 발생했습니다.');
		}
	};
		//남은 시간 갱신
		useEffect(() => {
			if (!post || isEvent || !post.end_nanum) return;

			// 1초마다 타이머 갱신
			const timer = setInterval(() => {
				setTimeLeft(getRemainingTimer(post.end_nanum));
			}, 1000);

			return () => clearInterval(timer); // 언마운트 시 정리
		}, [post, isEvent]);

		// 데이터 받아오기
		useEffect(()=>{
			const getDetail = async()=>{
				try{
					const response = await api.get(`/api/nanum/${nanum_id}`);
					setPost(response.data);
				}catch(err){
					console.error("데이터 로드 실패 : ", err);
				}
			};
			getDetail();
		},[nanum_id]);
		if(!post) return <div>로딩중...</div>;

		// 이미지 설정
		const imgBase = API_ORIGIN;
		let nanumImages = [];

		if (post && post.images) {
		console.log("📥 API에서 받은 post.images:", post.images);
		const raw = Array.isArray(post.images) ? post.images : [post.images];
		
		nanumImages = raw.map(item => {
			if (!item) return "";
			
			if (typeof item === 'object') {
				return item.image_url || item.url || "";
			}
			
			return String(item);
		})
		.filter(url => url && typeof url === 'string' && !url.includes('[object Object]'))
		.map(url => url.replace('/src/uploads', '/uploads'));

		console.log("🎯 처리된 nanumImages:", nanumImages);
		console.log("🔗 최종 이미지 URL:", nanumImages.map(img => `${imgBase}${img}`));
	}

	return (
		<main>
			{/* 응모완료 모달 */}
			{clearIsOpen&&
				<div className='clearedModalWrapper'>
					<div className='clearedModal'>
						<p>응모가 완료되었습니다!</p>
						<button onClick={()=>setClearIsOpen(false)}>확인</button>
					</div>
				</div>
			}
			<section className='nanumDetail'>
				{/* 게시자 정보 영역 */}
				<div className='postUser'>
					<img src={post.profile ? `${imgBase}${post.profile}` : `${process.env.PUBLIC_URL}/images/defaultProfile.png`} alt='사용자 프로필' onError={(e) => { e.target.src = `${process.env.PUBLIC_URL}/images/defaultProfile.png`; }}/>
					<p>{isEvent ? '관리자' : post.user_nickname}</p>
					<img
						src={`${process.env.PUBLIC_URL}/images/level0${Number(post.level_code || 0) + 1}.png`}
						alt='회원등급'
						onError={(e) => { e.target.src = `${process.env.PUBLIC_URL}/images/level01.png`; }}
					/>
					<IoIosMore className='moreBtn'
					onClick={()=>{setIsOpen(!isOpen)}}/>
					{isOpen && 
					<div className='moreAction'>
					<p>관심없음</p>
					<span></span>
					<Link to='' title='신고페이지로 이동'>신고하기</Link>
				</div>
					}
				</div>

				{/* 스와이퍼 이미지 영역 */}
				<div className='mainImg swipeContainer'>
				{nanumImages.length > 0 ? (
					nanumImages.map((img, idx) => {
						const fullUrl = `${imgBase}${img}`;
						console.log(`🖼️ 이미지 ${idx + 1} 최종 URL:`, fullUrl);
						return (
							<div className='goodsItem' key={idx}>
								<img 
									src={fullUrl} 
									alt={`나눔이미지 ${idx + 1}`}
									onError={(e) => { 
										console.error(`❌ 이미지 ${idx + 1} 로드 실패:`, fullUrl);
										e.target.src = 'https://placehold.co/390x430'; 
									}}
									onLoad={(e) => {
										console.log(`✅ 이미지 ${idx + 1} 로드 성공:`, fullUrl);
									}}
								/>
							</div>
						);
					})
				) : (
					<div className='goodsItem'>
						<img src='https://placehold.co/390x430' alt='이미지 없음'/>
					</div>
				)}
			</div>
			<div className='goodsInfo'>
				<h3>{post.title}</h3>
				<p>{getTimeDiff(post.created_at)} &#10072; 나눔</p>
				{!isEvent && <p>{timeLeft}</p>}
				
				{/* 좋아요/댓글 */}
				<div className='reaction'>
					<p>
					<FaUser />nnn
					</p>
				</div>
			</div>

			<div className='usedInfo'>
				<p>
					{post.content}
				</p>
			</div>

			<div className='bottomBtn nanumBtnCustom'>
					{Number(myUserId) === Number(post.user_id) ? (
						<>
							<button onClick={handleDelete}>삭제하기</button>
							<Link to={`/nanum/edit/${post.nanum_id}`}><button>수정하기</button></Link>
						</>
					) : (
						<button onClick={handleApply}>응모하기</button>
					)}
					</div>
		</section>
	</main>
	);
}

export default NanumDetail;