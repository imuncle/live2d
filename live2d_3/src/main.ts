/*
* Copyright(c) Live2D Inc. All rights reserved.
*
* Use of this source code is governed by the Live2D Open Software license
* that can be found at http://live2d.com/eula/live2d-open-software-license-agreement_en.html.
*/

import { LAppDelegate } from "./lappdelegate";

let main: any = () =>
{
    // create the application instance
    if(LAppDelegate.getInstance().initialize() == false)
    {
        return;
    }

    LAppDelegate.getInstance().run();
}


main();

/**
 * 終了時の処理
 */
window.onbeforeunload = () =>
{
    LAppDelegate.releaseInstance();
};
