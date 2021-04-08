const express = require('express')
const app = express()
const port = 5000
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const {User} = require("./models/User");


const config = require("./config/key");

//application/x-www-form-urlencoded 분석해서 가져옴
app.use(express.urlencoded({extended:true}))

//application/json 타입 분석후 가져옴
app.use(express.json());

app.use(cookieParser());


const mongoose = require('mongoose');

mongoose.connect(config.mongoURI, {
    useNewUrlParser : true, useUnifiedTopology : true, useCreateIndex : true, useFindAndModify : false
}).then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));




  app.post('/register', (req, res) => {
    //회원가입시 필요한 정보들을 client에서 가져오면
    //그것들을 데이터 베이스에 넣어준다.

    const user =new User(req.body)

    user.save((err,userInfo)=>{
      if(err) return res.json({success: false, err})
      return res.status(200).json({
        success:true
      })
    })
  })

  app.post('/login', (req,res)=>{

    //이메일 데베에 있는지 찾기
    User.findOne({email:req.body.email},(err,user)=>{
      if(!user){
        return res.json({
          loginSuccess: false,
          message:"해당 유저를 찾을 수 없습니다."
        })
      }
    
    //요청된 이메일이 있다면 비밀번호가 일치하는지 확인

    user.comparePassword(req.body.password,(err, isMatch)=>{

      console.log('err',err)
      console.log('isMatch', isMatch)
      if(!isMatch)
      return res.json({loginSuccess: false, message:"비밀번호가 틀렸습니다."})
      //비밀번호가 맞다면 토큰 생성
      user.generateToken((err, user)=>{
        if(err) return res.status(400).send(err);

        //쿠키, 로컬스토리지에 저장
        res.cookie("x_auth", user.token)
        .status(200)
        .json({loginSuccess: true, userId: user._id})
        
      })
  })
  })
  })
  

app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})