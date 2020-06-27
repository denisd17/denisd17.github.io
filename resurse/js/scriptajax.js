window.onload=function(){
	//creez un obiect de tip XMLHttpRequest cu care pot transmite cereri catre server
	var ajaxRequest = new XMLHttpRequest();
	

	//la schimbarea starii obiectului XMLHttpRequest (la schimbarea proprietatii readyState)
	/* stari posibile:
	0 - netrimis
	1 - conexiune deschisa
	2 - s-au transmis headerele
	3 - se downleadeaza datele (datele sunt impartite in pachete si el primeste cate un astfel de pachet)
	4 - a terminat
	*/
	ajaxRequest.onreadystatechange = function() {
			//daca am primit raspunsul (readyState==4) cu succes (codul status este 200)
			if (this.readyState == 4 && this.status == 200) {
					//in proprietatea responseText am contintul fiserului JSON
					//document.getElementById("afisneproc").innerHTML=this.responseText;
					obJson = JSON.parse(this.responseText); //GLOBAL
					afiseazaJsonTemplate(obJson);
			}
	};
	//deschid o conexiune cu o cerere de tip get catre server
	//json e pus in folderul static "resurse" deci calea e relativa la acel folder (fisierul e la calea absoluta /resurse/json/studenti.json)
	ajaxRequest.open("GET", "/json/adidasi.json", true);
	//trimit catre server cererea
	ajaxRequest.send();

	function afiseazaJsonTemplate(obJson) { 
			//in acets div voi afisa template-urile   
			let container=document.getElementById("afis_produse");

			//in textTemplate creez continutul (ce va deveni innerHTML-ul) divului "afisTemplate"
			let textTemplate ="";
			//parcurg vetorul de studenti din obJson
			for(let i=0;i<obJson.adidasi.length;i++){
				//creez un template ejs (primul parametru al lui ejs.render)
				//acesta va primi ca parametru un student din vectorul de studenti din json {student: obJson.studenti[i]}
				//practic obJson.studenti[i] e redenumit ca "student" in template si putem sa ii accesam proprietatile: student.id etc
				textTemplate+=ejs.render("<div class='template_adidas'>\
				<figure>\
				<img src=<%= '/imagini/' + adidas.poza %> alt='imagine lipsa' title= <%= adidas.nume %>>\
				<figcaption id='nume'><%= adidas.nume %></figcaption>\
				</figure>\
				<p><%= adidas.marimi %></p>\
				<p><%= adidas.culoare %></p>\
				<p><%= adidas.pret %> RON</p>\
				<p><%= adidas.gen %></p>\
				<p><%= adidas.livraregratis%><p>\
				<p><%= adidas.lansare%><p>\
				</div>", 
				{adidas: obJson.adidasi[i]});
				}
				
			
			//adaug textul cu afisarea studentilor in container
			container.innerHTML=textTemplate;
			actualizarePreferinte();
	}
	tabelProd = document.getElementById("afis_produse");
	tabelNoutati = document.getElementById("noutati");
	ofertaActiva = false;
	//GENERARE NUMAR RANDOM
	function randInt(a,b){
		return Math.trunc(a+(b-a)*Math.random());
	}
	
	function actualizareStoc(){
		let nr_perechi = randInt(1, 11);
		let id = randInt(1,obJson.adidasi.length+1);
		let sansa = randInt(1,4);
		let model = obJson.adidasi[id-1].nume;
		let text = "NOU PE STOC! AM ADUS " + nr_perechi + " PERECHI DE ADIDASI DIN MARCA " + model.toUpperCase();
		tabelNoutati.children[0].innerHTML = text;
		if(Number(sansa) == 1 && ofertaActiva == false)
		{
			let id_oferta = randInt(1,obJson.adidasi.length+1);
			let model_oferta = obJson.adidasi[id-1].nume;
			let pret_original = Number(obJson.adidasi[id-1].pret);
			let reducere = Number(randInt(25,76));
			let pret_oferta = Math.trunc((Number(pret_original) * reducere)/100);
			//GENERARE CULOARE RANDOM
			let r = Number(randInt(0,256)); 
			let g = Number(randInt(0,256)); 
			let b = Number(randInt(0,256));
			let randomColor = "rgb(" + r + "," + g + "," + b + ")";
			
			tabelNoutati.children[1].innerHTML = "WOW SUPER OFERTA! " + model_oferta.toUpperCase() + " LA DOAR " + pret_oferta + " RON! PRET VECHI: " + pret_original + "RON";
			tabelNoutati.children[1].classList.toggle("invizibil")
			tabelNoutati.children[1].style.color = randomColor;
			tabelNoutati.style.border = "solid 2px " + randomColor;
			ofertaActiva = true;
			setTimeout(function(){ofertaActiva = false;tabelNoutati.children[1].classList.toggle("invizibil"); tabelNoutati.style.border = "initial";},5000);
		}
	}
	setInterval(actualizareStoc, 3000);
	
	//KEYPRESS
	window.onkeydown=function(e){
		
		if(65 <= e.keyCode &&  e.keyCode <= 90 && e.altKey){
			
			var randuri = tabelProd.children;
			
			for(let i = 0; i < randuri.length; i++){
			
				let nume = randuri[i].children[0].children[1].innerHTML;
				if(nume[0].toLowerCase() == e.key || nume[0] == e.key)
					randuri[i].classList.toggle("selectat");
			}
		}
			
		
	}
	
	//CHEIE PENTRU STOCARE IN LOCAL STORAGE
	function cheieLocalStorage(){
		var optiune = localStorage.getItem("optiune");
		if(optiune)
			return localStorage.length - 1;
		else
			return localStorage.length;
	}
	//SELECTARE ELEMENTE
	document.getElementById("afis_produse").onclick=function(){
		var produse = this.children;
		for(let prod of produse)
			prod.onclick=function(){
				this.classList.toggle("selectat");
				
			}
	}
	
	//SORTARE DUPA NUME
	//DOAR PE ELEMENTELE AFISATE LA MOMENTUL RESPECTIV
	document.getElementById("sort_nume").onclick=function(){
		let cheie = cheieLocalStorage();
		let s = "sortnume ";
		let tipSortare;
		//verificam daca a fost apasat checkboxul pentru sortare descrescatoare
		var check = document.getElementById("i_check1");
		if(check.checked)
		{
			s+=0;
			tip = 0;
		}
		else
		{	
			s+=1;
			tip = 1;
		}
		
		localStorage.setItem(cheie,s);
				
		sortareDupaNume(tip);
	}
			
	function sortareDupaNume(tipSortare){
		var produse = tabelProd.children;
		var vranduri = Array.prototype.slice.call(produse);
		var crescator = true;
			
		if(!tipSortare)
			crescator = false; 
				
			
      
      vranduri.sort(function(a,b){
        return a.children[0].children[1].innerHTML.localeCompare(b.children[0].children[1].innerHTML);
      });
	  
	  //daca checkboxul ptr sortare descrescatoare a fost apasat, inversam elementele sortate ale arrayului de produse
	  if(!crescator)
		  vranduri.reverse();

      for(let rand of vranduri){
        tabelProd.appendChild(rand);
			}
	}
	
	//SORTARE DUPA PRET
	//DOAR PE ELEMENTELE AFISATE LA MOMENTUL RESPECTIV
	document.getElementById("sort_pret").onclick=function(){
		let cheie = cheieLocalStorage();
		let s = "sortpret ";
		let tipSortare;
		//verificam daca a fost apasat checkboxul pentru sortare descrescatoare
		var check = document.getElementById("i_check2");
		if(check.checked)
		{
			s+=0;
			tip = 0;
		}
		else
		{
			s+=1;
			tip = 1;
		}
		localStorage.setItem(cheie,s);
		sortareDupaPret(tip);
	}
   function sortareDupaPret(tipSortare){
	    var produse = tabelProd.children;
		var vranduri = Array.prototype.slice.call(produse);
		var crescator = true;
			
		
		if(!tipSortare)
			crescator = false; 
	
		vranduri.sort(function(a,b){
        return a.children[3].innerHTML.localeCompare(b.children[3].innerHTML);
		});
	  
		//daca checkboxul ptr sortare descrescatoare a fost apasat, inversam elementele sortate ale arrayului de produse
		if(!crescator)
			vranduri.reverse();

		for(let rand of vranduri){
			tabelProd.appendChild(rand);
			}
   }
   
   //FILTRARE DUPA TIP
   //ADIDASI PENTRU BARBATI
   document.getElementById("i_check3").onclick=function(){
		
		let cheie = cheieLocalStorage();
		let s = "M ";
		var check = document.getElementById("i_check3");
		if(check.checked)
			adauga=1;
		else
			adauga=0;
		s+=adauga;
		localStorage.setItem(cheie,s);
		filtrareTip("M",Number(adauga));
	}
   
   
   //ADIDASI PENTRU FEMEI
   document.getElementById("i_check4").onclick=function(){
		
		let cheie = cheieLocalStorage();
		let s = "F ";
		var check = document.getElementById("i_check4");
		if(check.checked)
			adauga=1;
		else
			adauga=0;
		s+=adauga;
		localStorage.setItem(cheie,s);
		filtrareTip("F",Number(adauga));
   }
   
   //ADIDASI UNISEX
   document.getElementById("i_check5").onclick=function(){
		
		let cheie = cheieLocalStorage();
		let s = "U ";
		let adauga;
		var check = document.getElementById("i_check5");
		if(check.checked)
			adauga=1;
		else
			adauga=0;
		s+=adauga;
		localStorage.setItem(cheie,s);
		filtrareTip("U",Number(adauga));	
   }
   
   //FUNCTIE GENERALA DE FILTRARE
   function filtrareTip(tip,adauga){
		
		if(adauga)
			adaugaElemente(tip);
		else
			stergeElemente(tip);
   }
   
   //FUNCTIE DE ADAUGARE ELEMENTE DIN JSON DUPA TIP
   function adaugaElemente(tip){
		
		let textTemplate = tabelProd.innerHTML;
			
		for(let i=0;i<obJson.adidasi.length;i++){
			if(obJson.adidasi[i].gen == tip)
			{
			textTemplate+=ejs.render("<div class='template_adidas'>\
			<figure>\
			<img src=<%= '/imagini/' + adidas.poza %> alt='imagine lipsa' title= <%= adidas.nume %>>\
			<figcaption id='nume'><%= adidas.nume %></figcaption>\
			</figure>\
			<p><%= adidas.marimi %></p>\
			<p><%= adidas.culoare %></p>\
			<p><%= adidas.pret %> RON</p>\
			<p><%= adidas.gen %></p>\
			<p><%= adidas.livraregratis%><p>\
			<p><%= adidas.lansare%><p>\
			</div>", 
			{adidas: obJson.adidasi[i]});
			}
		}
		tabelProd.innerHTML=textTemplate;
			
	   
   }
   
   //STERGERE ELEMENTE DIN TABEL DUPA TIP
   function stergeElemente(tip){
		
		var randuri = tabelProd.children;

		for(let i=0; i<randuri.length;i++){
        if (randuri[i].children[4].innerHTML == tip){
			randuri[i].remove();
			i-=1;
        }
		
   }}
   
   //FILTRARE ELEMENTE DUPA PRET MAXIM
   //PE TOATE PRODUSELE DISPONIBILE PE SITE
   document.getElementById("filter_pret").onclick=function(){
		resetare();
		let cheie = cheieLocalStorage();
		let s = "pretmaxim ";
		var pretMax = document.getElementById("i_range1").value;
		s+=pretMax;
		localStorage.setItem(cheie,s);
		filtrarePret(pretMax);
		
   }
   
   function filtrarePret(pretMax){
	   
		
		
		var randuri = tabelProd.children;
		for(let i = 0; i < randuri.length; i++){
			
			let rand = randuri[i].children[3].innerHTML;
			let pret = rand.split(" ")[0];
			if(pret > pretMax)
			{
				randuri[i].remove();
				i-=1;
			}
		}
   }
   
   //CAUTARE ELEMENTE DUPA MARIME
   //PE TOATE PRODUSELE DISPONIBILE PE SITE
   document.getElementById("filter_marime").onclick=function(){
		
		
		var marime = prompt("Introduceti marimea cautata: ");
		//VERIFICAM INAINTE CA AVEM INPUT VALID
		if(!Number(marime) || marime==null)
			return;
		
		resetare();
		let cheie = cheieLocalStorage();
		let s = "marime ";
		s+=marime;
		localStorage.setItem(cheie,s);
	    filtrareMarime(marime);
	}
	
	function filtrareMarime(marime){
		
		tabelProd.innerHTML="";
		
		let textTemplate = "";
			
			for(let i=0;i<obJson.adidasi.length;i++){
				if(obJson.adidasi[i].marimi.includes(marime))
				{
				textTemplate+=ejs.render("<div class='template_adidas'>\
				<figure>\
				<img src=<%= '/imagini/' + adidas.poza %> alt='imagine lipsa' title= <%= adidas.nume %>>\
				<figcaption id='nume'><%= adidas.nume %></figcaption>\
				</figure>\
				<p><%= adidas.marimi %></p>\
				<p><%= adidas.culoare %></p>\
				<p><%= adidas.pret %> RON</p>\
				<p><%= adidas.gen %></p>\
				<p><%= adidas.livraregratis%><p>\
				<p><%= adidas.lansare%><p>\
				</div>", 
				{adidas: obJson.adidasi[i]});
				}
			}
			tabelProd.innerHTML=textTemplate;
	}
	//CAUTARE PRODUSE CU LIVRARE GRATUITA
	document.getElementById("filter_livrare").onclick=function(){
		let cheie = cheieLocalStorage();
		let s = "cautalivrare";
		localStorage.setItem(cheie,s);
		cautareLivrareGratis();
	}
	
	function cautareLivrareGratis(){
		var randuri = tabelProd.children;
		for(let i = 0;i<randuri.length;i++)
		{
			
			let livrare = randuri[i].children[5].innerHTML == "true" ? true : false;
			if(!livrare)
			{
				randuri[i].remove();
				i-=1;
			}
		}
	}
   //BUTON RESETARE TABEL
   document.getElementById("resetare").onclick=function(){
		resetare();
		alert("CONTINUTUL TABELULUI A FOST RESETAT!");
	}
	
	//FUNCTIE RESETARE TABEL
	function resetare(){
		
		localStorage.clear();
		document.getElementById("i_check3").checked = true;
		document.getElementById("i_check4").checked = true;
		document.getElementById("i_check5").checked = true;
		//actualizarePreferinte();
		tabelProd.innerHTML="";
		afiseazaJsonTemplate(obJson);
		setarePret(0);
	}
	
	//CALCUL PRET PRODUSE SELECTATE
	document.getElementById("calcul_pret").onclick=function(){
		var pretTotal = 0;
		
		var randuri = tabelProd.children;
		
		for(let i=0;i<randuri.length;i++)
		{
			if(randuri[i].classList.contains("selectat"))
			{
				let rand = randuri[i].children[3].innerHTML;
				let pret = rand.split(" ")[0];
				pretTotal+=Number(pret);
			}
		}
		setarePret(pretTotal);
	}
	
	//SETARE PRET AFISAT
	function setarePret(pret){
		let cutieMesaj = document.getElementById("pret_calculat");
		let mesaj = cutieMesaj.innerHTML;
		mesaj = mesaj.split(" ");
		mesaj[5] = pret;
		cutieMesaj.innerHTML = mesaj.join(" ");
	}
	//SORTARE COMPLEXA 1
	//SORTARE DUPA NUME BRAND, PRET, RATING
	document.getElementById("complex1").onclick=function(){
		resetare();
		var randuri = tabelProd.children;
		var vranduri = Array.prototype.slice.call(randuri);
	}
	
	//SORTARE COMPLEXA 2
	//GRUPATI DUPA LUNA APARITIE, APOI AN, APOI ZI
	document.getElementById("complex2").onclick=function(){
		resetare();
		var randuri = tabelProd.children;
		var vranduri = Array.prototype.slice.call(randuri);
		
		vranduri.sort(function(a,b){
        let data1 = a.children[7].innerHTML.split("-");
		let luna1 = Number(data1[1]);
		let an1 = Number(data1[0]);	
		let data2 = b.children[7].innerHTML.split("-");
		let luna2 = Number(data2[1]);
		let an2 = Number(data2[0]);
		
		if(luna1 == luna2)
		{
			if(an1 == an2)
				return 0;
			else
				return an1 < an2 ? -1 : 1;
		}
		else
			return luna1 < luna2 ? -1 : 1;
		
		});
		
		for(let rand of vranduri){
			tabelProd.appendChild(rand);
			}
		
	}
	
	//SORTARE COMPLEXA 3
	//SORTARE DUPA NUMAR PERECHI VALABILE APOI DUPA LIVRARE
	document.getElementById("complex3").onclick=function(){
		resetare();
		var randuri = tabelProd.children;
		var vranduri = Array.prototype.slice.call(randuri);
	}
	
	//UTILIZARE LOCAL STORAGE
	function actualizarePreferinte(){
		if(localStorage.length != 0){
			var cheie = 0;
			var text="";
			while(localStorage.getItem(cheie))
			{
				let optiune = localStorage.getItem(cheie);
				//text +=optiune;
				optiune = optiune.split(" ");
				cheie+=Number(1);
				switch(optiune[0])
				{
					case "sortnume":
						sortareDupaNume(Number(optiune[1]));
						break;
					case "sortpret":
						sortareDupaPret(Number(optiune[1]));
						break;
					case "marime":
						if(optiune[1])
							filtrareMarime(Number(optiune[1]));
						break;
					case "pretmaxim":
						filtrarePret(Number(optiune[1]));
						break;
					case "F":
						filtrareTip("F",Number(optiune[1]));
						if(Number(optiune[1]) == 0)
							document.getElementById("i_check4").checked = false;
						else
							document.getElementById("i_check4").checked = true;
						break;
					case "M":
						filtrareTip("M",Number(optiune[1]));
						if(Number(optiune[1]) == 0)
							document.getElementById("i_check3").checked = false;
						else
							document.getElementById("i_check3").checked = true;
						break;
					case "U":
						filtrareTip("U",Number(optiune[1]));
						if(Number(optiune[1]) == 0)
							document.getElementById("i_check5").checked = false;
						else
							document.getElementById("i_check5").checked = true;
						break;
					case "cautalivrare":
						cautareLivrareGratis();
						break;
					
				}
			}
			//tabelProd.innerHTML = text;
		}
	}
	
}

   
