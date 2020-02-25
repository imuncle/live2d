var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var LIVE2DCUBISMPIXI;
(function (LIVE2DCUBISMPIXI) {
    var Model = (function (_super) {
        __extends(Model, _super);
        function Model(coreModel, textures, animator, physicsRig, userData, groups) {
            var _this = _super.call(this) || this;
            _this._coreModel = coreModel;
            _this._textures = textures;
            _this._animator = animator;
            _this._physicsRig = physicsRig;
            _this._userData = userData;
            _this._groups = groups;
            _this._animator.groups = _this._groups;
            if (_this._coreModel == null) {
                return _this;
            }
            _this._meshes = new Array(_this._coreModel.drawables.ids.length);
            for (var m = 0; m < _this._meshes.length; ++m) {
                var uvs = _this._coreModel.drawables.vertexUvs[m].slice(0, _this._coreModel.drawables.vertexUvs[m].length);
                for (var v = 1; v < uvs.length; v += 2) {
                    uvs[v] = 1 - uvs[v];
                }
                _this._meshes[m] = new CubismMesh(textures[_this._coreModel.drawables.textureIndices[m]], _this._coreModel.drawables.vertexPositions[m], uvs, _this._coreModel.drawables.indices[m], PIXI.DRAW_MODES.TRIANGLES);
                _this._meshes[m].name = _this._coreModel.drawables.ids[m];
                _this._meshes[m].scale.y *= -1;
                _this._meshes[m].isCulling = !Live2DCubismCore.Utils.hasIsDoubleSidedBit(_this._coreModel.drawables.constantFlags[m]);
                if (Live2DCubismCore.Utils.hasBlendAdditiveBit(_this._coreModel.drawables.constantFlags[m])) {
                    if (_this._coreModel.drawables.maskCounts[m] > 0) {
                        var addFilter = new PIXI.Filter();
                        addFilter.blendMode = PIXI.BLEND_MODES.ADD;
                        _this._meshes[m].filters = [addFilter];
                    }
                    else {
                        _this._meshes[m].blendMode = PIXI.BLEND_MODES.ADD;
                    }
                }
                else if (Live2DCubismCore.Utils.hasBlendMultiplicativeBit(_this._coreModel.drawables.constantFlags[m])) {
                    if (_this._coreModel.drawables.maskCounts[m] > 0) {
                        var multiplyFilter = new PIXI.Filter();
                        multiplyFilter.blendMode = PIXI.BLEND_MODES.MULTIPLY;
                        _this._meshes[m].filters = [multiplyFilter];
                    }
                    else {
                        _this._meshes[m].blendMode = PIXI.BLEND_MODES.MULTIPLY;
                    }
                }
                _this.addChild(_this._meshes[m]);
            }
            ;
            _this._maskSpriteContainer = new MaskSpriteContainer(coreModel, _this);
            return _this;
        }
        Object.defineProperty(Model.prototype, "parameters", {
            get: function () {
                return this._coreModel.parameters;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Model.prototype, "parts", {
            get: function () {
                return this._coreModel.parts;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Model.prototype, "drawables", {
            get: function () {
                return this._coreModel.drawables;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Model.prototype, "canvasinfo", {
            get: function () {
                return this._coreModel.canvasinfo;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Model.prototype, "textures", {
            get: function () {
                return this._textures;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Model.prototype, "animator", {
            get: function () {
                return this._animator;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Model.prototype, "userData", {
            get: function () {
                return this._userData;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Model.prototype, "meshes", {
            get: function () {
                return this._meshes;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Model.prototype, "masks", {
            get: function () {
                return this._maskSpriteContainer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Model.prototype, "groups", {
            get: function () {
                return this._groups;
            },
            enumerable: true,
            configurable: true
        });
        Model.prototype.update = function (delta) {
            var _this = this;
            var deltaTime = 0.016 * delta;
            this._animator.updateAndEvaluate(deltaTime);
            if (this._physicsRig) {
                this._physicsRig.updateAndEvaluate(deltaTime);
            }
            this._coreModel.update();
            var sort = false;
            for (var m = 0; m < this._meshes.length; ++m) {
                this._meshes[m].alpha = this._coreModel.drawables.opacities[m];
                this._meshes[m].visible = Live2DCubismCore.Utils.hasIsVisibleBit(this._coreModel.drawables.dynamicFlags[m]);
                if (Live2DCubismCore.Utils.hasVertexPositionsDidChangeBit(this._coreModel.drawables.dynamicFlags[m])) {
                    this._meshes[m].vertices = this._coreModel.drawables.vertexPositions[m];
                    this._meshes[m].dirtyVertex = true;
                }
                if (Live2DCubismCore.Utils.hasRenderOrderDidChangeBit(this._coreModel.drawables.dynamicFlags[m])) {
                    sort = true;
                }
            }
            if (sort) {
                this.children.sort(function (a, b) {
                    var aIndex = _this._meshes.indexOf(a);
                    var bIndex = _this._meshes.indexOf(b);
                    var aRenderOrder = _this._coreModel.drawables.renderOrders[aIndex];
                    var bRenderOrder = _this._coreModel.drawables.renderOrders[bIndex];
                    return aRenderOrder - bRenderOrder;
                });
            }
            this._coreModel.drawables.resetDynamicFlags();
        };
        Model.prototype.destroy = function (options) {
            if (this._coreModel != null) {
                this._coreModel.release();
            }
            _super.prototype.destroy.call(this, options);
            this.masks.destroy();
            this._meshes.forEach(function (m) {
                m.destroy();
            });
            if (options == true || options.texture) {
                this._textures.forEach(function (t) {
                    t.destroy();
                });
            }
        };
        Model.prototype.getModelMeshById = function (id) {
            if (this._meshes == null)
                return null;
            for (var _i = 0, _a = this._meshes; _i < _a.length; _i++) {
                var mesh = _a[_i];
                if (mesh.name === id)
                    return mesh;
            }
            return null;
        };
        Model.prototype.addParameterValueById = function (id, value) {
            var p = this._coreModel.parameters.ids.indexOf(id);
            if (p == -1) {
                return;
            }
            this._coreModel.parameters.values[p] = this._coreModel.parameters.values[p] + value;
        };
        Model._create = function (coreModel, textures, animator, physicsRig, userData, groups) {
            if (physicsRig === void 0) { physicsRig = null; }
            if (userData === void 0) { userData = null; }
            if (groups === void 0) { groups = null; }
            var model = new Model(coreModel, textures, animator, physicsRig, userData, groups);
            if (!model.isValid) {
                model.destroy();
                return null;
            }
            return model;
        };
        Object.defineProperty(Model.prototype, "isValid", {
            get: function () {
                return this._coreModel != null;
            },
            enumerable: true,
            configurable: true
        });
        return Model;
    }(PIXI.Container));
    LIVE2DCUBISMPIXI.Model = Model;
    var MaskSpriteContainer = (function (_super) {
        __extends(MaskSpriteContainer, _super);
        function MaskSpriteContainer(coreModel, pixiModel) {
            var _this = _super.call(this) || this;
            _this._maskShaderVertSrc = new String("\n            attribute vec2 aVertexPosition;\n            attribute vec2 aTextureCoord;\n            uniform mat3 projectionMatrix;\n            varying vec2 vTextureCoord;\n            void main(void){\n                gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n                vTextureCoord = aTextureCoord;\n            }\n            ");
            _this._maskShaderFragSrc = new String("\n            varying vec2 vTextureCoord;\n            uniform sampler2D uSampler;\n            void main(void){\n                vec4 c = texture2D(uSampler, vTextureCoord);\n                c.r = c.a;\n                c.g = 0.0;\n                c.b = 0.0;\n                gl_FragColor = c;\n            }\n            ");
            _this._maskShader = new PIXI.Filter(_this._maskShaderVertSrc.toString(), _this._maskShaderFragSrc.toString());
            var _maskCounts = coreModel.drawables.maskCounts;
            var _maskRelationList = coreModel.drawables.masks;
            _this._maskMeshContainers = new Array();
            _this._maskTextures = new Array();
            _this._maskSprites = new Array();
            for (var m = 0; m < pixiModel.meshes.length; ++m) {
                if (_maskCounts[m] > 0) {
                    var newContainer = new PIXI.Container;
                    for (var n = 0; n < _maskRelationList[m].length; ++n) {
                        var meshMaskID = coreModel.drawables.masks[m][n];
                        if(meshMaskID < 0) continue;
                        var maskMesh = new CubismMesh(pixiModel.meshes[meshMaskID].texture, pixiModel.meshes[meshMaskID].vertices, pixiModel.meshes[meshMaskID].uvs, pixiModel.meshes[meshMaskID].indices, PIXI.DRAW_MODES.TRIANGLES);
                        maskMesh.name = pixiModel.meshes[meshMaskID].name;
                        maskMesh.transform = pixiModel.meshes[meshMaskID].transform;
                        maskMesh.worldTransform = pixiModel.meshes[meshMaskID].worldTransform;
                        maskMesh.localTransform = pixiModel.meshes[meshMaskID].localTransform;
                        maskMesh.isCulling = pixiModel.meshes[meshMaskID].isCulling;
                        maskMesh.isMaskMesh = true;
                        maskMesh.filters = [_this._maskShader];
                        newContainer.addChild(maskMesh);
                    }
                    newContainer.transform = pixiModel.transform;
                    newContainer.worldTransform = pixiModel.worldTransform;
                    newContainer.localTransform = pixiModel.localTransform;
                    _this._maskMeshContainers.push(newContainer);
                    var newTexture = PIXI.RenderTexture.create(0, 0);
                    _this._maskTextures.push(newTexture);
                    var newSprite = new PIXI.Sprite(newTexture);
                    _this._maskSprites.push(newSprite);
                    _this.addChild(newSprite);
                    pixiModel.meshes[m].mask = newSprite;
                }
            }
            return _this;
        }
        Object.defineProperty(MaskSpriteContainer.prototype, "maskSprites", {
            get: function () {
                return this._maskSprites;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MaskSpriteContainer.prototype, "maskMeshes", {
            get: function () {
                return this._maskMeshContainers;
            },
            enumerable: true,
            configurable: true
        });
        MaskSpriteContainer.prototype.destroy = function (options) {
            this._maskSprites.forEach(function (m) {
                m.destroy();
            });
            this._maskTextures.forEach(function (m) {
                m.destroy();
            });
            this._maskMeshContainers.forEach(function (m) {
                m.destroy();
            });
            this._maskShader = null;
        };
        MaskSpriteContainer.prototype.update = function (appRenderer) {
            for (var m = 0; m < this._maskSprites.length; ++m) {
                appRenderer.render(this._maskMeshContainers[m], this._maskTextures[m], true, null, false);
            }
        };
        MaskSpriteContainer.prototype.resize = function (viewWidth, viewHeight) {
            for (var m = 0; m < this._maskTextures.length; ++m) {
                this._maskTextures[m].resize(viewWidth, viewHeight, false);
            }
        };
        return MaskSpriteContainer;
    }(PIXI.Container));
    LIVE2DCUBISMPIXI.MaskSpriteContainer = MaskSpriteContainer;
    var ModelBuilder = (function () {
        function ModelBuilder() {
            this._textures = new Array();
            this._timeScale = 1;
            this._animatorBuilder = new LIVE2DCUBISMFRAMEWORK.AnimatorBuilder();
        }
        ModelBuilder.prototype.setMoc = function (value) {
            this._moc = value;
            return this;
        };
        ModelBuilder.prototype.setTimeScale = function (value) {
            this._timeScale = value;
            return this;
        };
        ModelBuilder.prototype.setPhysics3Json = function (value) {
            if (!this._physicsRigBuilder) {
                this._physicsRigBuilder = new LIVE2DCUBISMFRAMEWORK.PhysicsRigBuilder();
            }
            this._physicsRigBuilder.setPhysics3Json(value);
            return this;
        };
        ModelBuilder.prototype.setUserData3Json = function (value) {
            if (!this._userDataBuilder) {
                this._userDataBuilder = new LIVE2DCUBISMFRAMEWORK.UserDataBuilder();
            }
            this._userDataBuilder.setUserData3Json(value);
            return this;
        };
        ModelBuilder.prototype.addTexture = function (index, texture) {
            this._textures.splice(index, 0, texture);
            return this;
        };
        ModelBuilder.prototype.addAnimatorLayer = function (name, blender, weight) {
            if (blender === void 0) { blender = LIVE2DCUBISMFRAMEWORK.BuiltinAnimationBlenders.OVERRIDE; }
            if (weight === void 0) { weight = 1; }
            this._animatorBuilder.addLayer(name, blender, weight);
            return this;
        };
        ModelBuilder.prototype.addGroups = function (groups) {
            this._groups = groups;
            return this;
        };
        ModelBuilder.prototype.buildFromModel3Json = function (loader, model3Obj, callbackFunc) {
            var _this = this;
            var model3URL = model3Obj.url;
            var modelDir = model3URL.substring(0, model3URL.lastIndexOf("/") + 1);
            var textureCount = 0;
            if (typeof (model3Obj.data['FileReferences']['Moc']) !== "undefined")
                loader.add('moc', modelDir + model3Obj.data['FileReferences']['Moc'], { xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.BUFFER });
            if (typeof (model3Obj.data['FileReferences']['Textures']) !== "undefined") {
                model3Obj.data['FileReferences']['Textures'].forEach(function (element) {
                    loader.add('texture' + textureCount, modelDir + element);
                    textureCount++;
                });
            }
            if (typeof (model3Obj.data['FileReferences']['Physics']) !== "undefined")
                loader.add('physics', modelDir + model3Obj.data['FileReferences']['Physics'], { xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.JSON });
            if (typeof (model3Obj.data['FileReferences']['UserData']) !== "undefined")
                loader.add('userdata', modelDir + model3Obj.data['FileReferences']['UserData'], { xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.JSON });
            if (typeof (model3Obj.data['Groups'] !== "undefined"))
                this._groups = LIVE2DCUBISMFRAMEWORK.Groups.fromModel3Json(model3Obj.data);
            loader.load(function (loader, resources) {
                if (typeof (resources['moc']) !== "undefined")
                    _this.setMoc(Live2DCubismCore.Moc.fromArrayBuffer(resources['moc'].data));
                if (typeof (resources['texture' + 0]) !== "undefined") {
                    for (var i = 0; i < textureCount; i++)
                        _this.addTexture(i, resources['texture' + i].texture);
                }
                if (typeof (resources['physics']) !== "undefined")
                    _this.setPhysics3Json(resources['physics'].data);
                if (typeof (resources['userdata']) !== "undefined")
                    _this.setUserData3Json(resources['userdata'].data);
                var model = _this.build();
                callbackFunc(model);
            });
        };
        ModelBuilder.prototype.build = function () {
            var coreModel = Live2DCubismCore.Model.fromMoc(this._moc);
            if (coreModel == null) {
                return null;
            }
            var animator = this._animatorBuilder
                .setTarget(coreModel)
                .setTimeScale(this._timeScale)
                .build();
            var physicsRig = null;
            if (this._physicsRigBuilder) {
                physicsRig = this._physicsRigBuilder
                    .setTarget(coreModel)
                    .setTimeScale(this._timeScale)
                    .build();
            }
            var userData = null;
            if (this._userDataBuilder) {
                userData = this._userDataBuilder
                    .setTarget(coreModel)
                    .build();
            }
            return Model._create(coreModel, this._textures, animator, physicsRig, userData, this._groups);
        };
        return ModelBuilder;
    }());
    LIVE2DCUBISMPIXI.ModelBuilder = ModelBuilder;
    var CubismMesh = (function (_super) {
        __extends(CubismMesh, _super);
        function CubismMesh() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.isCulling = false;
            _this.isMaskMesh = false;
            return _this;
        }
        CubismMesh.prototype._renderWebGL = function (renderer) {
            if (this.isMaskMesh === true)
                renderer.state.setFrontFace(1);
            else
                renderer.state.setFrontFace(0);
            if (this.isCulling === true)
                renderer.state.setCullFace(1);
            else
                renderer.state.setCullFace(0);
            _super.prototype._renderWebGL.call(this, renderer);
            renderer.state.setFrontFace(0);
        };
        return CubismMesh;
    }(PIXI.mesh.Mesh));
    LIVE2DCUBISMPIXI.CubismMesh = CubismMesh;
})(LIVE2DCUBISMPIXI || (LIVE2DCUBISMPIXI = {}));
