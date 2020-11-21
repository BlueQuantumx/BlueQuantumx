function showCode(id) {
  let ele = document.getElementById(id);
  if (ele.style.height == "0px" || ele.style.height == "") {
    ele.style.height = ele.firstElementChild.clientHeight + "px";
  } else ele.style.height = "0px";
}

var gitalk = new Gitalk({
  clientID: 'b820644a38313eb3360f', //Client ID

  clientSecret: 'eebc1a3b7a57db5c06cbd73445ef48622df0a6ee', //Client Secret

  repo: 'MyBlogComments', //仓库名称
  owner: 'Bluequarks', //仓库拥有者
  admin: ['Bluequarks'],
  id: document.title,
  distractionFreeMode: false  // Facebook-like distraction free mode
});

gitalk.render('gitalk-container');