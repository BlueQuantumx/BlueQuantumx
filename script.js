var flag = 0;
window.onscroll = function () {
  if (flag == 0 && document.documentElement.scrollTop > 400) {
    var list = document.getElementsByClassName("card");
    for (let i = 0; i < list.length; ++i) {
      const element = list[i];
      element.style.animation = "cutin 1s ease";
      element.style.opacity = "1";
    }
    flag = 1;
  }
  if (flag == 1 && document.documentElement.scrollTop < 350) {
    var list = document.getElementsByClassName("card");
    for (let i = 0; i < list.length; ++i) {
      const element = list[i];
      element.style.animation = "cutout 1s ease";
      element.style.opacity = "0";
    }
    flag = 0;
  }
}