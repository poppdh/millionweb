const express = require('express');
const router = express.Router();
const fs = require('file-system');
const fse = require('fs-extra');
const axios = require("axios");
const cheerio = require("cheerio");
const xlsx = require("xlsx");


class RouterClass{
  constructor(){
    this.dirK = ['d','p', 'm', 'r', 'a', 'pbadmin'];
    this.routeLst = {"d":[], "p":[], "m":[], "r":[], "a":[], "pbadmin": []};

    this.name = null; // 작업자명
    this.form = []; // 형태
    this.type = null; // 구조
    this.font = null; // 폰트
    this.fontCss = '';
    this.plugin = null;

    this.res = null;
  }
  default(){
    console.log('default');
    /*
    * 기본 라우터 기능
    * d: 최상위 디렉토리
    * p: pc,
    * m: mobile,
    * r: responsive,
    * a: admin
    *
    * font
    * scss, js 복사
    */
    this.dirK.map((x,i) =>{
      fs.readdir(`./views/${x}`, (err, files) => {
        if(files !== undefined){
          files.map((y, z) => {
            let file = y.split('.');
            file = file[0];
            this.routeLst[x].push(file);
          });
          this.routeLst[x].map((y, z) => {
            let useDir = null;
            if(x === 'pbadmin'){
              useDir = '/admin/'+y;
            }else if(x === 'd'){
              useDir = '/'+y;
            }else{
              useDir = '/'+x+'/'+y;
            }
            router.use(useDir, (req, res, next)=>{
              res.render(x+'/'+y, {title: y});
            });
          });
        }
      });
      // use로 설정하면 파일이외의 접근이 에러처리x
      let indexDir = null;
      if(x === 'pbadmin'){
        indexDir = '/admin';
      }else if(x === 'd'){
        indexDir = '/';
      }else{
        indexDir = '/'+x;
      }
      router.get(indexDir, (req, res, next)=>{
        res.render(x+'/index', {title: 'index'});
      });
    });

  }

  initial(req, res, next){
    //초기화 세팅
    this.name = req.body.name;
    this.form = req.body.form;
    this.type = req.body.type;
    this.plugin = req.body.plugin;

    this.font = req.body.font;
    this.res = res;
    this.makeDir();
    res.send(`<style>*{text-align:center;}.setting_wrap{width:500px;margin:0 auto;}</style>
    <title>프로젝트 적용 완료</title>
    <div class="setting_wrap">
      <h1>프로젝트 설정이 적용되었습니다.</h1>
      <p><strong>템플릿 폴더 추가</strong> : ${this.form}</p>
      <p><strong>페이지 구조</strong> : ${this.type}</p>
      <p><strong>폰트</strong> : ${this.font}</p>
    </div>`);
  }


  makeDir(){
    // 폰트 파일 복사
    if(this.font !== undefined){
      this.fontFileCopy(this.font);
    }
    // p,m,r,a 폴더 생성
    if(typeof(this.form) !== 'string'){
      this.form.map((x,i) => {
        fs.mkdir(`views/${x}`, (err) =>{
          if(! err){
            this.editLayout(x, i);
          }else{
            return console.log(err);
          }
        });
        this.copyScssJs(x);
      });
    }else{
      fs.mkdir(`views/${this.form}`, (err) =>{
        if(! err){
          this.editLayout(this.form);
        }else{
          return console.log(err);
        }
        this.copyScssJs(this.form);
      });
    }
  }

  copyScssJs(x){
    // scss
    fse.copy(`public/scss/${x}`, `scss/css/`)
      .then(() => {
        let layoutScss = fs.readFileSync(`./scss/css/${x}_layout.scss`, 'utf8');
        if(this.type === 'shop'){
          layoutScss = layoutScss.replace(/\/\/@shop/g, `@import "${x}_shop.scss";`);
          fs.copyFile(`public/scss/shop/${x}_shop.scss`, `scss/css/${x}_shop.scss`);
        }else{
          layoutScss = layoutScss.replace(/\/\/@shop/g, '');
        }
        fs.writeFileSync(`scss/css/${x}_layout.scss`, layoutScss, 'utf8');
      })
      .catch(err => {});

    // js
    fs.copyFile(`public/js/${x}-inday-1.0.0.js`, `src/js/${x}-inday-1.0.0.js`);
  }



