"use strict";

window.ajaxReturn = function (aUrl, type, upData, reType) {
  var dataJson;
  var propV = reType === 'form' ? false : true;
  $.ajax({
    type: type,
    url: aUrl,
    data: upData,
    async: false,
    cache: propV,
    contentType: propV,
    processData: propV,
    success: function success(data) {
      console.log(data);

      if (reType === 'html') {
        dataJson = data;
      } else {
        try {
          dataJson = JSON.parse(data);
        } catch (e) {
          alert('Data error');
        }
      }
    },
    statusCode: {
      404: function _() {
        alert('Server Error');
      }
    }
  });
  return dataJson;
};