var LIVE2DCUBISMFRAMEWORK;
(function (LIVE2DCUBISMFRAMEWORK) {
    var AnimationPoint = (function () {
        function AnimationPoint(time, value) {
            this.time = time;
            this.value = value;
        }
        return AnimationPoint;
    }());
    LIVE2DCUBISMFRAMEWORK.AnimationPoint = AnimationPoint;
    var AnimationUserDataBody = (function () {
        function AnimationUserDataBody(time, value) {
            this.time = time;
            this.value = value;
        }
        ;
        return AnimationUserDataBody;
    }());
    LIVE2DCUBISMFRAMEWORK.AnimationUserDataBody = AnimationUserDataBody;
    var BuiltinAnimationSegmentEvaluators = (function () {
        function BuiltinAnimationSegmentEvaluators() {
        }
        BuiltinAnimationSegmentEvaluators.lerp = function (a, b, t) {
            return new AnimationPoint((a.time + ((b.time - a.time) * t)), (a.value + ((b.value - a.value) * t)));
        };
        BuiltinAnimationSegmentEvaluators.LINEAR = function (points, offset, time) {
            var p0 = points[offset + 0];
            var p1 = points[offset + 1];
            var t = (time - p0.time) / (p1.time - p0.time);
            return (p0.value + ((p1.value - p0.value) * t));
        };
        BuiltinAnimationSegmentEvaluators.BEZIER = function (points, offset, time) {
            var t = (time - points[offset + 0].time) / (points[offset + 3].time - points[offset].time);
            var p01 = BuiltinAnimationSegmentEvaluators.lerp(points[offset + 0], points[offset + 1], t);
            var p12 = BuiltinAnimationSegmentEvaluators.lerp(points[offset + 1], points[offset + 2], t);
            var p23 = BuiltinAnimationSegmentEvaluators.lerp(points[offset + 2], points[offset + 3], t);
            var p012 = BuiltinAnimationSegmentEvaluators.lerp(p01, p12, t);
            var p123 = BuiltinAnimationSegmentEvaluators.lerp(p12, p23, t);
            return BuiltinAnimationSegmentEvaluators.lerp(p012, p123, t).value;
        };
        BuiltinAnimationSegmentEvaluators.STEPPED = function (points, offset, time) {
            return points[offset + 0].value;
        };
        BuiltinAnimationSegmentEvaluators.INVERSE_STEPPED = function (points, offset, time) {
            return points[offset + 1].value;
        };
        return BuiltinAnimationSegmentEvaluators;
    }());
    LIVE2DCUBISMFRAMEWORK.BuiltinAnimationSegmentEvaluators = BuiltinAnimationSegmentEvaluators;
    var AnimationSegment = (function () {
        function AnimationSegment(offset, evaluate) {
            this.offset = offset;
            this.evaluate = evaluate;
        }
        return AnimationSegment;
    }());
    LIVE2DCUBISMFRAMEWORK.AnimationSegment = AnimationSegment;
    var AnimationTrack = (function () {
        function AnimationTrack(targetId, points, segments) {
            this.targetId = targetId;
            this.points = points;
            this.segments = segments;
        }
        AnimationTrack.prototype.evaluate = function (time) {
            var s = 0;
            var lastS = this.segments.length - 1;
            for (; s < lastS; ++s) {
                if (this.points[this.segments[s + 1].offset].time < time) {
                    continue;
                }
                break;
            }
            return this.segments[s].evaluate(this.points, this.segments[s].offset, time);
        };
        return AnimationTrack;
    }());
    LIVE2DCUBISMFRAMEWORK.AnimationTrack = AnimationTrack;
    var Animation = (function () {
        function Animation(motion3Json) {
            var _this = this;
            this.modelTracks = new Array();
            this.parameterTracks = new Array();
            this.partOpacityTracks = new Array();
            this.userDataBodys = new Array();
            this.duration = motion3Json['Meta']['Duration'];
            this.fps = motion3Json['Meta']['Fps'];
            this.loop = motion3Json['Meta']['Loop'];
            this.userDataCount = motion3Json['Meta']['UserDataCount'];
            this.totalUserDataSize = motion3Json['Meta']['TotalUserDataSize'];
            if (motion3Json['UserData'] != null) {
                motion3Json['UserData'].forEach(function (u) {
                    _this.userDataBodys.push(new AnimationUserDataBody(u['Time'], u['Value']));
                });
                console.assert(this.userDataBodys.length === this.userDataCount);
            }
            motion3Json['Curves'].forEach(function (c) {
                var s = c['Segments'];
                var points = new Array();
                var segments = new Array();
                points.push(new AnimationPoint(s[0], s[1]));
                for (var t = 2; t < s.length; t += 3) {
                    var offset = points.length - 1;
                    var evaluate = BuiltinAnimationSegmentEvaluators.LINEAR;
                    var type = s[t];
                    if (type == 1) {
                        evaluate = BuiltinAnimationSegmentEvaluators.BEZIER;
                        points.push(new AnimationPoint(s[t + 1], s[t + 2]));
                        points.push(new AnimationPoint(s[t + 3], s[t + 4]));
                        t += 4;
                    }
                    else if (type == 2) {
                        evaluate = BuiltinAnimationSegmentEvaluators.STEPPED;
                    }
                    else if (type == 3) {
                        evaluate = BuiltinAnimationSegmentEvaluators.INVERSE_STEPPED;
                    }
                    else if (type != 0) {
                    }
                    points.push(new AnimationPoint(s[t + 1], s[t + 2]));
                    segments.push(new AnimationSegment(offset, evaluate));
                }
                var track = new AnimationTrack(c['Id'], points, segments);
                if (c['Target'] == 'Model') {
                    _this.modelTracks.push(track);
                }
                else if (c['Target'] == 'Parameter') {
                    _this.parameterTracks.push(track);
                }
                else if (c['Target'] == 'PartOpacity') {
                    _this.partOpacityTracks.push(track);
                }
                else {
                }
            });
        }
        Animation.fromMotion3Json = function (motion3Json) {
            if (motion3Json == null) {
                return null;
            }
            var animation = new Animation(motion3Json);
            return (animation.isValid)
                ? animation
                : null;
        };
        Animation.prototype.addAnimationCallback = function (callbackFunc) {
            if (this._callbackFunctions == null)
                this._callbackFunctions = new Array();
            this._callbackFunctions.push(callbackFunc);
        };
        Animation.prototype.removeAnimationCallback = function (callbackFunc) {
            if (this._callbackFunctions != null) {
                var _target = -1;
                for (var _index = 0; _index < this._callbackFunctions.length; _index++) {
                    if (this._callbackFunctions[_index] === callbackFunc) {
                        _target = _index;
                        break;
                    }
                }
                if (_target >= 0)
                    this._callbackFunctions.splice(_target, 1);
            }
        };
        Animation.prototype.clearAnimationCallback = function () {
            this._callbackFunctions = [];
        };
        Animation.prototype.callAnimationCallback = function (value) {
            if (this._callbackFunctions.length > 0)
                this._callbackFunctions.forEach(function (func) { func(value); });
        };
        Animation.prototype.evaluate = function (time, weight, blend, target, stackFlags, groups) {
            if (groups === void 0) { groups = null; }
            if (weight <= 0.01) {
                return;
            }
            if (this.loop) {
                while (time > this.duration) {
                    time -= this.duration;
                }
            }
            this.parameterTracks.forEach(function (t) {
                var p = target.parameters.ids.indexOf(t.targetId);
                if (p >= 0) {
                    var sample = t.evaluate(time);
                    if (stackFlags[0][p] != true) {
                        target.parameters.values[p] = target.parameters.defaultValues[p];
                        stackFlags[0][p] = true;
                    }
                    target.parameters.values[p] = blend(target.parameters.values[p], sample, t.evaluate(0), weight);
                }
            });
            this.partOpacityTracks.forEach(function (t) {
                var p = target.parts.ids.indexOf(t.targetId);
                if (p >= 0) {
                    var sample = t.evaluate(time);
                    if (stackFlags[1][p] != true) {
                        target.parts.opacities[p] = 1;
                        stackFlags[1][p] = true;
                    }
                    target.parts.opacities[p] = blend(target.parts.opacities[p], sample, t.evaluate(0), weight);
                }
            });
            this.modelTracks.forEach(function (t) {
                if (groups != null) {
                    var g = groups.getGroupById(t.targetId);
                    if (g != null && g.target === "Parameter") {
                        for (var _i = 0, _a = g.ids; _i < _a.length; _i++) {
                            var tid = _a[_i];
                            var p = target.parameters.ids.indexOf(tid);
                            if (p >= 0) {
                                var sample = t.evaluate(time);
                                if (stackFlags[0][p] != true) {
                                    target.parameters.values[p] = target.parameters.defaultValues[p];
                                    stackFlags[0][p] = true;
                                }
                                target.parameters.values[p] = blend(target.parameters.values[p], sample, t.evaluate(0), weight);
                            }
                        }
                    }
                }
            });
            if (this._callbackFunctions != null) {
                for (var _i = 0, _a = this.userDataBodys; _i < _a.length; _i++) {
                    var ud = _a[_i];
                    if (this.isEventTriggered(ud.time, time, this._lastTime, this.duration))
                        this.callAnimationCallback(ud.value);
                }
            }
            this._lastTime = time;
        };
        Animation.prototype.isEventTriggered = function (timeEvaluate, timeForward, timeBack, duration) {
            if (timeForward > timeBack) {
                if (timeEvaluate > timeBack && timeEvaluate < timeForward)
                    return true;
            }
            else {
                if (timeEvaluate > 0 && timeEvaluate < timeForward
                    || timeEvaluate > timeBack && timeEvaluate < duration)
                    return true;
            }
            return false;
        };
        Object.defineProperty(Animation.prototype, "isValid", {
            get: function () {
                return true;
            },
            enumerable: true,
            configurable: true
        });
        return Animation;
    }());
    LIVE2DCUBISMFRAMEWORK.Animation = Animation;
    var BuiltinCrossfadeWeighters = (function () {
        function BuiltinCrossfadeWeighters() {
        }
        BuiltinCrossfadeWeighters.LINEAR = function (time, duration) {
            return (time / duration);
        };
        return BuiltinCrossfadeWeighters;
    }());
    LIVE2DCUBISMFRAMEWORK.BuiltinCrossfadeWeighters = BuiltinCrossfadeWeighters;
    var AnimationState = (function () {
        function AnimationState() {
        }
        return AnimationState;
    }());
    LIVE2DCUBISMFRAMEWORK.AnimationState = AnimationState;
    var BuiltinAnimationBlenders = (function () {
        function BuiltinAnimationBlenders() {
        }
        BuiltinAnimationBlenders.OVERRIDE = function (source, destination, initial, weight) {
            return ((destination * weight) + source * (1 - weight));
        };
        BuiltinAnimationBlenders.ADD = function (source, destination, initial, weight) {
            return (source + ((destination - initial) * weight));
        };
        BuiltinAnimationBlenders.MULTIPLY = function (source, destination, weight) {
            return (source * (1 + ((destination - 1) * weight)));
        };
        return BuiltinAnimationBlenders;
    }());
    LIVE2DCUBISMFRAMEWORK.BuiltinAnimationBlenders = BuiltinAnimationBlenders;
    var AnimationLayer = (function () {
        function AnimationLayer() {
            this.weight = 1;
        }
        Object.defineProperty(AnimationLayer.prototype, "currentAnimation", {
            get: function () {
                return this._animation;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationLayer.prototype, "currentTime", {
            get: function () {
                return this._time;
            },
            set: function (value) {
                this._time = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AnimationLayer.prototype, "isPlaying", {
            get: function () {
                return this._play;
            },
            enumerable: true,
            configurable: true
        });
        AnimationLayer.prototype.play = function (animation, fadeDuration) {
            if (fadeDuration === void 0) { fadeDuration = 0; }
            if (this._animation && fadeDuration > 0) {
                this._goalAnimation = animation;
                this._goalTime = 0;
                this._fadeTime = 0;
                this._fadeDuration = fadeDuration;
            }
            else {
                this._animation = animation;
                this.currentTime = 0;
                this._play = true;
            }
        };
        AnimationLayer.prototype.resume = function () {
            this._play = true;
        };
        AnimationLayer.prototype.pause = function () {
            this._play = false;
        };
        AnimationLayer.prototype.stop = function () {
            this._play = false;
            this.currentTime = 0;
        };
        AnimationLayer.prototype._update = function (deltaTime) {
            if (!this._play) {
                return;
            }
            this._time += deltaTime;
            this._goalTime += deltaTime;
            this._fadeTime += deltaTime;
            if (this._animation == null || (!this._animation.loop && this._time > this._animation.duration)) {
                this.stop();
                this._animation = null;
            }
        };
        AnimationLayer.prototype._evaluate = function (target, stackFlags) {
            if (this._animation == null) {
                return;
            }
            var weight = (this.weight < 1)
                ? this.weight
                : 1;
            var animationWeight = (this._goalAnimation != null)
                ? (weight * this.weightCrossfade(this._fadeTime, this._fadeDuration))
                : weight;
            this._animation.evaluate(this._time, animationWeight, this.blend, target, stackFlags, this.groups);
            if (this._goalAnimation != null) {
                animationWeight = 1 - (weight * this.weightCrossfade(this._fadeTime, this._fadeDuration));
                this._goalAnimation.evaluate(this._goalTime, animationWeight, this.blend, target, stackFlags, this.groups);
                if (this._fadeTime > this._fadeDuration) {
                    this._animation = this._goalAnimation;
                    this._time = this._goalTime;
                    this._goalAnimation = null;
                }
            }
        };
        return AnimationLayer;
    }());
    LIVE2DCUBISMFRAMEWORK.AnimationLayer = AnimationLayer;
    var Animator = (function () {
        function Animator(target, timeScale, layers) {
            this._target = target;
            this.timeScale = timeScale;
            this._layers = layers;
        }
        Object.defineProperty(Animator.prototype, "target", {
            get: function () {
                return this._target;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Animator.prototype, "isPlaying", {
            get: function () {
                var ret = false;
                this._layers.forEach(function (l) {
                    if (l.isPlaying) {
                        ret = true;
                        return;
                    }
                });
                return ret;
            },
            enumerable: true,
            configurable: true
        });
        Animator.prototype.addLayer = function (name, blender, weight) {
            if (blender === void 0) { blender = BuiltinAnimationBlenders.OVERRIDE; }
            if (weight === void 0) { weight = 1; }
            var layer = new AnimationLayer();
            layer.blend = blender;
            layer.weightCrossfade = BuiltinCrossfadeWeighters.LINEAR;
            layer.weight = weight;
            layer.groups = this.groups;
            this._layers.set(name, layer);
        };
        Animator.prototype.getLayer = function (name) {
            return this._layers.has(name)
                ? this._layers.get(name)
                : null;
        };
        Animator.prototype.removeLayer = function (name) {
            return this._layers.has(name)
                ? this._layers.delete(name)
                : null;
        };
        Animator.prototype.clearLayers = function () {
            this._layers.clear();
        };
        Animator.prototype.updateAndEvaluate = function (deltaTime) {
            var _this = this;
            deltaTime *= ((this.timeScale > 0)
                ? this.timeScale
                : 0);
            if (deltaTime > 0.001) {
                this._layers.forEach(function (l) {
                    l._update(deltaTime);
                });
            }
            var paramStackFlags = new Array(this._target.parameters.count).fill(false);
            var partsStackFlags = new Array(this._target.parts.count).fill(false);
            var stackFlags = new Array(paramStackFlags, partsStackFlags);
            this._layers.forEach(function (l) {
                l._evaluate(_this._target, stackFlags);
            });
        };
        Animator._create = function (target, timeScale, layers) {
            var animator = new Animator(target, timeScale, layers);
            return animator.isValid
                ? animator
                : null;
        };
        Object.defineProperty(Animator.prototype, "isValid", {
            get: function () {
                return this._target != null;
            },
            enumerable: true,
            configurable: true
        });
        return Animator;
    }());
    LIVE2DCUBISMFRAMEWORK.Animator = Animator;
    var AnimatorBuilder = (function () {
        function AnimatorBuilder() {
            this._timeScale = 1;
            this._layerNames = new Array();
            this._layerBlenders = new Array();
            this._layerCrossfadeWeighters = new Array();
            this._layerWeights = new Array();
        }
        AnimatorBuilder.prototype.setTarget = function (value) {
            this._target = value;
            return this;
        };
        AnimatorBuilder.prototype.setTimeScale = function (value) {
            this._timeScale = value;
            return this;
        };
        AnimatorBuilder.prototype.addLayer = function (name, blender, weight) {
            if (blender === void 0) { blender = BuiltinAnimationBlenders.OVERRIDE; }
            if (weight === void 0) { weight = 1; }
            this._layerNames.push(name);
            this._layerBlenders.push(blender);
            this._layerCrossfadeWeighters.push(BuiltinCrossfadeWeighters.LINEAR);
            this._layerWeights.push(weight);
            return this;
        };
        AnimatorBuilder.prototype.build = function () {
            var layers = new Map();
            for (var l = 0; l < this._layerNames.length; ++l) {
                var layer = new AnimationLayer();
                layer.blend = this._layerBlenders[l];
                layer.weightCrossfade = this._layerCrossfadeWeighters[l];
                layer.weight = this._layerWeights[l];
                layers.set(this._layerNames[l], layer);
            }
            return Animator._create(this._target, this._timeScale, layers);
        };
        return AnimatorBuilder;
    }());
    LIVE2DCUBISMFRAMEWORK.AnimatorBuilder = AnimatorBuilder;
    var PhysicsVector2 = (function () {
        function PhysicsVector2(x, y) {
            this.x = x;
            this.y = y;
        }
        PhysicsVector2.distance = function (a, b) {
            return Math.abs(a.substract(b).length);
        };
        PhysicsVector2.dot = function (a, b) {
            return ((a.x * b.x) + (a.y * b.y));
        };
        Object.defineProperty(PhysicsVector2.prototype, "length", {
            get: function () {
                return Math.sqrt(PhysicsVector2.dot(this, this));
            },
            enumerable: true,
            configurable: true
        });
        PhysicsVector2.prototype.add = function (vector2) {
            return new PhysicsVector2(this.x + vector2.x, this.y + vector2.y);
        };
        PhysicsVector2.prototype.substract = function (vector2) {
            return new PhysicsVector2(this.x - vector2.x, this.y - vector2.y);
        };
        PhysicsVector2.prototype.multiply = function (vector2) {
            return new PhysicsVector2(this.x * vector2.x, this.y * vector2.y);
        };
        PhysicsVector2.prototype.multiplyByScalar = function (scalar) {
            return this.multiply(new PhysicsVector2(scalar, scalar));
        };
        PhysicsVector2.prototype.divide = function (vector2) {
            return new PhysicsVector2(this.x / vector2.x, this.y / vector2.y);
        };
        PhysicsVector2.prototype.divideByScalar = function (scalar) {
            return this.divide(new PhysicsVector2(scalar, scalar));
        };
        PhysicsVector2.prototype.rotateByRadians = function (radians) {
            var x = (this.x * Math.cos(radians)) - (this.y * Math.sin(radians));
            var y = (this.x * Math.sin(radians)) + (this.y * Math.cos(radians));
            return new PhysicsVector2(x, y);
        };
        PhysicsVector2.prototype.normalize = function () {
            var length = this.length;
            var x = this.x / length;
            var y = this.y / length;
            return new PhysicsVector2(x, y);
        };
        PhysicsVector2.zero = new PhysicsVector2(0, 0);
        return PhysicsVector2;
    }());
    LIVE2DCUBISMFRAMEWORK.PhysicsVector2 = PhysicsVector2;
    var Physics = (function () {
        function Physics() {
        }
        Physics.clampScalar = function (scalar, lower, upper) {
            if (scalar < lower) {
                return lower;
            }
            if (scalar > upper) {
                return upper;
            }
            return scalar;
        };
        Physics.directionToDegrees = function (from, to) {
            var radians = Physics.directionToRadians(from, to);
            var degrees = Physics.radiansToDegrees(radians);
            return ((to.x - from.x) > 0)
                ? -degrees
                : degrees;
        };
        Physics.radiansToDegrees = function (radians) {
            return ((radians * 180) / Math.PI);
        };
        Physics.radiansToDirection = function (radians) {
            return new PhysicsVector2(Math.sin(radians), Math.cos(radians));
        };
        Physics.degreesToRadians = function (degrees) {
            return ((degrees / 180) * Math.PI);
        };
        Physics.directionToRadians = function (from, to) {
            var dot = PhysicsVector2.dot(from, to);
            var magnitude = from.length * to.length;
            if (magnitude == 0) {
                return 0;
            }
            var cosTheta = (dot / magnitude);
            return (Math.abs(cosTheta) <= 1.0)
                ? Math.acos(cosTheta)
                : 0;
        };
        Physics.gravity = new PhysicsVector2(0, -1);
        Physics.wind = new PhysicsVector2(0, 0);
        Physics.maximumWeight = 100;
        Physics.airResistance = 5;
        Physics.movementThreshold = 0.001;
        Physics.correctAngles = true;
        return Physics;
    }());
    LIVE2DCUBISMFRAMEWORK.Physics = Physics;
    var PhysicsParticle = (function () {
        function PhysicsParticle(initialPosition, mobility, delay, acceleration, radius) {
            this.initialPosition = initialPosition;
            this.mobility = mobility;
            this.delay = delay;
            this.acceleration = acceleration;
            this.radius = radius;
            this.position = initialPosition;
            this.lastPosition = this.position;
            this.lastGravity = new PhysicsVector2(0, -1);
            this.force = new PhysicsVector2(0, 0);
            this.velocity = new PhysicsVector2(0, 0);
        }
        return PhysicsParticle;
    }());
    LIVE2DCUBISMFRAMEWORK.PhysicsParticle = PhysicsParticle;
    var PhysicsFactorTuple = (function () {
        function PhysicsFactorTuple(x, y, angle) {
            this.x = x;
            this.y = y;
            this.angle = angle;
        }
        PhysicsFactorTuple.prototype.add = function (factor) {
            var x = this.x + factor.x;
            var y = this.y + factor.y;
            var angle = this.angle + factor.angle;
            return new PhysicsFactorTuple(x, y, angle);
        };
        return PhysicsFactorTuple;
    }());
    LIVE2DCUBISMFRAMEWORK.PhysicsFactorTuple = PhysicsFactorTuple;
    var PhysicsNormalizationTuple = (function () {
        function PhysicsNormalizationTuple(minimum, maximum, def) {
            this.minimum = minimum;
            this.maximum = maximum;
            this.def = def;
        }
        return PhysicsNormalizationTuple;
    }());
    LIVE2DCUBISMFRAMEWORK.PhysicsNormalizationTuple = PhysicsNormalizationTuple;
    var PhysicsNormalizationOptions = (function () {
        function PhysicsNormalizationOptions(position, angle) {
            this.position = position;
            this.angle = angle;
        }
        return PhysicsNormalizationOptions;
    }());
    LIVE2DCUBISMFRAMEWORK.PhysicsNormalizationOptions = PhysicsNormalizationOptions;
    var PhysicsInput = (function () {
        function PhysicsInput(targetId, weight, factor, invert) {
            this.targetId = targetId;
            this.weight = weight;
            this.factor = factor;
            this.invert = invert;
        }
        Object.defineProperty(PhysicsInput.prototype, "normalizedWeight", {
            get: function () {
                return Physics.clampScalar(this.weight / Physics.maximumWeight, 0, 1);
            },
            enumerable: true,
            configurable: true
        });
        PhysicsInput.prototype.evaluateFactor = function (parameterValue, parameterMinimum, parameterMaximum, parameterDefault, normalization) {
            console.assert(parameterMaximum > parameterMinimum);
            var parameterMiddle = this.getMiddleValue(parameterMinimum, parameterMaximum);
            var value = parameterValue - parameterMiddle;
            switch (Math.sign(value)) {
                case 1:
                    {
                        var parameterRange = parameterMaximum - parameterMiddle;
                        if (parameterRange == 0) {
                            value = normalization.angle.def;
                        }
                        else {
                            var normalizationRange = normalization.angle.maximum - normalization.angle.def;
                            if (normalizationRange == 0) {
                                value = normalization.angle.maximum;
                            }
                            else {
                                value *= Math.abs(normalizationRange / parameterRange);
                                value += normalization.angle.def;
                            }
                        }
                    }
                    break;
                case -1:
                    {
                        var parameterRange = parameterMiddle - parameterMinimum;
                        if (parameterRange == 0) {
                            value = normalization.angle.def;
                        }
                        else {
                            var normalizationRange = normalization.angle.def - normalization.angle.minimum;
                            if (normalizationRange == 0) {
                                value = normalization.angle.minimum;
                            }
                            else {
                                value *= Math.abs(normalizationRange / parameterRange);
                                value += normalization.angle.def;
                            }
                        }
                    }
                    break;
                case 0:
                    {
                        value = normalization.angle.def;
                    }
                    break;
            }
            var weight = (this.weight / Physics.maximumWeight);
            value *= (this.invert) ? 1 : -1;
            return new PhysicsFactorTuple(value * this.factor.x * weight, value * this.factor.y * weight, value * this.factor.angle * weight);
        };
        PhysicsInput.prototype.getRangeValue = function (min, max) {
            var maxValue = Math.max(min, max);
            var minValue = Math.min(min, max);
            return Math.abs(maxValue - minValue);
        };
        PhysicsInput.prototype.getMiddleValue = function (min, max) {
            var minValue = Math.min(min, max);
            return minValue + (this.getRangeValue(min, max) / 2);
        };
        return PhysicsInput;
    }());
    LIVE2DCUBISMFRAMEWORK.PhysicsInput = PhysicsInput;
    var PhysicsOutput = (function () {
        function PhysicsOutput(targetId, particleIndex, weight, angleScale, factor, invert) {
            this.targetId = targetId;
            this.particleIndex = particleIndex;
            this.weight = weight;
            this.factor = factor;
            this.invert = invert;
            this.factor.angle *= angleScale;
        }
        Object.defineProperty(PhysicsOutput.prototype, "normalizedWeight", {
            get: function () {
                return Physics.clampScalar(this.weight / Physics.maximumWeight, 0, 1);
            },
            enumerable: true,
            configurable: true
        });
        PhysicsOutput.prototype.evaluateValue = function (translation, particles) {
            var value = (translation.x * this.factor.x) + (translation.y * this.factor.y);
            if (this.factor.angle > 0) {
                var parentGravity = Physics.gravity;
                if (Physics.correctAngles && this.particleIndex > 1) {
                    parentGravity = particles[this.particleIndex - 2].position
                        .substract(particles[this.particleIndex - 1].position);
                }
                var angleResult = (Physics.directionToRadians(parentGravity, translation));
                value += (((translation.x - parentGravity.x) > 0) ? -angleResult : angleResult) * this.factor.angle;
            }
            value *= ((this.invert)
                ? -1
                : 1);
            return value;
        };
        return PhysicsOutput;
    }());
    LIVE2DCUBISMFRAMEWORK.PhysicsOutput = PhysicsOutput;
    var PhysicsSubRig = (function () {
        function PhysicsSubRig(input, output, particles, normalization) {
            this.input = input;
            this.output = output;
            this.particles = particles;
            this.normalization = normalization;
        }
        PhysicsSubRig.prototype._update = function (deltaTime, target) {
            var _this = this;
            var parameters = target.parameters;
            var factor = new PhysicsFactorTuple(0, 0, 0);
            this.input.forEach(function (i) {
                var parameterIndex = parameters.ids.indexOf(i.targetId);
                if (parameterIndex == -1) {
                    return;
                }
                factor = factor.add(i.evaluateFactor(parameters.values[parameterIndex], parameters.minimumValues[parameterIndex], parameters.maximumValues[parameterIndex], parameters.defaultValues[parameterIndex], _this.normalization));
            });
            var a = Physics.degreesToRadians(-factor.angle);
            var xy = new PhysicsVector2(factor.x, factor.y).rotateByRadians(a);
            factor.x = xy.x;
            factor.y = xy.y;
            var factorRadians = a;
            var gravityDirection = Physics
                .radiansToDirection(factorRadians)
                .normalize();
            this.particles.forEach(function (p, i) {
                if (i == 0) {
                    p.position = new PhysicsVector2(factor.x, factor.y);
                    return;
                }
                p.force = gravityDirection.multiplyByScalar(p.acceleration).add(Physics.wind);
                p.lastPosition = p.position;
                var delay = p.delay * deltaTime * 30;
                var direction = p.position.substract(_this.particles[i - 1].position);
                var distance = PhysicsVector2.distance(PhysicsVector2.zero, direction);
                var angle = Physics.directionToDegrees(p.lastGravity, gravityDirection);
                var radians = Physics.degreesToRadians(angle) / Physics.airResistance;
                direction = direction
                    .rotateByRadians(radians)
                    .normalize();
                p.position = _this.particles[i - 1].position.add(direction.multiplyByScalar(distance));
                var velocity = p.velocity.multiplyByScalar(delay);
                var force = p.force
                    .multiplyByScalar(delay)
                    .multiplyByScalar(delay);
                p.position = p.position
                    .add(velocity)
                    .add(force);
                var newDirection = p.position
                    .substract(_this.particles[i - 1].position)
                    .normalize();
                p.position = _this.particles[i - 1].position.add(newDirection.multiplyByScalar(p.radius));
                if (Math.abs(p.position.x) < Physics.movementThreshold) {
                    p.position.x = 0;
                }
                if (delay != 0) {
                    p.velocity = p.position
                        .substract(p.lastPosition)
                        .divideByScalar(delay)
                        .multiplyByScalar(p.mobility);
                }
                else {
                    p.velocity = PhysicsVector2.zero;
                }
                p.force = PhysicsVector2.zero;
                p.lastGravity = gravityDirection;
            });
        };
        PhysicsSubRig.prototype._evaluate = function (target) {
            var _this = this;
            var parameters = target.parameters;
            this.output.forEach(function (o) {
                if (o.particleIndex < 1 || o.particleIndex >= _this.particles.length) {
                    return;
                }
                var parameterIndex = parameters.ids.indexOf(o.targetId);
                if (parameterIndex == -1) {
                    return;
                }
                var translation = _this.particles[o.particleIndex - 1].position.substract(_this.particles[o.particleIndex].position);
                var value = Physics.clampScalar(o.evaluateValue(translation, _this.particles), parameters.minimumValues[parameterIndex], parameters.maximumValues[parameterIndex]);
                var unclampedParameterValue = (parameters.values[parameterIndex] * (1 - o.normalizedWeight)) + (value * o.normalizedWeight);
                parameters.values[parameterIndex] = Physics.clampScalar(unclampedParameterValue, parameters.minimumValues[parameterIndex], parameters.maximumValues[parameterIndex]);
            });
        };
        return PhysicsSubRig;
    }());
    LIVE2DCUBISMFRAMEWORK.PhysicsSubRig = PhysicsSubRig;
    var PhysicsRig = (function () {
        function PhysicsRig(target, timeScale, physics3Json) {
            var _this = this;
            this.timeScale = 1;
            this.timeScale = timeScale;
            this._target = target;
            if (!target) {
                return;
            }
            this._subRigs = new Array();
            physics3Json['PhysicsSettings'].forEach(function (r) {
                var input = new Array();
                r['Input'].forEach(function (i) {
                    var factor = new PhysicsFactorTuple(1, 0, 0);
                    if (i['Type'] == 'Y') {
                        factor.x = 0;
                        factor.y = 1;
                    }
                    else if (i['Type'] == 'Angle') {
                        factor.x = 0;
                        factor.angle = 1;
                    }
                    input.push(new PhysicsInput(i['Source']['Id'], i['Weight'], factor, i['Reflect']));
                });
                var output = new Array();
                r['Output'].forEach(function (o) {
                    var factor = new PhysicsFactorTuple(1, 0, 0);
                    if (o['Type'] == 'Y') {
                        factor.x = 0;
                        factor.y = 1;
                    }
                    else if (o['Type'] == 'Angle') {
                        factor.x = 0;
                        factor.angle = 1;
                    }
                    output.push(new PhysicsOutput(o['Destination']['Id'], o['VertexIndex'], o['Weight'], o['Scale'], factor, o['Reflect']));
                });
                var particles = new Array();
                r['Vertices'].forEach(function (p) {
                    var initialPosition = new PhysicsVector2(p['Position']['X'], p['Position']['Y']);
                    particles.push(new PhysicsParticle(initialPosition, p['Mobility'], p['Delay'], p['Acceleration'], p['Radius']));
                });
                var jsonOptions = r['Normalization'];
                var positionsOption = new PhysicsNormalizationTuple(jsonOptions['Position']['Minimum'], jsonOptions['Position']['Maximum'], jsonOptions['Position']['Default']);
                var anglesOption = new PhysicsNormalizationTuple(jsonOptions['Angle']['Minimum'], jsonOptions['Angle']['Maximum'], jsonOptions['Angle']['Default']);
                var normalization = new PhysicsNormalizationOptions(positionsOption, anglesOption);
                _this._subRigs.push(new PhysicsSubRig(input, output, particles, normalization));
            });
        }
        PhysicsRig.prototype.updateAndEvaluate = function (deltaTime) {
            var _this = this;
            deltaTime *= ((this.timeScale > 0)
                ? this.timeScale
                : 0);
            if (deltaTime > 0.01) {
                this._subRigs.forEach(function (r) {
                    r._update(deltaTime, _this._target);
                });
            }
            this._subRigs.forEach(function (r) {
                r._evaluate(_this._target);
            });
        };
        PhysicsRig._fromPhysics3Json = function (target, timeScale, physics3Json) {
            var rig = new PhysicsRig(target, timeScale, physics3Json);
            return (rig._isValid)
                ? rig
                : null;
        };
        Object.defineProperty(PhysicsRig.prototype, "_isValid", {
            get: function () {
                return this._target != null;
            },
            enumerable: true,
            configurable: true
        });
        return PhysicsRig;
    }());
    LIVE2DCUBISMFRAMEWORK.PhysicsRig = PhysicsRig;
    var PhysicsRigBuilder = (function () {
        function PhysicsRigBuilder() {
            this._timeScale = 1;
        }
        PhysicsRigBuilder.prototype.setTarget = function (value) {
            this._target = value;
            return this;
        };
        PhysicsRigBuilder.prototype.setTimeScale = function (value) {
            this._timeScale = value;
            return this;
        };
        PhysicsRigBuilder.prototype.setPhysics3Json = function (value) {
            this._physics3Json = value;
            return this;
        };
        PhysicsRigBuilder.prototype.build = function () {
            return PhysicsRig._fromPhysics3Json(this._target, this._timeScale, this._physics3Json);
        };
        return PhysicsRigBuilder;
    }());
    LIVE2DCUBISMFRAMEWORK.PhysicsRigBuilder = PhysicsRigBuilder;
    var UserData = (function () {
        function UserData(target, userData3Json) {
            var _this = this;
            this._target = target;
            if (!target) {
                return;
            }
            this._version = userData3Json['Version'];
            this._userDataCount = userData3Json['Meta']['UserDataCount'];
            this._totalUserDataSize = userData3Json['Meta']['TotalUserDataSize'];
            if (userData3Json['UserData'] != null) {
                this._userDataBodys = new Array();
                userData3Json['UserData'].forEach(function (u) {
                    _this._userDataBodys.push(new UserDataBody(u['Target'], u['Id'], u['Value']));
                });
                console.assert(this._userDataBodys.length === this._userDataCount);
            }
        }
        UserData._fromUserData3Json = function (target, userData3Json) {
            var userdata = new UserData(target, userData3Json);
            return (userdata._isValid)
                ? userdata
                : null;
        };
        Object.defineProperty(UserData.prototype, "_isValid", {
            get: function () {
                return this._target != null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UserData.prototype, "userDataCount", {
            get: function () {
                if (this._userDataBodys == null)
                    return 0;
                return this._userDataCount;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UserData.prototype, "totalUserDataSize", {
            get: function () {
                if (this._userDataBodys == null)
                    return 0;
                return this._totalUserDataSize;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UserData.prototype, "userDataBodys", {
            get: function () {
                if (this._userDataBodys == null)
                    return null;
                return this._userDataBodys;
            },
            enumerable: true,
            configurable: true
        });
        UserData.prototype.isExistUserDataById = function (id_) {
            if (this._userDataBodys == null)
                return false;
            for (var _i = 0, _a = this._userDataBodys; _i < _a.length; _i++) {
                var ud = _a[_i];
                if (ud.id === id_)
                    return true;
            }
            return false;
        };
        UserData.prototype.getUserDataValueById = function (id_) {
            if (this._userDataBodys == null)
                return null;
            for (var _i = 0, _a = this._userDataBodys; _i < _a.length; _i++) {
                var ud = _a[_i];
                if (ud.id === id_)
                    return ud.value;
            }
            return null;
        };
        UserData.prototype.getUserDataTargetById = function (id_) {
            if (this._userDataBodys == null)
                return null;
            for (var _i = 0, _a = this._userDataBodys; _i < _a.length; _i++) {
                var ud = _a[_i];
                if (ud.id === id_)
                    return ud.target;
            }
            return null;
        };
        UserData.prototype.getUserDataBodyById = function (id_) {
            if (this._userDataBodys == null)
                return null;
            for (var _i = 0, _a = this._userDataBodys; _i < _a.length; _i++) {
                var ud = _a[_i];
                if (ud.id === id_)
                    return ud;
            }
            return null;
        };
        return UserData;
    }());
    LIVE2DCUBISMFRAMEWORK.UserData = UserData;
    var UserDataBuilder = (function () {
        function UserDataBuilder() {
        }
        UserDataBuilder.prototype.setTarget = function (value) {
            this._target = value;
            return this;
        };
        UserDataBuilder.prototype.setUserData3Json = function (value) {
            return this._userData3Json = value;
        };
        UserDataBuilder.prototype.build = function () {
            return UserData._fromUserData3Json(this._target, this._userData3Json);
        };
        return UserDataBuilder;
    }());
    LIVE2DCUBISMFRAMEWORK.UserDataBuilder = UserDataBuilder;
    var UserDataBody = (function () {
        function UserDataBody(target, id, value) {
            this.target = target;
            this.id = id;
            this.value = value;
        }
        return UserDataBody;
    }());
    LIVE2DCUBISMFRAMEWORK.UserDataBody = UserDataBody;
    var UserDataTargetType;
    (function (UserDataTargetType) {
        UserDataTargetType[UserDataTargetType["UNKNOWN"] = 0] = "UNKNOWN";
        UserDataTargetType[UserDataTargetType["ArtMesh"] = 1] = "ArtMesh";
    })(UserDataTargetType || (UserDataTargetType = {}));
    var Groups = (function () {
        function Groups(model3Json) {
            var _this = this;
            if (typeof (model3Json['Groups']) !== "undefined") {
                this._groupBodys = new Array();
                model3Json['Groups'].forEach(function (u) {
                    _this._groupBodys.push(new GroupBody(u['Target'], u['Name'], u['Ids']));
                });
            }
            else {
                this._groupBodys = null;
            }
        }
        Object.defineProperty(Groups.prototype, "data", {
            get: function () {
                if (this._groupBodys == null)
                    return null;
                return this._groupBodys;
            },
            enumerable: true,
            configurable: true
        });
        Groups.fromModel3Json = function (model3Json) {
            return new Groups(model3Json);
        };
        Groups.prototype.getGroupById = function (targetId) {
            if (this._groupBodys != null) {
                for (var _i = 0, _a = this._groupBodys; _i < _a.length; _i++) {
                    var body = _a[_i];
                    if (body.name === targetId)
                        return body;
                }
            }
            return null;
        };
        return Groups;
    }());
    LIVE2DCUBISMFRAMEWORK.Groups = Groups;
    var GroupBody = (function () {
        function GroupBody(target, name, ids) {
            this.target = target;
            this.name = name;
            this.ids = ids;
        }
        return GroupBody;
    }());
    LIVE2DCUBISMFRAMEWORK.GroupBody = GroupBody;
})(LIVE2DCUBISMFRAMEWORK || (LIVE2DCUBISMFRAMEWORK = {}));