  editLayout(x, i){
    // 생성일
    const date = new Date();
    const year = date.getFullYear();
    const month = ("0" + (1 + date.getMonth())).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);

    const writer = `<!-- n:${this.name}, s:${year}.${month}.${day} -->`;
    const viewport = x === 'r' || x === 'm' ? '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">' : '';

    const mailto = this.type === 'shop' ? '<% include mailto %>' : '';

    let header = `<!doctype html>
<html lang="ko" data-v="v2.1.1">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="format-detection" content="telephone=no">
  ${viewport}
  <title>Document</title>
  ${writer}
  ${this.fontCss}
  <link rel="stylesheet" href="/css/${x}_layout.css?v=init" media="all">
  <script src="/js/plugin/jquery-1.12.4.min.js?v=init"></script>
  <script src="/js/dev/popup.js?v=init" defer></script>
  <script src="/js/common.js?v=init"></script>
  <script src="/js/jq_ajax.js?v=init"></script>
  <script src="/js/${x}-inday-1.0.0.js?v=init"></script>
</head>
<body>
<div id="wrap">
  <div class="skip_nav">
    <ul>
      <li><a href="#gnb">주 메뉴 바로가기</a></li>
      <li><a href="#content">본문 바로가기</a></li>
    </ul>
  </div>
  <div id="header">

  </div>
  <div id="content">
  ${mailto}`;

