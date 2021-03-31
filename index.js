const express = require('express')
const app = express()
const port = 5000

const bodyParser = require('body-parser');
const {User} = require("./models/User");

const config = require("./config/key");

//application/x-www-form-urlencoded 분석해서 가져옴
app.use(express.urlencoded({extended:true}))

//application/json 타입 분석후 가져옴
app.use(express.json());


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
  

app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})