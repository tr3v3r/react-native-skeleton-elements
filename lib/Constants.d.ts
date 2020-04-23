import * as React from 'react';
import { EasingFunction, ViewStyle } from 'react-native';
declare type animationType = 'none' | 'shiver' | 'pulse';
declare type animationDirection = 'horizontalLeft' | 'horizontalRight' | 'verticalTop' | 'verticalDown' | 'diagonalDownLeft' | 'diagonalDownRight' | 'diagonalTopLeft' | 'diagonalTopRight';
export declare type CustomViewStyle = any;
export interface ISkeletonProps {
    isLoading: boolean;
    layout?: CustomViewStyle[];
    duration?: number;
    containerStyle?: ViewStyle;
    animationType?: 'none' | 'shiver' | 'pulse';
    animationDirection?: 'horizontalLeft' | 'horizontalRight' | 'verticalTop' | 'verticalDown' | 'diagonalDownLeft' | 'diagonalDownRight' | 'diagonalTopLeft' | 'diagonalTopRight';
    boneColor?: string;
    intensity?: number;
    highlightColor?: string;
    easing?: EasingFunction;
    children: React.ReactNode;
}
export interface IState {
    isLoading: boolean;
    layout: CustomViewStyle[];
}
export interface IDirection {
    x: number;
    y: number;
}
export declare const DEFAULT_BORDER_RADIUS: number;
export declare const DEFAULT_DURATION: number;
export declare const DEFAULT_ANIMATION_TYPE: animationType;
export declare const DEFAULT_ANIMATION_DIRECTION: animationDirection;
export declare const DEFAULT_BONE_COLOR: string;
export declare const DEFAULT_HIGHLIGHT_COLOR: string;
export declare const DEFAULT_EASING: any;
export declare const DEFAULT_LOADING = true;
export {};
