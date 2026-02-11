import React,{useState} from 'react';
import './styles/deleteAccount.css';

function DeleteAccount(props) {
	const [popup, setPopup] =useState(false);

	return (
		<main>
			<form className='DeleteAccount' id='deleteForm'>
				<p>안전한 탈퇴를 위해 본인 확인이 필요합니다</p>
				<p>
					<label>이름</label>
					<input type='text'
					placeholder='이름을 입력해주세요'
					required/>
				</p>
				<p>
					<label>전화번호</label>
					<input type='number'
					placeholder="'~'없이 번호만 입력해주세요"
					required/>
				</p>
				<p>
					<label>탈퇴사유</label>
					<select>
						<option value=''></option>
						<option value=''></option>
						<option value=''></option>
						<option value=''></option>
						<option value=''></option>
					</select>
				</p>
				<button type='button'
				onClick={()=>setPopup(true)}>탈퇴하기</button>
				
			</form>
			{/* 탈퇴하기 모달 서식은 config2.scss*/}
				{popup && 
					<div className='deletePopup'>
					<div className='deleteModal'>
						<p>탈퇴 하시겠습니까?</p>
						<div className='deleteBtn'>
							<button onClick={()=>setPopup(false)}>취소</button>
							<button type='submit' form='deleteForm'>탈퇴하기</button>
						</div>
					</div>
					</div>
				}
		</main>
	);
}

export default DeleteAccount;