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
  // Gitalk
  fetch('/static/gitalk.json').then(response => {
    return response.json();
  }).then(content => {
    var gitalk = new Gitalk({
      clientID: content.clientID, //Client ID
      clientSecret: content.clientSecret, //Client Secret
      repo: 'MyBlogComments', //仓库名称
      owner: 'BlueQuantumx', //仓库拥有者
      admin: ['BlueQuantumx'],
      id: document.title,
      distractionFreeMode: false  // Facebook-like distraction free mode
    });
    gitalk.render('gitalk-container');
  });
});