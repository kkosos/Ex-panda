require('../lib/db');

var express = require('express');
var router = express.Router();

//db setting
var mongoose = require('mongoose');
var expanda_account=mongoose.model('expanda_account')
var Article = mongoose.model('Article',Article)

//register

router.post('/reg',function(req,res,next) {
    
    //check if input username or passwd
    if((!req.body.account)||(!req.body.password))
    {
        res.redirect('/users/reg');
        return;
    }
    
    if(req.session.logined){
        res.redirect('/');
        return;
    };

     
    var ttt=expanda_account.findOne({username:req.body.account},function(err,doc){
            //if username exist
            if(doc)
                return res.redirect('/users/reg')
            //if not exist then go down
            
            var tmp_acc =new expanda_account({
            username:req.body.account,
            passwd:req.body.password
            });
   
            tmp_acc.save(function(err)
                {
                    if(err){console.log("reg to db err.")}
                });
        
           res.redirect('/');
           return;
        
    });           
}
);


router.post('/login',function(req,res,next) {
    //check if input username or passwd
    
    
    if((!req.body.account)||(!req.body.password))
    {
        res.redirect('/');
        return;
    }
    
    if(req.session.logined){
        res.redirect('/');
        return;
    };
    
    
    expanda_account.findOne({username:req.body.account,passwd:req.body.password}
                         ,function(err,user){
        if(!user){        
         res.redirect('/')
        return;
        }
        //res.session={name:req.body.account,passwd:req.body.password,logined:true}
        req.session.name =req.body.account;    
        req.session.passwd = req.body.password;
        req.session.logined=1;             
        
         res.redirect('/')                
        }    
    )    
}
);


router.post('/add_article',function(req,res,next){
    console.log("now to add")
    console.log(req.body.article)
    if(!req.session.name){
        res.redirect('/')
    }
    
    new Article({
        username:req.session.name,
        Context:req.body.article
    }).save(function(err){
        if(err){console.log('Context save failed');return;}
        console.log('save to db context')
    })
    
    res.redirect('/');
    
    
});







module.exports = router;
