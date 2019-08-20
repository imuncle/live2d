/*
* Copyright(c) Live2D Inc. All rights reserved.
*
* Use of this source code is governed by the Live2D Open Software license
* that can be found at http://live2d.com/eula/live2d-open-software-license-agreement_en.html.
*/

import {Live2DCubismFramework as live2dcubismframework} from "../Framework/live2dcubismframework";
import {Live2DCubismFramework as cubismid} from "../Framework/id/cubismid";
import {Live2DCubismFramework as cubismusermodel} from "../Framework/model/cubismusermodel";
import {Live2DCubismFramework as icubismmodelsetting} from "../Framework/icubismmodelsetting";
import {Live2DCubismFramework as cubismmodelsettingjson} from "../Framework/cubismmodelsettingjson";
import {Live2DCubismFramework as cubismdefaultparameterid} from "../Framework/cubismdefaultparameterid";
import {Live2DCubismFramework as acubismmotion} from "../Framework/motion/acubismmotion";
import {Live2DCubismFramework as cubismeyeblink} from "../Framework/effect/cubismeyeblink";
import {Live2DCubismFramework as cubismbreath} from "../Framework/effect/cubismbreath";
import {Live2DCubismFramework as csmvector} from "../Framework/type/csmvector";
import {Live2DCubismFramework as csmmap} from "../Framework/type/csmmap";
import {Live2DCubismFramework as cubismmatrix44} from "../Framework/math/cubismmatrix44";
import {Live2DCubismFramework as cubismstring} from "../Framework/utils/cubismstring";
import {Live2DCubismFramework as cubismmotion} from "../Framework/motion/cubismmotion";
import {Live2DCubismFramework as cubismmotionqueuemanager} from "../Framework/motion/cubismmotionqueuemanager";
import {Live2DCubismFramework as csmstring} from "../Framework/type/csmstring";
import {Live2DCubismFramework as csmrect } from "../Framework/type/csmrectf";
import {CubismLogInfo} from "../Framework/utils/cubismdebug";
import csmRect = csmrect.csmRect;
import csmString = csmstring.csmString;
import InvalidMotionQueueEntryHandleValue = cubismmotionqueuemanager.InvalidMotionQueueEntryHandleValue;
import CubismMotionQueueEntryHandle = cubismmotionqueuemanager.CubismMotionQueueEntryHandle;
import CubismMotion = cubismmotion.CubismMotion;
import CubismString = cubismstring.CubismString;
import CubismMatrix44 = cubismmatrix44.CubismMatrix44;
import csmMap = csmmap.csmMap;
import csmVector = csmvector.csmVector;
import CubismBreath = cubismbreath.CubismBreath;
import BreathParameterData = cubismbreath.BreathParameterData;
import CubismEyeBlink = cubismeyeblink.CubismEyeBlink;
import ACubismMotion = acubismmotion.ACubismMotion;
import CubismFramework = live2dcubismframework.CubismFramework;
import CubismIdHandle = cubismid.CubismIdHandle;
import CubismUserModel = cubismusermodel.CubismUserModel;
import ICubismModelSetting = icubismmodelsetting.ICubismModelSetting;
import CubismModelSettingJson = cubismmodelsettingjson.CubismModelSettingJson;
import CubismDefaultParameterId = cubismdefaultparameterid;

import {LAppDefine} from "./lappdefine";
import {LAppPal} from "./lapppal";
import {gl, canvas, frameBuffer, LAppDelegate} from "./lappdelegate";
import {TextureInfo} from "./lapptexturemanager";
import "whatwg-fetch";

function createBuffer(path: string, callBack: any): void
{
    LAppPal.loadFileAsBytes(path, callBack);
}

function deleteBuffer(buffer: ArrayBuffer, path: string = "")
{
    LAppPal.releaseBytes(buffer);
}

