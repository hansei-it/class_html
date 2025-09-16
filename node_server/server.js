const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 정적 파일 서빙 (public 폴더)
app.use(express.static(path.join(__dirname, '../public')));

// 사용자 데이터를 저장할 배열 (실제 프로젝트에서는 데이터베이스 사용)
let users = [];

// 루트 경로 - index.html 서빙
app.get('/', (req, res) => {
  console.log('get /', users);
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// 모든 사용자 조회
app.get('/users', (req, res) => {
  console.log('get /users', users);
  res.json({
    success: true,
    count: users.length,
    users: users
  });
});

// 새 사용자 등록 (fetch JSON 전송용)
app.post('/users', (req, res) => {
  const { name, age } = req.body;
  console.log('post /users', {name, age});

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

// 폼 전송 처리 (form action POST 전송용)
app.post('/users-form', (req, res) => {
  const { name, age } = req.body;
  console.log('post /users-form', {name, age});

  // 간단한 입력 검증
  if (!name?.trim() || !age || age < 0 || age > 150) {
    return res.status(400).send('올바른 이름과 나이(0-150)를 입력해주세요.');
  }

  const newUser = {
    id: users.length + 1,
    name: String(name).trim(),
    age: parseInt(age),
    createdAt: new Date().toISOString()
  };

  users.push(newUser);

  const escape = (s) => String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;');

  const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>사용자 등록 결과</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 420px; margin: 40px auto; padding: 20px; }
    h1 { text-align: center; }
    .card { background: #f8f9fa; border: 1px solid #e5e5e5; border-radius: 6px; padding: 16px; }
    .row { margin: 8px 0; }
    .links { margin-top: 16px; display: flex; gap: 10px; }
    a { color: #007bff; text-decoration: none; }
  </style>
</head>
<body>
  <h1>사용자 등록 결과</h1>
  <div class="card">
    <div class="row"><strong>이름:</strong> ${escape(newUser.name)}</div>
    <div class="row"><strong>나이:</strong> ${escape(newUser.age)}</div>
    <div class="row"><strong>등록시각:</strong> ${escape(newUser.createdAt)}</div>
  </div>
  <div class="links">
    <a href="/index2.html">뒤로 가기</a>
    <a href="/users">전체 사용자 보기(JSON)</a>
  </div>
</body>
</html>`;

  const resultPath = path.join(__dirname, '../public/result.html');
  fs.writeFile(resultPath, html, 'utf8', (err) => {
    if (err) {
      return res.status(500).send('결과 페이지 생성 중 오류가 발생했습니다.');
    }
    return res.sendFile(resultPath);
  });
});

// 폼 전송 처리 (form action GET 전송용)
app.get('/users-form', (req, res) => {
  const { name, age } = req.query;
  console.log('get /users-form', {name, age});

  // 간단한 입력 검증
  if (!name?.trim() || !age || age < 0 || age > 150) {
    return res.status(400).send('올바른 이름과 나이(0-150)를 입력해주세요.');
  }

  const newUser = {
    id: users.length + 1,
    name: String(name).trim(),
    age: parseInt(age),
    createdAt: new Date().toISOString()
  };

  users.push(newUser);

  const escape = (s) => String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;');

  const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>사용자 등록 결과 (GET)</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 420px; margin: 40px auto; padding: 20px; }
    h1 { text-align: center; }
    .card { background: #f8f9fa; border: 1px solid #e5e5e5; border-radius: 6px; padding: 16px; }
    .row { margin: 8px 0; }
    .links { margin-top: 16px; display: flex; gap: 10px; }
    a { color: #007bff; text-decoration: none; }
  </style>
</head>
<body>
  <h1>사용자 등록 결과 (GET)</h1>
  <div class="card">
    <div class="row"><strong>이름:</strong> ${escape(newUser.name)}</div>
    <div class="row"><strong>나이:</strong> ${escape(newUser.age)}</div>
    <div class="row"><strong>등록시각:</strong> ${escape(newUser.createdAt)}</div>
  </div>
  <div class="links">
    <a href="/index3.html">뒤로 가기</a>
    <a href="/users">전체 사용자 보기(JSON)</a>
  </div>
</body>
</html>`;

  const resultPath = path.join(__dirname, '../public/result.html');
  fs.writeFile(resultPath, html, 'utf8', (err) => {
    if (err) {
      return res.status(500).send('결과 페이지 생성 중 오류가 발생했습니다.');
    }
    return res.sendFile(resultPath);
  });
});

// 특정 사용자 조회
app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  console.log('get /users/id', user);

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
