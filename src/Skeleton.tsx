import * as React from "react";
import { Animated, StyleSheet, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import {
  DEFAULT_ANIMATION_TYPE,
  DEFAULT_ANIMATION_DIRECTION,
  DEFAULT_BONE_COLOR,
  DEFAULT_BORDER_RADIUS,
  DEFAULT_EASING,
  DEFAULT_DURATION,
  DEFAULT_HIGHLIGHT_COLOR,
  DEFAULT_INTENSITY,
  DEFAULT_LOADING
} from "./Constants";
import {
  ISkeletonProps,
  IState,
  IDirection,
  CustomViewStyle
} from "./Constants";

const styles = StyleSheet.create({
  absoluteGradient: {
    height: "100%",
    position: "absolute",
    width: "100%"
  },
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center"
  },
  gradientChild: {
    flex: 1
  }
});

const getInitialState = ({
  isLoading,
  layout
}: ISkeletonProps): IState => ({
  isLoading,
  layout: layout!
});

const getDefaultProps = (): ISkeletonProps => ({
  containerStyle: styles.container,
  easing: DEFAULT_EASING,
  duration: DEFAULT_DURATION,
  layout: [],
  animationType: DEFAULT_ANIMATION_TYPE,
  animationDirection: DEFAULT_ANIMATION_DIRECTION,
  isLoading: DEFAULT_LOADING,
  boneColor: DEFAULT_BONE_COLOR,
  highlightColor: DEFAULT_HIGHLIGHT_COLOR,
  intensity: DEFAULT_INTENSITY
});

export default class Skeleton extends React.Component<
  ISkeletonProps,
  IState