enum LoadStep
{
    LoadAssets,
    LoadModel,
    WaitLoadModel,
    LoadExpression,
    WaitLoadExpression,
    LoadPhysics,
    WaitLoadPhysics,
    LoadPose,
    WaitLoadPose,
    SetupEyeBlink,
    SetupBreath,
    LoadUserData,
    WaitLoadUserData,
    SetupEyeBlinkIds,
    SetupLipSyncIds,
    SetupLayout,
    LoadMotion,
    WaitLoadMotion,
    CompleteInitialize,
    CompleteSetupModel,
    LoadTexture,
    WaitLoadTexture,
    CompleteSetup,
}

/**
 * ユーザーが実際に使用するモデルの実装クラス<br>
 * モデル生成、機能コンポーネント生成、更新処理とレンダリングの呼び出しを行う。
 */
export class LAppModel extends CubismUserModel {
    /**
     * model3.jsonが置かれたディレクトリとファイルパスからモデルを生成する
     * @param dir 
     * @param fileName 
     */
    public loadAssets(dir: string, fileName: string): void 
    {
        this._modelHomeDir = dir;

        const path: string = dir + fileName;

        fetch(path).then(
            (response) =>
            {
                return response.arrayBuffer();
            }
        ).then(
            (arrayBuffer) =>
            {
                let buffer: ArrayBuffer = arrayBuffer;
                let size = buffer.byteLength;
                let setting: ICubismModelSetting = new CubismModelSettingJson(buffer, size);

                // ステートを更新
                this._state = LoadStep.LoadModel;

                // 結果を保存
                this.setupModel(setting);
            }
        );
    }

