const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds =10
const jwt = require('jsonwebtoken');


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
    password:{
        type:String,
        minlength: 5
    },
    role:{
        type: Number, //number가 :1이면 관리자
        default:0
    },

    image:String,
    token:{
        type:String
    },
    tokenExp:{
        type: Number //token 사용 기간
    }
})

userSchema.pre('save', function(next){
    var user = this;

    if (user.isModified('password')){

    
    //비밀번호 암호화
    bcrypt.genSalt(saltRounds, function(err, salt) {
        if(err) return next(err)
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err)
            user.password = hash
            next()
            // Store hash in your password DB.
        })
    })
    }
    else{
        next()
    }
    
})

userSchema.methods.comparePassword = function(plainpassword, cb){
    //plainpassword 암호화된 비밀번호와 동일한지 체크-비교
    bcrypt.compare(plainpassword,this.password, function(err, isMatch){
        if(err) return cb(err);
        cb(null, isMatch);
    })
}

userSchema.methods.generateToken = function(cb){

    var user= this;
//jsonwebtoken을 이용해서 token을 생성하기
    var token = jwt.sign(user._id.toHexString(),  'secretToken')

    user.token = token
    user.save(function(err, user){
        if(err) return cb(err)
        cb(null, user)
    })

}

const User = mongoose.model('User', userSchema)

module.exports ={User};