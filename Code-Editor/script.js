const run = () => {
  let htmlCode = document.getElementById("html-code").value;
  let cssCode = document.getElementById("css-code").value;
  let jsCode = document.getElementById("js-code").value;
  let outPut = document.getElementById("output");

  outPut.contentDocument.body.innerHTML =
    htmlCode + "<style>" + cssCode + "</style>";
  outPut.contentWindow.eval(jsCode);
};

const initializeDateTime = () => {
  const updateDateTime = () => {
    const now = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    };
    document.getElementById("current-datetime").textContent =
      now.toLocaleDateString("en-US", options);
  };

  updateDateTime();
  setInterval(updateDateTime, 1000);
};

initializeDateTime();
