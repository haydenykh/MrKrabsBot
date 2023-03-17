/**
 * @param {Error | undefined} error
 * @returns {void}
 */
function ErrorLogger(error) {
    const XHR = new XMLHttpRequest();

    XHR.open("POST", "/log");

    XHR.setRequestHeader("Content-Type", "application/json");

    XHR.onload = function () {
        if (this.status === 200) {
            console.log(`Error logged successfully.`);
        } else {
            console.log(`Error logging failed.`);
        }
    };

    const data = { error: error.message };
    XHR.send(JSON.stringify(data));
}

module.exports = { ErrorLogger };
