import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Outline from './pages/Outline';
import Login from './pages/Login';
import Tos from './pages/Tos';
import Signup from './pages/Signup';
import Home from './pages/user/Home';
import SideBar from './component/MypageCompo/SideBar';
import FreeWriting from './component/MypageCompo/FreeWriting';
import SalesWriting from './component/MypageCompo/SalesWriting';
import MyPosts from './component/MypageCompo/MyPosts';
import PaidPosts from './component/MypageCompo/PaidPosts';
import ChargedPointList from './component/MypageCompo/ChargedPointList';
import RefundList from './component/MypageCompo/RefundList';
import UserInfoChange from './component/MypageCompo/UserInfoChange';
import UserInfo from './component/MypageCompo/UserInfo';
import Mypage from './pages/user/Mypage';
import Mainpage from './pages/user/Mainpage';
import FreeBoard from './pages/content/contentBoard/FreeBoard';
import PostList from './pages/user/PostList';
import Post from './pages/user/Post';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Outline />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="tos" element={<Tos />} />
          <Route path="signup" element={<Signup />} />
          <Route path="main">
            <Route index element={<Mainpage />} />
            <Route path="search">
              <Route index element={<PostList />} />
              <Route path=":postId" element={<Post />} />
            </Route>
          </Route>
          {/* 유료게시글, 무료게시글 */}
          <Route path="freeboard" element={<FreeBoard />} />
          <Route path="paidboard" element={<FreeBoard paid={true} />} />
          <Route path="mypage" element={<SideBar />}>
            <Route index element={<Mypage />} />
            <Route path="info" element={<UserInfo />}>
              <Route path="change" element={<UserInfoChange />} />
              <Route path="myposts" element={<MyPosts />} />
              <Route path="paidPosts" element={<PaidPosts />} />
              <Route path="chargedPointList" element={<ChargedPointList />} />
              <Route path="refundList" element={<RefundList />} />
            </Route>
            <Route path="freeWriting" element={<FreeWriting />} />
            <Route path="salesWriting" element={<FreeWriting paid={true} />} />
          </Route>
          {/* <Route path="admin" element={<Admin />} />
          <Route path="*" element={<NotFoundPage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
