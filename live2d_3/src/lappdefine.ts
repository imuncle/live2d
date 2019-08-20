/*
* Copyright(c) Live2D Inc. All rights reserved.
*
* Use of this source code is governed by the Live2D Open Software license
* that can be found at http://live2d.com/eula/live2d-open-software-license-agreement_en.html.
*/

import {LogLevel} from "../Framework/live2dcubismframework";

/**
 * Sample Appで使用する定数
 */
export namespace LAppDefine
{
    // 画面
    export const ViewMaxScale: number = 2.0;
    export const ViewMinScale: number = 0.8;

    export const ViewLogicalLeft: number = -1.0;
    export const ViewLogicalRight: number = 1.0;

    export const ViewLogicalMaxLeft: number = -2.0;
    export const ViewLogicalMaxRight: number = 2.0;
    export const ViewLogicalMaxBottom: number = -2.0;
    export const ViewLogicalMaxTop: number = 2.0;

    // 相対パス
    export const ResourcesPath: string = "./Resources/";

    // モデルの後ろにある背景の画像ファイル
    export const BackImageName: string = "back_class_normal.png";

    // 歯車
    export const GearImageName: string = "icon_gear.png";

    // 終了ボタン
    export const PowerImageName: string = "CloseNormal.png";

    // モデル定義---------------------------------------------
    // モデルを配置したディレクトリ名の配列
    // ディレクトリ名とmodel3.jsonの名前を一致させておくこと
    export const ModelDir: string[] = [
        "Haru",
        "Hiyori",
        "Mark",
        "Natori"
    ]
    export const ModelDirSize: number = ModelDir.length;

    // 外部定義ファイル（json）と合わせる
    export const MotionGroupIdle: string = "Idle"; // アイドリング
    export const MotionGroupTapBody: string = "TapBody"; // 体をタップしたとき

    // 外部定義ファイル（json）と合わせる
    export const HitAreaNameHead: string = "Head";
    export const HitAreaNameBody: string = "Body";

    // モーションの優先度定数
    export const PriorityNone: number = 0;
    export const PriorityIdle: number = 1;
    export const PriorityNormal: number = 2;
    export const PriorityForce: number = 3;

    // デバッグ用ログの表示オプション
    export const DebugLogEnable: boolean = true;
    export const DebugTouchLogEnable: boolean = false;

    // Frameworkから出力するログのレベル設定
    export const CubismLoggingLevel: LogLevel = LogLevel.LogLevel_Verbose;
}