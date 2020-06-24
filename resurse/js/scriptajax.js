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
					var obJson = JSON.parse(this.responseText);
					afiseajaJsonTemplate(obJson, 'afisF');
					afiseajaJsonTemplate(obJson, 'afisM');
			}
	};
	//deschid o conexiune cu o cerere de tip get catre server
	//json e pus in folderul static "resurse" deci calea e relativa la acel folder (fisierul e la calea absoluta /resurse/json/studenti.json)
	ajaxRequest.open("GET", "/json/adidasi.json", true);
	//trimit catre server cererea
	ajaxRequest.send();

	function afiseajaJsonTemplate(obJson, id) { 
			//in acets div voi afisa template-urile   
			let container=document.getElementById(id);

			//in textTemplate creez continutul (ce va deveni innerHTML-ul) divului "afisTemplate"
			let textTemplate ="";
			//parcurg vetorul de studenti din obJson
			for(let i=0;i<obJson.adidasi.length;i++){
				//creez un template ejs (primul parametru al lui ejs.render)
				//acesta va primi ca parametru un student din vectorul de studenti din json {student: obJson.studenti[i]}
				//practic obJson.studenti[i] e redenumit ca "student" in template si putem sa ii accesam proprietatile: student.id etc
				if(obJson.adidasi[i].gen == 'U' || obJson.adidasi[i].gen == id.substr(-1))
				{
				textTemplate+=ejs.render("<div class='template_adidas'>\
				<figure>\
				<img src=<%= '/imagini/' + adidas.poza %> alt='imagine lipsa' title= <%= adidas.nume %>>\
				<figcaption><%= adidas.nume %></figcaption>\
				</figure>\
				<p><%= adidas.marimi %></p>\
				<p><%= adidas.culoare %></p>\
				<p><%= adidas.pret %> RON</p>\
				</div>", 
				{adidas: obJson.adidasi[i]});
				}
				
			} 
			//adaug textul cu afisarea studentilor in container
			container.innerHTML=textTemplate;
	}
}