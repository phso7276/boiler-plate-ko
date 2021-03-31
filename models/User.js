const mongoose = require('mongoose');

const userSchema = mongoose.Schema({

    name:{
        type:String,
        maxlength: 50
    },
    email:{
        type:String,
        trim: true, //스페이스를 없애주는 역할
        unique:1 //같은 이메일 사용방지
    },
    name:{
        type:String,
        minlength: 5
    },
    role:{
        type: Number, //number가 :1이면 관리자
        default:0
    },

    image:String,
    token:{
        type:toString
    },
    tokenExp:{
        type: Number //token 사용 기간
    }
})

const User = mongoose.model('User', userSchema)

module.exports =(User);