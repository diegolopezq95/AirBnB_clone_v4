document.addEventListener('DOMContentLoaded', function () {
  $(function () {
    const myDict = {};
    let listAmeny = [];
    let listSta = [];
    let listCit = [];
    const dictAmeny = {};
    const state = {};
    const city = {};
    let statecity = {};

    $('.amenities input[type="checkbox"]').click(function () {
      if ($(this).is(':checked')) {
        myDict[$(this).attr('data-id')] = $(this).attr('data-name');
        $('.amenities h4').text(Object.values(myDict).join(', '));
      } else if ($(this).is(':not(:checked)')) {
        delete myDict[$(this).attr('data-id')];
        $('.amenities h4').text(Object.values(myDict).join(', '));
      }
    });

    $('.locations H2 input[type="checkbox"]').click(function () {
      if ($(this).is(':checked')) {
        state[$(this).attr('data-id')] = $(this).attr('data-name');
        statecity = Object.assign({}, state, city);
        $('.locations h4').text(Object.values(statecity).join(', '));
      } else if ($(this).is(':not(:checked)')) {
        delete state[$(this).attr('data-id')];
        statecity = Object.assign({}, state, city);
        $('.locations h4').text(Object.values(statecity).join(', '));
      }
    });

    $('.locations LI input[type="checkbox"]').click(function () {
      if ($(this).is(':checked')) {
        city[$(this).attr('data-id')] = $(this).attr('data-name');
        statecity = Object.assign({}, state, city);
        $('.locations h4').text(Object.values(statecity).join(', '));
      } else if ($(this).is(':not(:checked)')) {
        delete city[$(this).attr('data-id')];
        statecity = Object.assign({}, state, city);
        $('.locations h4').text(Object.values(statecity).join(', '));
      }
    });

    let datas = JSON.stringify(dictAmeny);
    $.get('http://localhost:5001/api/v1/status/', function (data) {
      if (data.status === 'OK') {
        $('DIV#api_status').addClass('available');
      } else {
        $('DIV#api_status').removeClass('available');
      }
    });
    $.ajax({
      url: 'http://localhost:5001/api/v1/places_search/',
      contentType: 'application/json',
      type: 'POST',
      data: datas,
      success: function (data) {
        data.sort(function (a, b) {
          if (a.name > b.name) {
            return 1;
          }
          if (a.name < b.name) {
            return -1;
          }
          return 0;
        });
        console.log(data[0]);
        for (const elem of Object.values(data)) {
          $.ajax({
            url: 'http://localhost:5001/api/v1/users/' + elem.user_id,
            contentType: 'application/json',
            type: 'GET',
            success: function (dataname) {
              $('SECTION.places').append(
                '<article> <div class="title">' +
                  '<h2>' + elem.name + '</h2>' +
                  '<div class="price_by_night">' + elem.price_by_night + '</div> </div>' +
                  '<div class="information"> <div class="max_guest">' +
                  '<i class="fa fa-users fa-3x" aria-hidden="true"></i>' +
                  '<br />' + elem.max_guest + ' Guests' + '</div>' +
                  '<div class="number_rooms">' +
                    '<i class="fa fa-bed fa-3x" aria-hidden="true"></i>' +
                  '<br />' + elem.number_rooms + ' Bedrooms' + '</div>' +
                    '<div class="number_bathrooms">' +
                  '<i class="fa fa-bath fa-3x" aria-hidden="true"></i>' +
                  '<br />' + elem.number_bathrooms + ' Bathroom' + '</div>' + '</div>' +
                  '<div class="user">' + '<strong>' + 'Owner: ' + dataname.first_name +
                  ' ' + dataname.last_name + '</strong>' + '</div>' +
                  '</div>' + '<div class="description">' + elem.description + '</div>' +
                  '</article>'
              );
            }
          });
        }
      }
    });
    $('button').click(function () {
      listAmeny = Object.keys(myDict);
      listSta = Object.keys(state);
      listCit = Object.keys(city);
      datas = { states: listSta, cities: listCit, amenities: listAmeny };
      console.log(listSta + '..............' + listCit);
      datas = JSON.stringify(datas);
      $('SECTION.places').empty();
      $.ajax({
        url: 'http://localhost:5001/api/v1/places_search/',
        contentType: 'application/json',
        type: 'POST',
        data: datas,
        success: function (data) {
          data.sort(function (a, b) {
            if (a.name > b.name) {
              return 1;
            }
            if (a.name < b.name) {
              return -1;
            }
            return 0;
          });
          for (const elem of Object.values(data)) {
            $.ajax({
              url: 'http://localhost:5001/api/v1/users/' + elem.user_id,
              contentType: 'application/json',
              type: 'GET',
              success: function (dataname) {
                $('SECTION.places').append(
                  '<article> <div class="title">' +
                    '<h2>' + elem.name + '</h2>' +
                    '<div class="price_by_night">' + elem.price_by_night + '</div> </div>' +
                    '<div class="information"> <div class="max_guest">' +
                    '<i class="fa fa-users fa-3x" aria-hidden="true"></i>' +
                    '<br />' + elem.max_guest + ' Guests' + '</div>' +
                    '<div class="number_rooms">' +
                    '<i class="fa fa-bed fa-3x" aria-hidden="true"></i>' +
                    '<br />' + elem.number_rooms + ' Bedrooms' + '</div>' +
                    '<div class="number_bathrooms">' +
                    '<i class="fa fa-bath fa-3x" aria-hidden="true"></i>' +
                    '<br />' + elem.number_bathrooms + ' Bathroom' + '</div>' + '</div>' +
                    '<div class="user">' + '<strong>' + 'Owner: ' + dataname.first_name +
                    ' ' + dataname.last_name + '</strong>' + '</div>' +
                    '</div>' + '<div class="description">' + elem.description + '</div>' + '</article>'
                );
              }
            });
          }
        }
      });
    });
  });
});
