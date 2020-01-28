const User = require('../models/user')
var jwt = require('jsonwebtoken');
var express = require('express');
// helmet using for security 
const helmet = require('helmet');
var app = express();
app.use(helmet());


//middleware for authentication
const auth = async (req,res,next)=>{
    // console.log('req', req.session)
    try{
        var authHeader = req.header('Authorization');
        if(authHeader !== undefined){
            const token = req.header('Authorization').replace('Bearer', "").trim();
            jwt.verify(token,process.env.JWT_SECRET,(err, decoded)=>{
                if(err || decoded === undefined){
                    return res.json({
                        status:"error",
                        msg:"token not valid"
                    })
                }else{
                    User.findOne({user_id:decoded.userId,'token.jwttoken':token},(err,user)=>{
                        console.log("error",err)
                        if(err){
                            return res.json({
                                status:"error",
                                msg:"please authenticate"
                            })  
                        }
                        if(!user){
                            return res.json({
                                status:"error",
                                msg:"user not found"
                            })
                        }else{
                            req.token = token
                            req.user = user
                            next()
                        }
                    })
                }
            });
        } else if(req.session !== undefined && req.session.user !== undefined && req.session.loggedin !== undefined){
                next();
        }else if (req.baseUrl === '/api' || req.baseUrl === '/game-engine'){
            return res.json({
                status:"error",
                msg:"unknown user"
            })
        }else{
            res.redirect('/admin/signin');
        } 
    }catch(e){
        res.redirect('/admin/signin');
    }
    
}

module.exports = auth