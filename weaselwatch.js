var WeaselWatch = {
    words: {
        'puffery': {
            "description": "Peacocking, not facts.",
            "words": ["legendary", "great", "acclaimed", "visionary", "outstanding", "leading", "celebrated", "award-winning", "landmark", "cutting-edge", "innovative", "extraordinary", "brilliant", "hit", "famous", "renowned", "remarkable", "prestigious", "world-class", "respected", "notable", "virtuoso", "honorable", "awesome", "unique"]
        },
        'contentious-label': {
            "description": "Contentious opinion, not facts.",
            "words": ["cult", "racist", "perverted", "sect", "fundamentalist", "heretic", "extremist", "denialist", "terrorist", "freedom fighter", "bigot", "myth", "-gate", "pseudo-", "controversial"]
        },
        'unsupported-attributions': {
            "description": "According to whom?",
            "words": ["some people say", "many scholars state", "is believed", "is regarded", "of the opinion", "most feel", "experts declare", "it is often reported", "it is widely thought", "research has shown", "science says", "scientists claim", "it is often said"]
        },
        'expressions-of-doubt': {
            "description": "Intended to cast doubt, not inform",
            "words": ["supposed", "apparent", "purported", "alleged", "accused", "so-called"]
        },
        'synonym-for-said': {
            "description": "Potentially implies something is true rather than simply claimed",
            "words": ["reveal", "point out", "expose", "explain", "find", "note", "observe", "insist", "speculate", "surmise", "claim", "assert", "admit", "confess", "deny", "clarify"]
        }
    },
 
    getWords: function() { 
        return this.words
    },

    getDomElements: function() {
        return document.querySelectorAll("p","div")
    },

    highlightText: function(weasel_dict, dom_elements) {
        for (weasel_name in weasel_dict) {
            search_words = []
            for (index in weasel_dict[weasel_name]["words"])
                search_words.push('\\b' + weasel_dict[weasel_name]["words"][index] + '\\b')
            search_words = search_words.join('|')
            tooltip = weasel_dict[weasel_name]["description"]
            new_marker = new Mark(dom_elements)
            console.log(search_words)
            new_marker.markRegExp(
                new RegExp(search_words),
                {
                    "element": "span",
                    "className": "weaselword-" + weasel_name,
//                    "separateWordSearch": false,
//                    "accuracy": "exactly",
                    "each": function(node){
                        node.setAttribute("title", tooltip)
                    }
                }
            )
        }
    },

    unhighlightText: function(weasel_dict, dom_elements) {
            new_marker = new Mark(dom_elements)
            new_marker.unmark()
    },

    active: false,
    checkIsActive: function() {
        // Active if markers list has items.
//        return (this.markers.length > 0)
        return this.active
    },
            
    ToggleActive: function() {
        if (!this.checkIsActive()) {
        // Activate
            console.log("Activating WeaselWatch")
            this.highlightText(this.getWords(), this.getDomElements())
            this.active = true
            console.log("WeaselWatch Activated")
        } else {
        // Deactivate
            console.log("Deactivating WeaselWatch")
            this.unhighlightText(this.getWords(), this.getDomElements())
            this.active = false
            console.log("WeaselWatch Deactivated")
        }
    }
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.greeting == "weaselwatch_check_active") {
            console.log("WeaselWatch received " + request.greeting)
            sendResponse({farewell: WeaselWatch.checkIsActive()})
        } else if (request.greeting == "weaselwatch_toggle") {
            console.log("WeaselWatch received " + request.greeting)
            WeaselWatch.ToggleActive()
            sendResponse({farewell: "Toggled. checkActive is " + WeaselWatch.checkIsActive()})
        }
    }
)
