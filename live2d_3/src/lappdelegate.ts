/*
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at http://live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import {Live2DCubismFramework as live2dcubismframework, Option as Csm_Option} from "../Framework/live2dcubismframework";
import {Live2DCubismFramework as cubismmatrix44} from "../Framework/math/cubismmatrix44";
import Csm_CubismMatrix44 = cubismmatrix44.CubismMatrix44;
import Csm_CubismFramework = live2dcubismframework.CubismFramework;
import {LAppView} from "./lappview";
import {LAppPal} from "./lapppal";
import {LAppTextureManager} from "./lapptexturemanager";
import {LAppLive2DManager} from "./lapplive2dmanager";
import {LAppDefine} from "./lappdefine";

export let canvas: HTMLCanvasElement = null;
export let s_instance: LAppDelegate = null;
export let gl: WebGLRenderingContext = null;
export let frameBuffer: WebGLFramebuffer = null;

/**
 * アプリケーションクラス。
 * Cubism3の管理を行う。
 */
export class LAppDelegate
{
    /**
     * クラスのインスタンス（シングルトン）を返す。
     * インスタンスが生成されていない場合は内部でインスタンスを生成する。
     * 
     * @return クラスのインスタンス
     */
    public static getInstance(): LAppDelegate
    {
        if(s_instance == null)
        {
            s_instance = new LAppDelegate();
        }

        return s_instance;
    }

    /**
     * クラスのインスタンス（シングルトン）を解放する。
     */
    public static releaseInstance(): void
    {
        if(s_instance != null)
        {
            s_instance.release();
        }

        s_instance = null;
    }

    /**
     * APPに必要な物を初期化する。
     */
    public initialize(): boolean
    {
        // キャンバスの取得
        canvas = <HTMLCanvasElement>document.getElementById("SAMPLE");

        // glコンテキストを初期化
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

        if(!gl)
        {
            alert("WebGLを初期化できません。ブラウザはサポートしていないようです。");
            gl = null;

            // gl初期化失敗
            return false;
        }

        if (!frameBuffer)
        {
            frameBuffer = gl.getParameter(gl.FRAMEBUFFER_BINDING);    
        }

        // 透過設定
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        let supportTouch: boolean = 'ontouchend' in canvas;

        if(supportTouch)
        {
            // タッチ関連コールバック関数登録
            canvas.ontouchstart = onTouchBegan;
            canvas.ontouchmove = onTouchMoved;
            canvas.ontouchend = onTouchEnded;
            canvas.ontouchcancel = onTouchCancel;
        }
        else
        {
            // マウス関連コールバック関数登録
            canvas.onmousedown = onClickBegan;
            canvas.onmousemove = onMouseMoved;
            canvas.onmouseup = onClickEnded;
        }

        // AppViewの初期化
        this._view.initialize();
        
        // Cubism3の初期化
        this.initializeCubism();

        return true;
    }

    /**
     * 解放する。
     */
    public release(): void
    {
        this._textureManager.release();
        this._textureManager = null;

        this._view.release();
        this._view = null;

        // リソースを解放
        LAppLive2DManager.releaseInstance();

        // Cubism3の解放
        Csm_CubismFramework.dispose();
    }

    /**
     * 実行処理。
     */
    public run(): void
    {
        // メインループ
        let loop = () =>
        {
            // インスタンスの有無の確認
            if(s_instance == null)
            {
                return;
            }

            // 時間更新
            LAppPal.updateTime();

            // 画面の初期化
            gl.clearColor(0.0, 0.0, 0.0, 1.0);

            // 深度テストを有効化
            gl.enable(gl.DEPTH_TEST);

            // 近くにある物体は、遠くにある物体を覆い隠す
            gl.depthFunc(gl.LEQUAL);

            // カラーバッファや深度バッファをクリアする
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            gl.clearDepth(1.0);

            // 透過設定
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

            // 描画更新
            this._view.render();

            // ループのために再帰呼び出し
            requestAnimationFrame(loop);
        };
        loop();
    }

    /**
     * シェーダーを登録する。
     */
    public createShader(): WebGLProgram
    {
        // バーテックスシェーダーのコンパイル
        let vertexShaderId = gl.createShader(gl.VERTEX_SHADER);

        if(vertexShaderId == null)
        {
            LAppPal.printLog("failed to create vertexShader");
            return null;
        }

        const vertexShader: string =
            "precision mediump float;" +
            "attribute vec3 position;" +
            "attribute vec2 uv;" +
            "varying vec2 vuv;" +
            "void main(void)" +
            "{" +
            "   gl_Position = vec4(position, 1.0);" +
            "   vuv = uv;" +
            "}";

        gl.shaderSource(vertexShaderId, vertexShader);
        gl.compileShader(vertexShaderId);

        // フラグメントシェーダのコンパイル
        let fragmentShaderId = gl.createShader(gl.FRAGMENT_SHADER);
        
        if(fragmentShaderId == null)
        {
            LAppPal.printLog("failed to create fragmentShader");
            return null;
        }

        const fragmentShader: string =
            "precision mediump float;" +
            "varying vec2 vuv;" +
            "uniform sampler2D texture;" +
            "void main(void)" +
            "{" +
            "   gl_FragColor = texture2D(texture, vuv);" +
            "}";

        gl.shaderSource(fragmentShaderId, fragmentShader);
        gl.compileShader(fragmentShaderId);

        // プログラムオブジェクトの作成
        let programId = gl.createProgram();
        gl.attachShader(programId, vertexShaderId);
        gl.attachShader(programId, fragmentShaderId);

        gl.deleteShader(vertexShaderId);
        gl.deleteShader(fragmentShaderId);

        // リンク
        gl.linkProgram(programId);

        gl.useProgram(programId);

        return programId;
    }

