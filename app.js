const express = require('express');
const app = express();
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const userModel = require('./models/user');



app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));
app.use(cookieParser());


app.get('/', (req, res) => {
    res.render('login');
})

app.get('/project',isLoggedIn,(req,res)=>{
    res.render('project')
})













app.get('/register', (req,res) => {
    res.render('register')
})









// app.get('/profile', isLoggedIn, async (req, res) => {
//     let user = await userModel.findOne({_id: req.user.id}).populate('books');

//     res.render('profile',{user: user})
// })

// app.get('/profile/:id', isLoggedIn, async (req, res)=>{
//     let user = await userModel.findOne({_id: req.params.id});
//     res.render('addProfilePic',{user: user})
// })







app.post('/create', async (req,res)=>{
    
    let {email,name,username,password} = req.body;

    let user = await userModel.findOne({email: email});
    if(user){
        res.redirect('/');
        
    }

    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, async function(err, hash) {
            let newUser = await userModel.create({
                name: name,
                username: username,
                email: email,
                password: hash,
            })

            let token = jwt.sign({email: email, id: newUser._id},"admin");
            res.cookie('token',token);
            res.redirect('/project');
        });
    });
})

app.post('/login', async (req, res) => {
    let {email, password} = req.body;
   
    let user = await userModel.findOne({email: email});
    if(!user){
        return res.redirect('/');


    }

    bcrypt.compare(password, user.password, function(err, result) {
        if(result){
            let token = jwt.sign({email: email, id: user._id},"admin");
            res.cookie('token',token);
            
            
            res.redirect('/project');
        }else{
            res.redirect('/');
        }
    });

})

app.get('/contact',isLoggedIn, function(req, res) {
    res.render('contact')
})

app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
})

function isLoggedIn(req, res,next) {
    if(!req.cookies.token) { return res.redirect('/')}
        else{
            let data = jwt.verify(req.cookies.token,"admin")
            req.user = data
        
        }
    
        next();
}






app.listen(3000);