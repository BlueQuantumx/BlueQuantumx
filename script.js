var flag = 0;

var offsX = document.documentElement.clientWidth / 2;
var offsY = document.documentElement.clientHeight / 2;
var list = document.getElementsByClassName("card");
var height = document.documentElement.clientHeight;

document.onmousemove = function (event) {
  // document.getElementById("posX").innerHTML = X;
  // document.getElementById("posY").innerHTML = Y;
  let X = event.pageX;
  let Y = event.pageY;
  let sway = document.getElementById("sway-pic");
  let star = document.getElementById("starback");
  let back = document.getElementById("back");
  sway.style.transform = "translate(" + (X - offsX) / 15 + "px" + "," + (Y - offsY) / 15 + "px)";
  star.style.transform = "translate(" + (offsX - X) / 30 + "px" + "," + (offsY - Y) / 30 + "px)";
  back.style.transform = "translate(" + (offsX - X) / 60 + "px" + "," + (offsY - Y) / 60 + "px)";
}

window.onscroll = function () {
  // document.getElementById("scroll").innerHTML = document.documentElement.scrollTop;
  if (document.documentElement.scrollTop < 0.01) {
    document.getElementById("top-panel").style.boxShadow = "0 0 0 black";
  } else {
    document.getElementById("top-panel").style.boxShadow = "0 0 8px rgba(0, 0, 0, 0.4)";
  }

  if (flag == 0 && document.documentElement.scrollTop > height * 0.75) {
    for (let i = 0; i < this.list.length; ++i) {
      let element = this.list[i];
      element.style.animation = "cutin 1s ease";
      element.style.opacity = "1";
    }
    document.getElementById("main-container").style.pointerEvents = "auto";
    flag = 1;
  }
  if (flag == 1 && document.documentElement.scrollTop < height * 0.6) {
    for (let i = 0; i < this.list.length; ++i) {
      let element = this.list[i];
      element.style.animation = "cutout 1s ease";
      element.style.opacity = "0";
    }
    document.getElementById("main-container").style.pointerEvents = "none";
    flag = 0;
  }
}