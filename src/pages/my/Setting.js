import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import React,{useState} from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Toggle from 'components/toggle/Toggle';

// 내부서식은 supportList에서 가져옴
function Setting(props) {
	const [searchParams, setSearchParams] = useSearchParams();
	const navigate = useNavigate();

	// 로그아웃,캐시제거 모달 상태변수
	const [logout, setLogout] = useState(false);
	const [cash, setCash] = useState(false);

	// 현재 URL에서 menu가져오기
	const currentMenu = searchParams.get('menu') || 'main';

	// 로그아웃 기능 추가
	const handleLogout = () =>{
		// 로컬스토리지 지우기
		localStorage.removeItem('user_id');
		localStorage.removeItem('loginWelcomeShown');
		// user_id가져오면 삭제
		localStorage.clear();
		alert('로그아웃 되었습니다.');
		navigate('/');
		window.location.reload();
	}


	return (
		<main>
			<section className='supportList'>
				{/* 로그아웃 모달 */}
				{logout &&
					<div className='deletePopup'>
						<div className='deleteModal'>
							<p>로그아웃 하시겠습니까?</p>
							<div className='deleteBtn'>
								<button onClick={()=>setLogout(false)}>취소</button>
								<button onClick={handleLogout}>로그아웃</button>
							</div>
						</div>
					</div>
				}
				{/* 캐시 삭제 모달 */}
				{cash &&
					<div className='deletePopup'>
						<div className='deleteModal'>
							<p>앱 내 모든 미디어 데이터 캐시를 삭제 하시겠습니까?</p>
							<div className='deleteBtn'>
								<button onClick={()=>setCash(false)}>취소</button>
								<button onClick={()=>setCash(false)}>삭제</button>
							</div>
						</div>
					</div>
				}
				<ul>
					{currentMenu === 'main' &&(
						<>
					<li
					onClick={()=>setSearchParams({menu:'alarm'})}>
						<hr/>
						<div className='question'>
							<span>알림 설정</span>
								<FaAngleRight />
						</div>
						<hr/>
					</li>
					<li
					onClick={()=>setSearchParams({menu:'other'})}>
						<hr/>
						<div className='question'>
							<span>기타 설정</span>
								<FaAngleRight />
						</div>
						<hr/>
					</li>
					</>
					)}

					{/* 알림 설정 클릭 시 로딩될 구간 */}
					{currentMenu === 'alarm' &&(
						<>
					<li>
						<hr/>
						<div className='question'>
							<p>찜 알림</p>
							<Toggle id='4'/>
						</div>
						<hr/>
					</li>
					<li>
						<hr/>
						<div className='question'>
							<p>채팅 알림</p>
							<Toggle id='1'/>
						</div>
						<hr/>
					</li>
					<li>
						<hr/>
						<div className='question'>
							<p>댓글 알림</p>
							<Toggle id='2'/>
						</div>
						<hr/>
					</li>
					<li>
						
						<hr/>
						<div className='question'>
							<p>야간 알림</p>
							<Toggle id='3'/>
						</div>
						<hr/>
					</li>
					</>
					)}
					{/* 기타 설정 클릭 시 로딩될 구간 */}
					{currentMenu === 'other' &&(
					<>
					<li onClick={()=>setCash(true)}>
						<hr/>
						<div className='question'>
							<p>캐시 데이터 삭제</p>
						</div>
						<hr/>
					</li>
					<li>
						<hr/>
						<div className='question'>
							<div className='setting'>
							<p>최신버전 업데이트</p>
							<p>최신버전 0.2.2</p>
							</div>
							<div className='setting'>
							<span>0.1.8</span>
							</div>
						</div>
						<hr/>
					</li>
					<li onClick={()=>setLogout(true)}>
						<hr/>
						<div className='question'>
							<p>로그아웃</p>
						</div>
						<hr/>
					</li>
					<li>
						<hr/>
						<Link to='/mypage/setting/deleteaccount' title='회원탈퇴 페이지로 이동'>
						<div className='question'>
							<p>탈퇴하기</p>
						</div>
						</Link>
						<hr/>
					</li>
					</>
					)}
					
				</ul>
				{/* 뒤로가기 버튼 */}
				
				{currentMenu !== 'main' && (logout, cash) === false &&(
					<div
					style={{
						width:'35px',height:'35px',
						background:(logout || cash)?'#808080':'#F2F5F2',
						position:'fixed',
						zIndex:'99999',
						top:'1%',left:'0.5rem',
						display:'flex',alignItems:'center',justifyContent:'center'
					}}>
						<FaAngleLeft
						onClick={()=>navigate(-1)}
						style={{
						fontSize:'1.5rem',
						}}/>
					</div>
					
				)}
			</section>
		</main>
	);
}

export default Setting;