    /**
     * model3.jsonからモデルを生成する。
     * model3.jsonの記述に従ってモデル生成、モーション、物理演算などのコンポーネント生成を行う。
     *
     * @param setting ICubismModelSettingのインスタンス
     */
    private setupModel(setting: ICubismModelSetting): void
    {
        this._updating = true;
        this._initialized = false;

        this._modelSetting = setting;

        let buffer: ArrayBuffer;
        let size: number;

        // CubismModel
        if (this._modelSetting.getModelFileName() != "")
        {
            let path: string = this._modelSetting.getModelFileName();
            path = this._modelHomeDir + path;

            fetch(path).then(
                (response) =>
                {
                    return response.arrayBuffer();
                }
            ).then(
                (arrayBuffer) =>
                {
                    buffer = arrayBuffer;
                    this.loadModel(buffer);
                    deleteBuffer(buffer, path);
                    this._state = LoadStep.LoadExpression;
        
                    // callback
                    loadCubismExpression();
                }
            );

            this._state = LoadStep.WaitLoadModel;
        }
        else
        {
            LAppPal.printLog("Model data does not exist.");
        }

        // Expression
        let loadCubismExpression = () =>
        {
            if(this._modelSetting.getExpressionCount() > 0)
            {
                const count: number = this._modelSetting.getExpressionCount();
    
                for(let i: number = 0; i < count; i++)
                {
                    let name: string = this._modelSetting.getExpressionName(i);
                    let path: string = this._modelSetting.getExpressionFileName(i);
                    path = this._modelHomeDir + path;
    
                    fetch(path).then(
                        (response) => 
                        {
                            return response.arrayBuffer();
                        }
                    ).then(
                        (arrayBuffer) =>
                        {
                            let buffer: ArrayBuffer = arrayBuffer;
                            let size: number = buffer.byteLength;
        
                            let motion: ACubismMotion = this.loadExpression(buffer, size, name);
        
                            if(this._expressions.getValue(name) != null)
                            {
                                ACubismMotion.delete(this._expressions.getValue(name));
                                this._expressions.setValue(name, null);
                            }
        
                            this._expressions.setValue(name, motion);
        
                            deleteBuffer(buffer, path);
    
                            this._expressionCount++;
    
                            if(this._expressionCount >= count)
                            {
                                this._state = LoadStep.LoadPhysics;

                                // callback
                                loadCubismPhysics();
                            }
                        }
                    );
                }
                this._state = LoadStep.WaitLoadExpression;
            }
            else
            {
                this._state = LoadStep.LoadPhysics;

                // callback
                loadCubismPhysics();
            }
        };

        // Physics
        let loadCubismPhysics = () =>
        {
            if(this._modelSetting.getPhysicsFileName() != "")
            {
                let path: string = this._modelSetting.getPhysicsFileName();
                path = this._modelHomeDir + path;

                fetch(path).then(
                    (response) => 
                    {
                        return response.arrayBuffer();
                    }
                ).then(
                    (arrayBuffer) =>
                    {
                        let buffer: ArrayBuffer = arrayBuffer;
                        let size: number = buffer.byteLength;
        
                        this.loadPhysics(buffer, size);
                        deleteBuffer(buffer, path);
        
                        this._state = LoadStep.LoadPose;

                        // callback
                        loadCubismPose();
                    }
                );
                this._state = LoadStep.WaitLoadPhysics;
            }
            else
            {
                this._state = LoadStep.LoadPose;

                // callback
                loadCubismPose();
            }
        };

        // Pose
        let loadCubismPose = () =>
        {
            if(this._modelSetting.getPoseFileName() != "")
            {
                let path: string = this._modelSetting.getPoseFileName();
                path = this._modelHomeDir + path;

                fetch(path).then(
                    (response) => 
                    {
                        return response.arrayBuffer();
                    }
                ).then(
                    (arrayBuffer) =>
                    {
                        let buffer: ArrayBuffer = arrayBuffer;
                        let size: number = buffer.byteLength;
        
                        this.loadPose(buffer, size);
                        deleteBuffer(buffer, path);
        
                        this._state = LoadStep.SetupEyeBlink;

                        // callback
                        setupEyeBlink();
                    }
                );
                this._state = LoadStep.WaitLoadPose;
            }
            else
            {
                this._state = LoadStep.SetupEyeBlink;
                
                // callback
                setupEyeBlink();
            }
        };

        // EyeBlink
        let setupEyeBlink = () =>
        {
            if(this._modelSetting.getEyeBlinkParameterCount() > 0)
            {
                this._eyeBlink = CubismEyeBlink.create(this._modelSetting);
                this._state = LoadStep.SetupBreath;

            }

            // callback
            setupBreath();
        };

        // Breath
        let setupBreath = () =>
        {
            this._breath = CubismBreath.create();
    
            let breathParameters: csmVector<BreathParameterData> = new csmVector();
            breathParameters.pushBack(new BreathParameterData(this._idParamAngleX, 0.0, 15.0, 6.5345, 0.5));
            breathParameters.pushBack(new BreathParameterData(this._idParamAngleY, 0.0, 8.0, 3.5345, 0.5));
            breathParameters.pushBack(new BreathParameterData(this._idParamAngleZ, 0.0, 10.0, 5.5345, 0.5));
            breathParameters.pushBack(new BreathParameterData(this._idParamBodyAngleX, 0.0, 4.0, 15.5345, 0.5));
            breathParameters.pushBack(new BreathParameterData(CubismFramework.getIdManager().getId(CubismDefaultParameterId.ParamBreath), 0.0, 0.5, 3.2345, 0.5));
    
            this._breath.setParameters(breathParameters);
            this._state = LoadStep.LoadUserData;

            // callback 
            loadUserData();
        };

        // UserData
        let loadUserData = () =>
        {
            if(this._modelSetting.getUserDataFile() != "")
            {
                let path: string = this._modelSetting.getUserDataFile();
                path = this._modelHomeDir + path;

                fetch(path).then(
                    (response) => 
                    {
                        return response.arrayBuffer();
                    }
                ).then(
                    (arrayBuffer) =>
                    {
                        let buffer: ArrayBuffer = arrayBuffer;
                        let size: number = buffer.byteLength;
        
                        this.loadUserData(buffer, size);
                        deleteBuffer(buffer, path);
    
                        this._state = LoadStep.SetupEyeBlinkIds;

                        // callback
                        setupEyeBlinkIds();
                    }
                );

                this._state = LoadStep.WaitLoadUserData;
            }
            else
            {
                this._state = LoadStep.SetupEyeBlinkIds;

                // callback
                setupEyeBlinkIds();
            }
        };

        // EyeBlinkIds
        let setupEyeBlinkIds = () =>
        {
            let eyeBlinkIdCount: number = this._modelSetting.getEyeBlinkParameterCount();

            for(let i: number = 0; i < eyeBlinkIdCount; ++i)
            {
                this._eyeBlinkIds.pushBack(this._modelSetting.getEyeBlinkParameterId(i));
            }

            this._state = LoadStep.SetupLipSyncIds;

            // callback
            setupLipSyncIds();
        };

        // LipSyncIds
        let setupLipSyncIds = () =>
        {
            let lipSyncIdCount = this._modelSetting.getLipSyncParameterCount();
            
            for(let i: number = 0; i < lipSyncIdCount; ++i)
            {
                this._lipSyncIds.pushBack(this._modelSetting.getLipSyncParameterId(i));
            }
            this._state = LoadStep.SetupLayout;
            
            // callback
            setupLayout();
        };

        // Layout
        let setupLayout = () =>
        {
            let layout: csmMap<string, number> = new csmMap<string, number>();
            this._modelSetting.getLayoutMap(layout);
            this._modelMatrix.setupFromLayout(layout);
            this._state = LoadStep.LoadMotion;

            // callback
            loadCubismMotion();
        };

        // Motion
        let loadCubismMotion = () =>
        {
            this._state = LoadStep.WaitLoadMotion;
            this._model.saveParameters();
            this._allMotionCount = 0;
            this._motionCount = 0;
            let group: string[] = [];
            
            let motionGroupCount: number = this._modelSetting.getMotionGroupCount();
            
            // モーションの総数を求める
            for(let i: number = 0; i < motionGroupCount; i++)
            {
                group[i] = this._modelSetting.getMotionGroupName(i);
                this._allMotionCount += this._modelSetting.getMotionCount(group[i]);
            }

            // モーションの読み込み
            for(let i: number = 0; i < motionGroupCount; i++)
            {
                this.preLoadMotionGroup(group[i]);
            }

            // モーションがない場合
            if(motionGroupCount == 0)
            {
                this._state = LoadStep.LoadTexture;
    
                // 全てのモーションを停止する
                this._motionManager.stopAllMotions();

                this._updating = false;
                this._initialized = true;

                this.createRenderer();
                this.setupTextures();
                this.getRenderer().startUp(gl);
            }
        };
    }

