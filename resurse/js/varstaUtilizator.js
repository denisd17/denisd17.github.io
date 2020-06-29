window.addEventListener('load', calculVarsta)
function calculVarsta(){
clicked = false;
document.getElementById("calcul_varsta").onclick=function(){
	let dataNastere = document.getElementById("data_n").value;
	dataNastere = dataNastere.split("#");
	if(dataNastere.length == 3)
		dataNastere = new Date(dataNastere[2],parseInt(dataNastere[1],10)-1,dataNastere[0]);
	else
		return;
	
	if(!isNaN(dataNastere.getDay()) && !clicked)
	{
		
		clicked = true;
		setInterval(function(){varsta_curenta(dataNastere)},1000);
	}
}
function varsta_curenta(dataN){
	//DATA CURENTA
	let chenar = document.getElementById("vv");
	chenar.classList.remove("display_none");
	let textc = ""
	let timp = Math.abs(new Date() - dataN);
	
	if(timp < 0)
		textc+="EROARE: Data de nastere nu poate fi mai mare decat data curenta!"
	
	else{
	let ms = timp % 1000;
	timp = Math.trunc(timp / 1000); //obtinem secundele
	let s = timp % 60;
	timp = Math.trunc(timp / 60); //obtinem minutele
	let min = timp % 60;
	timp = Math.trunc(timp / 60); //obtinem orele
	let ore = timp % 24;
	timp = Math.trunc(timp / 24); //obtinem zilele
	let zile = timp % 30;
	timp = Math.trunc(timp / 30); //obtinem lunile
	let luni = timp % 12;
	timp = Math.trunc(timp / 12); //obtinem anii
	let ani = timp;
	textc = "Varsta dvs. este: " + ani + " ani " +  luni  + " luni  " +  zile  + " zile " +  ore  + " ore " +  min + " minute " +  s + " secunde " + ms + " milisecunde ";
	}
	document.getElementById("vv").innerHTML = textc; 
}
	//ASCUNDERE IMAGINI
		
		document.getElementById("asc_imag").onclick=function(){
		imagini = document.getElementsByTagName("img");
		if(this.innerHTML == "ASCUNDE IMAGINI")
		{
			this.innerHTML = "AFISEAZA IMAGINI";
			for(let imag of imagini)
				imag.classList.add("display_none");
		}
		else
		{
			this.innerHTML = "ASCUNDE IMAGINI";
			for(let imag of imagini)
				imag.classList.remove("display_none");
		}
	}
	//NUMAR RANDOM
	function randInt(a,b){
		return Math.trunc(a+(b-a)*Math.random());
	}
	//RAVAS
	var urari = ["Vei avea parte de reduceri fabuloase!",
				 "Perechea pe care doresti sa o cumperi va reveni in stoc!",
				 "Vei primi cadou perechea de adidasi dorita!",
				 "Curand se va lansa o super pereche de adidasi!",
				 "Urmeaza sa apara o editie limitata de adidasi!"]
	let indice = randInt(0,urari.length);
	let chenarMesaj = document.getElementById("ravas");
	chenarMesaj.children[1].innerHTML = urari[indice];
	
}