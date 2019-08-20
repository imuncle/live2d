/*
* Copyright(c) Live2D Inc. All rights reserved.
*
* Use of this source code is governed by the Live2D Open Software license
* that can be found at http://live2d.com/eula/live2d-open-software-license-agreement_en.html.
*/

import {Live2DCubismFramework as cubismmatrix44} from "../Framework/math/cubismmatrix44";
import {Live2DCubismFramework as csmvector} from "../Framework/type/csmvector";
import Csm_csmVector = csmvector.csmVector;
import Csm_CubismMatrix44 = cubismmatrix44.CubismMatrix44;

import { LAppModel } from "./lappmodel";
import { LAppDefine } from "./lappdefine";
import { LAppPal } from "./lapppal";
import { canvas } from "./lappdelegate";


export let s_instance: LAppLive2DManager = null;

/**
 * サンプルアプリケーションにおいてCubismModelを管理するクラス
 * モデル生成と破棄、タップイベントの処理、モデル切り替えを行う。
 */
export class LAppLive2DManager
{
    /**
     * クラスのインスタンス（シングルトン）を返す。
     * インスタンスが生成されていない場合は内部でインスタンスを生成する。
     * 
     * @return クラスのインスタンス
     */
    public static getInstance(): LAppLive2DManager
    {
        if(s_instance == null)
        {
            s_instance = new LAppLive2DManager();
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
            s_instance = void 0;
        }
        
        s_instance = null;
    }

    /**
     * 現在のシーンで保持しているモデルを返す。
     * 
     * @param no モデルリストのインデックス値
     * @return モデルのインスタンスを返す。インデックス値が範囲外の場合はNULLを返す。
     */
    public getModel(no: number): LAppModel
    {
        if(no < this._models.getSize())
        {
            return this._models.at(no);
        }

        return null;
    }

    /**
     * 現在のシーンで保持しているすべてのモデルを解放する
     */
    public releaseAllModel(): void
    {
        for(let i: number = 0; i < this._models.getSize(); i++)
        {
            this._models.at(i).release();
            this._models.set(i, null);
        }

        this._models.clear();
    }

    /**
     * 画面をドラッグした時の処理
     * 
     * @param x 画面のX座標
     * @param y 画面のY座標
     */
    public onDrag(x: number, y: number): void
    {
        for(let i: number = 0; i < this._models.getSize(); i++)
        {
            let model: LAppModel = this.getModel(i);

            if(model)
            {
                model.setDragging(x, y);
            }
        }
    }

    /**
     * 画面をタップした時の処理
     * 
     * @param x 画面のX座標
     * @param y 画面のY座標
     */
    public onTap(x: number, y: number): void
    {
        if(LAppDefine.DebugLogEnable)
        {
            LAppPal.printLog("[APP]tap point: {x: {0} y: {1}}", x.toFixed(2), y.toFixed(2));
        }

        for(let i: number = 0; i < this._models.getSize(); i++)
        {
            if(this._models.at(i).hitTest(LAppDefine.HitAreaNameHead, x, y))
            {
                if(LAppDefine.DebugLogEnable)
                {
                    LAppPal.printLog("[APP]hit area: [{0}]", LAppDefine.HitAreaNameHead);
                }
                this._models.at(i).setRandomExpression();
            }
            else if(this._models.at(i).hitTest(LAppDefine.HitAreaNameBody, x, y))
            {
                if(LAppDefine.DebugLogEnable)
                {
                    LAppPal.printLog("[APP]hit area: [{0}]", LAppDefine.HitAreaNameBody);
                }
                this._models.at(i).startRandomMotion(LAppDefine.MotionGroupTapBody, LAppDefine.PriorityNormal);
            }
        }
    }

    /**
     * 画面を更新するときの処理
     * モデルの更新処理及び描画処理を行う
     */
    public onUpdate(): void
    {
        let projection: Csm_CubismMatrix44 = new Csm_CubismMatrix44();

        let width: number, height: number;
        width = canvas.width;
        height = canvas.height;
        projection.scale(1.0, width / height);

        if(this._viewMatrix != null)
        {
            projection.multiplyByMatrix(this._viewMatrix);
        }

        const saveProjection: Csm_CubismMatrix44 = projection.clone();
        let modelCount: number = this._models.getSize();

        for(let i: number = 0; i < modelCount; ++i)
        {
            let model: LAppModel = this.getModel(i);
            projection = saveProjection.clone();

            model.update();
            model.draw(projection); // 参照渡しなのでprojectionは変質する。
        }
    }

    /**
     * 次のシーンに切りかえる
     * サンプルアプリケーションではモデルセットの切り替えを行う。
     */
    public nextScene(): void
    {
        let no: number = (this._sceneIndex + 1) % LAppDefine.ModelDirSize;
        this.changeScene(no);
    }

    /**
     * シーンを切り替える
     * サンプルアプリケーションではモデルセットの切り替えを行う。
     */
    public changeScene(index: number): void
    {
        this._sceneIndex = index;
        if(LAppDefine.DebugLogEnable)
        {
            LAppPal.printLog("[APP]model index: {0}", this._sceneIndex);
        }

        // ModelDir[]に保持したディレクトリ名から
        // model3.jsonのパスを決定する。
        // ディレクトリ名とmodel3.jsonの名前を一致させておくこと。
        let model: string = LAppDefine.ModelDir[index];
        let modelPath: string = LAppDefine.ResourcesPath + model + "/";
        let modelJsonName: string = LAppDefine.ModelDir[index];
        modelJsonName += ".model3.json";

        this.releaseAllModel();
        this._models.pushBack(new LAppModel());
        this._models.at(0).loadAssets(modelPath, modelJsonName);
    }

    /**
     * コンストラクタ
     */
    constructor()
    {
        this._viewMatrix = new Csm_CubismMatrix44();
        this._models = new Csm_csmVector<LAppModel>();
        this._sceneIndex = 0;
        this.changeScene(this._sceneIndex);
    }

    _viewMatrix: Csm_CubismMatrix44;    // モデル描画に用いるview行列
    _models: Csm_csmVector<LAppModel>;  // モデルインスタンスのコンテナ
    _sceneIndex: number;                // 表示するシーンのインデックス値
}