> {
  static defaultProps = getDefaultProps();
  state = getInitialState(this.props);

  animationPulse = new Animated.Value(0);
  animationShiver = new Animated.Value(0);
  interpolatedBackgroundColor = this.animationPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [this.props.boneColor!, this.props.highlightColor!]
  });

  getGradientStartDirection = (): IDirection => {
    let direction: IDirection = { x: 0, y: 0 };
    if (this.props.animationType === "shiver") {
      if (
        this.props.animationDirection === "horizontalLeft" ||
        this.props.animationDirection === "horizontalRight" ||
        this.props.animationDirection === "verticalTop" ||
        this.props.animationDirection === "verticalDown" ||
        this.props.animationDirection === "diagonalDownRight"
      ) {
        direction = { x: 0, y: 0 };
      } else if (this.props.animationDirection === "diagonalTopLeft") {
        direction = { x: 1, y: 1 };
      } else if (this.props.animationDirection === "diagonalTopRight") {
        direction = { x: 0, y: 1 };
      } else {
        // diagonalDownLeft
        direction = { x: 1, y: 0 };
      }
    }
    return direction;
  };

  getGradientEndDirection = (): IDirection => {
    let direction = { x: 0, y: 0 };
    if (this.props.animationType === "shiver") {
      if (
        this.props.animationDirection === "horizontalLeft" ||
        this.props.animationDirection === "horizontalRight" ||
        this.props.animationDirection === "diagonalTopRight"
      ) {
        direction = { x: 1, y: 0 };
      } else if (
        this.props.animationDirection === "verticalTop" ||
        this.props.animationDirection === "verticalDown" ||
        this.props.animationDirection === "diagonalDownLeft"
      ) {
        direction = { x: 0, y: 1 };
      } else if (this.props.animationDirection === "diagonalTopLeft") {
        direction = { x: 0, y: 0 };
      } else {
        // diagonalDownRight
        direction = { x: 1, y: 1 };
      }
    }
    return direction;
  };

  gradientStart = this.getGradientStartDirection();
  gradientEnd = this.getGradientEndDirection();

  static getDerivedStateFromProps(
    nextProps: ISkeletonProps,
    prevState: IState
  ) {
    if (
      nextProps.isLoading !== prevState.isLoading ||
      nextProps.layout !== prevState.layout
    ) {
      return { isLoading: nextProps.isLoading, layout: nextProps.layout };
    } else {
      return null;
    }
  }

  componentDidUpdate() {
    if (this.state.isLoading) {
      this.playAnimation();
    }
  }

  playAnimation = () => {
    if (this.props.animationType === "pulse") {
      Animated.loop(
        Animated.sequence([
          Animated.timing(this.animationPulse, {
            toValue: 1,
            duration: this.props.duration! / 2,
            easing: this.props.easing,
            delay: this.props.duration
          }),
          Animated.timing(this.animationPulse, {
            toValue: 0,
            easing: this.props.easing,
            duration: this.props.duration! / 2
          })
        ])
      ).start();
    } else {
      Animated.loop(
        Animated.timing(this.animationShiver, {
          toValue: 1,
          duration: this.props.duration,
          easing: this.props.easing
        })
      ).start();
    }
  };

  getBoneStyles = (boneLayout: CustomViewStyle): CustomViewStyle => {
    const boneStyle: CustomViewStyle = {
      width: boneLayout.width || 0,
      height: boneLayout.height || 0,
      borderRadius: boneLayout.borderRadius || DEFAULT_BORDER_RADIUS,
      ...boneLayout
    };
    if (this.props.animationType === "pulse") {
      boneStyle.backgroundColor = this.interpolatedBackgroundColor;
    } else {
      boneStyle.overflow = "hidden";
      boneStyle.backgroundColor =
        boneLayout.backgroundColor || this.props.boneColor;
    }
    return boneStyle;
  };

  getGradientTransform = (boneLayout: CustomViewStyle): object => {
    let transform = {};
    const interpolatedPosition = this.animationShiver.interpolate({
      inputRange: [0, 1],
      outputRange: this.getPositionRange(boneLayout)
    });
    if (
      this.props.animationDirection !== "verticalTop" &&
      this.props.animationDirection !== "verticalDown"
    ) {
      transform = { translateX: interpolatedPosition };
    } else {
      transform = { translateY: interpolatedPosition };
    }
    return transform;
  };

  getPositionRange = (boneLayout: CustomViewStyle): number[] => {
    const outputRange: number[] = [];
    const boneWidth = boneLayout.width || 0;
    const boneHeight = boneLayout.height || 0;

    if (
      this.props.animationDirection === "horizontalRight" ||
      this.props.animationDirection === "diagonalDownRight" ||
      this.props.animationDirection === "diagonalTopRight"
    ) {
      outputRange.push(-boneWidth, +boneWidth);
    } else if (
      this.props.animationDirection === "horizontalLeft" ||
      this.props.animationDirection === "diagonalDownLeft" ||
      this.props.animationDirection === "diagonalTopLeft"
    ) {
      outputRange.push(+boneWidth, -boneWidth);
    } else if (this.props.animationDirection === "verticalDown") {
      outputRange.push(-boneHeight, +boneHeight);
    } else {
      // verticalTop
      outputRange.push(+boneHeight, -boneHeight);
    }
    return outputRange;
  };

  getBoneContainer = (layoutStyle: CustomViewStyle, children: JSX.Element[], key: string) => (
    <View key={layoutStyle.key || key} style={layoutStyle}>
        {children}
    </View>
);

  getStaticBone = (layoutStyle: CustomViewStyle, key: string | number): JSX.Element => (
    <Animated.View key={layoutStyle.key || key} style={this.getBoneStyles(layoutStyle)} />
  );

  getShiverBone = (layoutStyle: CustomViewStyle, key: string | number): JSX.Element => (
    <View key={layoutStyle.key || key} style={this.getBoneStyles(layoutStyle)}>
      <Animated.View
        style={[
          styles.absoluteGradient,
          {
            transform: [this.getGradientTransform(layoutStyle)]
          }
        ]}
      >
        <LinearGradient
          colors={[
            this.props.boneColor!,
            this.props.highlightColor!,
            this.props.boneColor!
          ]}
          start={this.gradientStart}
          end={this.gradientEnd}
          style={styles.gradientChild}
        />
      </Animated.View>
    </View>
  );

  getBones = (layout: CustomViewStyle[], children: any, prefix = ''): JSX.Element[] => {
    if (layout.length > 0) {
      const iterator: number[] = new Array(layout.length);
      for (let i = 0; i < layout.length; i++) {
        iterator[i] = 0;
      }
      return iterator.map((_, i) => {
        if (layout[i].children && layout[i].children.length > 0) {
          const containerPrefix = layout[i].key || `bone_container_${i}`;
          return this.getBoneContainer(layout[i], this.getBones(layout[i].children, [], containerPrefix), containerPrefix);
        } else {
          if (
            this.props.animationType === "pulse" ||
            this.props.animationType === "none"
          ) {
            return this.getStaticBone(layout[i], prefix ? `${prefix}_${i}` : i);
          } else {
            return this.getShiverBone(layout[i], prefix ? `${prefix}_${i}` : i);
          }
        }
      });
    } else {
      return React.Children.map(children, (child, i) => {
        const styling = child.props.style || {};
        if (
          this.props.animationType === "pulse" ||
          this.props.animationType === "none"
        ) {
          return this.getStaticBone(styling, i);
        } else {
          return this.getShiverBone(styling, i);
        }
      });
    }
  };

  renderLayout = (
    isLoading: boolean,
    bones: JSX.Element[],
    children: any
  ): JSX.Element[] => (isLoading ? bones : children);

  render() {
    const { isLoading, layout } = this.state;
    const { children } = this.props;
    const bones = this.getBones(layout, children);

    return (
      <View style={this.props.containerStyle}>
        {this.renderLayout(isLoading, bones, children)}
      </View>
    );
  }
}
