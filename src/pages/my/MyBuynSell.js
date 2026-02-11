import React, {useState} from 'react';
import { useLocation } from 'react-router-dom';
import './styles/myBuynSell.css';
import GoodsList from 'components/GoodsList/GoodsList';


const dummyData = {
  // 판매중 (selling)
  selling: [
    { num: 1, title: '아이패드 에어 5세대', status: '판매중', price: '750,000', img:`${process.env.PUBLIC_URL}/images/dummy/ipad.jpg` },
    { num: 2, title: '로지텍 MX Master 3S', status: '판매중', price: '120,000', img:`${process.env.PUBLIC_URL}/images/dummy/laptop.jpg`},
    { num: 3, title: '소니 WH-1000XM5', status: '판매중', price: '320,000', img:`${process.env.PUBLIC_URL}/images/dummy/headset.jpg` }
  ],
  
  // 구매 (buy)
  buy: [
    { num: 10, title: '닌텐도 스위치 OLED', status: '구매완료', price: '380,000', img:`${process.env.PUBLIC_URL}/images/dummy/switch.jpg` },
    { num: 11, title: '맥북 에어 M2', status: '구매완료', price: '1,450,000', img:`${process.env.PUBLIC_URL}/images/dummy/mac.jpg` },
    { num: 12, title: '킨들 페이퍼화이트', status: '구매완료', price: '150,000', img:`${process.env.PUBLIC_URL}/images/dummy/kindle.jpg` }
  ],
  
  // 거래 완료 (soldout)
  soldout: [
    { num: 21, title: '에어팟 프로 2세대', status: '중고제품', soldout: '', img:`${process.env.PUBLIC_URL}/images/dummy/airpods.jpg`},
    { num: 22, title: '필코 기계식 키보드', status: '중고제품', soldout: '', img:`${process.env.PUBLIC_URL}/images/dummy/keyboard.jpg` },
    { num: 23, title: '다이슨 에어랩', status: '새제품', soldout: '', img:`${process.env.PUBLIC_URL}/images/dummy/dyson.jpg` }
  ]
};

function MyBuynSell(props) {
	const location = useLocation();
	const [type, setType] = useState(location.state?.activeTab ||'selling');

	

	return (
		<main>
			<section className='myBuynSell'>
				<ul className='myTabMenu'>
					<li className={type === 'selling'?'active':''}
					onClick={()=>setType('selling')}>
				판매중
					</li>
					<li className={type === 'buy'?'active':''}
					onClick={()=>setType('buy')}>
						구매
					</li>
					<li className={type === 'soldout'?'active':''}
					onClick={()=>setType('soldout')}>
						거래 완료
					</li>
				</ul>
				{dummyData[type].map((item)=>(
					<GoodsList type={type}
					key={item.num}
					title={item.title}
					status={item.status}
					price={type==='soldout'?null:item.price}
					soldout={type ==='soldout'}
					img={item.img}
					/>
				))}
			</section>
		</main>
	);
}

export default MyBuynSell;