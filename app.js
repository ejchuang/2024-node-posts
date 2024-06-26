const express = require('express');
const path = require('path');
const logger = require('morgan'); //日誌
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUI = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');

//路由
const index = require('./routes/index');
const posts = require('./routes/posts');
const users = require('./routes/users');
const upload = require('./routes/upload');
const app = express();

// 程式出現重大錯誤時
process.on('uncaughtException', err => {
  // 記錄錯誤下來，等到服務都處理完後，停掉該 process
  //console.error('Uncaughted Exception！')
  //console.error(err);
  process.exit(1);
});
dotenv.config({ path: './config.env' });

//資料庫連線
require('./connections/index');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); //靜態資料

app.use('/', index);
app.use('/posts', posts);
app.use('/users', users);
app.use('/upload', upload)
app.use('/api-doc', swaggerUI.serve, swaggerUI.setup(swaggerFile));

// 404 錯誤
app.use(function (req, res, next) {
  res.status(404).json({
    status: 'error',
    message: "無此路由資訊",
  });
});

// express 錯誤處理
// 自己設定的 err 錯誤 
const resErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      message: err.message
    });
  } else {
    // log 紀錄
    //console.error('出現重大錯誤', err);
    // 送出罐頭預設訊息
    res.status(500).json({
      status: 'error',
      message: '系統錯誤，請恰系統管理員'
    });
  }
};
// 開發環境錯誤
const resErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    message: err.message,
    error: err,
    stack: err.stack
  });
};
// 錯誤捕捉
app.use(function (err, req, res, next) {
  // dev
  err.statusCode = err.statusCode || 500;
  if (process.env.NODE_ENV === 'dev') {
    return resErrorDev(err, res);
  }
  // production mongoose
  switch (err.name) {
    case 'ValidationError':
      err.message = "資料未填寫正確，請重新輸入！";
      err.isOperational = true;
      return resErrorProd(err, res);
    case 'SyntaxError':
      err.message = '資料格式錯誤';
      err.statusCode = 400;
      err.isOperational = true;
      return resErrorProd(err, res);
    case 'CastError':
      err.message = '找不到此貼文';
      err.statusCode = 400;
      err.isOperational = true;
      return resErrorProd(err, res);
    case 'JsonWebTokenError':
      err.message = 'JWT 格式錯誤或過期';
      err.statusCode = 401;
      err.isOperational = true;
      return resErrorProd(err, res);
    case 'MulterError':
      err.message = '圖片不能大於 2MB';
      err.statusCode = 400;
      err.isOperational = true;
      return resErrorProd(err, res);
    default:
      return resErrorProd(err, res);
  }
});

// 未捕捉到的 catch 
process.on('unhandledRejection', (err, promise) => {
  //console.error('未捕捉到的 rejection：', promise, '原因：', err);
});
module.exports = app;