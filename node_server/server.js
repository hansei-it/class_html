const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// 미들웨어 설정
app.use(cors());
app.use(express.json());

// 정적 파일 서빙 (public 폴더)
app.use(express.static(path.join(__dirname, '../public')));

// 사용자 데이터를 저장할 배열 (실제 프로젝트에서는 데이터베이스 사용)
let users = [];

// 루트 경로 - index.html 서빙
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// 모든 사용자 조회
app.get('/users', (req, res) => {
  res.json({
    success: true,
    count: users.length,
    users: users
  });
});

// 새 사용자 등록
app.post('/users', (req, res) => {
  const { name, age } = req.body;

  // 간단한 입력 검증
  if (!name?.trim() || !age || age < 0 || age > 150) {
    return res.status(400).json({
      success: false,
      message: '올바른 이름과 나이(0-150)를 입력해주세요.'
    });
  }

  // 새 사용자 생성
  const newUser = {
    id: users.length + 1,
    name: name.trim(),
    age: parseInt(age),
    createdAt: new Date().toISOString()
  };

  users.push(newUser);

  res.status(201).json({
    success: true,
    message: '사용자가 등록되었습니다.',
    user: newUser
  });
});

// 특정 사용자 조회
app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));

  if (!user) {
    return res.status(404).json({
      success: false,
      message: '사용자를 찾을 수 없습니다.'
    });
  }

  res.json({ success: true, user });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 서버 실행: http://localhost:${PORT}`);
  console.log(`📱 웹페이지: http://localhost:${PORT}`);
});
