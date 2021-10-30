// FRONTEND
var modal1 = document.getElementById('form_login_user');
var modal2 = document.getElementById('form_register_admin');
var modal3 = document.getElementById('form_login_admin');
var modal4 = document.getElementById('form_register_user');

var btn1 = document.getElementById('button_modal1');
var btn2 = document.getElementById('button_modal2');
var btn3 = document.getElementById('button_modal3');
var btn4

window.onclick = function(event) {
    if (event.target == modal1) {
        modal1.style.display = "none";
    }

    if (event.target == modal2) {
        modal2.style.display = "none";
    }
    
    if (event.target == modal3) {
        modal3.style.display = "none";
    }

    if (event.target == modal4) {
        modal4.style.display = "none";
    }
}