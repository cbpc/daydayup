function getSliderItem(item, i) {
  return (
    '<li><a class="product-link" target="_blank" href="./detail.html?file=' +
    item.title +
    '"><h6 class="product-title">' +
    (i + 1) +
    '.' +
    item.title +
    (item.author ? '(' + item.author + ')' : '') +
    ' </h6><p> ' +
    item.desc +
    '</p></a> </li>'
  );
}
$(document).ready(function() {
  $.ajax('./js/menu.json').done(function(res) {
    var dom = $('.home-product-content');
    var sliders = [];
    for (var i = 0; i < res.length - 1; i += 2) {
      var item1 = getSliderItem(res[i], i);
      var item2 = getSliderItem(res[i + 1], i + 1);
      sliders.push('<ul class="product-column-two">' + item1 + item2 + '</ul>');
    }
    if (res.length % 2 == 1) {
      sliders.push(
        '<ul class="product-column-one">' +
          getSliderItem(res[res.length - 1], res.length - 1) +
          '</ul>'
      );
    }
    dom.append(sliders.join(''));
  });
});
