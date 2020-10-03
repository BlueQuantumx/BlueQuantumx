var flag = 0;

var offsX = document.documentElement.clientWidth / 2;
var offsY = document.documentElement.clientHeight / 2;

document.onmousemove = function (event) {
  let X = event.pageX;
  let Y = event.pageY;
  let ele = document.getElementById("sway-pic");
  // document.getElementById("posX").innerHTML = X;
  // document.getElementById("posY").innerHTML = Y;
  ele.style.transform = "translate(" + (X - offsX) / 40 + "px" + "," + (Y - offsY) / 40 + "px)";
}

window.onscroll = function () {
  var height = document.documentElement.clientHeight;
  // document.getElementById("scroll").innerHTML = document.documentElement.scrollTop;
  if (document.documentElement.scrollTop < 0.01) {
    document.getElementById("top-panel").style.boxShadow = "0 0 0 black";
  } else {
    document.getElementById("top-panel").style.boxShadow = "0 0 8px rgba(0, 0, 0, 0.4)";
  }

  if (flag == 0 && document.documentElement.scrollTop > height * 0.75) {
    var list = document.getElementsByClassName("card");
    for (let i = 0; i < list.length; ++i) {
      const element = list[i];
      element.style.animation = "cutin 1s ease";
      element.style.opacity = "1";
    }
    flag = 1;
  }
  if (flag == 1 && document.documentElement.scrollTop < height * 0.6) {
    var list = document.getElementsByClassName("card");
    for (let i = 0; i < list.length; ++i) {
      const element = list[i];
      element.style.animation = "cutout 1s ease";
      element.style.opacity = "0";
    }
    flag = 0;
  }
}