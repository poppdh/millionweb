$(function(){


    const body = $('body');
    const win = $(window);


    function ajaxReturn(aUrl, type, upData, reType){
		let dataJson;
		let propV = reType === 'form' ? false : true;

		$.ajax({
			type: type,
			url: aUrl,
			data: upData,
			async: false,
			cache: propV,
            contentType: propV,
            processData: propV,
			success: function(data){
                console.log(data)
				if(reType === 'html'){
					dataJson = data;
				}else{
					try{
						dataJson = JSON.parse(data);
					}catch (e) {
						alert('Data error');
					}
				}
			},statusCode:{
				404: function(){
					alert('Server Error');
				}
			}
		});
		return dataJson;
	}





});
