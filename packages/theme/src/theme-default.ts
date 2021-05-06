import * as CSS from 'csstype';

export type ThemeType = {
    
    /** 主色调 */
    colorPrimary: CSS.Property.Color
    
    /** 默认颜色 */
    colorDefault: CSS.Property.Color
    
    /** 危险颜色 */
    colorDanger: CSS.Property.Color
}

/**
 * 默认主题信息
 */
export const DefaultTheme: ThemeType  = {
    colorPrimary: '#6002ee',
    colorDanger: '#ff4d4f',
    colorDefault: '#fff'
}
 
