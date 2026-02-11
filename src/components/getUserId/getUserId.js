import { jwtDecode } from 'jwt-decode';

// 토큰에서 user_id 가져오기
export const getUserId = () => {
	const token = localStorage.getItem("userToken");
	if(!token) {
		console.log("getUserId: 토큰이 로컬스토리지에 없음");
		return null;}

	try{
		const decoded = jwtDecode(token);
		console.log("getUserId: 디코딩 성공", decoded);
		return decoded.user_id; //토큰에 담긴 ID 반환
	}catch(error){
		console.error("토큰 파싱 에러 : ", error);
		return null;
	}
};