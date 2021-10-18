/*

* 게시판 리스트 ajax로 뿌려줌



*/

(function($){
	$.fn.bdAjaxLst = function(jObj){

		// 스크롤 이동
		function bdScrollTop($this){
			var posTop = $this.closest('.ajax_bd').offset().top-72;
			console.log(posTop)
			$(window).scrollTop(posTop)
		}


		// 게시판 형식 확인
		function bdTypeF(el){
			var bdTypeRt = el.hasClass('qna') ? 'qna' : 'rev';
			return bdTypeRt;
		}



		// 본문 추가
		function appendContF(memCheck, jsonData, bdType, thisEl, appendTd, tdLength, loginUrl){
			// 로그인확인
			if(memCheck === 1){
				// 보기권한
				if(jsonData.vAuth === 1){
					var strCont = jsonData.cont;
					strContTxt = strCont.replace(/\n/g, "<br>");
					appendCtr = jsonData.eAuth === 1 ? '<div class="bd_v_btn"><button type="button" class="edit">수정</button><button type="button" class="edit">삭제</button></div>' : '';
					appendCont = '<tr class="tr_td v_tr">\n'+
						'<td>\n'+
                            '<div class="w_info"><p>'+ jsonData.date +'\n'+
						    '</p><p>'+ jsonData.writer +'\n'+
						    '</p></div>\n'+
                        '</td>\n'+
                        '<td>'+ strContTxt + appendCtr +'\n'+
						'</td>\n'+
					'</tr>';
				}else if(jsonData.vAuth === 2){
					appendCont = '<tr class="tr_td v_tr"><td colspan="'+ tdLength +'" class="tac">자신의 글만 확인이 가능합니다.</td></tr>';
				}else{
					// 비밀번호 확인폼 추가
					appendCont = '<tr class="tr_td v_tr"><td colspan="'+ tdLength +'" class="pw_td"><form action="'+ jObj[bdType].pwUrl +'" method="post">Password : <input type="password" name="'+ jObj[bdType].pwName +'" class="bd_v_pw"><button type="submit" class="pw_check_btn">Submit</button></form></div></td></tr>';
				}
			}else{
				// 로그인 링크 추가
				appendCont = '<tr class="tr_td v_tr"><td colspan="'+ tdLength +'" class="tac"><div class="login_txt">자신의 글은 로그인 후 확인이 가능합니다.</div><a href="'+ loginUrl +'" class="login_link">로그인</a></td></tr>';
			}
			thisEl.find('.bd_lst_tb table').append(appendTd + appendCont);
		}





		// page
		function appendPage(lstData, objType, thisEl){
			var appendLength = objType.maxidx >= lstData[0].pgStart+objType.lstLength-1 ? objType.lstLength : objType.maxidx - lstData[0].pgStart;
			for(var i = 0; appendLength > i; i++){
				if(parseInt(lstData[0].pgStart+i) === lstData[0].pgCur){
					thisEl.find('.page_num').append('<button type="button" data-href="'+ objType.pgLink+parseInt(lstData[0].pgStart+i) +'" class="act">'+ parseInt(lstData[0].pgStart+i) +'</button>');
				}else{
					thisEl.find('.page_num').append('<button type="button" data-href="'+ objType.pgLink+parseInt(lstData[0].pgStart+i) +'">'+ parseInt(lstData[0].pgStart+i) +'</button>');
				}
			}

			// 이전, 처음 버튼
			if(lstData[0].pgCur < objType.lstLength){
			}else{
				var prevNum;
				console.log(parseInt(lstData[0].pgStart - objType.lstLength))
				if(parseInt(lstData[0].pgStart - objType.lstLength) > 0){
					prevNum = parseInt(lstData[0].pgStart - objType.lstLength);
				}else{
					prevNum = 1;
	
				}
				thisEl.find('.page_l').append('<button type="button" data-href="'+ objType.pgLink + prevNum +'" class="page l">&lt;</button>');
			}

			// 다음, 마지막 버튼
			if(lstData[0].pgStart+objType.lstLength-1 < objType.maxidx){
				var nextNum;
				if(parseInt(lstData[0].pgStart + objType.lstLength) < objType.maxidx){
					nextNum = parseInt(lstData[0].pgStart + objType.lstLength);
				}
				else{
					nextNum = objType.maxidx;
				}
				thisEl.find('.page_r').append('<button type="button" data-href="'+ objType.pgLink + nextNum +'" class="page r">&gt;</button>');

			}else{}
		}











		// 리스트 추가
		function lstAppend(thisEl, bdType, lstUrlarg){
			// 기본 엘리먼트 추가
			thisEl.append('<div class="lst_wrap"><div class="bd_lst_tb append_el"><table></table></div><div class="page_num_box append_el pt20"><div class="page_l"></div><div class="page_num"></div><div class="page_r"></div></div><div class="btn_box"></div></div><div class="form_wrap"></div>');
			$.ajax({
				type: 'get',
				url: lstUrlarg,
				dataType: 'json',
				success: function(lstData){
					for(var key in lstData){
						// 리스트 추가
						var appendTd;
						var tdLength;
						var appendLock = lstData[key].lock === 1 ? '<span class="lock"></span>' : '';
						var appendRe = lstData[key].re === 1 ? '<span class="re">RE :</span>' : '';
						var appendCont;
						var appendCtr;
						if(bdType === 'rev'){
							var appendPoint = '';
							for(i = 0; i < 5; i++){
								if(i < lstData[key].point){
									appendPoint += '<span class="point point1"></span>'
								}else{
									appendPoint += '<span class="point"></span>'
								}
							}

							tdLength = 2;
							var statstxt;
							appendTd = '<tr class="tr_td lst_tr">\n'+
							'<td class="td1"><span class="rev_point_box">'+ appendPoint +'</span></td>\n'+
							'<td class="td2">\n'+
								'<p class="t1_1 fz16">\n'+
									'<span>'+ lstData[key].title +'</span>\n'+
								'</p>\n'+
							'</td>\n'+
							'</tr>';
						}else{
							// review
							tdLength = 2;
							if(lstData[key].state === 0){
								statstxt = '답변대기';
							}else if(lstData[key].state === 1){
								statstxt = '답변완료';
							}else{
								statstxt = '';
							}

							appendTd = '<tr class="tr_td lst_tr">\n'+
							'<td class="td1">'+ lstData[key].date +'</td>\n'+
							'<td class="td2">\n'+
								'<p class="t1_1">'+ appendLock+appendRe +'\n'+
									'<span>'+ lstData[key].title +'</span>\n'+
								'</p>\n'+
							'</td>\n'+
							'</tr>';
						}

						// 본문 추가
						appendContF(jObj[bdType].memUse, lstData[key], bdType, thisEl, appendTd, tdLength, jObj.loginUrl);
					}
					appendPage(lstData, jObj[bdType], thisEl);



				}

			});

			if(jObj[bdType].wAuth === 1){
				thisEl.find('.btn_box').append('<button type="button" class="w_btn">글쓰기</button>');
			}
		}











		// 기본세팅

		$('.ajax_bd').each(function(){
			var $this = $(this);
			var bdType = bdTypeF($this);
			lstAppend($this, bdType, jObj[bdType].lstUrl);
		});



		// 페이지 클릭
		$('body').on('click', '.page_num button,.page_l button,.page_r button', function(){
			var $this = $(this).closest('.ajax_bd');
			var lstUrlarg = $(this).attr('data-href');
			var bdType = bdTypeF($this);
			$this.empty();
			$this.append
			lstAppend($this, bdType, lstUrlarg);
		});



		$('body').on('click', '.bd_lst_tb table .lst_tr td', function(){
			var $this = $(this);
            $this.closest('tr').toggleClass('activ').siblings().removeClass('activ');
			$this.closest('tr').next().toggleClass('db').siblings().removeClass('db');
		});





		//글쓰기
		$('body').on('click', '.btn_box .w_btn', function(){
			var $this = $(this);
			var bdType = bdTypeF($this.closest('.ajax_bd'));
			bdScrollTop($this);
			var appendWrite = bdType === 'qna' ? '<form action="'+ jObj[bdType].wUrl +'" method="post">\n'+
				'<input type="hidden" name="gid" value="'+ jObj.gid +'">\n'+
				'<table class="prod_v_inp">\n'+
					'<tr>\n'+
						'<th class="fz16">제목</th>\n'+
						'<td><input type="text" name="title" class="re_inp req_inp" data-alert="Title"></td>\n'+
					'</tr>\n'+
					'<tr>\n'+
						'<th class="fz16">내용</th>\n'+
						'<td><textarea name="cont" class="re_inp req_inp" data-alert="Content"></textarea></td>\n'+
					'</tr>\n'+
					'</table>\n'+
					'<div class="w_btn_box tac pt20"><button type="submit" class="re_inp_btn w_submit fz16">글쓰기</button><button type="button" class="re_inp_btn w_cancel fz16">취소</button></div>\n'+
				'</form>' : '<form action="'+ jObj[bdType].wUrl +'" method="post">\n'+
					'<table class="prod_v_inp">\n'+
					'<tr>\n'+
						'<th class="fz16">평점</th>\n'+
						'<td>\n'+
							'<input type="radio" name="point" value="5" checked><span class="rev_point_box"><span class="point point1"></span><span class="point point1"></span><span class="point point1"></span><span class="point point1"></span><span class="point point1"></span></span>\n'+
							'<input type="radio" name="point" value="4"><span class="rev_point_box"><span class="point point1"></span><span class="point point1"></span><span class="point point1"></span><span class="point point1"></span><span class="point"></span></span>\n'+
							'<input type="radio" name="point" value="3"><span class="rev_point_box"><span class="point point1"></span><span class="point point1"></span><span class="point point1"></span><span class="point"></span><span class="point"></span></span>\n'+
							'<input type="radio" name="point" value="2"><span class="rev_point_box"><span class="point point1"></span><span class="point point1"></span><span class="point"></span><span class="point"></span><span class="point"></span></span>\n'+
							'<input type="radio" name="point" value="1"><span class="rev_point_box"><span class="point point1"></span><span class="point"></span><span class="point"></span><span class="point"></span><span class="point"></span></span></td>\n'+
					'</tr>\n'+
					'<tr>\n'+
						'<th class="fz16">제목</th>\n'+
						'<td><input type="text" name="title" class="re_inp req_inp" data-alert="Title"></td>\n'+
					'</tr>\n'+
					'<tr>\n'+
						'<th class="fz16">제목</th>\n'+
						'<td><textarea name="cont" class="re_inp req_inp" data-alert="Content"></textarea></td>\n'+
					'</tr>\n'+
					'</table>\n'+
					'<div class="w_btn_box tac pt20"><button type="submit" class="re_inp_btn w_submit fz16">글쓰기</button><button type="button" class="re_inp_btn w_cancel fz16">취소</button></div>\n'+
				'</form>';
			$this.closest('.lst_wrap').addClass('dn');
			$this.closest('.lst_wrap').siblings('.form_wrap').empty().append(appendWrite);
		});



		// 글쓰기 submit
		$('body').on('click', '.w_btn_box .w_submit', function(e){
			e.preventDefault();
			var $this = $(this);
			var nextS = [];
			$('.req_inp').each(function(){
				reqInp = $(this);
				if(reqInp.val() === ''){
					alert(reqInp.attr('data-alert')+' 입력해주세요.');
					reqInp.focus();
					nextS = false;
					return false;
				}
			});

			if(nextS !== false){

				var bdType = bdTypeF($this.closest('.ajax_bd'));
				var submitCont = $this.closest('form').serializeArray();
				console.log(submitCont)
				$.ajax({
					type:'post',
					url: jObj[bdType].wUrl,
					data: submitCont,
					success : function(wData){
						// 글쓰기 성공 1
						if(wData){
							var thisCloset = $this.closest('.ajax_bd');
							thisCloset.empty();
							lstAppend(thisCloset, bdType, jObj[bdType].lstUrl);
						}
						console.log('success');
					},error: function(){
						console.log('error');
					}
				});
			}

		});





		// 글쓰기 취소

		$('body').on('click', '.w_btn_box .w_cancel', function(){
			var $this = $(this);
			$this.closest('.ajax_bd').find('.lst_wrap').removeClass('dn');
			$this.closest('.ajax_bd').find('.form_wrap').empty();
		});





		// 게시물 비밀번호 확인

		$('body').on('click', '.pw_check_btn', function(e){
			e.preventDefault();
			var $this = $(this);
			var bdType = bdTypeF($this.closest('.ajax_bd'));
			var pwData = $this.closest('form').serialize();
			$.ajax({
				type: 'post',
				url: jObj[bdType].pwUrl,
				data: pwData,
				success: function(rData){
					try {
						rData = JSON.parse(rData);
						var winTop = $(window).scrollTop()+50;
						if(rData.stats === "1"){
							var thisTd = $this.closest('.pw_td')
							thisTd.empty().append('rData');
						}else if(rData.stats === "2"){
							alert('비밀번호가 일치하지 않습니다.');
						}else{
							console.log('stats return 에러');
						}
					} catch(e) {
						console.log('json 에러');
					}
				},error: function(){
					console.log('error');
				}
			});
		});
	}

})(jQuery);











	/*

	* 객체정보
	* loginUrl : 로그인페이지 url
	* lstUrl : 게시물 리스트 url
	* lstLength : 한 페이지당 게시물 수
	* maxidx : 마지막 페이지 번호
	* pgLink : page nav 링크주소
	* wAuth : 글쓰기권한 (1 글쓰기 가능, 0 권한없음)
	* wUrl : 글쓰기 데이터 받을 페이지
	* memUse : 회원전용 (1 회원, 0 비회원)

	* 외부 스크립트 객체
	* num : 게시물 번호
	* title : 제목
	* date :날짜
	* view :조회수
	* point :평점, 답변상태
	* writer :작성자
	* cont :본문
	* pgStart : 페이지시작번호
	* pgCur : 활성화페이지
	* vAuth : 글조회 권한 (1 권한있음, 0 권한없음)
	* eAuth : 수정권한 (1 권한있음, 0 권한없음)
	* state 상태 (0 답변대기, 1 답변완료, 답글에는 값없음)
	* 글쓰기 성공시 1 리턴
	*/
