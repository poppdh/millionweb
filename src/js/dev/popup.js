'use strict';

class Popup{
  constructor(){
    this.code = 0;

    this.el = null;
  }

  getData($this){
    this.code = $this.attr('data-c');
    this.el = $this;

    if(this.el.hasClass('close')){
      this.close();
    }else if(this.el.hasClass('cookie')){
      this.setCookie($this);
    }else{
      this.checkCookie();
    }
  }

  checkCookie(){
    const cookiedata = document.cookie;
    if(cookiedata.indexOf(this.code) != -1){
      this.el.addClass('dn');
    }else{
      this.el.removeClass('dn');
    }
  }

  setCookie($this){
    const code = $this.closest('.sys_popup').attr('data-c');
    const date = new Date();
    date.setDate(date.getDate() + 1);
    document.cookie = code + "=" + escape(1) + "; SameSite=Lax; Secure path=/; expires=" + date.toGMTString() + ";";
    this.close();
  }

  close(){
    this.el.closest('.sys_popup').addClass('dn');
  }
}

const popup = new Popup();

$('.sys_popup').each(function(){
  const $this = $(this);
  popup.getData($this);
});

$('.sys_pop_close').click(function(){
  const $this = $(this);
  popup.getData($this);
});
