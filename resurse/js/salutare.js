window.addEventListener('load', salutareUtilizator)

function salutareUtilizator(){
	var nume = prompt("Cum te numesti?");
	var aux = document.title;
	document.title = "Salut, " + nume + "!";
	setTimeout(function(){document.title = aux;}, 2000);
}