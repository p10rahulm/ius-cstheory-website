function readTalks(dirName) {
    filesListPath = "files.list";
    const filesListRaw = loadFile(dirName + filesListPath);
    const filenames = filesListRaw.split('\n');
    for (let i = 1; i < filenames.length; i++) {
        console.log(filenames[i]);
        let talkName = filenames[i];

        createTalk(talkName, dirName);
    }
    setAbstracts();
}

function loadFile(filePath) {
    var result = null;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", filePath, false);
    xmlhttp.send();
    if (xmlhttp.status == 200) {
        result = xmlhttp.responseText;
    }
    return result;
}

function createTalk(talkName, dirName) {
    const contents = loadFile(dirName + talkName);
    const talkKV = parseContents(contents);
    const seminar = document.createElement("div");
    let seminarDate = new Date();
    seminar.className = "seminar";
    if (talkKV.title) {
        const metadiv = document.createElement("div");
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
        seminar.appendChild(metadiv);
    }
    if (talkKV.location) {
        const metadiv = document.createElement("div");
        metadiv.innerHTML = talkKV.location;
        metadiv.className = "seminar-location"
        seminar.appendChild(metadiv);
    }
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
    if (talkKV.article) {
        const metadiv = document.createElement("div");
        metadiv.innerHTML = talkKV.article;
        metadiv.className = "seminar-abstract-short"
        metadiv.setAttribute("onClick", "seeMoreAbstract(this)")
        seminar.appendChild(metadiv);
    }
    const currTime = new Date();
    if (seminarDate >= currTime) {
        document.getElementById("upcoming-seminars").appendChild(seminar);
    } else {
        document.getElementById("past-seminars").appendChild(seminar);
    }


}

function parseContents(contents) {

    //Remove comments from string: https://stackoverflow.com/questions/5989315/regex-for-match-replacing-javascript-comments-both-multiline-and-inline
    contents = contents.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1');
    const contentLines = contents.split("\n");
    // console.log("contentLines = ", contentLines);
    const contentKV = {};
    let inMeta = 0;
    let inContent = 0;
    let lineNo = 0;
    let multiline = "";
    let multilineKey = "";
    for (lineNo = 0; lineNo < contentLines.length && !inContent; lineNo++) {
        // console.log(contentLines[lineNo]);
        if (!inMeta && contentLines[lineNo].trim() == "+++") {
            // console.log("line number of meta start = ",lineNo);
            inMeta = 1;
            continue;
        } else if (inMeta && contentLines[lineNo].trim() == '+++') {
            // console.log("line number of meta end = ",lineNo);
            inContent = 1;
        } else if (inMeta && multiline != "") {
            // console.log("Parsing >1 line of multiline comment");
            multiline = multiline.concat('\n', contentLines[lineNo].trim());
            if (multiline.slice(-3) == "'''") {
                contentKV[multilineKey] = multiline.slice(0, -3);
                // console.log("key = ",multilineKey,",val = ",contentKV[multilineKey] );
                multiline = "";
                multilineKey = "";

            }

        } else if (inMeta && multiline == "") {
            keyval = contentLines[lineNo].split(/=(.+)/);
            if (keyval.length > 1) {
                let key = keyval[0].trim();
                let val = keyval[1].trim();
                // console.log("key = ",key,"val = ",val, "val[0]=",val[0],"val[0]==\"",val[0]=="\"");
                if (val[0] == "\"") {
                    val = val.slice(1, -1);
                    contentKV[key] = val;
                }
                if (val.length > 3 && (val.slice(0, 3) == "'''")) {
                    // console.log("Parsing first line of multiline comment");
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
    // console.log("contentKV.article = ",contentKV.article);
    console.log("contentKV = ", contentKV);
    return contentKV;


}
