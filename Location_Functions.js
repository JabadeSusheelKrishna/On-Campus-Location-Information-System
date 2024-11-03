const pop_details_printer = function(details){
   document.getElementById("popup").style.display = "block";
   document.getElementById("popup_heading").innerHTML = details["name"];
   document.querySelector(".popup-image").src = details["image"];
   document.getElementById("popup_details").innerHTML = details["info"];
}

var Bakul_det_printer = function () {
   pop_details_printer(bakul_nivas)
}

var T_Hub_det_printer = function () {
   pop_details_printer(T_Hub_details)
}