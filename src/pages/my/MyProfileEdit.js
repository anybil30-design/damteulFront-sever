import React, {useState} from 'react';
import { useEffect } from 'react';
import './styles/myProfileEdit.css';
import { useNavigate } from 'react-router-dom';
import api from 'app/api/axios';
import { getUserId } from '../../components/getUserId/getUserId';
import { FaCamera } from "react-icons/fa";


function MyProfileEdit(props) {
	const navigate = useNavigate();
	const handleSubmit = (e) =>{
		e.preventDefault();
		navigate(-1);
	}
  const [userData, setUserData] = useState({});
	const [newNickname, setNewNickname] = useState("");
	
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
        setUserData(res.data);
        console.log('프로필 데이터:', res.data);
      }catch(err){
        console.error('프로필 조회 실패:', err);
      }
    }; getProfile();
  },[])
	
	// 전화번호 포맷팅 함수
	const formatPhoneNumber = (phone) => {
		if (!phone) return '';
		const phoneStr = String(phone).replace(/[^0-9]/g, '');
		if (phoneStr.length === 11) {
			return `${phoneStr.slice(0, 3)}-${phoneStr.slice(3, 7)}-${phoneStr.slice(7)}`;
		}
		return phoneStr;
	};
	
	// 닉네임 변경 함수
	const handleUpdateNickname = async () => {
		const userId = getUserId();
		if (!newNickname.trim()) return alert("닉네임을 입력해주세요.");
		if (!userId) return alert("로그인 정보가 없습니다.");

		try {
			const response = await api.put("/api/profile/nickname", {
				user_id: userId,
				newNickname: newNickname,
			});

			if (response.status === 200) {
				alert("닉네임이 성공적으로 변경되었습니다!");
				navigate(-1);
			}
		} catch (err) {
			console.error("닉네임 변경 실패:", err);
			alert("이미 존재하는 닉네임이거나 바꿀 수 없습니다.");
		}
	};
	return (
		<main>
			<form className='myProfileEdit'
			onSubmit={handleSubmit}>
				<div className='editUser'>
					<img src={`${process.env.PUBLIC_URL}/images/defaultProfile.png`} alt='내 프로필'/>
					<label htmlFor='editProfile'
					className='fileWrapper'>
					<input type='file'
					id='editProfile'
					className='file'/>
					<FaCamera />
					</label>
				</div>
				<p>
					<label htmlFor='username' className='userName'>닉네임</label>
					<input type='text'
					placeholder='사용할 닉네임을 입력해주세요'
					id='username'
					className='inputForm'
					value={newNickname}
					onChange={(e)=> setNewNickname(e.target.value)}
					required/>
				</p>
				
				{/* 동네 범위 재설정 보류 */}
				<hr style={{
					margin:'20px 0',
					marginLeft:'calc(-50vw + 50%)',
					width:'100vw',
					border:'none',
					borderTop:'1px solid #D7D7D7'
				}}></hr>

				{/* 사용자 정보표시영역 */}
				<div className='checkProfile myContainer'>
					<dl>
						<div className='checkProfileItem'>
						<dt>이름</dt>
						<dd>{userData.user_name}</dd>
						</div>
						<div className='checkProfileItem'>
						<dt>전화번호</dt>
						<dd>{formatPhoneNumber(userData.user_phone)}</dd>
						</div>
						<div className='checkProfileItem'>
						<dt>내 동네</dt>
						<dd>{userData.address}</dd>
						</div>
					</dl>
				</div>
				<button type='submit'
				onClick={handleUpdateNickname}>변경 완료</button>
			</form>
		</main>
	);
}

export default MyProfileEdit;