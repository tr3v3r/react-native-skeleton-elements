"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_native_1 = require("react-native");
var react_native_linear_gradient_1 = require("react-native-linear-gradient");
var memo = React.memo, useMemo = React.useMemo, useCallback = React.useCallback, useEffect = React.useEffect;
var Constants_1 = require("./Constants");
var styles = react_native_1.StyleSheet.create({
    absoluteGradient: {
        height: '100%',
        position: 'absolute',
        width: '100%',
    },
    container: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    gradientChild: {
        flex: 1,
    },
});
exports.Skeleton = memo(function (_a) {
    var _b = _a.containerStyle, containerStyle = _b === void 0 ? styles.container : _b, _c = _a.easing, easing = _c === void 0 ? Constants_1.DEFAULT_EASING : _c, _d = _a.duration, duration = _d === void 0 ? Constants_1.DEFAULT_DURATION : _d, _e = _a.layout, layout = _e === void 0 ? [] : _e, _f = _a.animationType, animationType = _f === void 0 ? Constants_1.DEFAULT_ANIMATION_TYPE : _f, _g = _a.animationDirection, animationDirection = _g === void 0 ? Constants_1.DEFAULT_ANIMATION_DIRECTION : _g, _h = _a.isLoading, isLoading = _h === void 0 ? Constants_1.DEFAULT_LOADING : _h, _j = _a.boneColor, boneColor = _j === void 0 ? Constants_1.DEFAULT_BONE_COLOR : _j, _k = _a.highlightColor, highlightColor = _k === void 0 ? Constants_1.DEFAULT_HIGHLIGHT_COLOR : _k, children = _a.children;
    var _l = useMemo(function () { return [new react_native_1.Animated.Value(0), new react_native_1.Animated.Value(0)]; }, []), animationPulse = _l[0], animationShiver = _l[1];
    var interpolatedBackgroundColor = useMemo(function () {
        return animationPulse.interpolate({
            inputRange: [0, 1],
            outputRange: [boneColor, highlightColor],
        });
    }, [animationPulse, boneColor, highlightColor]);
    var gradientStart = useMemo(function () {
        var direction = { x: 0, y: 0 };
        if (animationType === 'shiver') {
            if (animationDirection === 'horizontalLeft' ||
                animationDirection === 'horizontalRight' ||
                animationDirection === 'verticalTop' ||
                animationDirection === 'verticalDown' ||
                animationDirection === 'diagonalDownRight') {
                direction = { x: 0, y: 0 };
            }
            else if (animationDirection === 'diagonalTopLeft') {
                direction = { x: 1, y: 1 };
            }
            else if (animationDirection === 'diagonalTopRight') {
                direction = { x: 0, y: 1 };
            }
            else {
                // diagonalDownLeft
                direction = { x: 1, y: 0 };
            }
        }
        return direction;
    }, [animationDirection, animationType]);
    var gradientEnd = useMemo(function () {
        var direction = { x: 0, y: 0 };
        if (animationType === 'shiver') {
            if (animationDirection === 'horizontalLeft' ||
                animationDirection === 'horizontalRight' ||
                animationDirection === 'diagonalTopRight') {
                direction = { x: 1, y: 0 };
            }
            else if (animationDirection === 'verticalTop' ||
                animationDirection === 'verticalDown' ||
                animationDirection === 'diagonalDownLeft') {
                direction = { x: 0, y: 1 };
            }
            else if (animationDirection === 'diagonalTopLeft') {
                direction = { x: 0, y: 0 };
            }
            else {
                // diagonalDownRight
                direction = { x: 1, y: 1 };
            }
        }
        return direction;
    }, [animationDirection, animationType]);
    var playAnimation = useCallback(function () {
        if (animationType === 'pulse') {
            react_native_1.Animated.loop(react_native_1.Animated.sequence([
                react_native_1.Animated.timing(animationPulse, {
                    toValue: 1,
                    duration: duration / 2,
                    easing: easing,
                    delay: duration,
                    useNativeDriver: false,
                }),
                react_native_1.Animated.timing(animationPulse, {
                    toValue: 0,
                    easing: easing,
                    duration: duration / 2,
                    useNativeDriver: false,
                }),
            ])).start();
        }
        else {
            react_native_1.Animated.loop(react_native_1.Animated.timing(animationShiver, {
                toValue: 1,
                duration: duration,
                easing: easing,
                useNativeDriver: true,
            })).start();
        }
    }, [animationPulse, animationShiver, animationType, duration, easing]);
    useEffect(function () {
        if (isLoading) {
            playAnimation();
        }
    }, [isLoading, playAnimation]);
    var getBoneStyles = useCallback(function (boneLayout) {
        var boneStyle = __assign({ width: boneLayout.width || 0, height: boneLayout.height || 0, borderRadius: boneLayout.borderRadius || Constants_1.DEFAULT_BORDER_RADIUS }, boneLayout);
        if (animationType === 'pulse') {
            boneStyle.backgroundColor = interpolatedBackgroundColor;
        }
        else {
            boneStyle.overflow = 'hidden';
            boneStyle.backgroundColor = boneLayout.backgroundColor || boneColor;
        }
        return boneStyle;
    }, [animationType, boneColor, interpolatedBackgroundColor]);
    var getPositionRange = useCallback(function (boneLayout) {
        var outputRange = [];
        var boneWidth = boneLayout.width || 0;
        var boneHeight = boneLayout.height || 0;
        if (animationDirection === 'horizontalRight' ||
            animationDirection === 'diagonalDownRight' ||
            animationDirection === 'diagonalTopRight') {
            outputRange.push(-boneWidth, +boneWidth);
        }
        else if (animationDirection === 'horizontalLeft' ||
            animationDirection === 'diagonalDownLeft' ||
            animationDirection === 'diagonalTopLeft') {
            outputRange.push(+boneWidth, -boneWidth);
        }
        else if (animationDirection === 'verticalDown') {
            outputRange.push(-boneHeight, +boneHeight);
        }
        else {
            // verticalTop
            outputRange.push(+boneHeight, -boneHeight);
        }
        return outputRange;
    }, [animationDirection]);
    var getGradientTransform = useCallback(function (boneLayout) {
        var transform = {};
        var interpolatedPosition = animationShiver.interpolate({
            inputRange: [0, 1],
            outputRange: getPositionRange(boneLayout),
        });
        if (animationDirection !== 'verticalTop' &&
            animationDirection !== 'verticalDown') {
            transform = { translateX: interpolatedPosition };
        }
        else {
            transform = { translateY: interpolatedPosition };
        }
        return transform;
    }, [animationDirection, animationShiver, getPositionRange]);
    var getBoneContainer = useCallback(function (layoutStyle, children, key) { return (<react_native_1.View key={layoutStyle.key || key} style={layoutStyle}>
          {children}
        </react_native_1.View>); }, []);
    var getStaticBone = useCallback(function (layoutStyle, key) { return (<react_native_1.Animated.View key={layoutStyle.key || key} style={getBoneStyles(layoutStyle)}/>); }, [getBoneStyles]);
    var getShiverBone = useCallback(function (layoutStyle, key) { return (<react_native_1.View key={layoutStyle.key || key} style={getBoneStyles(layoutStyle)}>
          <react_native_1.Animated.View style={[
        styles.absoluteGradient,
        {
            transform: [getGradientTransform(layoutStyle)],
        },
    ]}>
            <react_native_linear_gradient_1.default colors={[boneColor, highlightColor, boneColor]} start={gradientStart} end={gradientEnd} style={styles.gradientChild}/>
          </react_native_1.Animated.View>
        </react_native_1.View>); }, [
        boneColor,
        getBoneStyles,
        getGradientTransform,
        gradientEnd,
        gradientStart,
        highlightColor,
    ]);
    var getBones = useCallback(function (layout, children, prefix) {
        if (prefix === void 0) { prefix = ''; }
        if (layout.length > 0) {
            var iterator = new Array(layout.length);
            for (var i = 0; i < layout.length; i++) {
                iterator[i] = 0;
            }
            return iterator.map(function (_, i) {
                if (layout[i].children && layout[i].children.length > 0) {
                    var containerPrefix = layout[i].key || "bone_container_" + i;
                    return getBoneContainer(layout[i], getBones(layout[i].children, [], containerPrefix), containerPrefix);
                }
                else {
                    if (animationType === 'pulse' || animationType === 'none') {
                        return getStaticBone(layout[i], prefix ? prefix + "_" + i : i);
                    }
                    else {
                        return getShiverBone(layout[i], prefix ? prefix + "_" + i : i);
                    }
                }
            });
        }
        else {
            return React.Children.map(children, function (child, i) {
                var styling = child.props.style || {};
                if (animationType === 'pulse' || animationType === 'none') {
                    return getStaticBone(styling, i);
                }
                else {
                    return getShiverBone(styling, i);
                }
            });
        }
    }, [animationType, getBoneContainer, getShiverBone, getStaticBone]);
    var bones = getBones(layout, children);
    return <react_native_1.View style={containerStyle}>{isLoading ? bones : children}</react_native_1.View>;
});
exports.default = exports.Skeleton;
