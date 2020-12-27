if (matchMedia("(prefers-color-scheme: dark)").matches) {
  document.documentElement.className = "dark";
} else {
  document.documentElement.className = "light";
}

// onLoad
addEventListener("load", () => {
  //切换深色模式
  document.getElementById("colorSwitch").addEventListener("click", () => {
    if (document.documentElement.className == "light") document.documentElement.className = "dark";
    else {
      document.documentElement.className = "light";
    }
  });
  // Gitalk
  fetch('/static/gitalk.json').then(response => {
    return response.json();
  }).then(content => {
    var gitalk = new Gitalk({
      clientID: content.clientID, //Client ID
      clientSecret: content.clientSecret, //Client Secret
      repo: 'MyBlogComments', //仓库名称
      owner: 'Bluequarks', //仓库拥有者
      admin: ['Bluequarks'],
      id: document.title,
      distractionFreeMode: false  // Facebook-like distraction free mode
    });
    gitalk.render('gitalk-container');
  });
});