    /**
     * テクスチャユニットにテクスチャをロードする
     */
    private setupTextures(): void
    {
        // iPhoneでのアルファ品質向上のためTypescriptではpremultipliedAlphaを採用 
        let usePremultiply: boolean = true;

        if(this._state == LoadStep.LoadTexture)
        {
            // テクスチャ読み込み用
            let textureCount: number = this._modelSetting.getTextureCount();

            for(let modelTextureNumber = 0; modelTextureNumber < textureCount; modelTextureNumber++)
            {
                // テクスチャ名が空文字だった場合はロード・バインド処理をスキップ
                if(this._modelSetting.getTextureFileName(modelTextureNumber) == "")
                {
                    console.log("getTextureFileName null");
                    continue;
                }
    
                // WebGLのテクスチャユニットにテクスチャをロードする
                let texturePath = this._modelSetting.getTextureFileName(modelTextureNumber);
                texturePath = this._modelHomeDir + texturePath;

                // ロード完了時に呼び出すコールバック関数
                let onLoad = (textureInfo: TextureInfo) : void => 
                {
                    this.getRenderer().bindTexture(modelTextureNumber, textureInfo.id);
                    
                    this._textureCount++;
                    
                    if(this._textureCount >= textureCount)
                    {
                        // ロード完了
                        this._state = LoadStep.CompleteSetup;
                    }
                };
                
                // 読み込み
                LAppDelegate.getInstance().getTextureManager().createTextureFromPngFile(texturePath, usePremultiply, onLoad);
                this.getRenderer().setIsPremultipliedAlpha(usePremultiply);
            }

            this._state = LoadStep.WaitLoadTexture;
        }
    }

