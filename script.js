var flag = false;

var offsX = document.documentElement.clientWidth / 2;
var offsY = document.documentElement.clientHeight / 2;
var mainContainer = document.getElementById("main-container");
var sway = document.getElementById("sway");
var topPanel = document.getElementById("top-panel");
var height = document.documentElement.clientHeight;

window.onmousemove = function (event) {
  // document.getElementById("posX").innerHTML = X;
  // document.getElementById("posY").innerHTML = Y;
  sway.style.transform = "translate(" + (event.pageX - offsX) * 0.1 + "px" + "," + (event.pageY - offsY) * 0.1 + "px)";
}

window.onscroll = function () {
  // document.getElementById("scroll").innerHTML = document.documentElement.scrollTop;
  if (document.documentElement.scrollTop < 0.01) {
    topPanel.style.boxShadow = "0 0 0 black";
  } else {
    topPanel.style.boxShadow = "0 0 8px rgba(0, 0, 0, 0.4)";
  }

  if (flag == false && document.documentElement.scrollTop > height * 0.75) {
    mainContainer.style.animation = "cutin 1s ease";
    mainContainer.style.opacity = "1";
    mainContainer.style.pointerEvents = "auto";
    flag = 1;
  }
  if (flag == true && document.documentElement.scrollTop < height * 0.6) {
    mainContainer.style.animation = "cutout 1s ease";
    mainContainer.style.opacity = "0";
    mainContainer.style.pointerEvents = "none";
    flag = 0;
  }
}

var gitalk = new Gitalk({
  clientID: 'b820644a38313eb3360f', //Client ID

  clientSecret: 'eebc1a3b7a57db5c06cbd73445ef48622df0a6ee', //Client Secret

  repo: 'MyBlogComments',//仓库名称
  owner: 'Bluequarks',//仓库拥有者
  admin: ['Bluequarks'],
  id: 'commentsTest',
  distractionFreeMode: false  // Facebook-like distraction free mode
});

gitalk.render('gitalk-container');

// 拉取 json 以获取文章列表和友链列表
function getArticle(Arts) {
  let make_html = '';
  for (let i in Arts) {
    let a = Arts[i];
    make_html += '<a class="card artical" href="./Articles/' + a.path + '" target="_blank">' + a.name + '</a>';
  }
  document.getElementById('articals').innerHTML = make_html;
}

function getFriendLinks(Friends) {
  for (let i = 0; i < Friends.length; ++i) {
    let f = Friends[i];
    let str = '<a target=_"blank" href="' + f.href + '">' + f.name + "</a>";
    document.getElementById("links").innerHTML += str;
  }
}

fetch('/Resources/Articles.json').then(response => { return response.json(); }).then(getArticle);
fetch('/Resources/FriendLinks.json').then(response => { return response.json(); }).then(getFriendLinks);

// 一言
fetch('https://v1.hitokoto.cn?c=i').then(function (response) { return response.json(); })
  .then(function (myJson) {
    document.getElementById("hitokoto").innerHTML += myJson.hitokoto;
    if (myJson.from_who) {
      let ref = document.createElement('div');
      ref.textContent = myJson.from_who;
      ref.id = "hitokotoRef";
      document.getElementById('hitokoto').appendChild(ref);
    }
  });
