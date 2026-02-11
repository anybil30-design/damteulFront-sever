// src/app/router/routes.js

// 로그인 가드
import {
  RequireUserAuth,
  RedirectIfUserAuthed,
  RequireAdminAuth,
  RedirectIfAdminAuthed,
} from "app/router/guards";

// 고정할 헤더 푸터 (경우의 수)
import TabsLayout from "layouts/TabsLogoLayout";
import NoTabsTitleLayout from "layouts/NoTabsTitleLayout";
import NoTabsBackLayout from "layouts/NoTabsBackLayout";
import FullLayout from "layouts/FullLayout";
import AdminIndex from "pages/admin/AdminIndex";


// path모음
// 1) 상단헤더(로고) + 하단탭O (TabsLayout)
import HomePage from "pages/home/HomePage";
import Community from "pages/community/Community";
import Event from "pages/event/Event";
import Nanum from "pages/nanum/Nanum";
import Chat from "pages/chat/Chat";
import MyPage from "pages/my/MyPage";
import MyProfile from 'pages/my/MyProfile';
import Payment from 'pages/payment/Payment';

// 2) 상단헤더(뒤로가기+제목) + 하단탭X (NoTabsTitleLayout)
import Support from 'pages/my/Support';
import Faq from 'pages/my/Faq';
import ContactUs from 'pages/my/ContactUs';
import Reports from 'pages/my/Reports';
import Notice from 'pages/my/Notice';
import NoticeDetail from 'pages/my/NoticeDetail';
import Setting from 'pages/my/Setting';
import ChatRoom from "pages/chat/ChatRoom";
import ChatStart from "pages/chat/ChatStart";

// 3) 상단헤더(뒤로가기) + 하단탭X (NoTabsBackLayout)
import CommWrite from "pages/community/CommWrite";
import CommPost from "pages/community/CommPost";
import GoodsTrade from "pages/goods/GoodsTrade";
import GoodsDetail from 'pages/goods/GoodsDetail';
import NanumPost from 'pages/nanum/NanumPost';
import NanumDetail from 'pages/nanum/NanumDetail';
import EventDetail from 'pages/nanum/EventDetail';
import MyProfileEdit from 'pages/my/MyProfileEdit';
import MyBuynSell from 'pages/my/MyBuynSell';
import MyHistory from 'pages/my/MyHistory';
import MyWishlist from 'pages/my/MyWishlist';
import SearchPage from 'pages/search/SearchPage';
import Alarm from 'pages/alarm/Alarm';
import SubmitReport from 'pages/my/SubmitReport';
import DeleteAccount from 'pages/my/DeleteAccount';


// 4) 상단헤더X + 하단탭O (NoHeaderLayout)

// 5) 상단헤더X + 하단탭X (FullLayout)
import FirstPage from "pages/intro/FirstPage";
import Start from "pages/intro/Start";
import Login from "pages/auth/Login";
import Register from "pages/auth/Register";
import AddressSearch from "pages/auth/AddressSearch";
import CommTag from "pages/community/CommTag";




// 6) 관리자 페이지 (AdminPage)
import AdminLogin from "components/admin/AdminLogin";
import DashboardPage from "components/admin/DashboardPage";
import UserAdminPage from "components/admin/UserAdminPage";
import UserDetailPage from "components/admin/UserDetailPage"; // 새 페이지용
import PostAdminPage from "components/admin/PostAdminPage";
import PostDetailPage from "components/admin/PostDetailPage"; // 새 페이지용
import ReportAdminPage from "components/admin/ReportAdminPage"
import ReportDetailPage from "components/admin/ReportDetailPage"; // 새 페이지용
import TradeAdminPage from "components/admin/TradeAdminPage";
import TradeDetailPage from "components/admin/TradeDetailPage"; // 새 페이지용
import NoticeEventAdminPage from "components/admin/NoticeEventAdminPage";
import NoticeDetailPage from "components/admin/NoticeDetailPage"; // 새 페이지용
import NoticeEventWritePage from "components/admin/NoticeEventWritePage";// 새 페이지용
import EventDetailPage from "components/admin/EventDetailPage"; // 새 페이지용
import CommunityAdminPage from "components/admin/CommunityAdminPage";
import CommunityDetailPage from "components/admin/CommunityDetailPage"; // 새 페이지용








