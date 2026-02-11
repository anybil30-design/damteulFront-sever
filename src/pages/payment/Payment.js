import React, {useState} from 'react';
import { useLocation } from 'react-router-dom';
import './styles/payment.css';
import { useNavigate } from 'react-router-dom';


const Payment = () => {

  const [payment, setPayment] = useState(false);
  const navigate = useNavigate();

  const location = useLocation();
  // GoodsDetail에서 state값으로 goods보냄
  const goods = location.state?.goods;

  if(!goods){
    return <p>결제할 상품 정보가 없습니다.</p>
  }

  return (
    <main>
      {payment &&
        <div className='deletePopup'> 
        <div className='deleteModal'>
          <p>결제가 완료되었습니다!</p>
          <div className='deleteBtn'>
            <button onClick={()=>navigate(-1)}>확인</button>
          </div>
        </div>
      </div>
      }
      
      <section className='payment'>
        {/* 주문상품 영역 */}
        <div className='productOrder'>
          <h3>주문상품</h3>
          <div className='productOrderForm'>
            <img src='https://placehold.co/600x400' alt='주문상품 이미지'/>
            <div>
              <p>{goods.title}</p>
              <span>{goods.price.toLocaleString()}원</span>
            </div>
          </div>
        </div>

        {/* 거래방법 */}
        <div className='transactionType'>
          <h3>거래방법</h3>
          <p>일반택배(선불)</p>
        </div>

        {/* 배송지 입력 */}
        <div className='deliveryAddress'>
          <div className='myAddress'>
            <h3>배송지 입력</h3>
            <span>변경</span>
          </div>
          <div className='myAddressInput'>
            <label htmlFor='shippingAddress'>배송지 입력란</label>
            <input type='text' 
            id='shippingAddress' 
            aria-label='배송지 입력란'
            placeholder='(03192)서울특별시 종로구 수표로 96 국일관드림팰리스 2층'/>
          </div>
        </div>

        {/* 결제수단 */}
        <div className='paymentMethod'>
          <h3>결제수단</h3>
          <p>
          <input type='radio' id='option1' value='easypay' name='paymentmethod'/>
          <label htmlFor='option1'>담뜰 간편결제</label>
          </p>
          <p>
          <input type='radio' id='option2' value='credit' name='paymentmethod'/>
          <label htmlFor='option2'>신용카드 결제</label>
          </p>
          <p>
          <input type='radio' id='option3' value='phone' name='paymentmethod'/>
          <label htmlFor='option3'>휴대폰결제</label>
          </p>
          <p>
          <input type='radio' id='option4' value='transfer' name='paymentmethod'/>
          <label htmlFor='option4'>계좌이체</label>
          </p>
        </div>

        {/* 결제금액 */}
        <div className='paymentAmount'>
          <h3>결제금액</h3>
          <p>
            <span>상품금액</span>
            <span>{goods.price.toLocaleString()}원</span>
          </p>
          <p>
            <span>배송비</span>
            <span>4,000원</span>
          </p>
          <hr />
          <p>
            <span>총 결제 금액</span>
            <span>{(goods.price+4000).toLocaleString()}원</span>
          </p>
          <p>
            <span>주문 내용을 확인했으며 결제에 동의합니다.</span>
            <span className='moreInfo'>자세히</span>
          </p>
          <p>
            <span>회원님의 개인정보는 안전하게 관리됩니다.</span>
            <span className='moreInfo'>자세히</span>
          </p>
          <p>담뜰은 통신판매중개자로, 업체 배송 상품의 상품/상품정보/거래 등에 대한 책임은 담뜰이 아닌 판매자에게 있습니다.</p>
        </div>
        <button onClick={()=>setPayment(true)}>결제하기</button>
      </section>
    </main>
  );
};

export default Payment;