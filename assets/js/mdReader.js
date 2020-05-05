function loadTalks(dirName, filesListPath) {
    filesListPath = "files.list";
    const filesListHttp = loadFileAsync(dirName + filesListPath);
    filesListHttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const filesListRaw = this.responseText;
            const filenames = filesListRaw.split('\n');
            for (let i = 1; i < filenames.length; i++) {
                // console.log(filenames[i]);
                let talkFile = filenames[i];
                let talkhttp = loadFileAsync(dirName + talkFile);
                talkhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        [seminar, seminarDate] = createTalk(this.responseText, talkFile, 0);
                        const currTime = new Date();
                        if (seminarDate >= currTime) {
                            document.getElementById("upcoming-seminars").appendChild(seminar);
                        } else {
                            document.getElementById("past-seminars").appendChild(seminar);
                        }

                    }
                }
            }
        }
    }
    if (document.readyState == "complete") {
        //reset all the "see mores after including new data"
        setAbstracts();
        //reset Mathjax typesetting
        MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    }


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

function createTalk(talkContents, talkFile, divLocation) {
    const talkKV = parseContents(talkContents);
    const seminar = document.createElement("div");

    let seminarDate = new Date();
    seminar.className = "seminar";
    if (talkKV.title) {
        let metadiv;
        if(divLocation==0){
            metadiv = document.createElement("a");
            const talkName = talkFile.slice(0,talkFile.indexOf("."))
            const baseUrl = window.location.origin + window.location.pathname;
            metadiv.href = baseUrl + "?talk="+talkName;
        } else {
            metadiv = document.createElement("div");
        }
        metadiv.innerHTML = talkKV.title;
        metadiv.className = "seminar-title"
        seminar.appendChild(metadiv);
    }
    if (talkKV.author) {
        const metadiv = document.createElement("div");
        metadiv.innerHTML = talkKV.author;
        metadiv.className = "seminar-speaker"
        seminar.appendChild(metadiv);
    }
    if (talkKV.date || talkKV.location) {
        const metadivholder = document.createElement("div");
        metadivholder.className = "seminar-dateloc"
        if (talkKV.date) {
            const metadiv = document.createElement("div");
            let dateStartTime = new Date(talkKV.date);
            seminarDate = dateStartTime;
            if (talkKV.date_end) {
                let dateEndTime = new Date(talkKV.date_end);
                if (dateEndTime.getDate() == dateStartTime.getDate()) {
                    metadiv.innerHTML = dateStartTime.toLocaleString() + '-' + dateEndTime.toLocaleTimeString();
                } else {
                    metadiv.innerHTML = dateStartTime.toLocaleString() + '-' + dateEndTime.toLocaleString();
                }

            } else {
                metadiv.innerHTML = dateStartTime.toLocaleString();
            }
            metadiv.className = "seminar-time"
            metadiv.classList.add("seminar-dateloc-child");
            metadivholder.appendChild(metadiv);
        }
        if (talkKV.location) {
            const metadiv = document.createElement("div");
            metadiv.innerHTML = talkKV.location;
            metadiv.className = "seminar-location"
            metadiv.classList.add("seminar-dateloc-child");
            metadivholder.appendChild(metadiv);
        }
        seminar.appendChild(metadivholder);
    }
    if (talkKV.article) {
        const metadiv = document.createElement("div");
        metadiv.innerHTML = talkKV.article;
        if (divLocation == 0) {
            metadiv.className = "seminar-abstract-short"
        } else if (divLocation == 1) {
            metadiv.className = "seminar-abstract"
        } else {
            metadiv.className = "seminar-abstract-short"
        }

        metadiv.setAttribute("onClick", "seeMoreAbstract(this)")
        seminar.appendChild(metadiv);
    }
    if (divLocation == 1) {
        if (talkKV.notes) {
            const metadiv = document.createElement("div");
            metadiv.innerHTML = talkKV.notes;
            metadiv.className = "seminar-notes"
            seminar.appendChild(metadiv);
        }
        if (talkKV.link_to_paper) {
            const metadiv = document.createElement("div");
            metadiv.innerHTML = talkKV.link_to_paper;
            metadiv.className = "seminar-paper"
            seminar.appendChild(metadiv);
        }
        if (talkKV.link_to_recording) {
            const metadiv = document.createElement("div");
            metadiv.innerHTML = talkKV.link_to_recording;
            metadiv.className = "seminar-recording"
            seminar.appendChild(metadiv);
        }
    }
    return [seminar, seminarDate];


}

function parseContents(contents) {

    //Remove comments from string: https://stackoverflow.com/questions/5989315/regex-for-match-replacing-javascript-comments-both-multiline-and-inline
    contents = contents.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1');
    const contentLines = contents.split("\n");
    const contentKV = {};
    let inMeta = 0;
    let inContent = 0;
    let lineNo = 0;
    let multiline = "";
    let multilineKey = "";
    for (lineNo = 0; lineNo < contentLines.length && !inContent; lineNo++) {
        if (!inMeta && contentLines[lineNo].trim() == "+++") {
            inMeta = 1;
            continue;
        } else if (inMeta && contentLines[lineNo].trim() == '+++') {
            inContent = 1;
        } else if (inMeta && multiline != "") {
            multiline = multiline.concat('\n', contentLines[lineNo].trim());
            if (multiline.slice(-3) == "'''") {
                contentKV[multilineKey] = multiline.slice(0, -3);
                multiline = "";
                multilineKey = "";

            }

        } else if (inMeta && multiline == "") {
            keyval = contentLines[lineNo].split(/=(.+)/);
            if (keyval.length > 1) {
                let key = keyval[0].trim();
                let val = keyval[1].trim();
                if (val[0] == "\"") {
                    val = val.slice(1, -1);
                    contentKV[key] = val;
                }
                if (val.length > 3 && (val.slice(0, 3) == "'''")) {
                    multilineKey = key;
                    multiline = val.slice(3).trim();
                    if (multiline.slice(-3) == "'''") {
                        contentKV[multilineKey] = multiline.slice(0, -3)
                        multiline = "";
                        multilineKey = "";
                    }
                }
                // console.log("key = ",key,",val = ",val);
            }
        }


    }

    contentKV.article = contentLines.slice(lineNo).join('\n');
    return contentKV;


}
