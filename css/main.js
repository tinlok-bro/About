window.space = {};

window.$ajaxGetParams = function(data) {
  var arr = [];
  for (var param in data) {
    arr.push(encodeURIComponent(param) + "=" + encodeURIComponent(data[param]));
  }
  return arr.join("&");
};

window.$ajax = function(options) {
  options = options || {};
  options.type = (options.type || "GET").toUpperCase();
  options.dataType = options.dataType || "json";
  if (options.async === undefined) {
    options.async = true;
  }
  var params = window.$ajaxGetParams(options.data);
  var xhr;
  if (window.XMLHttpRequest) {
    xhr = new XMLHttpRequest();
  } else {
    xhr = new ActiveXObject("Microsoft.XMLHTTP");
  }
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      var status = xhr.status;
      if (status >= 200 && status < 300) {
        if (options.dataType === "json") {
          options.success && options.success(JSON.parse(xhr.responseText));
        } else {
          options.success && options.success(xhr.responseText);
        }
      } else {
        options.error && options.error(status);
      }
    }
  };
  if (options.type == "GET") {
    xhr.open("GET", options.url + "?" + params, options.async);
    xhr.send(null);
  } else if (options.type == "POST") {
    xhr.open("POST", options.url, options.async);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(params);
  }
};

const getRandNum = function(min = 1, max = 1.5) {
  return (Math.random() * (max - min) + min).toFixed(2);
};

space.initSpace = function(color = ["#8779d2"]) {
  let isAnimating = false;
  var space = new Object();
  space.revealer = document.getElementsByClassName("revealer")[0];
  space.fullview = document.getElementsByClassName("fullview")[0];
  space.fullviewItems = space.fullview.getElementsByClassName("fullview__item");
  space.btns = document.querySelectorAll(".menu__item:not(.linkout)");
  space.moreBtn = document.getElementsByClassName("space__back")[0];
  space.current = -1;

  space.toggleMoreBtn = function(action) {
    let speed = getRandNum(1, 1.5);
    anime({
      targets: space.moreBtn,
      duration: speed * 1000,
      delay: 200 + (speed / 2) * 1000,
      easing: "easeOutQuint",
      translateY: action === "hide" ? 0 : 1 * space.moreBtn.clientHeight
    });
  };

  space.toggleRevealer = function(action, callback, dir = "up") {
    if (action === "show") {
      space.revealer.style.backgroundColor =
        color[Math.floor(Math.random() * Math.floor(color.length))];
		//style="background-image: url(./back/revealer.jpg)
    }
    anime({
      targets: space.revealer,
      duration: 1000,
      easing: action === "show" ? "easeInOutQuint" : "easeOutQuint",
      translateX: action === "show" ? "-100%" : dir === "up" ? "-200%" : "0%",
      complete: callback
    });
  };

  space.toggle = function(action) {
    if (isAnimating) return;
    isAnimating = true;
    let isHide = action === "show";
    space.revealer.style.display = "block";
    if (!isHide) {
      space.fullviewItems[space.current].style.zIndex = 0;
    }
    space.toggleRevealer("show", function() {
      space.fullviewItems[space.current].style.opacity = isHide ? 1 : 0;
      space.fullview.style.opacity = isHide ? 1 : 0;
      space.fullview.style.pointerEvents = isHide ? "auto" : "none";
      space.toggleRevealer(
        "hide",
        function() {
          space.revealer.style.display = "none";
          if (isHide) {
            space.fullviewItems[space.current].style.zIndex = 10;
          }
          isAnimating = false;
        },
        isHide ? "up" : "down"
      );
    });
    space.toggleMoreBtn(action);
  };

  space.initEvents = function() {
    for (let i = 0; i < space.btns.length; i++) {
      space.btns[i].addEventListener("click", function() {
        space.current = i;
        space.toggle("show");
      });
    }
    space.moreBtn.addEventListener("click", function() {
      space.toggle("hide");
    });
  };
  return space;
};

space.initFooter = function() {
  document.getElementById("now-year").textContent = new Date().getFullYear();
};




function GetRnd(min,max){ 
  return Math.floor(Math.random() * (max - min + 1) + min);
} 
//你的img里面图片的名称为1.jpg,2.jpg.....100.jpg，则使用下面的就可以随机了
//document.write("<div class=space__wrapper style=background-image: url(./back/background"+GetRnd(1,100)+".jpg);>");

var item = space.initSpace([
  "#F6C071",
  "#7F4BD9",
  "#79d2bd",
  "#d2a279",
  "#119DB2",
  "#F5C89C",
  "#59A3BE",
  "#9DC1D9",
  "#BEE0EA"
]);
item.initEvents();
space.initFooter();

window.addEventListener("load", function() {
  space.initHitokoto();
  space.initArchives();
});