    /**
     * レンダラを再構築する
     */
    public reloadRenderer(): void
    {
        this.deleteRenderer();
        this.createRenderer();
        this.setupTextures();
    }

    /**
     * 更新
     */
    public update(): void
    {
        if(this._state != LoadStep.CompleteSetup) return;
        
        const deltaTimeSeconds: number = LAppPal.getDeltaTime();
        this._userTimeSeconds += deltaTimeSeconds;

        
        this._dragManager.update(deltaTimeSeconds);
        this._dragX = this._dragManager.getX();
        this._dragY = this._dragManager.getY();

        // モーションによるパラメータ更新の有無
        let motionUpdated = false;

        //--------------------------------------------------------------------------
        this._model.loadParameters();   // 前回セーブされた状態をロード
        if(this._motionManager.isFinished())
        {
            // モーションの再生がない場合、待機モーションの中からランダムで再生する
            this.startRandomMotion(LAppDefine.MotionGroupIdle, LAppDefine.PriorityIdle);
            
        }
        else
        {
            motionUpdated = this._motionManager.updateMotion(this._model, deltaTimeSeconds);    // モーションを更新
        }
        this._model.saveParameters(); // 状態を保存
        //--------------------------------------------------------------------------

        // まばたき
        if(!motionUpdated)
        {
            if(this._eyeBlink != null)
            {
                // メインモーションの更新がないとき
                this._eyeBlink.updateParameters(this._model, deltaTimeSeconds); // 目パチ
            }
        }

        if(this._expressionManager != null)
        {
            this._expressionManager.updateMotion(this._model, deltaTimeSeconds); // 表情でパラメータ更新（相対変化）
        }

        // ドラッグによる変化
        // ドラッグによる顔の向きの調整
        this._model.addParameterValueById(this._idParamAngleX, this._dragX * 30);  // -30から30の値を加える
        this._model.addParameterValueById(this._idParamAngleY, this._dragY * 30);
        this._model.addParameterValueById(this._idParamAngleZ, this._dragX * this._dragY * -30);

        // ドラッグによる体の向きの調整
        this._model.addParameterValueById(this._idParamBodyAngleX, this._dragX * 10);  // -10から10の値を加える

        // ドラッグによる目の向きの調整
        this._model.addParameterValueById(this._idParamEyeBallX, this._dragX); // -1から1の値を加える
        this._model.addParameterValueById(this._idParamEyeBallY, this._dragY);

        // 呼吸など
        if(this._breath != null)
        {
            this._breath.updateParameters(this._model, deltaTimeSeconds);
        }

        // 物理演算の設定
        if(this._physics != null)
        {
            this._physics.evaluate(this._model, deltaTimeSeconds);
        }

        // リップシンクの設定
        if(this._lipsync)
        {
            let value: number = 0;  // リアルタイムでリップシンクを行う場合、システムから音量を取得して、0~1の範囲で値を入力します。

            for(let i: number = 0; i < this._lipSyncIds.getSize(); ++i)
            {
                this._model.addParameterValueById(this._lipSyncIds.at(i), value, 0.8);
            }
        }
        
        // ポーズの設定
        if(this._pose != null)
        {
            this._pose.updateParameters(this._model, deltaTimeSeconds);
        }

        this._model.update();
    }

