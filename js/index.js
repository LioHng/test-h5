// ==========================================
// 主入口：所有初始化代码
// ==========================================
document.addEventListener('DOMContentLoaded', function () {
  // 初始化真实视口高度（解决移动端100vh问题）
  initRealViewportHeight();

  // 初始化 GSAP 插件
  initGSAP();

  // 初始化页面切换功能
  initPageSwitch();

  // 初始化淡入动画
  initFadeAnimations();

  // 初始化环形轮播
  initCarousel();

  // 初始化轮播图
  initSwiperCarousel();

  // 初始化窗口大小变化监听
  // initResizeHandler();

  // 初始化标签页切换
  initTabs();

  // 初始化格斗图鉴选项切换
  initWrestleOptions();

  handlePc()

});

var px2rem = function (px) {
  if (!lib || !lib.flexible) return px / 19.2 + 'rem';
  else return lib.flexible.px2rem(px) + 'rem';
}

// ==========================================
// 获取当前视口高度
// ==========================================
function initRealViewportHeight() {
  // 方法1：window.innerHeight（推荐，获取真实可视区域高度，不包含浏览器UI）
  // 这是最准确的方法，特别是在移动端
  const home = document.querySelector('.home');
  home.style.height = window.innerHeight + 'px';
  
  // 方法2：document.documentElement.clientHeight（获取文档元素的可视高度）
  // return document.documentElement.clientHeight;
  
  // 方法3：兼容性写法（降级方案）
  // return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
}

// 使用示例：
// var vh = getViewportHeight();
// console.log('当前视口高度:', vh);
// 设置元素高度：element.style.height = vh + 'px';

function isPCByUserAgent() {
  if (
    window.navigator.userAgent.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    )
  ) {
    // console.info('移动端')
    return false;
  } else {
    // console.info('PC')
    return true;
  }
}

function handlePc() {
  if (isPCByUserAgent()) {
    document.body.style.width = '7.5rem';
  }
}

// ==========================================
// 初始化 GSAP 插件
// ==========================================
function initGSAP() {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && typeof ScrollToPlugin !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
  }
}

// ==========================================
//  页面切换功能（一二屏切换）
// ==========================================
function initPageSwitch() {
  var home = document.querySelector('.home');
  var mainContainer = document.querySelector('.main_container');

  if (!home || !mainContainer) {
    return;
  }

  var isScrolling = false;
  var timer = null;

  // 处理滚轮事件
  function handleWheel(e) {
    if (isScrolling) {
      return;
    }

    var deltaY = e.deltaY;
    var windowScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var homeHeightWithError = window.innerHeight + 20;

    if (windowScrollTop < 20) {
      // 在第一屏，向下滚动切换到第二屏
      if (deltaY > 0) {
        e.preventDefault();
        isScrolling = true;
        scrollToElement(mainContainer, function () {
          isScrolling = false;
        });
      }
    } else {
      if (deltaY < 0) {
        if (windowScrollTop <= homeHeightWithError) {
          e.preventDefault();
          isScrolling = true;
          scrollToElement(home, function () {
            isScrolling = false;
          });
        }
      }
    }
  }

  // 滚动到指定元素
  function scrollToElement(element, callback) {
    if (typeof gsap !== 'undefined' && typeof ScrollToPlugin !== 'undefined') {
      gsap.to(window, {
        scrollTo: { y: element, offsetY: 0 },
        duration: 0.5,
        ease: "linear",
        onComplete: callback || function () { }
      });
    }
    // if(element === 'main_container') {
    //   window.scrollTo({
    //     top: document.querySelector('.main_container').offsetTop,
    //     behavior: 'smooth'
    //   });
    //   setTimeout(() => {
    //     callback && callback();
    //   }, 100);
    // } else if(element === 'home') {
    //   window.scrollTo({
    //     top: 0,
    //     behavior: 'smooth'
    //   });
    //   setTimeout(() => {
    //     callback && callback();
    //   }, 100);
    // }
  }

  // 监听wheel事件实现页面切换
  document.addEventListener('wheel', function (e) {
    if (isScrolling) {
      e.preventDefault();
      return;
    }
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(function () {
      if (!isScrolling) {
        handleWheel(e);
      }
    }, 50);
    handleWheel(e);
  }, { passive: false });

  // 移动端触摸方向监听
  var touchStartY = 0;

  document.addEventListener('touchstart', function (e) {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchend', function (e) {
    if (!touchStartY) {
      return;
    }

    var touchEndY = e.changedTouches[0].clientY;
    var deltaY = touchEndY - touchStartY;

    touchStartY = 0;
    var windowScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var homeHeightWithError = window.innerHeight + 20;
    if (windowScrollTop < window.innerHeight) {
      if (deltaY > 0) {
        if (windowScrollTop <= homeHeightWithError) {
          isScrolling = true;
          scrollToElement(home, function () {
            isScrolling = false;
          });
        }
      } else if (deltaY < 0) {
        isScrolling = true;
        scrollToElement(mainContainer, function () {
          isScrolling = false;
        });
      }
    }

  }, { passive: true });
}

