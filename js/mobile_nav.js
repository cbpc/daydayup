(function() {
  var isX = false;

  document.getElementById('mobile-nav-toggle').addEventListener('click', function() {
    var toggle = document.getElementsByClassName('mobile-nav-toggle-bar');
    var bodyinner = document.getElementsByClassName('body-inner')[0];
    var drawer = document.getElementsByClassName('drawer')[0];

    if (!isX) {
      for (var i = 0; i < toggle.length; i++) {
        toggle[i].className = 'mobile-nav-toggle-bar mobile-nav-toggle-bar-on';
        bodyinner.className = 'body-inner body-inner-on';
        drawer.className = 'drawer drawer-on';
        $('.mobile-nav').addClass("mobile-nav-on");
      }

      isX = true;
    } else {
      for (var j = 0; j < toggle.length; j++) {
        toggle[j].className = 'mobile-nav-toggle-bar';
        bodyinner.className = 'body-inner';
        drawer.className = 'drawer';
        $('.mobile-nav').removeClass("mobile-nav-on");
      }

      isX = false;
    }
  })


})();