    /**
     * 引数で指定したモーションの再生を開始する
     * @param group モーショングループ名
     * @param no グループ内の番号
     * @param priority 優先度
     * @return 開始したモーションの識別番号を返す。個別のモーションが終了したか否かを判定するisFinished()の引数で使用する。開始できない時は[-1]
     */
    public startMotion(group: string, no: number, priority: number): CubismMotionQueueEntryHandle
    {
        if(priority == LAppDefine.PriorityForce)
        {
            this._motionManager.setReservePriority(priority);
        }
        else if(!this._motionManager.reserveMotion(priority))
        {
            if(this._debugMode)
            {
                LAppPal.printLog("[APP]can't start motion.");
            }
            return InvalidMotionQueueEntryHandleValue;
        }

        const fileName: string = this._modelSetting.getMotionFileName(group, no);

        // ex) idle_0
        let name: string = CubismString.getFormatedString("{0}_{1}", group, no);
        let motion: CubismMotion = <CubismMotion>this._motions.getValue(name);
        let autoDelete: boolean = false;

        if(motion == null)
        {
            let path: string = fileName;
            path = this._modelHomeDir + path;

            fetch(path).then(
                (response) =>
                {
                    return response.arrayBuffer();
                }
            ).then(
                (arrayBuffer) =>
                {
                    let buffer: ArrayBuffer = arrayBuffer;
                    let size = buffer.byteLength;
    
                    motion = <CubismMotion>this.loadMotion(buffer, size, null);
                    let fadeTime: number = this._modelSetting.getMotionFadeInTimeValue(group, no);
    
                    if(fadeTime >= 0.0)
                    {
                        motion.setFadeInTime(fadeTime);
                    }
    
                    fadeTime = this._modelSetting.getMotionFadeOutTimeValue(group, no);
                    if(fadeTime >= 0.0)
                    {
                        motion.setFadeOutTime(fadeTime);
                    }
    
                    motion.setEffectIds(this._eyeBlinkIds, this._lipSyncIds);
                    autoDelete = true;  // 終了時にメモリから削除
    
                    deleteBuffer(buffer, path);
                }
            );
        }

        if(this._debugMode)
        {
            LAppPal.printLog("[APP]start motion: [{0}_{1}", group, no);
        }
        return this._motionManager.startMotionPriority(motion, autoDelete, priority);
    }

    /**
     * ランダムに選ばれたモーションの再生を開始する。
     * @param group モーショングループ名
     * @param priority 優先度
     * @return 開始したモーションの識別番号を返す。個別のモーションが終了したか否かを判定するisFinished()の引数で使用する。開始できない時は[-1]
     */
    public startRandomMotion(group: string, priority: number): CubismMotionQueueEntryHandle
    {
        if(this._modelSetting.getMotionCount(group) == 0)
        {
            return InvalidMotionQueueEntryHandleValue;
        }

        let no: number = Math.floor(Math.random() * this._modelSetting.getMotionCount(group));

        return this.startMotion(group, no, priority);
    }

    /**
     * 引数で指定した表情モーションをセットする
     * 
     * @param expressionId 表情モーションのID
     */
    public setExpression(expressionId: string): void
    {
        let motion: ACubismMotion = this._expressions.getValue(expressionId);

        if(this._debugMode)
        {
            LAppPal.printLog("[APP]expression: [{0}]", expressionId);
        }

        if(motion != null)
        {
            this._expressionManager.startMotionPriority(motion, false, LAppDefine.PriorityForce);
        }
        else
        {
            if(this._debugMode)
            {
                LAppPal.printLog("[APP]expression[{0}] is null", expressionId);
            }
        }
    }

    /**
     * ランダムに選ばれた表情モーションをセットする
     */
    public setRandomExpression(): void
    {
        if(this._expressions.getSize() == 0)
        {
            return;
        }

        let no: number = Math.floor(Math.random() * this._expressions.getSize());

        for(let i: number = 0; i < this._expressions.getSize(); i++)
        {
            if(i == no)
            {
                let name: string = this._expressions._keyValues[i].first;
                this.setExpression(name);
                return;
            }
        }
    }

