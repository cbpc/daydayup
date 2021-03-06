var pdfMode = false;
var app = (function() {
  var defaultTheme = 'light';
  var initDom = function() {
    var getUrlParam = function(name) {
      var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
      var r = encodeURI(window.location.search)
        .substr(1)
        .match(reg);
      if (r !== null) return decodeURI(r[2]);
      return null;
    };

    var getQueryObj = function() {
      var obj = {
        file: getUrlParam('file'),
        title: decodeURI(getUrlParam('title')),
        theme: getUrlParam('theme')
      };
      if (obj.theme === null) {
        obj.theme = defaultTheme;
      }
      document.title = decodeURI(obj.file);
      obj.theme = './css/theme.' + obj.theme + '.css';
      obj.file = './markdown/' + obj.file + '.md';
      pdfMode = window.location.search.match(/print-pdf/gi);
      if (pdfMode) {
        obj.print = '/css/pdf.min.css';
      }
      return obj;
    };

    // var node = document.getElementById('stage');
    var node = document.getElementsByTagName('section')[0];
    var queryObj = getQueryObj();
    document.getElementById('theme').setAttribute('href', queryObj.theme);
    //打印PDF
    var pdfDom = document.getElementById('print');
    if (pdfDom && queryObj.print) {
      pdfDom.setAttribute('href', queryObj.print);
    }
    node.dataset.markdown = queryObj.file;
  };

  var appendThemeList = function() {
    var getDate = function() {
      var jsRight = function(sr, rightn) {
        return sr.substring(sr.length - rightn, sr.length);
      };
      var date = new Date();
      var a = date.getFullYear();
      var b = jsRight('0' + (date.getMonth() + 1), 2);
      var c = jsRight('0' + date.getDate(), 2);
      return a + '-' + b + '-' + c;
    };

    var date = '<h3 style="margin-top:40px;">' + getDate() + '</h3>';
    var styleList = ['dark', 'moon', 'blue', 'green', 'light'];
    styleList = styleList.map(function(item) {
      return (
        '<a href="#" name="theme" onclick="document.getElementById(\'theme\').setAttribute(\'href\',\'./css/theme.' +
        item +
        '.css\'); return false;">' +
        item +
        '</a>'
      );
    });
    var str =
      '<div class="theme-info">请选择主题: <br><br>' +
      styleList.join(' - ') +
      '</div>';
    var print =
      '<div class="theme-info"><a href="/detail.html?file=展望&print-pdf=1" target="_blank">打印为PDF</a></div>';

    $('section')
      .first()
      .append(date + str + print);
  };

  var slideStarted = 0;
  var isFullScreen = false;
  var clock = function() {
    var iMinute, iSecond;
    slideStarted++;
    slideStarted = slideStarted % 3600;
    iMinute = parseInt(slideStarted / 60);
    iSecond = slideStarted % 60;
    var strTime =
      ('0' + iMinute).substring(('0' + iMinute).length - 2) +
      ':' +
      ('0' + iSecond).substring(('0' + iSecond).length - 2);
    $('#clock').text(strTime);
  };

  var enterFullscreen = function() {
    var element = document.body;
    // Check which implementation is available
    var requestMethod =
      element.requestFullScreen ||
      element.webkitRequestFullscreen ||
      element.webkitRequestFullScreen ||
      element.mozRequestFullScreen ||
      element.msRequestFullscreen;
    if (requestMethod) {
      requestMethod.apply(element);
    }
  };
  var CONTROL_MODE = location.href.includes('_multiscreen=control');
  var startTimer = function() {
    if (slideStarted === 0) {
      setInterval(clock, 1000);
    }
    if (!isFullScreen && !CONTROL_MODE) {
      enterFullscreen();
      isFullScreen = true;
    }
  };

  // debug 模式取消任意键全屏，方便测试。
  var DEBUG = false;
  $('body').on('keydown', function(event) {
    if (DEBUG) {
      return;
    }
    var keyName = event.key;
    var key = event.keyCode;
    // console.log(key + ":" + keyName);
    startTimer();
    if (CONTROL_MODE) {
      return;
    }
    if (key == 27) {
      isFullScreen = false;
    } else if (
      keyName != 'Control' &&
      keyName != 'F12' &&
      keyName != 'F5' &&
      keyName != 'Alt'
    ) {
      enterFullscreen();
    }
  });

  var fixImgFolder = function() {
    //MD文件默认图片目录
    var DEFAULT_SLIDE_IMG_CONTENT =
      $('section')
        .first()
        .attr('data-img-content') || 'markdown';
    var obj = $('section [data-markdown-parsed="true"] img');
    var imgSrc = obj
      .attr('src')
      .replace('./', './' + DEFAULT_SLIDE_IMG_CONTENT + '/');
    obj.attr('src', imgSrc);
  };

  var initSlide = function() {
    Slide.init({
      containerID: 'container',
      drawBoardID: 'drawBoard',
      slideClass: '.slide',
      buildClass: '.build',
      progressID: 'progress',
      transition: 'slide3',
      width: 1100,
      dir: './',
      //打开下面的注释就开启postMessage方式
      //访问网址127.0.0.1:8080/ppt/demo#client
      control: {
        type: 'postMessage',
        args: {
          isControl: false
        }
      },
      tipID: 'tip'
    });
    initHLJS();
    // initCode();

    handleBR();
    handleHref();
    initPDF();
    handleIframe();
  };

  var handleIframe = function() {
    $('iframe').each(function() {
      $(this)
        .parents('slide')
        .addClass('slide-iframe');
    });
  };

  var initPDF = function() {
    if (!pdfMode) {
      return;
    }
    window.print();
  };
  var handleHref = function() {
    $('a').each(function() {
      $(this).attr('target', '_blank');
    });
  };

  var handleBR = function() {
    $('p').each(function() {
      $(this).html(
        $(this)
          .html()
          .replace(/\n/g, '<br>')
      );
    });
  };

  var initHLJS = function() {
    MixJS.loadJS('highlight/highlight.pack.js', function() {
      hljs.tabReplace = '  ';
      //numbering for pre>code blocks
      $(function() {
        $('pre code').each(function() {
          var lines =
            $(this)
              .text()
              .split('\n').length - 1;
          var $numbering = $('<ul/>').addClass('pre-numbering');
          $(this)
            .addClass('has-numbering')
            .parent()
            .append($numbering);
          for (i = 1; i <= lines; i++) {
            $numbering.append($('<li/>').text(i));
          }
        });
      });
      hljs.initHighlightingOnLoad();
    });
  };

  var initCode = function() {
    $('code').each(function(i, item) {
      var html = $(item)
        .html()
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
      $(item).html('');
      CodeMirror(item, {
        lineNumbers: true,
        theme: 'material',
        styleActiveLine: true,
        matchBrackets: true,
        value: html
      });
    });
  };

  var init = (function() {
    initDom();
    RevealMarkdown.initialize();
    initSlide();
    appendThemeList();
  })();
})();