export const routes = [
  // 1) 상단헤더(로고) + 하단탭O (TabsLayout)
  {
    element: (
      <RequireUserAuth>
        <TabsLayout />
      </RequireUserAuth>
    ),
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/community", element: <Community /> },
      { path: "/nanum", element: <Nanum /> },
      { path: "/event", element: <Event /> },
      { path: "/chat", element: <Chat /> },
      { path: "/mypage", element: <MyPage /> },
      { path: "/myprofile", element: <MyProfile /> },
      { path: "/payment", element: <Payment /> }
    ],
  },

  // 2) 상단헤더(뒤로가기+제목) + 하단탭X (NoTabsTitleLayout)
  {
    element: (
      <RequireUserAuth>
        <NoTabsTitleLayout />
      </RequireUserAuth>
    ),
    children: [
      { path: "/mypage/support", element: <Support /> },
      { path: "/mypage/support/faq", element: <Faq /> },
      { path: "/mypage/support/contactus", element: <ContactUs /> },
      { path: "/mypage/support/reports", element: <Reports /> },
      { path: "/mypage/support/notice", element: <Notice /> },
      { path: "/mypage/support/notice/noticedetail", element: <NoticeDetail /> },
      { path: "/mypage/setting", element: <Setting /> },
      { path: "/chat/start/:goods_id", element: <ChatStart /> },
      { path: "/chat/chatroom/:chat_id", element: <ChatRoom /> },


    ],
  },

  // 3) 상단헤더(뒤로가기) + 하단탭X (NoTabsBackLayout)
  {
    element: (
      <RequireUserAuth>
        <NoTabsBackLayout />
      </RequireUserAuth>
    ),
    children: [
      { path: "/community/write", element: <CommWrite /> },
      { path: "/community/post/:id", element: <CommPost /> },
      { path: "/goodstrade", element: <GoodsTrade /> },
      { path: "/goodsdetail/:goods_id", element: <GoodsDetail /> },
      { path: "/nanumpost", element: <NanumPost /> },
      { path: "/nanumdetail/:nanum_id", element: <NanumDetail /> },
      { path: "/eventdetail/:id", element: <EventDetail /> },
      { path: "/myprofileedit", element: <MyProfileEdit /> },
      { path: '/mypage/mybuynsell', element: <MyBuynSell /> },
      { path: "/mypage/myhistory", element: <MyHistory /> },
      { path: "/mypage/mywishlist", element: <MyWishlist /> },
      { path: "/search", element: <SearchPage /> },
      { path: "/alarm", element: <Alarm /> },
      { path: "/submitreport", element: <SubmitReport /> },
      { path: "/mypage/setting/deleteaccount", element: <DeleteAccount /> },
      { path: "/payment/:goods_id", element: <Payment /> }
    ],
  },

  // 4) 상단헤더X + 하단탭O (NoHeaderLayout)
  {
    element: (
      <RequireUserAuth>
        <NoTabsBackLayout />
      </RequireUserAuth>
    ),
    children: [

    ],
  },

  // 5) 상단헤더X + 하단탭X (FullLayout)
  {
    element: <FullLayout />,
    children: [
      {
        path: "/introstart", element: (
          <RedirectIfUserAuthed>
            <Start />
          </RedirectIfUserAuthed>),
      },
      {
        path: "/intro", element: (
          <RedirectIfUserAuthed>
            <FirstPage />
          </RedirectIfUserAuthed>),
      },
      {
        path: "/login",
        element: (
          <RedirectIfUserAuthed>
            <Login />
          </RedirectIfUserAuthed>
        ),
      },
      {
        path: "/register",
        element: (
          <RedirectIfUserAuthed>
            <Register />
          </RedirectIfUserAuthed>
        ),
      },
      {
        path: "/address",
        element: (
          <RedirectIfUserAuthed>
            <AddressSearch />
          </RedirectIfUserAuthed>
        ),
      },

      // 로그인 없을시 진입 X
      {
        path: '/community/tag/:id',
        element: (
          <RequireUserAuth>
            <CommTag />
          </RequireUserAuth>
        )
      },
    ],
  },

  // 6) 관리자 페이지 (AdminPage)
  {
    path: "/admin/login",
    element: (
      <RedirectIfAdminAuthed>
        <AdminLogin />
      </RedirectIfAdminAuthed>
    ),
  },
  {
    path: "/admin",
    element: (
      <RequireAdminAuth>
        <AdminIndex />
      </RequireAdminAuth>
    ),
    children: [
      // /admin 접속 시 처음 보여줄 페이지 (index: true 사용)
      // { index: true, element: <AdminDashboard /> }, 
      { index: true, element: <DashboardPage /> },
      { path: "users", element: <UserAdminPage /> },
      { path: "posts", element: <PostAdminPage /> },
      // { path: "posts/detail/:id", element: <PostDetailPage /> }, // 새 페이지
      { path: "reports", element: <ReportAdminPage /> },
      { path: "trades", element: <TradeAdminPage /> },
      { path: "events", element: <NoticeEventAdminPage /> },
      { path: "community", element: <CommunityAdminPage /> }
    ],
  },

  // ⭐ 사이드바 없는 "단독 관리자 페이지"
  {
    path: "/admin/users/detail/:user_id",
    element: (
      <RequireAdminAuth>
        <UserDetailPage />
      </RequireAdminAuth>
    ),
  },
  {
    path: "/admin/reports/detail/:id",
    element: (
      <RequireAdminAuth>
        <ReportDetailPage />
      </RequireAdminAuth>
    ),
  },
  {
    path: "/admin/trades/detail/:id",
    element: (
      <RequireAdminAuth>
        <TradeDetailPage />
      </RequireAdminAuth>
    ),
  },
  {
    path: "/admin/notice/detail/:id",
    element: (
      <RequireAdminAuth>
        <NoticeDetailPage />
      </RequireAdminAuth>
    ),
  },
  {
    path: "/admin/event/detail/:id",
    element: (
      <RequireAdminAuth>
        <EventDetailPage />
      </RequireAdminAuth>
    ),
  },
  {
    path: "/admin/community/detail/:id",
    element: (
      <RequireAdminAuth>
        <CommunityDetailPage />
      </RequireAdminAuth>
    ),
  },
  {
    path: "/admin/notice/write",
    element: (
      <RequireAdminAuth>
        <NoticeEventWritePage defaultTab="notice" />
      </RequireAdminAuth>
    ),
  },
  {
    path: "/admin/event/write",
    element: (
      <RequireAdminAuth>
        <NoticeEventWritePage defaultTab="event" />
      </RequireAdminAuth>
    ),
  },
  {
    path: "/admin/:cate/detail/:id",
    element: (
      <RequireAdminAuth>
        <PostDetailPage />
      </RequireAdminAuth>
    ),
  },
];