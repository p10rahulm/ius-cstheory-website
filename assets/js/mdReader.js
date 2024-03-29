function loadTalks(contentUrl, filesListPath) {
    dirName = contentUrl + 'seminars/'
    filesListPath = "files.list";
    const filesListHttp = loadFileAsync(dirName + filesListPath);
    filesListHttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const filesListRaw = this.responseText.trim();
            const filenames = filesListRaw.split('\n');
            for (let i = 1; i < filenames.length; i++) {
                let talkFile = filenames[i];
                let talkhttp = loadFileAsync(dirName + talkFile);
                //create holders so that it does not go out of place in async
                talkFileName = talkFile.slice(0, -3);
                talkHolderUpcoming = document.createElement("div");
                talkHolderUpcoming.id = talkFileName + "-upcoming"
                document.getElementById("upcoming-seminars").appendChild(talkHolderUpcoming);
                talkHolderPast = document.createElement("div");
                talkHolderPast.id = talkFileName + "-past"
                document.getElementById("past-seminars").prepend(talkHolderPast);

                talkhttp.onreadystatechange = function (talkFileName) {
                    //We need current value of talkFileName, so creating an outer function that returns an inner function
                    innerFunc = function (event) {
                        if (this.readyState == 4 && this.status == 200) {
                            [seminar, seminarDate, seminarName] = createTalk(this.responseText, talkFile, 0);
                            const currTime = new Date();
                            if (seminarDate >= currTime) {
                                document.getElementById(talkFileName.valueOf() + "-upcoming").appendChild(seminar);
                                nodeToRemove = document.getElementById(talkFileName.valueOf() + "-past")
                                nodeToRemove.parentNode.removeChild(nodeToRemove);

                            } else {
                                document.getElementById(talkFileName.valueOf() + "-past").appendChild(seminar);
                                nodeToRemove = document.getElementById(talkFileName.valueOf() + "-upcoming")
                                nodeToRemove.parentNode.removeChild(nodeToRemove);
                            }
                            //reset Mathjax typesetting
                            MathJax.Hub.Queue(["Typeset", MathJax.Hub, seminar]);
                            setAbstractsforDiv(seminar.getElementsByClassName('seminar-abstract-short')[0]);
                        }
                    }
                    return innerFunc;
                }(talkFileName);
            }
        }
    }
}


function setAbstractsforDiv(abstractdiv) {
    const abstractDone = abstractdiv.parentElement.getElementsByClassName("seminar-abstract-seemore").length;
    if (isOverflown(abstractdiv) && !abstractDone) {
        //create a see less token
        const newdiv = document.createElement("div");
        newdiv.innerHTML = "...See More<i class=\"arrow down\"></i>";
        newdiv.className = "seminar-abstract-seemore"
        newdiv.setAttribute("onClick", "seeMoreAbstract(this.parentElement.getElementsByClassName('seminar-abstract-short')[0])");
        abstractdiv.parentElement.appendChild(newdiv);
    }
}

function isOverflown(element) {
    return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
}

function createTalk(talkContents, talkFile, divLocation) {
    const talkKV = parseContents(talkContents);
    const seminar = document.createElement("div");

    let seminarDate = new Date();
    seminar.className = "seminar";
    if (talkKV.title) {
        let metadiv;
        if (divLocation == 0) {
            metadiv = document.createElement("div");
            const talkName = talkFile.slice(0, talkFile.indexOf("."))
            metadiv.id = talkName;
            const baseUrl = window.location.origin + window.location.pathname;
            let talkUrl = baseUrl + "?talk=" + talkName;
            metadiv.onclick = function () {
                clickTalk(talkKV.title.valueOf(), talkUrl.valueOf())
            };


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
    return [seminar, seminarDate,talkKV.title];


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
            }
        }


    }

    contentKV.article = contentLines.slice(lineNo).join('\n');
    return contentKV;


}
