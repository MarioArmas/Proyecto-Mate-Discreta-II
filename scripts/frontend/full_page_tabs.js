// FRONTEND
function openPage(pageName, element) {
    var i, tabcontent, tablinks;

    // hide elements
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // fix color from buttons
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].style.backgroundColor = "";
        tablinks[i].classList.remove('current_page');
        /* tablinks[i].style.color = "#e60073"; */
    }

    // show tab
    document.getElementById(pageName).style.display = "block";
    
    // add color to button
    element.style.backgroundColor = "#e60073";
    element.classList.add('current_page');
}

document.getElementById("defaultOpen").click();

