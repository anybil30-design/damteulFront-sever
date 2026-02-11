import React, {useState} from 'react';
import './styles/goodsTrade.css';
import { useNavigate } from 'react-router-dom';
import api from 'app/api/axios';
import { getUserId } from 'components/getUserId/getUserId';
import { FaPlus } from "react-icons/fa";
import { uploadMultiImages } from 'components/uploadImage/uploadMultiImages';


// 서버에 전송할 함수
const createPost = async(data) =>{

	const response = await api.post('/api/goods',data);
	return response.data;

}

function GoodsTrade(props) {
	const navigate = useNavigate();
	const [file,setFile] = useState([]);

	// 폼 입력값 상태변수 생성
	const [formData, setFormData] = useState({
		user_id:'',
		category_id:'',
		title:'',
		conversation_type:'0',
		content:'',
		condition_type:'0',
		defect_note:'',
		price:'',
		status:'0',
	})

	// 입력값 맞춰서 상태 업데이트
	const handleChange = (e) =>{
		const {name, value} = e.target;
		setFormData({
			...formData,
			[name]:value
		});
	}

	// 이미지 선택 함수
	const handleFileChange = (e) =>{
		setFile(Array.from(e.target.files))
	};

	// 폼 제출 시 실행될 함수
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const userId = getUserId();
    let savedImages = []; // 문자열 "" 대신 빈 배열 []로 초기화

    // 이미지 먼저 업로드 후 경로 받아오기
    if (file && file.length > 0) {
      const imagePaths = await uploadMultiImages(file, "goods");
      
      // ✅ .join(',')를 삭제하고 객체 배열 그대로 사용합니다.
      // 만약 imagePaths가 [{url:'...'}, ...] 형태라면 그대로 넣습니다.
      savedImages = imagePaths; 
    }

    // 서버에 보낼 최종 데이터
    const postData = {
      ...formData,
      user_id: userId,
      images: savedImages, // ✅ 이제 데이터가 "[object Object]"가 아닌 진짜 배열로 날아갑니다.
      category_id: Number(formData.category_id),
      price: Number(formData.price),
      conversation_type: Number(formData.conversation_type),
      condition_type: Number(formData.condition_type)
    };

    // 서버전송
    const result = await createPost(postData);

    if (result.ok) {
      alert('글이 정상적으로 등록되었습니다.');
      navigate(`/goodsdetail/${result.id}`);
    }
  } catch (error) {
    console.error("등록 에러 상세:", error);
    alert('등록에 실패했습니다.');
  }
};

	return (
		<main>
			<form className='writeForm'
			onSubmit={handleSubmit}>
				<p>
					<label htmlFor='category_id'>카테고리</label>
					<select
					className='inputForm'
					id='category_id'
					name='category_id'
					value={formData.category_id}
					onChange={handleChange}
					required>
						<option value=''>카테고리를 선택해주세요</option>
						<option value='1'>티켓/교환권</option>
						<option value='2'>의류</option>
						<option value='3'>뷰티/미용</option>
						<option value='4'>유아용품</option>
						<option value='5'>도서</option>
						<option value='6'>스포츠레저</option>
						<option value='7'>디지털기기</option>
					</select>
				</p>
				<p>
					<label htmlFor='title'>제품명</label>
					<input type='text'
					className='inputForm'
					placeholder='제품명을 입력해주세요'
					name='title'
					id='title'
					value={formData.title}
					onChange={handleChange}
					required/>
				</p>
				<p>
					<label htmlFor='conversation_type'>대화여부</label>
					<select className='inputForm'
					id='conversation_type'
					name='conversation_type'
					value={formData.conversation_type}
					onChange={handleChange}
					required>
						<option value='0'>대화불가</option>
						<option value='1'>대화가능</option>
					</select>
				</p>
				<p>
					<label htmlFor='content'>자세한 설명</label>
					<textarea  type='textarea'
					id='content'
					name='content'
					className='inputForm'
					placeholder='자세한 설명을 입력해주세요'
					maxLength='500'
					value={formData.content}
					onChange={handleChange}
					>
					</textarea>
				</p>

		{/* 이미지 선택 버튼과 미리보기 영역 */}
		{/* 이미지 업로드 및 미리보기 영역 */}
		<div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
  	{/* 업로드 버튼 */}
		<label className='fileWrapper' htmlFor='fileUpload'>
			<input 
				type='file'
				id='fileUpload'
				name='fileUpload'
				onChange={handleFileChange}
				className='file'
				multiple
				accept="image/*"
			/>
			<FaPlus />
    	{file.length}/10
  	</label>

  {/* 미리보기 리스트 */}
  <div className="previewWrapper">
    {file.map((f, index) => (
      <div key={index} className="previewItem" style={{ position: 'relative' }}>
        <img 
          src={URL.createObjectURL(f)} 
          alt={`preview-${index}`} 
          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }} 
        />
        {/* 삭제 버튼: 필요하면 유지, 아니면 삭제 가능 */}
        <button 
          type="button"
          onClick={() => setFile(file.filter((_, i) => i !== index))}
          style={{ 
            position: 'absolute', top: '-5px', right: '-5px', 
            background: '#ff4d4f', color: '#fff', border: 'none', 
            borderRadius: '50%', width: '18px', height: '18px', 
            fontSize: '12px', cursor: 'pointer', display: 'flex',
            justifyContent: 'center', alignItems: 'center'
          }}
        >
          ✕
        </button>
      </div>
    ))}
  </div>
</div>
				<p>
					<label htmlFor='condition_type'>제품 상태</label>
					<select className='inputForm'
					name='condition_type'
					id='condition_type'
					onChange={handleChange}
					required>
						<option value='0'>중고제품</option>
						<option value='1'>새상품</option>
					</select>
				</p>
				{/* 제품상태 - 중고제품 선택했을 때 나오는 영역 */}
				<div className='writeForm'>
					{/* <label className='fileWrapper fileOrange' 
					htmlFor='fileUpload'>
					<input type='file'
					id='fileUpload'
					className='file'
					required/>
						<img src='https://placehold.co/30x30' alt=''/>
						n/5
				</label> */}
					<p>
					<label htmlFor='defect_note'>자세한 설명</label>
					<textarea  type='textarea'
					className='inputForm'
					name='defect_note'
					id='defect_note'
					value={formData.defect_note}
					onChange={handleChange}
					placeholder='자세한 설명을 입력해주세요'
					maxLength='500'
					>
					</textarea>
					</p>
				</div>
				<p>
					<label>거래 희망 장소</label>
					{/* 주소 api들어갈 자리 */}
				</p>
				<p>
					<label htmlFor='price'>금액</label>
					<span className='tradePrice'>
					<input type='number'
					className='inputForm'
					id='price'
					name='price'
					value={formData.price}
					onChange={handleChange}
					required/>
					<span>원</span>
					</span>
				</p>

				<div className='bottomBtn'>
				<button onClick={()=>navigate(-1)}>취소하기</button>
				<button type='submit'>완료</button>
				</div>
			</form>
		</main>
	);
}

export default GoodsTrade;