    const footer = `  </div>
  <div id="footer">

  </div>
</div>
</body>
</html>`;
      fs.writeFileSync(`views/${x}/${x}_header.ejs`, header, 'utf8');
      fs.writeFileSync(`views/${x}/${x}_footer.ejs`, footer, 'utf8');
      this.shopTempCopy();
      //this.makeSuccPage();
  }

  fontFileCopy(fonts){
    this.fontCss = '';
    if(typeof(fonts) !== 'string'){
      fonts.map((x,i) => {
        if(this.fontCss !== ''){
          this.fontCss = this.fontCss+`\n\t<link rel="stylesheet" href="/css/font/${x}.css" media="all">`;
        }else{
          this.fontCss = this.fontCss+`<link rel="stylesheet" href="/css/font/${x}.css" media="all">`;
        }
        fse.copy(`public/fonts/font/${x}`, `src/css/font/${x}`)
        .then(() => {})
        .catch(err => {});
        fs.copyFile(`public/fonts/${x}.css`, `src/css/font/${x}.css`);
      })
    }else{
      this.fontCss = `<link rel="stylesheet" href="/css/font/${fonts}.css" media="all">`;
      fse.copy(`public/fonts/font/${fonts}`, `src/css/font/${fonts}`)
      .then(() => {})
      .catch(err => {});
      fs.copyFile(`public/fonts/${fonts}.css`, `src/css/font/${fonts}.css`);
    }
  }

  shopTempCopy(){
    if(this.type === 'shop'){
      if(typeof(this.form) !== 'string'){
        this.form.map((x,i) =>{
          fse.copy(`public/shop/template/${x}`, `views/${x}`)
          .then(() => {})
          .catch(err => {});
        });

      }else{

        fse.copy(`public/shop/template/${this.form}`, `views/${this.form}`)
        .then(() => {})
        .catch(err => {});

      }
    }
  }


  crawlingejs(req, res, next){
    axios.get(`${req.body.url}`)
    .then(dataa => {
      const $ = cheerio.load(dataa.data);
      const writeHtml = $.html($(`${req.body.selector}`));
      if(writeHtml !== ''){
        fs.writeFileSync(`views/crawling/${req.body.filename}.ejs`, writeHtml, 'utf8');
        res.send(`<style>*{text-align:center;}.setting_wrap{width:500px;margin:0 auto;}</style>
        <title>크롤링 완료</title>
        <div class="setting_wrap">
          <h1>views/crawling/${req.body.filename}.ejs 파일이 저장되었습니다.</h1>
          <p><strong>url : ${req.body.url}</p>
          <p><strong>filename</strong> : ${req.body.filename}</p>
          <p><strong>selector</strong> : ${req.body.selector}</p>
        </div>`);
      }else{
        res.send(`<script>alert("${'선택자를 확인해 주세요'}");history.back();</script>`);
      }
    });
  }


  crawlingexcel(req, res, next){
    // 엑셀저장
  }


  crawlingajax(req, res, next){


    const saveImg = async(src, imgname) =>{
      console.log(src, imgname)
      const imgResult = await axios.get(src, {	//이미지 주소 result.img를 요청
      	responseType: 'arraybuffer',	//buffer가 연속적으로 들어있는 자료 구조를 받아온다
      });
      //fs로 읽어준다
      //console에서 이미지 확장자 확인 후 같은 것으로 적용
      //console.log(imgResult.data)
      fs.writeFileSync(`src/img/crawlingdata/${imgname}`, imgResult.data);

    }




    if(req.body.cellname !== '' && req.body.uploadname !== '' && req.body.uploadtype !== ''){
      axios.get(`${req.body.url}`)
      .then(dataa => {
        const $ = cheerio.load(dataa.data);
        const writeHtml = $(`${req.body.selector}`);
        // 게시물 리스트 반복
        writeHtml.each(function(i, x){
          axios.get(`${req.body.publicurl}${$(this).find('a').attr('href')}`)
          .then(datab =>{
            const $y = cheerio.load(datab.data);
            const getSelArr = req.body.cellname.split(',');
            const getNameArr = req.body.uploadname.split(',');
            const getTypeArr = req.body.uploadtype.split(',');
            //console.log(getSelArr, getNameArr);
            let upLoadData = {'i' : i};
            getNameArr.map((xx, ii) => {
              if(getTypeArr[ii] === 'text'){
                upLoadData[`${xx}`] = $y(`${getSelArr[ii]}`).text();
              }else if(getTypeArr[ii] === 'html'){

                const aaa = $y(`${getSelArr[ii]}`).find('img');
                $y(aaa).each(function(ccc, iii){
                  const src = $y(aaa[ccc]).attr('src');
                  const srcSplit = src.split('/');

                  if(src.indexOf('http') === -1){
                    saveImg(req.body.publicurl+src, srcSplit[srcSplit.length-1]);
                    $y(aaa[ccc]).attr('src', 'img/crawlingdata/'+srcSplit[srcSplit.length-1]);
                  }else{
                    saveImg(src, srcSplit[srcSplit.length-1]);
                    $y(aaa[ccc]).attr('src', 'img/crawlingdata/'+srcSplit[srcSplit.length-1]);
                  }
                });
                upLoadData[`${xx}`] = $y(`${getSelArr[ii]}`).html();
                //console.log(upLoadData[`${xx}`]);
              }else{
                const imgSrc = $y(`${getSelArr[ii]}`).attr('src');
                const srcSplit = imgSrc.split('/');
                upLoadData[`${xx}`] = '/img/crawlingdata/'+srcSplit[srcSplit.length-1];
                saveImg(req.body.publicurl+imgSrc, srcSplit[srcSplit.length-1]);
              }
            });
            //console.log(upLoadData);
            axios.post(`${req.body.uploadurl}`, upLoadData)
            .then(succ =>{
              console.log('succ', succ.data);
            })
            .catch(err => {
              console.log('err')
            })
          })
        })
      });
      res.send(`<script>alert("${'전송완료'}");history.back();</script>`);
    }else{
      res.send(`<script>alert("${'입력을 확인해주세요.'}");history.back();</script>`);

    }
  }
}


console.log('load');

const routerClass = new RouterClass();
routerClass.default();

// 크롤링 ejs 저장
router.post('/crawling_ejs', (req, res, next) => {
  routerClass.crawlingejs(req, res, next);
});
// 크롤링 excel 저장
router.post('/crawling_excel', (req, res, next) => {
  routerClass.crawlingexcel(req, res, next);
});
// 크롤링 ajax 전송
router.post('/crawling_ajax', (req, res, next) => {
  routerClass.crawlingajax(req, res, next);
});
// 크롤링 성공
router.post('/crawling_succ', (req, res, next) => {
  res.send(`${req.body.text} + ${req.body.i} + ${req.body.date}`);
});


// 초기 세팅
router.post('/set_complate', (req, res, next) => {
  routerClass.initial(req, res, next);
});


module.exports = router;
