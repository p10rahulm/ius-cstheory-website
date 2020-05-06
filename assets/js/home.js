document.addEventListener("DOMContentLoaded", start);
function start() {
    let contentUrl;
    const indexOfIndex = window.location.pathname.indexOf("index.html");
    if(indexOfIndex==-1){
        contentUrl = window.location.origin + window.location.pathname + 'content/'
    } else {
        contentUrl = window.location.origin + window.location.pathname.substr(0,indexOfIndex) + 'content/'
    }

    //Load Home
    loadHome(contentUrl);
    //Load Seminars
    loadTalks(contentUrl,"files.list");
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

function generateTalkHTML(talkHTTP,talkName){
    const seminarContents = talkHTTP.responseText;
    [seminar, seminarDate] = createTalk(seminarContents, talkName + ".md",1);
    const seminarHome = document.createElement("div");
    seminarHome.id = "seminarHome";
    seminarHome.className = "home-text";
    seminarHome.appendChild(seminar);
    const homeDiv = document.getElementById("Home");
    homeDiv.appendChild(seminarHome);
    //reset Mathjax typesetting
    MathJax.Hub.Queue(["Typeset", MathJax.Hub,seminarHome]);
}

function loadHome(contentUrl) {
    query = getSearchString();
    const talkIndex = query.indexOf("talk=")
    if(talkIndex==-1){
        generateHomeHTML(contentUrl);
    } else {
        let talkName = query.substr(talkIndex+5);
        const talkHttp = loadFileAsync(contentUrl+"seminars/" + talkName + ".md");
        talkHttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                generateTalkHTML(this,talkName);
            }
        }
    }
}
function getSearchString(){return window.location.search;}

function loadIntroText(introResponse, parentDiv){
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
    parentDiv.appendChild(introPart);
}
function loadCollaborators(collabResponse,parentDiv){
    //Collaborators Heading
    const collabHeading = document.createElement("div");
    collabHeading.className = "home-header";
    collabHeading.innerHTML = "Collaborators";
    collabHeading.id = "collaborators-heading"
    parentDiv.appendChild(collabHeading);

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
    parentDiv.appendChild(institutes);

}

function generateHomeHTML(dirName){
    //HomePage
    const introhttp = loadFileAsync(dirName+"home/intro.txt");
    const collaboratorshttp = loadFileAsync(dirName+"home/collaborators.txt");

    homeDiv = document.getElementById("Home");
    introHolder = document.createElement("div");
    introHolder.id = "intro-holder"
    collabHolder = document.createElement("div");
    collabHolder.id = "collaborators-holder"
    homeDiv.appendChild(introHolder);
    homeDiv.appendChild(collabHolder);

    introhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            loadIntroText(this,introHolder);
        }
    }
    collaboratorshttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            loadCollaborators(this,collabHolder);
        }
    }
}