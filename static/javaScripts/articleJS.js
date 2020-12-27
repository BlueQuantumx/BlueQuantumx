addEventListener("load", () => {
  let i = 1;
  while (true) {
    let ele = document.getElementById("cb" + i);
    if (ele == undefined) break;
    ele.style.zIndex = 99 - i;
    ele.addEventListener("click", () => {
      if (ele.firstElementChild.firstElementChild.style.height == "3em" || ele.firstElementChild.firstElementChild.style.height == "") {
        ele.firstElementChild.firstElementChild.style.height =
          ele.firstElementChild.firstElementChild.childElementCount * ele.firstElementChild.firstElementChild.firstElementChild.offsetHeight + 20 + "px";
      } else {
        ele.firstElementChild.firstElementChild.style.height = "3em";
      }
    });
    ++i;
  }
});