// ==========================================
// 初始化淡入动画
// ==========================================
function initFadeAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    return;
  }

  var fadeElements = document.querySelectorAll('.fade-form-bottom');

  if (fadeElements.length === 0) {
    return;
  }

  // 为每个元素添加淡入动画
  for (var i = 0; i < fadeElements.length; i++) {
    var dom = fadeElements[i];
    createFadeAnimation(dom);
  }
}

// 创建单个元素的淡入动画
function createFadeAnimation(element) {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    return;
  }

  gsap.from(element, {
    y: px2rem(300),
    opacity: 0,
    duration: 1.2,
    ease: "power3.out",
    scrollTrigger: {
      trigger: element,
      start: "top 95%",
      toggleActions: "play none none reverse",
      // markers: true,
    },
    immediateRender: true
  });
}

// ==========================================
//  无缝环形轮播
// ==========================================
function initCarousel() {
  var items = document.querySelectorAll(".carousel-item");
  var prevBtn = document.querySelector(".carousel-btn.prev_icon");
  var nextBtn = document.querySelector(".carousel-btn.next_icon");

  if (items.length === 0 || !prevBtn || !nextBtn) {
    return;
  }

  var currentIndex = 2; // 初始选中中间项 (index 2)
  var totalItems = items.length;

  // 更新轮播状态
  function updateCarousel(instant) {
    instant = instant || false;

    for (var i = 0; i < items.length; i++) {
      var item = items[i];

      // 如果需要瞬间移动，临时禁用transition
      if (instant) {
        item.style.transition = "none";
      } else {
        item.style.transition = "all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)";
      }

      // 计算相对于currentIndex的偏移量
      var offset = i - currentIndex;

      // 环形修正：确保元素能从一端无缝绕到另一端
      if (offset > totalItems / 2) {
        offset -= totalItems;
      } else if (offset < -totalItems / 2) {
        offset += totalItems;
      }

      // 根据offset计算视觉样式
      var absOffset = Math.abs(offset);
      var translateX = offset * 160;
      var scale = Math.max(0.6, 1 - absOffset * 0.15);
      var translateZ = -absOffset * 100;
      var zIndex = 100 - absOffset * 10;
      var opacity = Math.max(0, 1 - absOffset * 0.25);

      // 应用样式
      if(absOffset > 1) {
        item.style.transition = "none";
        item.style.opacity = 0
      } else {
        item.style.transform = "translateX(" + translateX + "px) translateZ(" + translateZ + "px) scale(" + scale + ")";
        item.style.zIndex = zIndex;
        item.style.opacity = opacity;
      }

      // 高亮当前选中项
      var cardPlaceholder = item.querySelector(".card-placeholder");
      if (offset === 0) {
        // item.style.filter = "brightness(1.1)";
        if (cardPlaceholder) {
          // cardPlaceholder.style.borderColor = "#ffd700";
          cardPlaceholder.classList.add("card-active");
        }
      } else {
        // item.style.filter = "brightness(0.7)";
        if (cardPlaceholder) {
          cardPlaceholder.classList.remove("card-active");
        }
      }
    }

    if (instant) {
      requestAnimationFrame(function () {
        for (var j = 0; j < items.length; j++) {
          items[j].style.transition = "all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)";
        }
      });
    }
  }

  let timer = null;
  function playClickNextBtn() {
    timer = setTimeout(() => {
      nextBtn.click()
    }, 30000)
  }

  // 下一张
  nextBtn.addEventListener("click", function () {
    clearTimeout(timer)
    playClickNextBtn()
    currentIndex = (currentIndex + 1) % totalItems;
    updateCarousel(false);
  });

  // 上一张
  prevBtn.addEventListener("click", function () {
    clearTimeout(timer)
    playClickNextBtn()
    currentIndex = (currentIndex - 1 + totalItems) % totalItems;
    updateCarousel(false);
  });

  playClickNextBtn()
  // 初始化轮播
  updateCarousel(true);
}

// ==========================================
//  轮播图功能 (carousel_box)
// ==========================================
function initSwiperCarousel() {
  if (typeof Swiper === 'undefined') {
    return;
  }

  var dots = document.querySelectorAll('.indicator .dot');
  var swiperContainer = document.querySelector('.swiper-container');

  if (!swiperContainer || dots.length === 0) {
    return;
  }

  var swiper = new Swiper('.swiper-container', {
    loop: true,
    autoplay: {
      delay: 3000
    },
    on: {
      init: function () {
        updateIndicators(this);
      },
      slideChange: function () {
        updateIndicators(this);
      }
    }
  });

  // 更新指示器状态
  function updateIndicators(swiperInstance) {
    var realIndex = swiperInstance.realIndex;
    for (var i = 0; i < dots.length; i++) {
      if (i === realIndex) {
        dots[i].classList.add('active');
      } else {
        dots[i].classList.remove('active');
      }
    }
  }

  // 为每个指示器点添加点击事件
  for (var j = 0; j < dots.length; j++) {
    (function (index) {
      dots[index].addEventListener('click', function () {
        swiper.slideToLoop(index);
      });
    })(j);
  }
}

