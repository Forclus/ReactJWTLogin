const winston = require("winston");
const colors = require("colors");

module.exports = {
    log(loaded, Text) {
        console.log(
            colors.green(
                `[${loaded}]`
            ) + colors.white(" " + Text)
        );
    },

    warn(Text) {
        let d = new Date();
        console.log(
            colors.gray(
                `[${d.getDate()}:${d.getMonth()}:${d.getFullYear()} - ${d.getHours()}:${d.getMinutes()}]`
            ) + colors.yellow(" " + Text)
        );
    },

    debug(Text) {
        let d = new Date();
        console.log(
            colors.gray(
                `[${d.getDate()}:${d.getMonth()}:${d.getFullYear()} - ${d.getHours()}:${d.getMinutes()}]`
            ) + colors.blue(" | " + Text)
        );
    }
}