    /**
     * イベントの発火を受け取る
     */
    public motionEventFired(eventValue: csmString): void
    {
        CubismLogInfo("{0} is fired on LAppModel!!", eventValue.s);
    }

    /**
     * 当たり判定テスト
     * 指定ＩＤの頂点リストから矩形を計算し、座標をが矩形範囲内か判定する。
     * 
     * @param hitArenaName  当たり判定をテストする対象のID
     * @param x             判定を行うX座標
     * @param y             判定を行うY座標
     */
    public hitTest(hitArenaName: string, x: number, y: number): boolean
    {
        // 透明時は当たり判定無し。
        if(this._opacity < 1)
        {
            return false;
        }

        const count: number = this._modelSetting.getHitAreasCount();

        for(let i: number = 0; i < count; i++)
        {
            if(this._modelSetting.getHitAreaName(i) == hitArenaName)
            {
                const drawId: CubismIdHandle = this._modelSetting.getHitAreaId(i);
                return this.isHit(drawId, x, y);
            }
        }

        return false;
    }

    /**
     * モーションデータをグループ名から一括でロードする。
     * モーションデータの名前は内部でModelSettingから取得する。
     * 
     * @param group モーションデータのグループ名
     */
    public preLoadMotionGroup(group: string): void
    {
        for(let i: number = 0; i < this._modelSetting.getMotionCount(group); i++)
        {
            // ex) idle_0
            let name: string = CubismString.getFormatedString("{0}_{1}", group, i);
            let path = this._modelSetting.getMotionFileName(group, i);
            path = this._modelHomeDir + path;

            if(this._debugMode)
            {
                LAppPal.printLog("[APP]load motion: {0} => [{1}_{2}]", path, group, i);
            }
            
            fetch(path).then(
                (response) => 
                {
                    return response.arrayBuffer();
                }
            ).then(
                (arrayBuffer) =>
                {
                    let buffer: ArrayBuffer = arrayBuffer;
                    let size = buffer.byteLength;
                    
                    let tmpMotion: CubismMotion = <CubismMotion>this.loadMotion(buffer, size, name);
                    
                    let fadeTime = this._modelSetting.getMotionFadeInTimeValue(group, i);
                    if(fadeTime >= 0.0)
                    {
                        tmpMotion.setFadeInTime(fadeTime);
                    }
    
                    fadeTime = this._modelSetting.getMotionFadeOutTimeValue(group, i);
                    if(fadeTime >= 0.0)
                    {
                        tmpMotion.setFadeOutTime(fadeTime);
                    }
                    tmpMotion.setEffectIds(this._eyeBlinkIds, this._lipSyncIds);
    
                    if(this._motions.getValue(name) != null)
                    {
                        ACubismMotion.delete(this._motions.getValue(name));
                    }

                    this._motions.setValue(name, tmpMotion);

                    deleteBuffer(buffer, path);
    
                    this._motionCount++;
                    if(this._motionCount >= this._allMotionCount)
                    {
                        this._state = LoadStep.LoadTexture;

                        // 全てのモーションを停止する
                        this._motionManager.stopAllMotions();

                        this._updating = false;
                        this._initialized = true;

                        this.createRenderer();
                        this.setupTextures();
                        this.getRenderer().startUp(gl);
                    }
                }
            );
        }
    }

    /**
     * すべてのモーションデータを解放する。
     */
    public releaseMotions(): void
    {
        this._motions.clear();
    }

    /**
     * 全ての表情データを解放する。
     */
    public releaseExpressions(): void
    {
        this._expressions.clear();
    }

