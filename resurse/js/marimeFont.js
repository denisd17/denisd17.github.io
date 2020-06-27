window.addEventListener('load', marimeFont)

function marimeFont(){
	var postari = document.getElementsByClassName("postare");
	var optiune = localStorage.getItem("optiune");
	if(optiune)
	{
		switch(optiune){
			case "1":
			let buton1 = document.getElementById("i_rad1");
			buton1.checked = true;
			setFont("font-mic","1");
			break;
			case "2":
			let buton2 = document.getElementById("i_rad2");
			buton2.checked = true;
			setFont("font-mediu","2");
			break;
			case "3":
			let buton3 = document.getElementById("i_rad3");
			buton3.checked = true;
			setFont("font-mare","3");
			break;
		}
	}
	
	document.getElementById("resetareop").onclick=function(){
		localStorage.removeItem("optiune");
		
		
		for(let post of postari)
		{
			stergere(post);
		}
		var radiobuttons=document.getElementsByName("gr_rad");		
		
		for(let rad of radiobuttons){
			if(rad.checked){
				rad.checked = false;
				break;
			}
		}
	}
	//STERGERE OPTIUNI
	function stergere(el){
		el.classList.remove("font-mic");
		el.classList.remove("font-mediu");
		el.classList.remove("font-mare");
	}
	//SETARE FONT MIC
	document.getElementById("i_rad1").onclick=function(){
		
		setFont("font-mic","1");
	}
	
	
	//SETARE FONT MEDIU
	document.getElementById("i_rad2").onclick=function(){
		
		setFont("font-mediu","2");
	}
	
	//SETARE FONT MARE
	document.getElementById("i_rad3").onclick=function(){
		
		setFont("font-mare","3");
	}
	
	//SETARE GENERALA FONT
	function setFont(clasa, id){
		for(let post of postari)
		{
			stergere(post);
			post.classList.add(clasa);
		}
		localStorage.setItem("optiune",id);
	}
}