import { css } from 'styled-components';


// 主颜色
export const primaryColor = (props: any) => '#6002ee';

// 危险的颜色
export const dangerColor = (props: any) => '#ff4d4f';

// 字体的颜色
export const fontColor = (props: any) => 'rgba(0,0,0,.85)';
export const fontDeepColor = (props: any) => 'rgba(255,255,255,.85)';


export const borderDefaultStyle = (props: any) => '1px solid #d3d3d3';
export const borderRadiusStyle = (props: any) => '2px';

// 禁用的css
export const disabled = css`
    color: rgba(0, 0, 0, 0.2);
    background-color: rgba(0, 0, 0, 0.1);
    cursor: default;
    pointer-events: none;
`;