// ==========================================
// 窗口大小变化处理（响应式适配）
// ==========================================
function initResizeHandler() {
  var resizeTimer = null;

  // 刷新ScrollTrigger
  function refreshScrollTrigger() {
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  }

  // 监听窗口大小变化
  window.addEventListener('resize', function () {
    // 防抖处理，避免频繁刷新
    if (resizeTimer) {
      clearTimeout(resizeTimer);
    }

    resizeTimer = setTimeout(function () {
      // 窗口大小改变后，重新计算ScrollTrigger的触发点
      refreshScrollTrigger();
    }, 150);
    
    handlePc()
  });

  // 页面加载完成后也刷新一次，确保初始状态正确
  setTimeout(function () {
    refreshScrollTrigger();
  }, 100);
}

// ==========================================
// 标签页切换功能
// ==========================================
function initTabs() {
  var tabsContainer = document.querySelector('.tabs');
  var allMesList = document.querySelector('.all_mes_list');
  var noticeMesList = document.querySelector('.notice_mes_list');
  var strategyMesList = document.querySelector('.strategy_mes_list');

  if (!tabsContainer) {
    return;
  }

  // 使用事件委托，监听tabs容器的点击事件
  tabsContainer.addEventListener('click', function (e) {
    var target = e.target;
    // 检查是否点击的是tab-item
    if (!target.classList.contains('tab-item')) {
      return;
    }

    var tabType = target.getAttribute('data-tab');
    if (!tabType) {
      return;
    }

    // 移除所有active类
    var allTabs = tabsContainer.querySelectorAll('.tab-item');
    for (var i = 0; i < allTabs.length; i++) {
      allTabs[i].classList.remove('text_active');
    }

    // 添加当前active类
    target.classList.add('text_active');

    // 隐藏所有列表
    if (allMesList) allMesList.style.display = 'none';
    if (noticeMesList) noticeMesList.style.display = 'none';
    if (strategyMesList) strategyMesList.style.display = 'none';

    // 根据tabType显示对应的列表
    if (tabType === 'all' && allMesList) {
      allMesList.style.display = 'block';
    } else if (tabType === 'notice' && noticeMesList) {
      noticeMesList.style.display = 'block';
    } else if (tabType === 'strategy' && strategyMesList) {
      strategyMesList.style.display = 'block';
    }
  });
}

// ==========================================
// 格斗图鉴选项切换功能
// ==========================================
function initWrestleOptions() {
  var wrestleMainContent = document.querySelector('.wrestle_main_content');
  var optionItems = document.querySelectorAll('.options_box .option_item');

  if (!wrestleMainContent || optionItems.length === 0) {
    return;
  }

  // 选项类名到选中类名的映射
  var optionToSelectedMap = {
    'flame_option': 'flame_selected',
    'bernstein_option': 'bernstein_selected',
    'kagura_option': 'kagura_selected',
    'serpent_option': 'serpent_selected',
    'shiranui_option': 'shiranui_selected'
  };

  // 所有可能的选中类名
  var allSelectedClasses = [
    'flame_selected',
    'bernstein_selected',
    'kagura_selected',
    'serpent_selected',
    'shiranui_selected'
  ];

  // 为每个选项添加点击事件
  for (var i = 0; i < optionItems.length; i++) {
    optionItems[i].addEventListener('click', function () {
      // 获取当前点击的选项类名
      var currentOptionClass = null;
      for (var className in optionToSelectedMap) {
        if (this.classList.contains(className)) {
          currentOptionClass = className;
          break;
        }
      }

      if (!currentOptionClass) {
        return;
      }

      // 获取对应的选中类名
      var targetSelectedClass = optionToSelectedMap[currentOptionClass];

      // 如果已经是当前选中的，不需要切换
      if (wrestleMainContent.classList.contains(targetSelectedClass)) {
        return;
      }

      // 淡出动画（从1到0.6）
      wrestleMainContent.style.opacity = '0.9';

      // 等待淡出完成后再切换背景
      setTimeout(function () {
        // 移除所有选中类名
        for (var j = 0; j < allSelectedClasses.length; j++) {
          wrestleMainContent.classList.remove(allSelectedClasses[j]);
        }

        // 添加新的选中类名
        wrestleMainContent.classList.add(targetSelectedClass);

        // 淡入动画（从0.6到1）
        setTimeout(function () {
          wrestleMainContent.style.opacity = '1';
        }, 50);
      }, 100);
    });
  }
}
