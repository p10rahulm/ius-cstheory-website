function clickNav(clicked_id) {
    divIdString = clicked_id.substring(7)

    document.getElementById("Home").classList.add("inactive")
    document.getElementById("Talks").classList.add("inactive");
    document.getElementById("Visits").classList.add("inactive");
    document.getElementById("JoinUs").classList.add("inactive");

    document.getElementById("Home").classList.remove("active");
    document.getElementById("Talks").classList.remove("active");
    document.getElementById("Visits").classList.remove("active");
    document.getElementById("JoinUs").classList.remove("active");

    document.getElementById(divIdString).classList.remove("inactive");
    document.getElementById(divIdString).classList.add("active");


    document.getElementById("navbar-Home").classList.remove("navbar-active");
    document.getElementById("navbar-Talks").classList.remove("navbar-active");
    document.getElementById("navbar-Visits").classList.remove("navbar-active");
    document.getElementById("navbar-JoinUs").classList.remove("navbar-active");
    document.getElementById(clicked_id).classList.add("navbar-active");

    if(clicked_id=="navbar-Talks"){
        document.getElementById("subscribe-holder").classList.add("subscribe-active");
        document.getElementById("subscribe-holder").classList.remove("subscribe-inactive");
    } else{
        document.getElementById("subscribe-holder").classList.remove("subscribe-active");
        document.getElementById("subscribe-holder").classList.add("subscribe-inactive");
    }

}

function setHash(clicked_id){
    divIdString = clicked_id.substring(7);
    const navTitle = document.title;
    const navUrl = window.location.origin + window.location.pathname + window.location.search + "#"+ divIdString;
    let contentUrl;
    const indexOfIndex = window.location.pathname.indexOf("index.html");
    if(indexOfIndex==-1){
        contentUrl = window.location.origin + window.location.pathname + 'content/'
    } else {
        contentUrl = window.location.origin + window.location.pathname.substr(0,indexOfIndex) + 'content/'
    }

    const navState = {"title":navTitle,"url":navUrl,"contentUrl":contentUrl};

    history.pushState(navState, navTitle, navUrl);
}

function seeMoreAbstract(element) {
    if (element.classList.contains("seminar-abstract-short") && isOverflown(element)) {
        element.classList.remove("seminar-abstract-short");
        element.classList.add("seminar-abstract");


        //create a see less token
        const newdiv = document.createElement("div");
        newdiv.innerHTML = "...See Less<i class=\"arrow up\"></i>";
        newdiv.className = "seminar-abstract-seeless";
        newdiv.setAttribute("onClick", "seeLessAbstract(this)");
        // newdiv.onclick = "seeLessAbstract(newdiv)";
        element.parentElement.appendChild(newdiv);

        seemore = element.parentElement.getElementsByClassName("seminar-abstract-seemore")[0];
        seemore.parentElement.removeChild(seemore);


    }
}


function setAbstracts() {
    abstracts = document.getElementsByClassName("seminar-abstract-short");
    for (let i = 0; i < abstracts.length; i++) {
        let abstract = abstracts.item(i);
        let abstractDone = abstract.parentElement.getElementsByClassName("seminar-abstract-seemore").length;
        if (isOverflown(abstract) && !abstractDone) {
            //create a see less token
            const newdiv = document.createElement("div");
            newdiv.innerHTML = "...See More<i class=\"arrow down\"></i>";
            newdiv.className = "seminar-abstract-seemore"
            newdiv.setAttribute("onClick", "seeMoreAbstract(this.parentElement.getElementsByClassName('seminar-abstract-short')[0])");
            abstract.parentElement.appendChild(newdiv);
        }
    }

}




function seeLessAbstract(element) {
    const abstract = element.parentElement.getElementsByClassName("seminar-abstract").item(0);
    abstract.classList.remove("seminar-abstract");
    abstract.classList.add("seminar-abstract-short");
    const newdiv = document.createElement("div");
    newdiv.innerHTML = "...See More<i class=\"arrow down\"></i>";
    newdiv.className = "seminar-abstract-seemore"
    newdiv.setAttribute("onClick", "seeMoreAbstract(this.parentElement.getElementsByClassName('seminar-abstract-short')[0])");
    abstract.parentElement.appendChild(newdiv);
    element.parentNode.removeChild(element);
}



//Touch

function oneRingToSwipemAll(){
    //right-swipe on Home
    document.getElementById('Home').addEventListener('swiped-right', function (e) {
        clickNav("navbar-JoinUs");
    });
    //left-swipe on Home
    document.getElementById('Home').addEventListener('swiped-left', function (e) {
        clickNav("navbar-Talks");
    });


    //right-swipe on Talks
    document.getElementById('Talks').addEventListener('swiped-right', function (e) {
        clickNav("navbar-Home");
    });
    //left-swipe on Talks
    document.getElementById('Talks').addEventListener('swiped-left', function (e) {
        clickNav("navbar-Visits");
    });

    //right-swipe on Visits
    document.getElementById('Visits').addEventListener('swiped-right', function (e) {
        clickNav("navbar-Talks");
    });
    //left-swipe on Visits
    document.getElementById('Visits').addEventListener('swiped-left', function (e) {
        clickNav("navbar-JoinUs");
    });

    //right-swipe on JoinUs
    document.getElementById('JoinUs').addEventListener('swiped-right', function (e) {
        clickNav("navbar-Visits");
    });
    //left-swipe on JoinUs
    document.getElementById('JoinUs').addEventListener('swiped-left', function (e) {
        clickNav("navbar-Home");
    });
}
