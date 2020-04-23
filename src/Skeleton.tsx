import React, { memo, useMemo, useCallback, useEffect } from 'react'
import { Animated, StyleSheet, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import {
  DEFAULT_ANIMATION_TYPE,
  DEFAULT_ANIMATION_DIRECTION,
  DEFAULT_BONE_COLOR,
  DEFAULT_BORDER_RADIUS,
  DEFAULT_EASING,
  DEFAULT_DURATION,
  DEFAULT_HIGHLIGHT_COLOR,
  DEFAULT_LOADING,
  ISkeletonProps,
  IDirection,
  CustomViewStyle,
} from './Constants'

const styles = StyleSheet.create({
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
})

export const Skeleton = memo(
  ({
    containerStyle = styles.container,
    easing = DEFAULT_EASING,
    duration = DEFAULT_DURATION,
    layout = [],
    animationType = DEFAULT_ANIMATION_TYPE,
    animationDirection = DEFAULT_ANIMATION_DIRECTION,
    isLoading = DEFAULT_LOADING,
    boneColor = DEFAULT_BONE_COLOR,
    highlightColor = DEFAULT_HIGHLIGHT_COLOR,
    children,
  }: ISkeletonProps) => {
    const [animationPulse, animationShiver] = useMemo(
      () => [new Animated.Value(0), new Animated.Value(0)],
      [],
    )

    const interpolatedBackgroundColor = useMemo(
      () =>
        animationPulse.interpolate({
          inputRange: [0, 1],
          outputRange: [boneColor!, highlightColor!],
        }),
      [animationPulse, boneColor, highlightColor],
    )

    const gradientStart = useMemo((): IDirection => {
      let direction: IDirection = { x: 0, y: 0 }
      if (animationType === 'shiver') {
        if (
          animationDirection === 'horizontalLeft' ||
          animationDirection === 'horizontalRight' ||
          animationDirection === 'verticalTop' ||
          animationDirection === 'verticalDown' ||
          animationDirection === 'diagonalDownRight'
        ) {
          direction = { x: 0, y: 0 }
        } else if (animationDirection === 'diagonalTopLeft') {
          direction = { x: 1, y: 1 }
        } else if (animationDirection === 'diagonalTopRight') {
          direction = { x: 0, y: 1 }
        } else {
          // diagonalDownLeft
          direction = { x: 1, y: 0 }
        }
      }
      return direction
    }, [animationDirection, animationType])

    const gradientEnd = useMemo((): IDirection => {
      let direction = { x: 0, y: 0 }
      if (animationType === 'shiver') {
        if (
          animationDirection === 'horizontalLeft' ||
          animationDirection === 'horizontalRight' ||
          animationDirection === 'diagonalTopRight'
        ) {
          direction = { x: 1, y: 0 }
        } else if (
          animationDirection === 'verticalTop' ||
          animationDirection === 'verticalDown' ||
          animationDirection === 'diagonalDownLeft'
        ) {
          direction = { x: 0, y: 1 }
        } else if (animationDirection === 'diagonalTopLeft') {
          direction = { x: 0, y: 0 }
        } else {
          // diagonalDownRight
          direction = { x: 1, y: 1 }
        }
      }
      return direction
    }, [animationDirection, animationType])

    const playAnimation = useCallback(() => {
      if (animationType === 'pulse') {
        Animated.loop(
          Animated.sequence([
            Animated.timing(animationPulse, {
              toValue: 1,
              duration: duration! / 2,
              easing,
              delay: duration,
              useNativeDriver: false,
            }),
            Animated.timing(animationPulse, {
              toValue: 0,
              easing,
              duration: duration! / 2,
              useNativeDriver: false,
            }),
          ]),
        ).start()
      } else {
        Animated.loop(
          Animated.timing(animationShiver, {
            toValue: 1,
            duration,
            easing,
            useNativeDriver: true,
          }),
        ).start()
      }
    }, [animationPulse, animationShiver, animationType, duration, easing])

    useEffect(() => {
      if (isLoading) {
        playAnimation()
      }
    }, [isLoading, playAnimation])

    const getBoneStyles = useCallback(
      (boneLayout: CustomViewStyle): CustomViewStyle => {
        const boneStyle: CustomViewStyle = {
          width: boneLayout.width || 0,
          height: boneLayout.height || 0,
          borderRadius: boneLayout.borderRadius || DEFAULT_BORDER_RADIUS,
          ...boneLayout,
        }
        if (animationType === 'pulse') {
          boneStyle.backgroundColor = interpolatedBackgroundColor
        } else {
          boneStyle.overflow = 'hidden'
          boneStyle.backgroundColor = boneLayout.backgroundColor || boneColor
        }
        return boneStyle
      },
      [animationType, boneColor, interpolatedBackgroundColor],
    )

    const getPositionRange = useCallback(
      (boneLayout: CustomViewStyle): number[] => {
        const outputRange: number[] = []
        const boneWidth = boneLayout.width || 0
        const boneHeight = boneLayout.height || 0

        if (
          animationDirection === 'horizontalRight' ||
          animationDirection === 'diagonalDownRight' ||
          animationDirection === 'diagonalTopRight'
        ) {
          outputRange.push(-boneWidth, +boneWidth)
        } else if (
          animationDirection === 'horizontalLeft' ||
          animationDirection === 'diagonalDownLeft' ||
          animationDirection === 'diagonalTopLeft'
        ) {
          outputRange.push(+boneWidth, -boneWidth)
        } else if (animationDirection === 'verticalDown') {
          outputRange.push(-boneHeight, +boneHeight)
        } else {
          // verticalTop
          outputRange.push(+boneHeight, -boneHeight)
        }
        return outputRange
      },
      [animationDirection],
    )

    const getGradientTransform = useCallback(
      (boneLayout: CustomViewStyle): object => {
        let transform = {}
        const interpolatedPosition = animationShiver.interpolate({
          inputRange: [0, 1],
          outputRange: getPositionRange(boneLayout),
        })
        if (
          animationDirection !== 'verticalTop' &&
          animationDirection !== 'verticalDown'
        ) {
          transform = { translateX: interpolatedPosition }
        } else {
          transform = { translateY: interpolatedPosition }
        }
        return transform
      },
      [animationDirection, animationShiver, getPositionRange],
    )

    const getBoneContainer = useCallback(
      (layoutStyle: CustomViewStyle, children: JSX.Element[], key: string) => (
        <View key={layoutStyle.key || key} style={layoutStyle}>
          {children}
        </View>
      ),
      [],
    )

    const getStaticBone = useCallback(
      (layoutStyle: CustomViewStyle, key: string | number): JSX.Element => (
        <Animated.View
          key={layoutStyle.key || key}
          style={getBoneStyles(layoutStyle)}
        />
      ),
      [getBoneStyles],
    )

    const getShiverBone = useCallback(
      (layoutStyle: CustomViewStyle, key: string | number): JSX.Element => (
        <View key={layoutStyle.key || key} style={getBoneStyles(layoutStyle)}>
          <Animated.View
            style={[
              styles.absoluteGradient,
              {
                transform: [getGradientTransform(layoutStyle)],
              },
            ]}
          >
            <LinearGradient
              colors={[boneColor!, highlightColor!, boneColor!]}
              start={gradientStart}
              end={gradientEnd}
              style={styles.gradientChild}
            />
          </Animated.View>
        </View>
      ),
      [
        boneColor,
        getBoneStyles,
        getGradientTransform,
        gradientEnd,
        gradientStart,
        highlightColor,
      ],
    )

    const getBones = useCallback(
      (
        layout: CustomViewStyle[],
        children: any,
        prefix = '',
      ): JSX.Element[] => {
        if (layout.length > 0) {
          const iterator: number[] = new Array(layout.length)
          for (let i = 0; i < layout.length; i++) {
            iterator[i] = 0
          }
          return iterator.map((_, i) => {
            if (layout[i].children && layout[i].children.length > 0) {
              const containerPrefix = layout[i].key || `bone_container_${i}`
              return getBoneContainer(
                layout[i],
                getBones(layout[i].children, [], containerPrefix),
                containerPrefix,
              )
            } else {
              if (animationType === 'pulse' || animationType === 'none') {
                return getStaticBone(layout[i], prefix ? `${prefix}_${i}` : i)
              } else {
                return getShiverBone(layout[i], prefix ? `${prefix}_${i}` : i)
              }
            }
          })
        } else {
          return React.Children.map(children, (child, i) => {
            const styling = child.props.style || {}
            if (animationType === 'pulse' || animationType === 'none') {
              return getStaticBone(styling, i)
            } else {
              return getShiverBone(styling, i)
            }
          })
        }
      },
      [animationType, getBoneContainer, getShiverBone, getStaticBone],
    )

    const bones = getBones(layout, children)

    return <View style={containerStyle}>{isLoading ? bones : children}</View>
  },
)

export default Skeleton
