/*
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at http://live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import {Live2DCubismFramework as csmvector} from "../Framework/type/csmvector";
import Csm_csmVector = csmvector.csmVector;
import csmVector_iterator = csmvector.iterator;
import {gl} from "./lappdelegate";

/**
 * テクスチャ管理クラス
 * 画像読み込み、管理を行うクラス。
 */
export class LAppTextureManager
{
    /**
     * コンストラクタ
     */
    constructor()
    {
        this._textures = new Csm_csmVector<TextureInfo>();
    }

    /**
     * 解放する。
     */
    public release(): void
    {
        for(let ite: csmVector_iterator<TextureInfo> = this._textures.begin(); ite.notEqual(this._textures.end()); ite.preIncrement())
        {
            gl.deleteTexture(ite.ptr().id);
        }
        this._textures = null;
    }

    /**
     * 画像読み込み
     * 
     * @param fileName 読み込む画像ファイルパス名
     * @param usePremultiply Premult処理を有効にするか
     * @return 画像情報、読み込み失敗時はnullを返す
     */
    public createTextureFromPngFile(fileName: string, usePremultiply: boolean, callback: any): void
    {
        // search loaded texture already
        for(let ite: csmVector_iterator<TextureInfo> = this._textures.begin(); ite.notEqual(this._textures.end()); ite.preIncrement())
        {
            if(ite.ptr().fileName == fileName && ite.ptr().usePremultply == usePremultiply)
            {
                // 2回目以降はキャッシュが使用される(待ち時間なし) 
                ite.ptr().img.onload = () =>
                {
                    callback(ite.ptr());
                }
                ite.ptr().img.src = fileName;
                return;
            }
        }

        // データのオンロードをトリガーにする
        let img = new Image();
        img.onload = () =>
        {
            // テクスチャオブジェクトの作成
            let tex: WebGLTexture = gl.createTexture();

            // テクスチャを選択
            gl.bindTexture(gl.TEXTURE_2D, tex);
            
            // テクスチャにピクセルを書き込む
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

            // Premult処理を行わせる 
            if(usePremultiply)
            {
                gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
            }

            // テクスチャにピクセルを書き込む
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

            // ミップマップを生成
            gl.generateMipmap(gl.TEXTURE_2D);

            // テクスチャをバインド
            gl.bindTexture(gl.TEXTURE_2D, null);

            let textureInfo: TextureInfo = new TextureInfo();
            if(textureInfo != null)
            {
                textureInfo.fileName = fileName;
                textureInfo.width = img.width;
                textureInfo.height = img.height;
                textureInfo.id = tex;
                textureInfo.img = img;
                textureInfo.usePremultply = usePremultiply;
                this._textures.pushBack(textureInfo);
            }

            callback(textureInfo);
        }
        img.src = fileName;
    }

    /**
     * 画像の解放
     * 
     * 配列に存在する画像全てを解放する。
     */
    public releaseTextures(): void
    {
        for(let i: number = 0; i < this._textures.getSize(); i++)
        {
            this._textures.set(i, null);
        }

        this._textures.clear();
    }

    /**
     * 画像の解放
     * 
     * 指定したテクスチャの画像を解放する。
     * @param texture 解放するテクスチャ
     */
    public releaseTextureByTexture(texture: WebGLTexture)
    {
        for(let i: number = 0; i < this._textures.getSize(); i++)
        {
            if(this._textures.at(i).id != texture)
            {
                continue;
            }

            this._textures.set(i, null);
            this._textures.remove(i);
            break;
        }
    }

    /**
     * 画像の解放
     * 
     * 指定した名前の画像を解放する。
     * @param fileName 解放する画像ファイルパス名
     */
    public releaseTextureByFilePath(fileName: string): void
    {
        for(let i: number = 0; i < this._textures.getSize(); i++)
        {
            if(this._textures.at(i).fileName == fileName)
            {
                this._textures.set(i, null);
                this._textures.remove(i);
                break;
            }
        }
    }

    _textures: Csm_csmVector<TextureInfo>;
}

/**
 * 画像情報構造体
 */
export class TextureInfo
{
    img: HTMLImageElement;      // 画像
    id: WebGLTexture = null;    // テクスチャ
    width: number = 0;          // 横幅
    height: number = 0;         // 高さ
    usePremultply: boolean;     // Premult処理を有効にするか
    fileName: string;           // ファイル名 
}