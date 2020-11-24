var flag = false;
var offsX = document.documentElement.clientWidth * 0.5;
var offsY = document.documentElement.clientHeight * 0.5;
var mainContainer = document.getElementsByTagName("main")[0];
var topPanel = document.getElementById("top-panel");
var height = document.documentElement.clientHeight;

// 首页特效
function mouseMoveThrottle() {
  let previous = 0;
  return event => {
    let now = Date.now();
    if (now - previous > 16) {
      if (flag == false)
        sway.style.transform = "translate(" + (event.pageX - offsX) * 0.1 + "px" + "," + (event.pageY - offsY) * 0.1 + "px)";
      previous = now;
    }
  }
}
document.getElementById("index-show").onmousemove = mouseMoveThrottle();

// Scroll特效
const duration = 700;
let inAnimation = false;
let start, ori, target;

function c_bezier(t) {
  return 2.1 * t * (1 - t) * (1 - t) + 3 * t * t * (1 - t) + t * t * t;
}

/* function c_bezier(p0, p1, p2, p3, t) {
  return p0 * (1 - t) * (1 - t) * (1 - t) + 3 * p1 * t * (1 - t) * (1 - t) + 3 * p2 * t * t * (1 - t) + p3 * t * t * t;
} */
document.getElementById("index-show").onwheel = e => {
  if (!inAnimation && e.deltaY > 0) {
    inAnimation = true;
    ori = document.documentElement.scrollTop;
    target = (height - ori - 80);
    requestAnimationFrame(scrollAnimation);
  }
};

function scrollAnimation(stepTime) {
  if (start === undefined) start = stepTime;
  const delta = stepTime - start;
  scrollTo(0, ori + target * c_bezier(delta / duration));
  if (delta < duration) requestAnimationFrame(scrollAnimation);
  else start = undefined, inAnimation = false;
}

window.onscroll = scrollTrottle();
function scrollTrottle() {
  let previous = 0;
  return function () {
    let now = Date.now();
    if (now - previous > 16) {
      if (document.documentElement.scrollTop < 0.1) {
        topPanel.style.boxShadow = "0 0 0 black";
      } else {
        topPanel.style.boxShadow = "0 0 15px rgba(0, 0, 0, 0.4)";
      }
      if (flag == false && document.documentElement.scrollTop > height * 0.75) {
        mainContainer.style.animation = "cutin 1s ease";
        mainContainer.style.opacity = "1";
        mainContainer.style.pointerEvents = "auto";
        flag = true;
      }
      if (flag == true && document.documentElement.scrollTop < height * 0.6) {
        mainContainer.style.animation = "cutout 1s ease";
        mainContainer.style.opacity = "0";
        mainContainer.style.pointerEvents = "none";
        flag = false;
      }
      previous = now;
    }
  }
}

// Gitalk
fetch('/static/gitalk.json').then(response => { return response.json(); }).then(content => {
  let gitalk = new Gitalk({
    clientID: content.clientID, //Client ID
    clientSecret: content.clientSecret, //Client Secret
    repo: 'MyBlogComments', //仓库名称
    owner: 'Bluequarks', //仓库拥有者
    admin: ['Bluequarks'],
    id: 'commentsTest',
    distractionFreeMode: false  // Facebook-like distraction free mode
  });
  gitalk.render('gitalk-container');
});

// 拉取 json 以获取文章列表和友链列表
fetch('static/articles.json').then(response => { return response.json(); }).then
  (Arts => {
    let make_html = '';
    for (let i in Arts) {
      let a = Arts[i];
      make_html += `<a class="card article" href="./articles/exports/${a.path}" target="_blank">${a.name}</a>`;
    }
    document.getElementById('articles').innerHTML = make_html;
  });
fetch('static/friendLinks.json').then(response => { return response.json(); }).then
  (Friends => {
    for (let i = 0; i < Friends.length; ++i) {
      let f = Friends[i];
      let str = `<a target=_"blank" href="${f.href}">${f.name}</a>`;
      document.getElementById("links").innerHTML += str;
    }
  });

// 一言
fetch('https://v1.hitokoto.cn?c=i').then(response => { return response.json(); }).then
  (myJson => {
    document.getElementById("hitokoto").innerHTML += myJson.hitokoto;
    if (myJson.from_who) {
      let ref = document.createElement('div');
      ref.textContent = myJson.from_who;
      ref.id = "hitokotoRef";
      document.getElementById('hitokoto').appendChild(ref);
    }
  });
