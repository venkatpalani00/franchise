const User = require("../models/user");

exports.addUserForm = (req, res, next) => {
    res.render('addUserForm', {
        //csrfToken: res.locals.csrfToken
    });
};

exports.addUser = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const contact = req.body.contact;
    const college = req.body.college;

    const user = new User({name: name, email: email, password: password, contact: contact, college: college});
    user.save()
    .then(
        res.locals.session.email = email,
        //console.log("User created successfully!"),
        res.redirect("/")
    )
    .catch(err => {
        console.log(err);
    });
};

exports.loginForm = (req, res, next) => {
    if(res.locals.session.email)
        res.redirect("/franchise/");
    res.render("loginForm", {
        message: ""
        //csrfToken: res.locals.csrfToken
    });
};

exports.loginCheck = (req, res, next) => {
    var credentials = {email: req.body.email, password: req.body.password};
    User.find(credentials)
    .then(user => {
        if(JSON.stringify(user) !== JSON.stringify([])){
            res.locals.session.loginFail = 0;
            res.locals.session.email = req.body.email;
            res.redirect("/franchise/");
        }
        else{
            res.locals.session.loginFail = 1;
            res.redirect("/");
            
        }
    })
    .catch(err => {
        console.log(err);
    });
};

exports.loggedPage = (req, res, next) => {
    User.find({email: res.locals.session.email})
    .then(user => {
        const jsonFile = require("../JSON/question.json");
        //console.log("Welcome " + user);
        const q = jsonFile[user[0].level - 1];
        res.render("logged", {         
            loggedUser: user,
            level: user[0].level,
            question: q
        });
    })
    .catch(err => {
        console.log(err);
    });
};


exports.landingPage = (req, res, next) => {
    var login_error = "";
    if(res.locals.session.loginFail === 1){
        login_error = "Incorrect username/password";
    }
    res.render("landingPage", {
        //csrfToken: res.locals.csrfToken
        loginFail: res.locals.session.loginFail,
        login_error: login_error
    });
    res.locals.session.loginFail = 0;
}

exports.validateAnswer = (req, res, next) => {
console.log(res.locals.franchise);    
    //console.log("Your email is " + res.locals.session.email);
    User.findOne({email: res.locals.session.email})
    .then(user => {
        //console.log("your level is " + user.level);
        var i = user.level - 1;
        const tex = res.locals.text;
            console.log(user);
        const jsonParsed = require("../JSON/question.json");
           const jsfr=require("../JSON/franchises.json");
           const jspl=require("../JSON/player.json");
            
        //console.log("The answer is " + jsonParsed[i].answer);
        if (jsonParsed[i].answer === tex) {
        /*     if(user.level === 1 || user.level === 4 || user.level === 7)
              {console.log("Print");
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
                }

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
                */

           /* console.log(user.franchise);
        franchise = user.franchise;
        console.log(franchise);*/
        var num;
        var random =  Math.floor((Math.random() * 4) + 0);
        switch(user.franchise)
        {
            case "kkr" :num=0;break;
            case "rcb" :num=1;break;
            case "csk" :num=2;break;
            case "srh" :num=3;break;
            case "mi" :num=4;break;
        }
        while(random==num)
        {
            random =  Math.floor((Math.random() * 4) + 0)
        }

        var gifPath;
        for(k=0;k<5;k++)
            if(jspl[k].team === user.franchise)
                break;
            console.log(k);
                if(user.level === 1||user.level === 4||user.level === 7)
                    gifPath=jspl[k].gif[user.player1];
                else if(user.level === 2||user.level === 5||user.level === 8)
                    gifPath=jspl[k].gif[user.player2];
                else if(user.level === 3||user.level === 6||user.level === 9)
                    gifPath=jspl[k].gif[user.player3];      
                    console.log(gifPath);         
                res.json({ data: "1", path: jsonParsed[i + 1].question, number: jsonParsed[i].number, giff:gifPath, oppTeam : jspl[random] , curTeam : jspl[num]});
                i = i + 1;
                var myquery = { email: res.locals.session.email };
                var newvalues = { $set: {level: i+1 } };
                User.updateOne(myquery, newvalues, function(err, res){
                    if(err) throw err;
                });
            }
            else {
                //console.log(jsonParsed[i].gif);
                res.json({ data: "0" });
            }
           
      
    });
    
   
}

exports.checkEmail = (req, res, next) => {
    User.findOne({email: res.locals.email})
    .then(user => {
        if(user != null){
            res.json({message: "Email already exists"});
        }
        else{
            res.json({message: ""});
        }
    });
}

exports.franchise = (req, res, next) => {
    const fs = require("fs");
    const jsonData = require("../JSON/franchises.json");
    var i = 0;
    for(i = 0; i < jsonData.length; i++){
        if(jsonData[i].email === res.locals.session.email){
            break;
        }
    }
    console.log("I value is "+ i);
    console.log("JSON length is " + jsonData.length);
    // if(i != jsonData.length){
    //     res.redirect("/logged/");
    // }
    /*
    fs.readFile("JSON/franchises.json", function(err, data){
        //console.log("Logged user email is " + res.locals.session.email);
        var jsonData = JSON.parse(data);
        var i = 0;
        for(i = 0; i < jsonData.length; i++){
            if(jsonData[i].email === res.locals.session.email){
                break;
            }
        }
        console.log("I value is "+ i);
        if(i != jsonData.length){
            res.redirect("/logged/");
        }
    });
    */
    res.render("franchiseSelector");
}

exports.addFranchise= (req,res,next)=>{
    /*   const franchiseData = {"email": res.locals.email, "franchise": res.locals.franchise, "players": ["", "", ""]};
    const fs = require("fs");
    fs.readFile("JSON/franchises.json", function(err, data){
        var jsonFileData = JSON.parse(data);
        
        //jsonFileData = JSON.stringify(jsonFileData);
        jsonFileData.push(franchiseData);
        fs.writeFileSync("JSON/franchises.json", JSON.stringify(jsonFileData));
    });*/
    const tex = res.locals.franchise;
        console.log(res.locals.email);
     var myquery = { email: res.locals.email };
                var newvalues = { $set: {franchise: tex} };
                User.updateOne(myquery, newvalues, function(err, res){
                    if(err) throw err;
                });
                     User.findOne({email: res.locals.email})
        .then(user => {
                console.log(user.franchise);
            })
            var i=0;
        const jsonParsed = require("../JSON/player.json");
        //console.log("The answer is " + jsonParsed[i].answer);
        for(i=0;i<5;i++)
        if (jsonParsed[i].team === tex) {
                res.json({ data: "1",team: jsonParsed[i].team_name,pla_name: jsonParsed[i].pla_name,pla_photo:jsonParsed[i].pla_photo});
            }
            //console.log("what");
           // console.log(res.locals.pla1);
}

exports.addPlayer= (req,res,next)=>{
    console.log("what");
    console.log(res.locals.pla1);
}
