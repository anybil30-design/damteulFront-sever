import React from 'react';
import { Link } from 'react-router-dom';
// CSS 서식
import './style/goodsList.css';
import { FaRegHeart } from "react-icons/fa6";
import { FaRegCalendarCheck } from "react-icons/fa6";
import { API_ORIGIN } from 'app/api/apiOrigin';




function GoodsList({linkTo, title, status, price,timer, soldout,likeCount, img }) 
{
	const imgBase = API_ORIGIN;
	// const imgSrc = img ? `${imgBase}${img}` : 'https://placehold.co/130x130';

	const getImgSrc = () => {
		if (!img) return 'https://placehold.co/130x130';
		if (img.startsWith('http') || img.startsWith('/images') || img.startsWith('static') || img.startsWith('/uploads')) {
      return img;
    }
    return `${imgBase}${img}`;
  };

  const imgSrc = getImgSrc();
	return (
		<div>
			<Link 
			to={linkTo}
			className='goodsList'>
							{/* 상품이미지 영역 */}
						<img src={imgSrc} alt='product' onError={(e) => { e.target.src = 'https://placehold.co/130x130'; }}/>
							<div className='goodsListArea'>
								{/* 텍스트 영역 */}
								<div className='goodsListInfo'>
								{/* MyBuynSell에서 sold out 시 h3서식 */}
								<h3
								style={soldout?
								{textDecoration:'line-through',
								color:'#6B6B6B'
								}:{}}>{title}</h3>
								<span>{status}</span>
								{/* sold out에선 price원이 아닌 '거래완료'텍스트 배치 */}
								{price&&<p>{price}원</p>}
								{soldout && <p
								style={{fontSize:'18px',
												fontWeight:'bold',
								}}>거래완료</p>}
								{/* 나눔페이지에서 나올 영역 */}
								{timer&&<p>
								<FaRegCalendarCheck />
								{timer}</p>}
								</div>
								{/* 좋아요 / 댓글 */}
								<div className='goodsReaction'>
									{/* <p><FaRegComment /><span>n</span></p> */}
									<p><FaRegHeart /><span>{likeCount || 0}</span></p>
								</div>
							</div>
						</Link>
		</div>
	);
}

export default GoodsList;