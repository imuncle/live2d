class L2D {
    constructor (basePath) {
        this.basePath = basePath;
        this.loader = new PIXI.loaders.Loader(this.basePath);
        this.animatorBuilder = new LIVE2DCUBISMFRAMEWORK.AnimatorBuilder();
        this.timeScale = 1;
        this.models = {};
    }
    
    setPhysics3Json (value) {
        if (!this.physicsRigBuilder) {
            this.physicsRigBuilder = new LIVE2DCUBISMFRAMEWORK.PhysicsRigBuilder();
        }
        this.physicsRigBuilder.setPhysics3Json(value);

        return this;
    }
    
    load (name, v) {
        if (!this.models[name]) {
            let modelDir = name+'/';
            name = name.split('/').pop();
            let modelPath = name+'.model3.json';
            let textures = new Array();
            let textureCount = 0;
            let motionNames = new Array();

            this.loader.add(name+'_model', modelDir+modelPath, { xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.JSON });

            this.loader.load((loader, resources) => {
                let model3Obj = resources[name+'_model'].data;
                
                if (typeof(model3Obj['FileReferences']['Moc']) !== "undefined") {
                    loader.add(name+'_moc', modelDir+model3Obj['FileReferences']['Moc'], { xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.BUFFER });
                }

                if (typeof(model3Obj['FileReferences']['Textures']) !== "undefined") {
                    model3Obj['FileReferences']['Textures'].forEach((element) => {
                        loader.add(name+'_texture'+textureCount, modelDir+element);
                        textureCount++;
                    });
                }

                if (typeof(model3Obj['FileReferences']['Physics']) !== "undefined") {
                    loader.add(name+'_physics', modelDir+model3Obj['FileReferences']['Physics'], { xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.JSON });
                }

                if (typeof(model3Obj['FileReferences']['Motions']) !== "undefined") {
                    for (let group in model3Obj['FileReferences']['Motions']) {
                        model3Obj['FileReferences']['Motions'][group].forEach((element) => {
                            let motionName = element['File'].split('/').pop().split('.').shift();
                            loader.add(name+'_'+motionName, modelDir+element['File'], { xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.JSON });
                            motionNames.push(name+'_'+motionName);
                        });
                    }
                }

                let groups = null;
                if (typeof(model3Obj['Groups'] !== "undefined")) {
                    groups = LIVE2DCUBISMFRAMEWORK.Groups.fromModel3Json(model3Obj);
                }

                loader.load((l, r) => {
                    let moc = null;
                    if (typeof(r[name+'_moc']) !== "undefined") {
                        moc = Live2DCubismCore.Moc.fromArrayBuffer(r[name+'_moc'].data);
                    }

                    if (typeof(r[name+'_texture'+0]) !== "undefined") {
                        for (let i = 0; i < textureCount; i++) {
                            textures.splice(i, 0, r[name+'_texture'+i].texture);
                        }
                    }

                    if (typeof(r[name+'_physics']) !== "undefined") {
                        this.setPhysics3Json(r[name+'_physics'].data);
                    }

                    let motions = new Map();
                    motionNames.forEach((element) => {
                        let n = element.split(name+'_').pop();
                        motions.set(n, LIVE2DCUBISMFRAMEWORK.Animation.fromMotion3Json(r[element].data));
                    });

                    let model = null;
                    let coreModel = Live2DCubismCore.Model.fromMoc(moc);
                    if (coreModel == null) {
                        return;
                    }

                    let animator = this.animatorBuilder
                        .setTarget(coreModel)
                        .setTimeScale(this.timeScale)
                        .build();

                    let physicsRig = this.physicsRigBuilder
                        .setTarget(coreModel)
                        .setTimeScale(this.timeScale)
                        .build();

                    let userData = null;

                    model = LIVE2DCUBISMPIXI.Model._create(coreModel, textures, animator, physicsRig, userData, groups);
                    model.motions = motions;
                    this.models[name] = model;

                    v.changeCanvas(model);
                });
            });
        } else {
            v.changeCanvas(this.models[name]);
        }
    }
}