    /**
     * モデルを描画する処理。モデルを描画する空間のView-Projection行列を渡す。
     */
    public doDraw(): void
    {
        if(this._model == null) return;

        // キャンバスサイズを渡す
        let viewport: number[] = [
            0, 
            0, 
            canvas.width,
            canvas.height
        ];

        this.getRenderer().setRenderState(frameBuffer, viewport);
        this.getRenderer().drawModel();
    }

    /**
     * モデルを描画する処理。モデルを描画する空間のView-Projection行列を渡す。
     */
    public draw(matrix: CubismMatrix44): void
    {
        if(this._model == null) 
        {
            return;
        }

        // 各読み込み終了後
        if(this._state == LoadStep.CompleteSetup)
        {
            matrix.multiplyByMatrix(this._modelMatrix);
            
            this.getRenderer().setMvpMatrix(matrix);
            
            this.doDraw();
        }
    }

    /**
     * コンストラクタ
     */
    public constructor() 
    {
        super();

        this._modelSetting = null;
        this._modelHomeDir = null;
        this._userTimeSeconds = 0.0;

        this._eyeBlinkIds = new csmVector<CubismIdHandle>();
        this._lipSyncIds = new csmVector<CubismIdHandle>();

        this._motions = new csmMap<string, ACubismMotion>();
        this._expressions = new csmMap<string, ACubismMotion>();

        this._hitArea = new csmVector<csmRect>();
        this._userArea = new csmVector<csmRect>();
        
        this._idParamAngleX = CubismFramework.getIdManager().getId(CubismDefaultParameterId.ParamAngleX);
        this._idParamAngleY = CubismFramework.getIdManager().getId(CubismDefaultParameterId.ParamAngleY);
        this._idParamAngleZ = CubismFramework.getIdManager().getId(CubismDefaultParameterId.ParamAngleZ);
        this._idParamEyeBallX = CubismFramework.getIdManager().getId(CubismDefaultParameterId.ParamEyeBallX);
        this._idParamEyeBallY = CubismFramework.getIdManager().getId(CubismDefaultParameterId.ParamEyeBallY);
        this._idParamBodyAngleX = CubismFramework.getIdManager().getId(CubismDefaultParameterId.ParamBodyAngleX);

        this._state = LoadStep.LoadAssets;
        this._expressionCount = 0;
        this._textureCount = 0;
        this._motionCount = 0;
        this._allMotionCount = 0;
    }

    _modelSetting: ICubismModelSetting;      // モデルセッティング情報
    _modelHomeDir: string;      // モデルセッティングが置かれたディレクトリ
    _userTimeSeconds: number;   // デルタ時間の積算値[秒]

    _eyeBlinkIds: csmVector<CubismIdHandle>;  // モデルに設定された瞬き機能用パラメータID
    _lipSyncIds: csmVector<CubismIdHandle>;   // モデルに設定されたリップシンク機能用パラメータID

    _motions: csmMap<string, ACubismMotion>;        // 読み込まれているモーションのリスト
    _expressions: csmMap<string, ACubismMotion>;    // 読み込まれている表情のリスト

    _hitArea: csmVector<csmRect>;
    _userArea: csmVector<csmRect>;

    _idParamAngleX: CubismIdHandle;     // パラメータID: ParamAngleX
    _idParamAngleY: CubismIdHandle;     // パラメータID: ParamAngleY
    _idParamAngleZ: CubismIdHandle;     // パラメータID: ParamAngleZ
    _idParamEyeBallX: CubismIdHandle;   // パラメータID: ParamEyeBallX
    _idParamEyeBallY: CubismIdHandle;   // パラメータID: ParamEyeBAllY
    _idParamBodyAngleX: CubismIdHandle; // パラメータID: ParamBodyAngleX

    _state: number; // 現在のステータス管理用
    _expressionCount: number; // 表情データカウント
    _textureCount: number;   // テクスチャカウント
    _motionCount: number;   // モーションデータカウント
    _allMotionCount: number; // モーション総数
}