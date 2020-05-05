document.addEventListener("DOMContentLoaded", start);
function start() {
    //Load Home
    loadHome("content/");
    //Load Seminars
    loadTalks("content/seminars/","files.list");
    //Load Swipes
    oneRingToSwipemAll();
}
//Try not to use below function as it's blocking code
function loadFile(filePath) {
    var result = null;
    var xmlhttp = new XMLHttpRequest();
    console.log("filePath=", filePath);
    xmlhttp.open("GET", filePath, false);
    xmlhttp.send();
    if (xmlhttp.status == 200) {
        result = xmlhttp.responseText;
    }
    return result;
}

function loadFileAsync(filePath) {
    var result = null;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", filePath, true);
    xmlhttp.send();
    return xmlhttp;

}

function clickHome(){
    window.location = window.location.origin + window.location.pathname;
}

function loadHome(dirName) {
    query = getSearchString();
    const talkIndex = query.indexOf("talk=")
    if(talkIndex==-1){
        generateHomeHTML(dirName);
    } else {
        let talkName = query.substr(talkIndex+5);
        const talkHttp = loadFileAsync(dirName+"seminars/" + talkName + ".md");
        talkHttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                const seminarContents = this.responseText;
                [seminar, seminarDate] = createTalk(seminarContents, talkName + ".md",1);
                const seminarHome = document.createElement("div");
                seminarHome.id = "seminarHome";
                seminarHome.className = "home-text";
                seminarHome.appendChild(seminar);
                const homeDiv = document.getElementById("Home");
                homeDiv.appendChild(seminarHome);

            }
        }
    }
}
function getSearchString(){return window.location.search;}

function loadIntroText(introResponse){
    //Introduction
    const introPart = document.createElement("div");
    introPart.className = "home-text"
    para = introResponse.responseText;
    paraS = para.split("~~~");

    for(let i =0;i<paraS.length;i++){
        let para = document.createElement("div");
        para.className = "home-textpara";
        para.innerHTML = paraS[i];
        introPart.appendChild(para);
    }
    document.getElementById("Home").appendChild(introPart);
}
function loadCollaborators(collabResponse){
    //Collaborators Heading
    const collabHeading = document.createElement("div");
    collabHeading.className = "home-header";
    collabHeading.innerHTML = "Collaborators";
    document.getElementById("Home").appendChild(collabHeading);

    //Create Page
    const institutes = document.createElement("div");
    institutes.className= "home-text";
    institutes.id = "institutions"
    instisData = collabResponse.responseText;
    instisDataS = instisData.split("+++");
    for (let i = 0;i<instisDataS.length;i++){
        let institute = document.createElement("div");
        institute.className = "institute";

        let instiData =  instisDataS[i].trim();
        let instiDataS =  instiData.split("\n");

        let instituteName = document.createElement("div");
        instituteName.className = "institute-name";
        let instituteLink = document.createElement('a');
        instituteLink.className = "institute-name-link";
        instituteLink.target = "_blank";
        instiNameSplit = instiDataS[0].split("||");
        instituteLink.href = instiNameSplit[1];
        instituteLink.innerHTML = instiNameSplit[0];
        instituteName.appendChild(instituteLink);
        institute.appendChild(instituteName);
        uldiv = document.createElement("ul");
        for(let j =1;j<instiDataS.length;j++){
            let lidiv = document.createElement("li");
            let personName = document.createElement("a");
            personName.className = "name";
            personName.target = "_blank";
            nameSplit = instiDataS[j].split("||");
            personName.href = nameSplit[1];
            personName.innerHTML = nameSplit[0];
            lidiv.appendChild(personName);
            uldiv.appendChild(lidiv);
        }
        if(instiDataS.length>1){
            institute.appendChild(uldiv);
        }
        institutes.appendChild(institute);
    }
    document.getElementById("Home").appendChild(institutes);
}

function generateHomeHTML(dirName){
    //HomePage
    const introhttp = loadFileAsync(dirName+"home/intro.txt");
    const collaboratorshttp = loadFileAsync(dirName+"home/collaborators.txt");
    introhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            loadIntroText(this);
            collaboratorshttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    loadCollaborators(this);
                }
            }
        }
    }
}