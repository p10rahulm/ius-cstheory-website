
function clickNav(clicked_id){
    divIdString = clicked_id.substring(7)

    document.getElementById("Home").classList.add("inactive")
    document.getElementById("Talks").classList.add("inactive");
    document.getElementById("Visits").classList.add("inactive");
    document.getElementById("Publications").classList.add("inactive");

    document.getElementById("Home").classList.remove("active")
    document.getElementById("Talks").classList.remove("active");
    document.getElementById("Visits").classList.remove("active");
    document.getElementById("Publications").classList.remove("active");

    document.getElementById(divIdString).classList.remove("inactive");
    document.getElementById(divIdString).classList.add("active");



    document.getElementById("navbar-Home").classList.remove("navbar-active");
    document.getElementById("navbar-Talks").classList.remove("navbar-active");
    document.getElementById("navbar-Visits").classList.remove("navbar-active");
    document.getElementById("navbar-Publications").classList.remove("navbar-active");
    document.getElementById(clicked_id).classList.add("navbar-active");


}