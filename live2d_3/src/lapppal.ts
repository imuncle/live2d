/*
* Copyright(c) Live2D Inc. All rights reserved.
*
* Use of this source code is governed by the Live2D Open Software license
* that can be found at http://live2d.com/eula/live2d-open-software-license-agreement_en.html.
*/

/**
 * プラットフォーム依存機能を抽象化する Cubism Platform Abstraction Layer.
 * 
 * ファイル読み込みや時刻取得等のプラットフォームに依存する関数をまとめる。
 */
export class LAppPal
{
    /**
     * ファイルをバイトデータとして読みこむ
     * 
     * @param filePath 読み込み対象ファイルのパス
     * @return 
     * { 
     *      buffer,   読み込んだバイトデータ
     *      size        ファイルサイズ
     * }
     */
    public static loadFileAsBytes(filePath: string, callback: any): void
    {
        //filePath;//
        const path: string = filePath;

        let size = 0;
        fetch(path).then(
            (response) =>
            {
                return response.arrayBuffer();
            }
        ).then(
            (arrayBuffer) =>
            {
                size = arrayBuffer.byteLength;
                callback(arrayBuffer, size);
            }
        );
    }

    /**
     * バイトデータを解放する
     * @param byteData 解放したいバイトデータ
     */
    public static releaseBytes(byteData: ArrayBuffer): void
    {
        byteData = void 0;
    }

    /**
     * デルタ時間（前回フレームとの差分）を取得する
     * @return デルタ時間[ms]
     */
    public static getDeltaTime(): number
    {
        return this.s_deltaTime;
    }

    public static updateTime(): void
    {
        this.s_currentFrame = Date.now();
        this.s_deltaTime = (this.s_currentFrame - this.s_lastFrame) / 1000;
        this.s_lastFrame = this.s_currentFrame;
    }

    /**
     * ログを出力する
     * @param format 書式付き文字列
     * @param ... args（可変長引数）文字列
     */
    public static printLog(format: string, ... args: any[]): void
    {
        console.log(
            format.replace(
                /\{(\d+)\}/g,
                (m, k) =>
                {
                    return args[k];
                }
            )
        );
    }

    /**
     * メッセージを出力する
     * @param message 文字列
     */
    public static printMessage(message: string): void
    {
        LAppPal.printLog(message);
    }

    static lastUpdate = Date.now();

    static s_currentFrame = 0.0;
    static s_lastFrame = 0.0;
    static s_deltaTime = 0.0;
}