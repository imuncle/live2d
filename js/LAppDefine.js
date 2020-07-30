var LAppDefine = {
   
    //这里配置canvsa元素的id
    CANVAS_ID: "live2d",

    //是否允许拖拽，默认为true
    IS_DRAGABLE: true,

    //绑定按钮元素id
    BUTTON_ID: "Change",

    TEXURE_BUTTON_ID: "texure",
    /**
     *  模型定义
        自定义配置模型，同一数组内放置同个模型的不同皮肤，换肤时按照顺序依次显示
        这里请用相对路径配置
     */
    MODELS: [
        ["model/22/model.default.json", "model/22/model.2016.xmas.1.json", "model/22/model.2016.xmas.2.json", "model/22/model.2017.cba-normal.json", "model/22/model.2017.cba-super.json", "model/22/model.2017.newyear.json", "model/22/model.2017.school.json", "model/22/model.2017.summer.normal.1.json", "model/22/model.2017.summer.normal.2.json", "model/22/model.2017.summer.super.1.json", "model/22/model.2017.summer.super.2.json", "model/22/model.2017.tomo-bukatsu.high.json", "model/22/model.2017.tomo-bukatsu.low.json", "model/22/model.2017.valley.json", "model/22/model.2017.vdays.json", "model/22/model.2018.bls-summer.json", "model/22/model.2018.bls-winter.json", "model/22/model.2018.lover.json", "model/22/model.2018.spring.json"], 
        ["model/22_high/model.json"], 
        ["model/33/model.default.json", "model/33/model.2016.xmas.1.json", "model/33/model.2016.xmas.2.json", "model/33/model.2017.cba-normal.json", "model/33/model.2017.cba-super.json", "model/33/model.2017.newyear.json", "model/33/model.2017.school.json", "model/33/model.2017.summer.normal.1.json", "model/33/model.2017.summer.normal.2.json", "model/33/model.2017.summer.super.1.json", "model/33/model.2017.summer.super.2.json", "model/33/model.2017.tomo-bukatsu.high.json", "model/33/model.2017.tomo-bukatsu.low.json", "model/33/model.2017.valley.json", "model/33/model.2017.vdays.json", "model/33/model.2018.bls-summer.json", "model/33/model.2018.bls-winter.json", "model/33/model.2018.lover.json", "model/33/model.2018.spring.json"],
        ["model/33_high/model.json"], 
        ["model/bronya/model.json"], 
        ["model/bronya_1/model.json"],
        ["model/haru/haru_01.model.json", "model/haru/haru_02.model.json"], 
        ["model/haruto/haruto.model.json"], 
        ["model/hibiki/hibiki.model.json"], 
        ["model/hijiki/hijiki.model.json", "model/tororo/tororo.model.json"], 
        ["model/index/model.json"], 
        ["model/izumi/izumi.model.json"], 
        ["model/katou_01/katou_01.model.json"], 
        ["model/liang/2.json"], 
        ["model/live_uu/model.json", "model/live_uu/model_usb.json"], 
        ["model/mei/model.json"], 
        ["model/miku/miku.model.json"], 
        ["model/murakumo/index.json"], 
        ["model/xiaomai/xiaomai.model.json"], 
        ["model/wanko/wanko.model.json"], 
        ["model/shizuku/shizuku.model.json"], 
        ["model/Epsilon2.1/Epsilon2.1.model.json"], 
        ["model/Pio/model.json", "model/Pio/model1.json", "model/Pio/model2.json", "model/Pio/model3.json", "model/Pio/model4.json", "model/Pio/model5.json"], 
        ["model/platelet/model.json"], 
        ["model/platelet-2/model.json", "model/platelet-3/kesyoban.model.json"], 
        ["model/rem/model.json"], 
        ["model/sagiri/sagiri.model.json"], 
        ["model/snow_miku/model.json"], 
        ["model/Terisa/model.json"], 
        ["model/Tia/index.json", "model/Tia/index1.json", "model/Tia/index2.json", "model/Tia/index3.json", "model/Tia/index4.json", "model/Tia/index5.json"], 
        ["model/tsumiki/tsumiki.model.json"], 
        ["model/unitychan/unitychan.model.json"], 
        ["model/yuri/model.json"], 
        ["model/z16/z16.model.json"], 
        ["model/chitose/chitose.model.json"], 
        ["model/HyperdimensionNeptunia/blanc_classic/index.json", "model/HyperdimensionNeptunia/blanc_normal/index.json", "model/HyperdimensionNeptunia/blanc_swimwear/index.json"], 
        ["model/HyperdimensionNeptunia/histoire/index.json", "model/HyperdimensionNeptunia/histoirenohover/index.json"], 
        ["model/HyperdimensionNeptunia/nepgear/index.json", "model/HyperdimensionNeptunia/nepgearswim/index.json", "model/HyperdimensionNeptunia/nepgear_extra/index.json"], 
        ["model/HyperdimensionNeptunia/nepmaid/index.json", "model/HyperdimensionNeptunia/nepnep/index.json", "model/HyperdimensionNeptunia/nepswim/index.json", "model/HyperdimensionNeptunia/neptune_classic/index.json", "model/HyperdimensionNeptunia/neptune_santa/index.json"], ["model/HyperdimensionNeptunia/noir_classic/index.json", "model/HyperdimensionNeptunia/noir/index.json", "model/HyperdimensionNeptunia/noir_santa/index.json", "model/HyperdimensionNeptunia/noireswim/index.json"], 
        ["model/HyperdimensionNeptunia/vert_classic/index.json", "model/HyperdimensionNeptunia/vert_normal/index.json", "model/HyperdimensionNeptunia/vert_swimwear/index.json"],
        ["model/mashiro/ryoufuku.model.json", "model/mashiro/seifuku.model.json", "model/mashiro/shifuku.model.json"],
        ["model/makoto0/makoto0.model.json"],
        ["model/penchan/penchan.model.json"],
        ["model/iio/iio.model.json"],
        ["model/yukari_model/yukari_model.model.json"],
        ["model/YuzukiYukari/YuzukiYukari.model.json"],
        ["model/Violet/14.json"],
        ["model/Alice/model.json"],
        ["model/fox/model.json"],
        ["model/himeko/model.json"],
        ["model/kiana/model.json"],
        ["model/redeemer/model.json"],
        ["model/sakura/model.json"],
        ["model/seele/model.json"],
        ["model/sin/model.json"],
        ["model/theresa/model.json"],
        ["model/illyasviel/illyasviel.model.json"],
        ["model/dollsfrontline/88type_1809/normal/model.json", "model/dollsfrontline/88type_1809/destroy/model.json"],
        ["model/dollsfrontline/95type_405/normal/model.json", "model/dollsfrontline/95type_405/destroy/model.json"],
        ["model/dollsfrontline/ags-30/model.json"],
        ["model/dollsfrontline/armor/model1.json", "model/dollsfrontline/armor/model2.json", "model/dollsfrontline/armor/model3.json"],
        ["model/dollsfrontline/command/model1.json", "model/dollsfrontline/command/model2.json", "model/dollsfrontline/command/model3.json"],
        ["model/dollsfrontline/dsr50_1801/normal/model.json", "model/dollsfrontline/dsr50_1801/destroy/model.json"],
        ["model/dollsfrontline/dsr50_2101/normal/model.json", "model/dollsfrontline/dsr50_2101/destroy/model.json"],
        ["model/dollsfrontline/fn57_2203/normal/model.json"],
        ["model/dollsfrontline/fortress/model1.json", "model/dollsfrontline/fortress/model2.json", "model/dollsfrontline/fortress/model3.json"],
        ["model/dollsfrontline/g36c_1202/normal/model.json", "model/dollsfrontline/g36c_1202/destroy/model.json"],
        ["model/dollsfrontline/g41_2401/normal/model.json", "model/dollsfrontline/g41_2401/destroy/model.json"],
        ["model/dollsfrontline/gelina/normal/model.json"],
        ["model/dollsfrontline/golden/model1.json", "model/dollsfrontline/golden/model2.json", "model/dollsfrontline/golden/model3.json"],
        ["model/dollsfrontline/grizzly_2102/normal/model.json", "model/dollsfrontline/grizzly_2102/destroy/model.json"],
        ["model/dollsfrontline/hk416_805/normal/model.json", "model/dollsfrontline/hk416_805/destroy/model.json"],
        ["model/dollsfrontline/kp31_310/normal/model.json", "model/dollsfrontline/kp31_310/destroy/model.json"],
        ["model/dollsfrontline/kp31_1103/normal/model.json", "model/dollsfrontline/kp31_1103/destroy/model.json"],
        ["model/dollsfrontline/kp31_3101/normal/model.json", "model/dollsfrontline/kp31_3101/destroy/model.json"],
        ["model/dollsfrontline/m1928a1_1501/normal/model.json", "model/dollsfrontline/m1928a1_1501/destroy/model.json"],
        ["model/dollsfrontline/mlemk1_604/normal/model.json", "model/dollsfrontline/mlemk1_604/destroy/model.json"],
        ["model/dollsfrontline/ntw20_2301/normal/model.json", "model/dollsfrontline/ntw20_2301/destroy/model.json"],
        ["model/dollsfrontline/ots14_3001/normal/model.json", "model/dollsfrontline/ots14_3001/destroy/model.json"],
        ["model/dollsfrontline/px4storm_2801/normal/model.json", "model/dollsfrontline/px4storm_2801/destroy/model.json"],
        ["model/dollsfrontline/rfb_1601/normal/model.json", "model/dollsfrontline/rfb_1601/destroy/model.json"],
        ["model/dollsfrontline/sat8_2601/normal/model.json", "model/dollsfrontline/sat8_2601/destroy/model.json"],
        ["model/dollsfrontline/shield/model1.json", "model/dollsfrontline/shield/model2.json", "model/dollsfrontline/shield/model3.json"],
        ["model/dollsfrontline/type64-ar_2901/normal/model.json", "model/dollsfrontline/type64-ar_2901/destroy/model.json"],
        ["model/dollsfrontline/vector_1901/normal/model.json", "model/dollsfrontline/vector_1901/destroy/model.json"],
        ["model/dollsfrontline/wa2000_6/normal/model.json", "model/dollsfrontline/wa2000_6/destroy/model.json"],
        ["model/dollsfrontline/welrod_1401/normal/model.json", "model/dollsfrontline/welrod_1401/destroy/model.json"],
        ["model/chiaki_kitty/chiaki_kitty.model.json"],
        ["model/date_16/date_16.model.json", "model/hallo_16/hallo_16.model.json"],
        ["model/kanzaki/kanzaki.model.json"],
        ["model/Kobayaxi/Kobayaxi.model.json"],
        ["model/kuroko/kuroko.model.json"],
        ["model/len/len.model.json", "model/len_impact/len_impact.model.json", "model/len_space/len_space.model.json", "model/len_swim/len_swim.model.json"],
        ["model/ryoufuku/ryoufuku.model.json"],
        ["model/saten/saten.model.json"],
        ["model/seifuku/seifuku.model.json"],
        ["model/shifuku/shifuku.model.json", "model/shifuku2/shifuku2.model.json"],
        ["model/stl/stl.model.json"],
        ["model/touma/touma.model.json"],
        ["model/uiharu/uiharu.model.json"],
        ["model/wed_16/wed_16.model.json"]
    ]
};


