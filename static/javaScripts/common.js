if (localStorage.getItem("color-scheme") != null) {
  document.documentElement.className = localStorage.getItem("color-scheme");
}
else {
  if (matchMedia("(prefers-color-scheme: dark)").matches) {
    document.documentElement.className = "dark";
  } else {
    document.documentElement.className = "light";
  }
}

// onLoad
addEventListener("load", () => {
  //切换深色模式
  document.getElementById("colorSwitch").addEventListener("click", () => {
    if (document.documentElement.className == "light") {
      document.documentElement.className = "dark";
      localStorage.setItem("color-scheme", "dark");
    }
    else {
      document.documentElement.className = "light";
      localStorage.setItem("color-scheme", "light");
    }
  });
});