import * as CSS from 'csstype';

export type ThemeType = {
    
    /** 主色调 */
    's-color-primary': CSS.Property.Color
    
    /** 默认颜色 */
    's-color-default': CSS.Property.Color
    
    /** 危险颜色 */
    's-color-danger': CSS.Property.Color

}

/**
 * 默认主题信息
 */
export const DefaultTheme: ThemeType  = {
    's-color-primary': '#1890ff',
    's-color-danger': '#ff4d4f',
    's-color-default': '#fff'
}
 
