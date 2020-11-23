function showCode(id) {
  let ele = document.getElementById(id);
  if (ele.style.height == "0px") {
    document.getElementById(id + "btn").innerHTML = "收起代码";
    ele.style.height = ele.firstElementChild.clientHeight + "px";
  } else {
    document.getElementById(id + "btn").innerHTML = "展开代码";
    ele.style.height = "0px";
  }
}

// Gitalk
function initGitalk(content) {
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
}
fetch('/static/gitalk.json').then(response => { return response.json(); }).then(initGitalk);