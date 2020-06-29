window.addEventListener('load', userInactiv)

function userInactiv(){
	var timpInactivitate = 0;
	var chenar = document.getElementById("id_inactivitate");

	setInterval(calculTimp, 60000); //SETEAZA LA LOC 1000, AM SETAT LA 60000 PENTRU A NU APAREA INCONTINUU DIVUL IN TIMPUL PREZENTARII
	
	//RESETARE TIMP INACTIVITATE
	function resetareTimp(){
		
		timpInactivitate = 0;
		chenar.classList.add("display_none");
	}
	//EVENIMENTE MOUSE
    document.onmousemove=function(e){
		
		resetareTimp();
	}
	document.onmousedown=function(e){
		
		resetareTimp();
	}
	document.onmouseup=function(e){
		
		resetareTimp();
	}
	document.onwheel=function(e){
		
		resetareTimp();
	}
	
	//EVENIMENTE TASTATURA
    document.onkeypress=function(e){
        
		resetareTimp();
    }

	function calculTimp(){
    
	timpInactivitate = timpInactivitate + 1;
    
	if (timpInactivitate >= 5) {
        {
          let mesaj = chenar.children[0].innerHTML;
		  
		  mesaj = mesaj.split(" ");
		  mesaj[5] = timpInactivitate;
		  mesaj = mesaj.join(" ");
		  
		  chenar.children[0].innerHTML = mesaj;
          chenar.classList.remove("display_none");
        }
    }
}
}
