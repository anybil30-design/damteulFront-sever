import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import api from 'app/api/axios';
import { getUserId } from 'components/getUserId/getUserId';
import { FaPlus } from "react-icons/fa";

function NanumPost(props) {

	const [form, setForm] =useState({
		title:'',
		content:''
	})
	const [file, setFile] = useState([]);
	const handleChange =(e)=>{
		const {name, value} = e.target;
		setForm({
			...form,
			[name]:value
		});
	};

	// 이미지 선택 함수
	const handleFileChange = (e) =>{
		setFile(Array.from(e.target.files))
	};
	const handleSubmit= async(e)=>{
		e.preventDefault();

		try {
			// 로그인된 사용자 ID 가져오기
			const storeUserId = getUserId();
			if (!storeUserId) {
				alert('로그인이 필요합니다.');
				return;
			}

			let savedImages = [];

			// 이미지 먼저 업로드 후 경로 받아오기 (app.js의 통합 API 사용)
			if (file && file.length > 0) {
				const formData = new FormData();
				Array.from(file).forEach((f) => {
					formData.append("images", f);
				});

				const uploadRes = await api.post('/api/upload/multi/nanum', formData, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
				});

				if (uploadRes.data.success) {
					savedImages = uploadRes.data.files;
					console.log("📤 업로드된 이미지:", savedImages);
				}
			}

			// 서버에 보낼 최종 데이터
			const postData = {
				user_id: storeUserId,
				title: form.title,
				content: form.content,
				images: savedImages,
				status: 0
			};

			const response = await api.post('/api/nanum', postData);
			if(response.status === 200){
				// 나눔글 번호 추출
				const {nanum_id} = response.data;
				alert('등록 완료');
				navigate(`/nanumdetail/${nanum_id}`)
			}
		}catch(err){
			console.error(err);
			alert('등록 중 오류가 발생했습니다.');
		}
	};
	const navigate = useNavigate();
	return (
		<main>
			<section>
				<form className='writeForm' onSubmit={handleSubmit}>
					<p>
						<label htmlFor='title'>제목</label>
						<input type='text'
						className='inputForm'
						placeholder='제목을 입력해주세요'
						name='title'
						id='title'
						value={form.title}
						onChange={handleChange}
						required/>
					</p>
					<p>
						<label htmlFor='content'>내용</label>
						<textarea  type='textarea'
						className='inputForm'
						placeholder='내용을 입력해주세요'
						maxLength='500'
						id='content'
						name='content'
						value={form.content}
						onChange={handleChange}
						required>
						</textarea>
					</p>
					<label className='fileWrapper' 
						htmlFor='fileUpload'>
						<input type='file'
						id='fileUpload'
						className='file'
						multiple
						onChange={handleFileChange}
						/>
							<FaPlus />
							{file.length}/10
					</label>

					
					<p style={{color:'6B6B6B',fontSize:'14px'}}>&middot;게시한 시점으로부터 12시간동안 응모가 진행됩니다.</p>
					<div className='bottomBtn'>
					<button onClick={()=>navigate(-1)}>취소하기</button>
					<button type='submit'>완료</button>
					</div>
					</form>
			</section>
		</main>
	);
}

export default NanumPost;