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
				</div>", 
				{adidas: obJson.adidasi[i]});
				}
				
			
			//adaug textul cu afisarea studentilor in container
			container.innerHTML=textTemplate;
			actualizarePreferinte();
	}
	tabelProd = document.getElementById("afis_produse");
	
	//SELECTARE ELEMENTE
	document.getElementById("afis_produse").onclick=function(e){
		var produse = this.children;
		for(let prod of produse)
			prod.onclick=function(){
				this.classList.toggle("selectat");
			}
	}
	
	//SORTARE DUPA NUME
	//DOAR PE ELEMENTELE AFISATE LA MOMENTUL RESPECTIV
	document.getElementById("sort_nume").onclick=function(){
		let cheie = localStorage.length;
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
		let cheie = localStorage.length;
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
		
		let cheie = localStorage.length;
		let s = "M ";
		var check = document.getElementById("i_check3");
		if(check.checked)
			adauga=true;
		else
			adauga=false;
		s+=adauga;
		localStorage.setItem(cheie,s);
		filtrareTip("M",adauga);
	}
   
   
   //ADIDASI PENTRU FEMEI
   document.getElementById("i_check4").onclick=function(){
		
		let cheie = localStorage.length;
		let s = "F ";
		var check = document.getElementById("i_check4");
		if(check.checked)
			adauga=true;
		else
			adauga=false;
		s+=adauga;
		localStorage.setItem(cheie,s);
		filtrareTip("F",adauga);
   }
   
   //ADIDASI UNISEX
   document.getElementById("i_check5").onclick=function(){
		
		let cheie = localStorage.length;
		let s = "U ";
		let adauga;
		var check = document.getElementById("i_check5");
		if(check.checked)
			adauga=true;
		else
			adauga=false;
		s+=adauga;
		localStorage.setItem(cheie,s);
		filtrareTip("U",adauga);	
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
		let cheie = localStorage.length;
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
		
		resetare();
		var marime = prompt("Introduceti marimea cautata: ");
		let cheie = localStorage.length;
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
				</div>", 
				{adidas: obJson.adidasi[i]});
				}
			}
			tabelProd.innerHTML=textTemplate;
	}
	
   //BUTON RESETARE TABEL
   document.getElementById("resetare").onclick=function(){
		resetare();
	}
	
	//FUNCTIE RESETARE TABEL
	function resetare(){
		
		localStorage.clear();
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
						if(optiune[1] == "true")
							
						if(optiune[1] == "false")
						
						break;
					case "M":
						if(optiune[1] == "true")
							
						if(optiune[1] == "false")
							
						break;
					case "U":
						if(optiune[1] == "true")
							
						if(optiune[1] == "false")
							
						break;
				}
			}
			//tabelProd.innerHTML = text;
		}
	}
	
}

   
