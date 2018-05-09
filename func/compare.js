const levenshtein = require("fast-levenshtein");

module.exports = {
    getSimilarity : function(string1, string2) {
        if (!string1 || !string2) return;

        return 1 - (levenshtein.get(string1, string2) / Math.max(string1.length, string2.length));
    },
    countWords : function(string) {
        return string.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/\s{2,}/g," ").toLowerCase().split(" ").length;
    },
    countChars : function(string) {
        return string.replace(/\s/g, "").length;
    },
    getNumCommonWords : function(string1, string2) {
        let arr1 = string1.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/\s{2,}/g," ").toLowerCase().split(" ");
        let arr2 = string2.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/\s{2,}/g," ").toLowerCase().split(" ");

        let count = 0;

        for (let word of arr1) {
            for (let i = 0; i < arr2.length; i++) {
                if (word === arr2[i]) {
                    count++;
                    arr2.splice(i, 1);
                    break;
                }
            }
        }

        return count;
    },
    getNumCommonChars : function(string1, string2) {
        let arr1 = string1.replace(/\s/g,"").toLowerCase().split("");
        let arr2 = string2.replace(/\s/g,"").toLowerCase().split("");

        let count = 0;

        for (let char of arr1) {
            for (let i = 0; i < arr2.length; i++) {
                if (char === arr2[i]) {
                    count++;
                    arr2.splice(i, 1);
                    break;
                }
            }
        }

        return count;
    }
}