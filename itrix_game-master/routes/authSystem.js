const express = require("express");
const router = express.Router();
const csrf = require("csurf");
const User = require("../models/user");
var session = require("express-session");

//var loginFail = 0;
//router.use(csrfProtection);

const userController = require("../Controller/userController");

router.post("/addUser/", function(req, res, next){
    res.locals.session = req.session;
    next()
},
userController.addUser);

router.get("/logged/", function (req, res, next) {

    if (!req.session.email){
        res.redirect("/");
    }
    
    res.locals.session = req.session
    res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
    })
    next()
},
    userController.loggedPage
);

router.post("/loginCheck/", function (req, res, next) {
    res.locals.session = req.session;
    res.locals.session.loginFail = 0;
    next();
},
    userController.loginCheck
);

router.get("/logout/", function (req, res, next) {
    req.session.email = null;
    res.redirect("/");
});

router.get("/", function (req, res, next) {
    //req.session.email = "hari@gmail.com";
    if (req.session.email){

        res.redirect("/franchise/");
    }
    res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
    })
    res.locals.session = req.session;
    next()
},
    userController.landingPage
);

router.post("/validateAnswer/", function (req, res, next) {
   res.locals.session = req.session
   res.locals.text = req.body.name
   res.locals.email=req.session.email;
   next()
},
    userController.validateAnswer
);

module.exports = router;

router.post("/checkEmail/", function(req, res, next){
    //console.log(req.body.email);
    res.locals.email = req.body.email
    next()
},
    userController.checkEmail
);

router.post("/logged/", function(req, res, next){
    res.redirect("/logged/");
});

router.get("/franchise/", function(req, res, next){
    res.locals.session = req.session;
    next();
},
    userController.franchise);


router.post("/franchise/", function(req,res,next){
var players=req.body.play;
var p1=players[0];
var p2= players[1];
var p3= players[2];
//var franchise= res.locals.franchise;
var email= req.session.email;
console.log(players);

//const Data = {"email": email, "franchise": franchise,"player1":p1,"player2":p2,"player3":p3};
/*var players = [p1, p2, p3];

    const fs = require("fs");
    //const json = require("../JSON/franchises.json");
    fs.readFile("JSON/franchises.json", function(err, data){
        var jsonFileData = JSON.parse(data);
        var i = 0;
        for(i = 0; i < jsonFileData.length; i++){
            if(jsonFileData[i].email === email)
                break;
        }
        for(var j = 0; j < 3; j++){
            jsonFileData[i].players[j] = players[j];
        }
        //jsonFileData[i].players = players;
        //jsonFileData = JSON.stringify(jsonFileData);
        //jsonFileData.push(Data);
        fs.writeFileSync("JSON/franchises.json", JSON.stringify(jsonFileData));
    });
*/

/*console.log("Print");
                console.log(jsfr.length);
                var k=0,j;
                console.log(jsfr[k].email);
             for(k=0;k<jsfr.length;k++)
              if(jsfr[k].email === res.locals.email)
                  {   console.log(jsfr[k].email); console.log(k);break;}
                var f=jsfr[k].franchise;
                console.log(f)
               for(j=0;j<jspl.length;j++)
                if(jspl[j].team === f)
                    break;
                console.log(j);
                var l=jsfr[i].players[0];
                console.log(l);
            console.log(jspl[j].gif[l]);
*/
var k=0,franchise;
/*
 const jspl=require("../JSON/player.json");
     User.findOne({email: email})
        .then(user => {
            console.log(user.franchise);
        franchise = user.franchise;
        });
        console.log(franchise);
        for(k=0;k<5;k++)
            if(jspl[k].team === franchise)
                break;
            console.log(k);
            console.log(jspl[k].gif[p1],pg1 : jspl[k].gif[p1],pg2 : jspl[k].gif[p2],pg3 : jspl[k].gif[p3]);*/
 var myquery = { email: email };
                var newvalues = { $set: {player1 : p1, player2 : p2, player3 : p3}};
                User.updateOne(myquery, newvalues, function(err, res){
                    if(err) throw err;
                });

res.redirect("/logged/");
});

router.post("/addFranchise/", function(req, res, next){
    console.log("hi");
    console.log("The email is " + req.session.email);
    res.locals.email = req.session.email;
    res.locals.franchise = req.body.franchise;
    next();
},
userController.addFranchise
);

router.post("/addPlayer/",function(req,res,next){
    res.locals.email=req.session.email;
    res.locals.pla1=req.body.pl1;
    res.locals.pla2=req.body.pl2;
    res.locals.pla3=req.body.pl3;
},userController.addPlayer);


module.exports = router;