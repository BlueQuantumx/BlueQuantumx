let flag = false;
let mainContainer = document.getElementsByTagName("main")[0];
let topPanel = document.getElementById("top-panel");

console.log("%cWelcome to BlueQuantum's Blog!", "color:black;display:block;background:white;padding:1em; border: 1em #2b73af solid")

// 首页特效
document.getElementById("index-show").addEventListener("mousemove", (() => {
  let previous = 0;
  return event => {
    let now = Date.now();
    if (now - previous > 16) {
      let offsX = document.documentElement.clientWidth * 0.5;
      let offsY = document.documentElement.clientHeight * 0.5;
      if (flag == false)
        sway.style.transform = "translate(" + (event.pageX - offsX) * 0.1 + "px" + "," + (event.pageY - offsY) * 0.1 + "px)";
      previous = now;
    }
  }
})());

// Scroll特效
const duration = 700;
let inAnimation = false;
let start, ori, target;

/* function c_bezier(p0, p1, p2, p3, t) {
  return p0 * (1 - t) * (1 - t) * (1 - t) + 3 * p1 * t * (1 - t) * (1 - t) + 3 * p2 * t * t * (1 - t) + p3 * t * t * t;
} */
function c_bezier(t) {
  return 2.1 * t * (1 - t) * (1 - t) + 3 * t * t * (1 - t) + t * t * t;
}
document.getElementById("down-arrow").addEventListener("click", () => {
  if (!inAnimation) {
    inAnimation = true;
    ori = document.documentElement.scrollTop;
    target = (document.documentElement.clientHeight - ori - 80);
    requestAnimationFrame(scrollAnimation);
  }
});

function scrollAnimation(stepTime) {
  if (start === undefined) start = stepTime;
  const delta = stepTime - start;
  scrollTo(0, ori + target * c_bezier(delta / duration));
  if (delta < duration) requestAnimationFrame(scrollAnimation);
  else start = undefined, inAnimation = false;
}

window.addEventListener("scroll", (() => {
  let previous = 0;
  return function () {
    let now = Date.now();
    if (now - previous > 16) {
      if (document.documentElement.scrollTop < 5) {
        topPanel.style.boxShadow = "0 0 0 black";
      } else {
        topPanel.style.boxShadow = "0 0 15px rgba(0, 0, 0, 0.4)";
      }
      if (flag == false && document.documentElement.scrollTop > document.documentElement.clientHeight * 0.75) {
        mainContainer.style.animation = "cutin 1s ease";
        mainContainer.style.opacity = "1";
        mainContainer.style.pointerEvents = "auto";
        flag = true;
      }
      if (flag == true && document.documentElement.scrollTop < document.documentElement.clientHeight * 0.6) {
        mainContainer.style.animation = "cutout 1s ease";
        mainContainer.style.opacity = "0";
        mainContainer.style.pointerEvents = "none";
        flag = false;
      }
      previous = now;
    }
  }
})());

// 拉取 json 以获取文章列表和友链列表
fetch('static/articles.json').then(response => {
  return response.json();
}).then(Arts => {
  let make_html = '';
  for (let i in Arts) {
    let a = Arts[i];
    make_html += `<a class="card article" href="./articles/exports/${a}.html">${a}</a>`;
  }
  document.getElementById('articles').innerHTML = make_html;
});

fetch('/static/friendLinks.json').then(response => {
  return response.json();
}).then(Friends => {
  for (let i = 0; i < Friends.length; ++i) {
    let f = Friends[i];
    let str = `<a class="goline-text" target="_blank" href="${f.href}">${f.name}</a>`;
    document.getElementById("links").innerHTML += str;
  }
});

// 一言
function getHitokoto() {
  fetch('https://v1.hitokoto.cn?c=i').then(r => r.json()).then(myJson => {
    document.getElementById("hitokotoText").innerText = myJson.hitokoto;
    document.getElementById("hitokotoRef").innerText = myJson.from_who;
  });
}
getHitokoto();
document.querySelector("#hitokoto span.refresh").addEventListener("click", getHitokoto);

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