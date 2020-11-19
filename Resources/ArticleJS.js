function showCode(id) {
  let ele = document.getElementById(id);
  /* if (ele.style.transform == "scaleY(0)") {
    ele.style.transform = "scaleY(1)";
  } else ele.style.transform = "scaleY(0)"; */
  if (ele.style.height == "0px" || ele.style.height == "") {
    ele.style.height = ele.firstElementChild.clientHeight + "px";
    // ele.style.height = "144px";
  } else ele.style.height = "0px";
}