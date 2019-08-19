var LAppDefine = {
    // 调试，true时会在console里显示日志
    DEBUG_LOG: false,
    DEBUG_MOUSE_LOG: false,
    // 鼠标相关日志   
    //  全部设定    
    //这里配置canvsa元素的id
    CANVAS_ID: "live2d",
    //是否开启滚轮缩放，默认true
    IS_SCROLL_SCALE: false,
    // 画面最大缩放级别
    VIEW_MAX_SCALE: 2,
    // 画面最小缩放级别
    VIEW_MIN_SCALE: 0.8,

    VIEW_LOGICAL_LEFT: -1,
    VIEW_LOGICAL_RIGHT: 1,

    VIEW_LOGICAL_MAX_LEFT: -2,
    VIEW_LOGICAL_MAX_RIGHT: 2,
    VIEW_LOGICAL_MAX_BOTTOM: -2,
    VIEW_LOGICAL_MAX_TOP: 2,

    // 动作优先级常量
    //关于各个事件触发的表情可以用动作常量优先级来取代
    PRIORITY_NONE: 0,
    PRIORITY_IDLE: 1,
    PRIORITY_NORMAL: 2,
    PRIORITY_FORCE: 3,

    //是否允许拖拽，默认为true
    IS_DRAGABLE: true,

    //是否绑定切换模型按钮
    IS_BIND_BUTTON: true,
    //绑定按钮元素id
    BUTTON_ID: "Change",
    //是否开启模型切换完成之前禁止按钮点击的选项，默认为true
    IS_BAN_BUTTON: true,
    //设置按钮禁止状态时的class，可自定义样式，前提是IS_BAN_BUTTON为true
    BAN_BUTTON_CLASS: "inactive",
    //设置按钮正常状态时的class
    NORMAL_BUTTON_CLASS: "active",

    //皮肤切换模式 目前只支持 sequence-顺序
    TEXURE_CHANGE_MODE: "sequence",
    IS_START_TEXURE_CHANGE: true,
    TEXURE_BUTTON_ID: "texure",
    /**
     *  模型定义
        自定义配置模型，同一数组内放置同个模型的不同皮肤，换肤时按照顺序依次显示
        这里请用相对路径配置
     */
    MODELS: [
        ["model/22/index.json", "model/22/index-cba-normal.json", "model/22/index-cba-super.json", "model/22/index-newyear.json", "model/22/index-school2017.json", "model/22/index-spring.json", "model/22/index-summer2017-high.json", "model/22/index-summer2017-low.json", "model/22/index-tomo-high.json", "model/22/index-tomo-low.json", "model/22/index-valley2017.json", "model/22/index-vdays.json", "model/22/index-xmas.json", "model/22/index-xmas-headwear.json"], 
        ["model/22_high/model.json"], 
        ["model/33/index.json", "model/33/index-cba-normal.json", "model/33/index-cba-super.json", "model/33/index-newyear.json", "model/33/index-school2017.json", "model/33/index-spring.json", "model/33/index-summer2017-high.json", "model/33/index-summer2017-low.json", "model/33/index-tomo-high.json", "model/33/index-tomo-low.json", "model/33/index-valley2017.json", "model/33/index-vdays.json", "model/33/index-xmas.json", "model/33/index-xmas-headwear.json"], 
        ["model/33_high/model.json"], 
        ["model/bronya/model.json"], 
        ["model/haru/haru_01.model.json", "model/haru/haru_02.model.json"], 
        ["model/haruto/haruto.model.json"], 
        ["model/hibiki/hibiki.model.json"], 
        ["model/hijiki/hijiki.model.json"], 
        ["model/index/model.json"], 
        ["model/izumi/izumi.model.json"], 
        ["model/katou_01/katou_01.model.json"], 
        ["model/liang/2.json"], 
        ["model/live_uu/model.json"], 
        ["model/live_uu/model_usb.json"], 
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
        ["model/tororo/tororo.model.json"], 
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
        ["model/YuzukiYukari/YuzukiYukari.model.json"]
    ],

    // 与外部定义的json文件匹配
    MOTION_GROUP_IDLE: "idle",
    // 空闲时
    MOTION_GROUP_TAP_BODY: "tap_body",
    // 点击身体时
    MOTION_GROUP_FLICK_HEAD: "flick_head",
    // 抚摸头部
    MOTION_GROUP_PINCH_IN: "pinch_in",
    // 放大时
    MOTION_GROUP_PINCH_OUT: "pinch_out",
    // 缩小时
    MOTION_GROUP_SHAKE: "shake",
    // 摇晃
    //如果有自定义的动作分组可以放在这里
    // 与外部定义json文件相匹配
    HIT_AREA_HEAD: "head",
    HIT_AREA_BODY: "body",

    //初始化的模型大小
    SCALE: 1.0,
    //新增属性，是否播放音频 默认为true
    IS_PLAY_AUDIO: true,
    //新增属性，audio标签id值   
    AUDIO_ID: "my_audio"
};