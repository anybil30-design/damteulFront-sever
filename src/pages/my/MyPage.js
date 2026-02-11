import React,{useState} from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GrShop } from "react-icons/gr";
import { TfiReceipt } from "react-icons/tfi";
import { ImBooks } from "react-icons/im";
import { MdOutlineInsertComment } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import { FaRegClock } from "react-icons/fa";
import { IoMdHeadset } from "react-icons/io";
import { MdOutlineSettings } from "react-icons/md";
import { FaAngleRight } from "react-icons/fa6";
import api from 'app/api/axios';
import './styles/myPage.css';
import { getUserId } from 'components/getUserId/getUserId';



const MyPage = () => {
  // profile.controllers에서 유저정보 가져오기
  const [userData, setUserData] = useState({});
  

  useEffect(()=>{
    const userId = getUserId();
    const getProfile =async()=>{
      if(!userId) return;
      try{
        const res = await api.get(`/api/profile/${userId}`);
        setUserData(res.data);
      }catch(err){
        console.error(err);
      }
    }; getProfile();
  },[]);

  return (
    <main>
      <section className='myPage'>
        {/* 사용자 정보영역 */}
        <div className='myPageUserWrapper'>
          <div className='myPageUser'>
            <h3>
            <img src={`${process.env.PUBLIC_URL}/images/defaultProfile.png`} alt='사용자 이미지'/>
          </h3>
          <Link to='/myprofile' title='내 프로필'>
            <div className='profileCheck'>
            <p>{userData?.user_nickname}</p>
            <img
              src={userData?.level_code ? `${process.env.PUBLIC_URL}/images/level0${userData.level_code+1}.png` : `${process.env.PUBLIC_URL}/images/level01.png`}
              alt='사용등급'
              onError={(e)=>{ e.target.src = `${process.env.PUBLIC_URL}/images/level01.png`; }}
            />
            <FaAngleRight />
            </div>
          </Link>
          </div>
          
          <hr style={{border:'none', borderTop:'1px solid #D7D7D7'}}/>
          <Link to='' title='담뜰페이'>
          <div className='myWallet'>
            <p>담뜰페이</p>
            <div className='myWalletAlign'>
            <p>1,000원</p>
            <FaAngleRight />
            </div>
          </div>
          </Link>
          <div className='payBtn'>
            <button>충전</button>
            <button>송금</button>
          </div>
          
          
          
        </div>
        {/* 사용자 메뉴영역 */}
        <div className='myPageGrid'>
          <div className='myPageMenu'>
            <Link to='/mypage/mybuynsell' title='판매내역'>
            <GrShop />
            <p>판매내역</p>
            </Link>
          </div>
          <div className='myPageMenu'>
            <Link to='/mypage/mybuynsell' title='구매내역'
            state={{activeTab:'buy'}}>
            <TfiReceipt />
            <p>구매내역</p>
            </Link>
          </div>
          <div className='myPageMenu'>
            <Link to='/mypage/myhistory' title='작성글'>
            <ImBooks />
            <p>작성글</p>
            </Link>
          </div>
          <div className='myPageMenu'>
            <Link to='/mypage/myhistory' title='작성댓글'
            state={{activeTab:'mycomment'}}>
            <MdOutlineInsertComment />
            <p>작성댓글</p>
            </Link>
          </div>
          <div className='myPageMenu'>
            <Link to='/mypage/mywishlist' title='관심목록'>
            <FaRegHeart />
            <p>관심목록</p>
            </Link>
          </div>
          <div className='myPageMenu'>
            <Link to='/mypage/mywishlist' title='최근 본 글'
            state={{activeTab:'recent'}}>
            <FaRegClock />
            <p>최근 본 글</p>
            </Link>
          </div>
          <div className='myPageMenu'>
            <Link to='/mypage/support' title='문의사항'>
            <IoMdHeadset />
            <p>문의</p>
            </Link>
          </div>
          <div className='myPageMenu'>
            <Link to='/mypage/setting' title='앱 설정'>
            <MdOutlineSettings />
            <p>앱 설정</p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default MyPage;