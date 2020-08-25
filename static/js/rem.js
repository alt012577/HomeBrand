(function (doc, win) {
    var docEl = doc.documentElement,
      resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
      recalc = function () {
          var clientWidth = docEl.clientWidth;
          if (!clientWidth) return;
          docEl.style.fontSize = 16 * (clientWidth / 1920) + 'px';
          var html = document.getElementsByTagName('html')[0];
          var settedFs = settingFs = parseInt(16 * (clientWidth / 1920));
          var whileCount = 0;
          while (true) {
              var realFs = parseInt(window.getComputedStyle(html).fontSize);
              var delta = realFs - settedFs;
              //不相等
              if (Math.abs(delta) >= 1) {
                  if (delta > 0)
                      settingFs--;
                  else
                      settingFs++;
                  html.setAttribute('style', 'font-size:' + settingFs + 'px!important');
              } else
                  break;
              if (whileCount++ > 100)
                  break
          }

      };
  if (!doc.addEventListener) return;
  win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);


function alertTip(tip) {
    let div = document.createElement('div')
    div.innerText = tip
    div.className = "alertTip"
    document.body.appendChild(div)
    setTimeout(()=>{
        document.body.removeChild(div)
    },1200)
}

function showLoading(ELinner,text) {
	let div = document.createElement("div")
	div.id = "Loading"
	div.innerHTML = "<ul><li></li><li></li><li></li></ul><p>" + text + "</p>"
	let EL = document.getElementById(ELinner)
	EL.style.position = "relative"
	EL.appendChild(div)
}
function hideLoading(ELinner){
	let EL = document.getElementById(ELinner)
	let LoadingEL = document.getElementById("Loading")
	if( LoadingEL != undefined ){
		EL.removeChild(LoadingEL)
	}
}
