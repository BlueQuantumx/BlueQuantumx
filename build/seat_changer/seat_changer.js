AV.init({
  appId: "beY1CHJwtpOwXviCEyQJNlN1-gzGzoHsz",
  appKey: "mRklyzcF05p8jXk0cbRQAe7T",
  serverURL: "https://bey1chjw.lc-cn-n1-shared.com"
});

const n = 25;
var P, p = []; // P:现有的排座位次序，号->人名; p:0-24的排列
var nodes;

function $(s) { return document.querySelectorAll(s); }

function init() {
  for (let i = 0; i < n; ++i) p.push(i);
  if (!AV.User.current()) {
    let password = prompt("为访问私有内容，请输入密码。", "Password");
    AV.User.logIn("B15SeatChanger", password).then((res) => { }).catch((error) => { alert(`登陆失败，请刷新重试。`) });
  }
  const query = new AV.Query('Seats');
  query.find().then((seatsHistories) => {
    P = seatsHistories[seatsHistories.length - 1].attributes.seatsDetail;
    html = '';
    let cnt = 0;
    for (let i = 0; i < 6; ++i) {
      html += '<div class="p-row">';
      for (let j = 0; j < 4; ++j)
        (html += `<div class="p-node" id="p-${cnt}">${P[cnt]}</div>`), ++cnt;
      html += "</div>";
    }
    html += `<div class="p-row"><div class="p-node" id="p-${cnt}">${P[cnt]}</div></div>`;
    ++cnt;
    $("#res")[0].innerHTML = html;
    nodes = $(".p-node");
  })
}

init();

let status = false;

function shuffle(arr) {
  let l = arr.length;
  let index, temp;
  while (l > 0) {
    index = Math.floor(Math.random() * l);
    temp = arr[l - 1];
    arr[l - 1] = arr[index];
    arr[index] = temp;
    l--;
  }
  return arr;
}

function check_repeat(arr) {
  let l = arr.length;
  for (let i = 0; i < l; ++i) if (arr[i] == i) return true;
  return false;
}

function func() {
  do p = shuffle(p);
  while ($("#noFixedPoint")[0].checked && check_repeat(p));
  for (let i = 0; i < n; ++i) nodes[i].innerText = P[p[i]];
  if (status) setTimeout(func, 50);
}

function toggle() {
  status = !status;
  if (status) { $("#switch")[0].innerText = "停止"; $("#save-btn")[0].disabled = true; func(); }
  else { $("#switch")[0].innerText = "开始"; $("#save-btn")[0].disabled = false; }
}

function saveSeat() {
  if (confirm("确认保存？")) {
    let nP = [];
    for (let i = 0; i < n; ++i) nP.push(P[p[i]]);
    let Seats = AV.Object.extend("Seats");
    let seats = new Seats;
    seats.set("seatsDetail", nP);
    seats.save().then((res) => {
      alert(`保存成功! ObjectId:${res.id}`);
    }, (error) => {
      alert(`保存失败。\n错误信息:\n${error}`)
    })
  }
}
