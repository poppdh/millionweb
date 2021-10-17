// js
// 2021
// inday jin

$(function(){

	var win = $(window);
	// file label
	$('.inp_file').change(function(){
    var $this = $(this);
    var fileValue = $this.val().split("\\");
    var fileName = fileValue[fileValue.length-1];
    $this.closest('.file_wrap').find('.label_file').text(fileName);
	});


	// select url이동
	$('.js_link').change(function(){
    var $this = $(this);
    var selectUrl = $this.find('option:selected').val();
    if(selectUrl !== ""){
      $(location).attr('href', selectUrl);
      //window.open(selectUrl);
    }
	});


	// 숫자만 입력
	$('.only_num').on('keyup', function(){
    var $this = $(this);
    $this.val($this.val().replace(/[^0-9]/g,""));
	});


	// checkbox, radio label
	$('.inp_label').change(function(){
    var $this = $(this);
    var tId = $this.attr('id');
    var wrap = $this.closest('.label_wrap');
    var inpType = $this[0].type;
    if(inpType == 'radio'){
      wrap.find('label[for="'+ tId +'"]').addClass('act').siblings().removeClass('act');
    }else if(inpType == 'checkbox'){
      wrap.find('label[for="'+ tId +'"]').toggleClass('act');
    }
	});


	// 입력폼 이메일 선택
	// mail_inp_wrap : 메일폼 감싸는 엘리먼트
	// mail_inp : 선택시 입력될 inp 엘리먼트
	$('.mail_selecter').change(function(){
    var $this = $(this);
    var selectVal = $this.find('option:selected').val();
    $this.closest('.mail_inp_wrap').find('.mail_inp').val(selectVal);
	});


	//지역선택
	// 필수입력시 전체선택 확인
	var boroughArr = {
		"시도 선택":["구/군을 선택해주세요."],
		"서울":["전체선택","강남구","강동구","강북구","강서구","관악구","광진구","구로구","금천구","노원구","도봉구","동대문구","동작구","중랑구","마포구","서대문구","성동구","성북구","서초구","송파구","양천구","영등포구","용산구","은평구","중구","종로구"],
		"대구":["전체선택","남구","달서구","달성군","동구","북구","서구","수성구","중구"],
		"부산":["전체선택","강서구","금정구","기장군","남구","동구","동래구","부산진구","북구","연제구","영도구","사상구","사하구","서구","수영구","중구","해운대구"],
		"대전":["전체선택","대덕구","동구","서구","유성구","중구"],
		"광주":["전체선택","광산구","남구","동구","북구","서구"],
		"울산":["전체선택","남구","동구","북구","울주군","중구"],
		"인천":["전체선택","강화군","계양구","남구","남동구","동구","부평구","서구","연수구","옹진군","중구"],
		"강원":["전체선택","강릉시","고성군","동해시","삼척시","속초시","양구군","양양군","영월군","원주시","인제군","정선군","철원군","춘천시","태백시","평창군","화천군","홍천군","횡성군"],
		"경기":["전체선택","가평군","과천시","광명시","광주시","고양시","구리시","군포시","김포시","남양주시","동두천시","부천시","수원시","성남시","시흥시","안양시","안산시","안성시","양주시","여주시","연천군","양평군","오산시","용인시","의왕시","이천시","포천시","의정부시","파주시","평택시","하남시","화성시"],
		"경남":["전체선택","거제시","거창군","고성군","김해시","남해군","밀양시","사천시","산청군","양산시","의령군","진주시","창녕군","창원시","통영시","하동군","함안군","함양군","합천군"],
		"경북":["전체선택","경산시","경주시","고령군","구미시","군위군","김천시","문경시","봉화군","상주시","성주군","안동시","영덕군","영양군","영주시","영천시","예천군","울릉군","울진군","의성군","청도군","청송군","칠곡군","포항시"],
		"전남":["전체선택","강진군","고흥군","곡성군","광양시","구례군","나주시","담양군","무안군","목포시","보성군","순천시","신안군","완도군","여수시","영광군","영암군","장성군","장흥군","진도군","함평군","화순군","해남군"],
		"전북":["전체선택","고창군","군산시","김제시","남원시","무주군","부안군","순창군","완주군","익산시","임실군","장수군","전주시","정읍시","진안군"],
		"충남":["전체선택","계룡시","공주시","금산군","논산시","당진시","부여군","보령시","아산시","예산군","서산시","서천군","천안시","청양군","태안군","홍성군"],
		"충북":["전체선택","괴산군","단양군","보은군","영동군","옥천군","음성군","제천시","증평군","진천군","청주시","충주시"],
		"제주":["전체선택","서귀포시","제주시"],
		"세종":["전체선택","반곡동","소담동","보람동","대평동","가람동","한솔동","나성동","새롬동","다정동","어진동","종촌동","고운동","아름동","도담동","조치원읍","연기면","연동면","부강면","금남면","장군면","연서면","전의면","전동면","소정면"]
	};

	$('.area_sel.city').change(function(){
		var $this = $(this);
		var val = $this.find('option:selected').val();
		if(val != ''){
			var appendOpt = '';
			for(var key in boroughArr[val]){
				appendOpt += '<option value="'+ boroughArr[val][key] +'">'+ boroughArr[val][key] +'</option>'
			}
			$this.siblings('.area_sel').empty().append(appendOpt);
		}else{
			$this.siblings('.area_sel').empty().append('<option value="">구/군을 선택해주세요.</option>')
		}
	});

	// 파일첨부 최대 크기
	$('.file_check_size').change(function(){
		if($('.file_check_size').value!=""){
			var fileSize = $('.file_check_size')[0].files[0].size;
			var maxMega = 1;
			var maxSize = maxMega * 1024 * 1024;
			if(fileSize > maxSize){
		   alert('첨부파일 사이즈는 '+ maxMega +'MB 이내로 등록이 가능합니다.');
		   return;
			}
		}
	});

	// 탑버튼
	$('.top_btn').click(function(){
		$('html,body').scrollTop(0);
	})


	// 프레임 높이 설정
  $('.frame_cont').load(function(){
		var frameH = $(this).contents().find('html').height();
		$(this).height(frameH);
	});


	// 대상 db클래스 토글
	$('.target_btn').click(function(){
		var $this = $(this);
		var targetEl = $this.attr('data-target');
		$('.'+targetEl).toggleClass('db');
	});

	$('.toggle_act').click(function(){
		var $this = $(this);
		$this.toggleClass('act');
	});



	$('.new_open_btn').click(function(){
    var $this = $(this);
		var popUrl = $this.attr('data-pop');
		var height = $this.attr('data-height');
		var winH = win.height();
		var sHeight = height < winH ? height : winH -50;
		window.open(popUrl,'', 'width=960, height='+ sHeight +', toolbar=no, menubar=no, scrollbars=yes, resizable=yes');
  });


	$('.page_num form a').click(function(e){
		e.preventDefault();
		var $this = $(this);
		var code = $this.attr('data-code');
		var codeArr = code.split(',');
		var form = $this.closest('form');
		form[0].tp.value = codeArr[0];
		form[0].tg.value = codeArr[1];
		form[0].action = form.attr('action');
		form[0].method = form.attr('method');
		form[0].submit();
	});




	// 필수입력
  window.checkFail = function(e, inp, msg, endMsg){
    alert(msg+endMsg);
    e.preventDefault();
    inp.focus();
  }
  window.reqFormCheck = function(e, form){
    var i = 0;
    var stats = true;
    var findInp = form.find('.req_inp');
    var inpLength = findInp.length;
    form.find('.req_inp').each(function(){
      i++;
      var inp = $(this);
      // var tag = inp[0].localName;
      var type = inp[0].type;
      if(type === 'text' || type === 'textarea' || type === 'password' || type === 'file'|| type === 'select-one'){
        if(inp.val() === ''){
          var msg = inp.data('alert');
          if(type === 'select-one'){
            checkFail(e, inp, msg, ' 선택해주세요.');
          }else{
            checkFail(e, inp, msg, ' 입력해주세요.');
          }
          stats = false;
          return false;
        }
      }else if(type === 'radio' || type === 'checkbox'){
        var name = inp.attr('name');
        if(form.find('input[name="'+ name +'"]').is(':checked') === false){
          var msg = inp.data('alert');
          if(inp.hasClass('agree')){
            checkFail(e, inp, msg, ' 동의 후 이용이 가능합니다.');
          }else{
            checkFail(e, inp, msg, ' 선택해주세요.');
          }
          stats = false;
          return false;
        }
      }
    });
    if(i == inpLength){
      if(stats == true){
        // submit
        return stats;
      }else{}
    }else{
      e.preventDefault();
    }
  }
  $('.req_form').submit(function(e){
    var $this = $(this);
    reqFormCheck(e, $this);
  });
	/*
	$('form').submit(function(e){
		var $this = $(this);
		var reqReturn = reqFormCheck(e, $this);
		if(reqReturn === true){
			// 성공시 true
		}else{
			return false;
		}
	});
	*/

	$('.addr_s').click(function(){
    var $this = $(this);
		daum.postcode.load(function(){
			new daum.Postcode({
				oncomplete: function(data){
					var wrap = $this.closest('.addr_wrap');
					wrap.find('.addr1').val(data.zonecode);
					wrap.find('.addr2').val(data.address);
					wrap.find('.addr3').focus();
				}
			}).open();
		});
  });


	function makeMap(el, i){
		var mapCanvas = el;
		var addr = el.attr('data-addr');
		if(i != 1){
			mapCanvas.empty();
		}

		var coords;
		var geocoder = new kakao.maps.services.Geocoder();
		geocoder.addressSearch(addr, function(result, status) {
			 if (status === kakao.maps.services.Status.OK) {
				coords = new kakao.maps.LatLng(result[0].y, result[0].x);
			}
			var mapContainer = mapCanvas[0],
				mapOption = {
					center: coords,
					level: 2
				};
			var map = new kakao.maps.Map(mapContainer, mapOption);

			var imageSrc = '/img/map_ico.png',
				imageSize = new kakao.maps.Size(70, 80),
				imageOption = {offset: new kakao.maps.Point(0, 60)};

			var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize),
				markerPosition = coords;

			var marker = new kakao.maps.Marker({
				position: markerPosition,
				image: markerImage
			});
			marker.setMap(map);
		});
	}

  $('.map_js').each(function(){
    var $this = $(this);
    makeMap($this);
  });

	$('iframe').each(function(){
		var $this = $(this);
		var src = $this.attr('src');
		if(src.indexOf('youtube.com') != -1){
			$this.wrap('<div class="mov_frame"></div>');
		}else{}
	});
});
