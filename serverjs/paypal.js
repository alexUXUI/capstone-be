function sendMail() {
    var link = "mailto:alexandergraybennett@gmail.com"
             + "?cc=alexandergraybennett@gmail.com"
             + "&subject=" + escape("Reciept from Rebel Markets")
             + "&body=" + escape("hello from the body")
    ;
    window.location.href = link;
}
