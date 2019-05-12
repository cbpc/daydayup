(function() {


  /***************** Header BG Scroll ******************/

  window.onscroll = function() {
    var scroll = document.body.scrollTop || document.documentElement.scrollTop;
    var nav = document.getElementsByClassName('navigation')[0];
    var ul = document.getElementsByClassName('primary-nav')[0];
    var dropbt1 = document.getElementsByClassName('dropbtn')[0];
    // var dropbt2 = document.getElementsByClassName('dropbtn')[1];

    if (scroll >= 600) {
      if (!(/fixed/.test(nav.className))) {
        nav.className += ' fixed';
        ul.className += ' primary-nav-on';
        dropbt1.className += ' dropbtn-on';
        // dropbt2.className += ' dropbtn-on';
        $('.dropdown-content').addClass("dropdown-content-on");
        $('.nav-link-dec').addClass("nav-link-dec-on");
        $('.drawer').removeClass("drawer-away");
        $('.current').addClass("current-on");
      }

      // header.style.borderBottom = 'none';
      // header.style.padding = '0 0';
    } else {
      nav.className = 'navigation';
      ul.className = 'primary-nav';
      dropbt1.className = 'dropbtn';
      // dropbt2.className = 'dropbtn';
      $('.dropdown-content').removeClass("dropdown-content-on");
      $('.nav-link-dec').removeClass("nav-link-dec-on");
      $('.drawer').addClass("drawer-away");
      $('.current').removeClass("current-on");

      // header.style.padding = '0 0';

    }
  };

  /***************** move picture ******************/

  var COMPANY_CNT = 9;
  var companyLeft = 0;
  var companyTotalWidth = 0;
  var docwidth = document.body.clientWidth;


  if (docwidth >= 768) {
    moveCompany();
  }

  //  window.onresize =function(){
  //     if (docwidth>=768) {
  //    		moveCompany();
  //    	}
  // };

  function moveCompany() {
    requestAnimationFrame(function() {
      // compute total width for the first time
      if (companyTotalWidth === 0) {
        for (var i = 1; i < COMPANY_CNT - 1; ++i) {
          companyTotalWidth += $('.schools img').eq(i).width();
        }
      }

      companyLeft += 1;
      if (companyLeft > companyTotalWidth) {
        companyLeft = 0;
      }

      $('.schools').scrollLeft(companyLeft);

      moveCompany();
    });
  }

  /***************** person slide ******************/


  new Swiper(".swiper-container", {
    loop: true,
    autoplay: false,
    speed: 1000,
    nextButton: ".next",
    prevButton: ".prev",
    slidesPerView: 3,
    autoplayDisableOnInteraction: false,
    onSlideChangeStart: function(r) {
      var divs = [].slice.call(document.querySelectorAll(".swiper-slide"))
      var middleIndex = (r.activeIndex + 1) % divs.length
      divs.forEach(function(div, index) {
        if (middleIndex === index) {
          divs[index].children[0].classList.add('active')
        } else {
          divs[index].children[0].classList.remove('active')
        }
      })
    }
  })

  /***************** body movin ******************/

  var animation = bodymovin.loadAnimation({
    container: document.getElementById('bm'),
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: './js/data.json'
  })
})();
