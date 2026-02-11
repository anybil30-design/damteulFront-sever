import React from 'react';


function DeleteModal(props) {

	// 게시자가 더보기 버튼 클릭 후 '삭제하기'클릭 시 나올 모달
	// CSS는 __config2.scss에 '삭제 모달 서식' 확인


	return (
		<>
			<div className='deletePopup'>
				<div className='deleteModal'>
					<p>정말 삭제하시겠습니까?</p>
					<div className='deleteBtn'>
						<button>취소</button>
						<button>삭제하기</button>
					</div>
				</div>
			</div>
		</>
	);
}

export default DeleteModal;