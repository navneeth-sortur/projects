document.addEventListener("DOMContentLoaded", function () {
  const textarea = document.getElementById("message");
  const counter = document.getElementById("counter");
  const maxLength = 250;

  counter.textContent = `0 / ${maxLength}`;

  textarea.addEventListener("input", function () {
    const currentLength = textarea.value.length;

    counter.textContent = `${currentLength} / ${maxLength}`;

    if (currentLength >= maxLength) {
      textarea.classList.add("limit-reached");
      counter.classList.add("limit-reached");

      if (currentLength > maxLength) {
        textarea.value = textarea.value.substring(0, maxLength);
      }
    } else {
      textarea.classList.remove("limit-reached");
      counter.classList.remove("limit-reached");
    }
  });

  textarea.addEventListener("paste", function (e) {
    const pasteData = e.clipboardData.getData("text");
    const currentLength = textarea.value.length;
    const newLength = currentLength + pasteData.length;

    if (newLength > maxLength) {
      e.preventDefault();

      const allowedLength = maxLength - currentLength;
      if (allowedLength > 0) {
        const truncatedPaste = pasteData.substring(0, allowedLength);
        document.execCommand("insertText", false, truncatedPaste);
      }
    }
  });
});
