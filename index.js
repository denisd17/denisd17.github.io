//module utilizate
var express = require('express');
var path = require('path');
var app = express();
var path = require('path');
var formidable = require('formidable'); //formidable - pentru formulare
var session = require('express-session');
var fs = require('fs'); //file system - administrare de directoare si fisiere
var crypto = require('crypto') //crypto - criptare parole
app.set('view engine', 'ejs');
//definirea folderului de resurse
app.use(express.static(path.join(__dirname,"resurse")));

app.use(session({
	secret: "parola_sesiune",
	resave:true,
	saveUninitialized:false
}))

//INREGISTRARE
app.post('/inreg', function(req, res){
	var dateFormular= new formidable.IncomingForm()
	dateFormular.parse(req, function(err, fields, files){
	//in files o sa am campurile de tip file <input type="file"
	//in fields o sa am restul
	var textFisier= fs.readFileSync("useri.json") //cale relativa la index.js
	var objson=JSON.parse(textFisier);
	var parolaCriptata;
	var algCriptare=crypto.createCipher("aes-128-cbc", "cheie_de_criptare")
	parolaCriptata=algCriptare.update(fields.parola, "utf8", "hex");
	parolaCriptata+=algCriptare.final("hex");
	var bool_value = fields.news == "true" ? true : false	
	var utilizatorNou={
		id:objson.lastId,
		username:fields.username,
		nume:fields.nume,
		email:fields.email,
		parola:parolaCriptata,
		dataInreg: new Date(),
		rol: "user",
		branduri: fields.branduri,
	    data:fields.data,
		nrperechi:fields.nrperechi,
		news:bool_value
		}
    
	objson.useri.push(utilizatorNou)
    objson.lastId += 1

	//stringify trece de la obiect la sir (opusul lui JSON.parse)
    var jsonNou=JSON.stringify(objson);
		fs.writeFileSync("useri.json", jsonNou);
		res.redirect("/");
	});

	     
})

//LOGARE
app.post('/login', function(req, res){
  var dateFormular= new formidable.IncomingForm()
	dateFormular.parse(req, function(err, fields, files){	
		var textFisier= fs.readFileSync("useri.json") //cale relativa la index.js
		var objson=JSON.parse(textFisier);
		var parolaCriptata;
		var algCriptare=crypto.createCipher("aes-128-cbc", "cheie_de_criptare")
		parolaCriptata=algCriptare.update(fields.parola, "utf8", "hex");
		parolaCriptata+=algCriptare.final("hex");
		
		//user e null daca nu gaseste un utiliz cu acea conditie
		var user=objson.useri.find(function(el){
			return el.username == fields.username && el.parola == parolaCriptata
		})
		if(user){
			console.log("S-a logat un user!");
			req.session.utilizator=user;
			res.render("html/index", {username: user.username});
		}
	});
}) 

//CERERI DE TIP GET
app.get('/', function(req, res) {
	/*afiseaza(render) pagina folosind ejs (deoarece este setat ca view engine) */
	var u=req.session ? (req.session.utilizator ? req.session.utilizator.username : null) :null;
	console.log(u);
	res.render('html/index',{username:u});
});
app.get('/logout', function(req, res) {
	req.session.destroy();
	res.redirect("/");
})

app.get('/*', function(req, res){
	var u=(req.session? (req.session.utilizator? req.session.utilizator.username: null) :null);
	res.render('html' + req.url,{username:u}, function(err, rezRandare){
		if(err){
				if(err.message.indexOf("Failed to lookup view")!=-1){
					res.status(404).render("html/404", {username:u})
        
				}
        else throw err
		}
    else res.send(rezRandare)
	});
});

app.use(function(req,res){
	res.status(404).render("html/404")
})
app.listen(8080);
console.log('Aplicatia se va deschide pe portul 8080.');