this.canvas = document.getElementById(LAppDefine.CANVAS_ID);
if (this.canvas.addEventListener) {
    this.canvas.addEventListener("click", mouseEvent, false);
    this.canvas.addEventListener("mousedown", mouseEvent, false);
    this.canvas.addEventListener("mouseup", mouseEvent, false);
    this.canvas.addEventListener("mousemove", mouseEvent, false);
}

var isDragging = false;
var mouseOffsetx = 0;
var mouseOffsety = 0;
function mouseEvent(e) {
    e.preventDefault();
    if (e.type == "mousedown") {
        if ("button" in e && e.button != 0){
            return;
        }
        isDragging = true;
        mouseOffsetx = e.pageX - document.getElementById(LAppDefine.CANVAS_ID).offsetLeft;
        mouseOffsety = e.pageY - document.getElementById(LAppDefine.CANVAS_ID).offsetTop;
    } else if (e.type == "mousemove") {
        if(isDragging == true) {
            var movex = e.pageX - mouseOffsetx;
            var movey = e.pageY - mouseOffsety;
            if(movex > window.innerWidth - document.getElementById(LAppDefine.CANVAS_ID).width)
                movex = window.innerWidth - document.getElementById(LAppDefine.CANVAS_ID).width;
            if(movex < 0) movex = 0;
            if(movey > window.innerHeight - document.getElementById(LAppDefine.CANVAS_ID).height)
                movey = window.innerHeight - document.getElementById(LAppDefine.CANVAS_ID).height;
            if(movey < 0) movey = 0;
            if(LAppDefine.IS_DRAGABLE) {
                document.getElementById(LAppDefine.CANVAS_ID).style.left = movex + "px";
                document.getElementById(LAppDefine.CANVAS_ID).style.top = movey + "px";
            }
        }
    } else if (e.type == "mouseup") {
        if ("button" in e && e.button != 0) return;
        isDragging = false;
    }
}
