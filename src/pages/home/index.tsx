import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <p>홈 페이지</p>
      <br />
      <button onClick={() => navigate('/mobile')}>📱 모바일 화면</button>
      <br />
      <br />
      <button onClick={() => navigate('/desktop')}>🖥️ 데스크탑 화면</button>
    </div>
  );
};

export default HomePage;