    /**
     * View情報を取得する。
     */
    public getView(): LAppView
    {
        return this._view;
    }

     public getTextureManager(): LAppTextureManager
     {
        return this._textureManager;
     }
    
    /**
     * コンストラクタ
     */
    constructor()
    {
        this._captured = false;
        this._mouseX = 0.0;
        this._mouseY = 0.0;
        this._isEnd = false;

        this._cubismOption = new Csm_Option();
        this._view = new LAppView();
        this._textureManager = new LAppTextureManager();
    }

    /**
     * Cubism3の初期化
     */
    public initializeCubism(): void
    {
        // setup cubism
        this._cubismOption.logFunction = LAppPal.printMessage;
        this._cubismOption.loggingLevel = LAppDefine.CubismLoggingLevel;
        Csm_CubismFramework.startUp(this._cubismOption);

        // initialize cubism
        Csm_CubismFramework.initialize();

        // load model
        LAppLive2DManager.getInstance();

        // default proj
        let projection: Csm_CubismMatrix44 = new Csm_CubismMatrix44();

        LAppPal.updateTime();

        this._view.initializeSprite();
    }

    _cubismOption: Csm_Option;          // Cubism3 Option
    _view: LAppView;                    // View情報
    _captured: boolean;                 // クリックしているか
    _mouseX: number;                    // マウスX座標
    _mouseY: number;                    // マウスY座標
    _isEnd: boolean;                    // APP終了しているか
    _textureManager: LAppTextureManager;// テクスチャマネージャー
}

/**
 * クリックしたときに呼ばれる。
 */
function onClickBegan(e: MouseEvent): void
{
    if(!LAppDelegate.getInstance()._view)
    {
        LAppPal.printLog("view notfound");
        return;
    }
    LAppDelegate.getInstance()._captured = true;
    
    let posX: number = e.pageX;
    let posY: number = e.pageY;

    LAppDelegate.getInstance()._view.onTouchesBegan(posX, posY);
}

/**
 * マウスポインタが動いたら呼ばれる。
 */
function onMouseMoved(e: MouseEvent): void
{
    if(!LAppDelegate.getInstance()._captured)
    {
        return;
    }
    
    if(!LAppDelegate.getInstance()._view)
    {
        LAppPal.printLog("view notfound");
        return;
    }

    let rect = (<Element>e.target).getBoundingClientRect();
    let posX: number = e.clientX - rect.left;
    let posY: number = e.clientY - rect.top;

    LAppDelegate.getInstance()._view.onTouchesMoved(posX, posY);
}

/**
 * クリックが終了したら呼ばれる。
 */
function onClickEnded(e: MouseEvent): void
{
    LAppDelegate.getInstance()._captured = false;
    if(!LAppDelegate.getInstance()._view)
    {
        LAppPal.printLog("view notfound");
        return;
    }
    
    
    let rect = (<Element>e.target).getBoundingClientRect();
    let posX: number = e.clientX - rect.left;
    let posY: number = e.clientY - rect.top;

    LAppDelegate.getInstance()._view.onTouchesEnded(posX, posY);
}


/**
 * タッチしたときに呼ばれる。
 */
function onTouchBegan(e: TouchEvent): void
{
    if(!LAppDelegate.getInstance()._view)
    {
        LAppPal.printLog("view notfound");
        return;
    }

    LAppDelegate.getInstance()._captured = true;

    let posX = e.changedTouches[0].pageX;
    let posY = e.changedTouches[0].pageY;

    LAppDelegate.getInstance()._view.onTouchesBegan(posX, posY);
}

/**
 * スワイプすると呼ばれる。
 */
function onTouchMoved(e: TouchEvent): void
{
    if(!LAppDelegate.getInstance()._captured)
    {
        return;
    }

    if(!LAppDelegate.getInstance()._view)
    {
        LAppPal.printLog("view notfound");
        return;
    }
    
    let rect = (<Element>e.target).getBoundingClientRect();

    let posX = e.changedTouches[0].clientX - rect.left;
    let posY = e.changedTouches[0].clientY - rect.top;

    LAppDelegate.getInstance()._view.onTouchesMoved(posX, posY);
}

/**
 * タッチが終了したら呼ばれる。
 */
function onTouchEnded(e: TouchEvent): void
{
    LAppDelegate.getInstance()._captured = false;

    if(!LAppDelegate.getInstance()._view)
    {
        LAppPal.printLog("view notfound");
        return;
    }

    let rect = (<Element>e.target).getBoundingClientRect();
    
    let posX = e.changedTouches[0].clientX - rect.left;
    let posY = e.changedTouches[0].clientY - rect.top;

    LAppDelegate.getInstance()._view.onTouchesEnded(posX, posY);
}

/**
 * タッチがキャンセルされると呼ばれる。
 */
function onTouchCancel(e: TouchEvent): void
{
    LAppDelegate.getInstance()._captured = false;

    if(!LAppDelegate.getInstance()._view)
    {
        LAppPal.printLog("view notfound");
        return;
    }

    let rect = (<Element>e.target).getBoundingClientRect();
    
    let posX = e.changedTouches[0].clientX - rect.left;
    let posY = e.changedTouches[0].clientY - rect.top;

    LAppDelegate.getInstance()._view.onTouchesEnded(posX, posY);
}
