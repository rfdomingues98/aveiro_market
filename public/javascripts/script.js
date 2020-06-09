$('.carousel').carousel({
    interval: 3000
});

$('#tabs a').click(function (e) {
    e.preventDefault();
    $(this).tab('show');
});

// store the currently selected tab in the hash value
$("ul.nav-tabs > li > a").on("shown.bs.tab", function (e) {
    var id = $(e.target).attr("href").substr(1);
    window.location.hash = id;
});

// on load of the page: switch to the currently selected tab
var hash = window.location.hash;
$('#tabs a[href="' + hash + '"]').tab('show');

$('.custom-file-input').change(function (e) {
    var files = [];
    for (var i = 0; i < $(this)[0].files.length; i++) {
        files.push($(this)[0].files[i].name);
    }
    $(this).next('.custom-file-label').html(files.join(', '));
});

$('#inputImage').change(function (e) {
    var fileName = e.target.files[0].name;
    $('.custom-file-label').html(fileName);
});

var stockLabel = $('label[for="inputStock"]');
var stock = $('input[name="stock"]');
$('input[name="typeRadio"]').change(function (e) {
    if (e.target.value == 1) {
        stockLabel[0].textContent = "Stock (kg) *";
        stock[0].attributes[3].value = 0.01;
        stock[0].value = 0;
    } else if (e.target.value == 0) {
        stockLabel[0].textContent = "Stock (Pcs) *";
        stock[0].attributes[3].value = 1;
        stock[0].value = 0;
    }
});