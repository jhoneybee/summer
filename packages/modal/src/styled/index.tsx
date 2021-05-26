import styled, { keyframes } from 'styled-components';
import {
    AiOutlineClose
} from 'react-icons/ai';


export const RootStyled = styled.div.attrs(props => {
})`
    display: ${props => props.visible ? 'block' : 'none'};
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    
`

const ModalMaskAnimation = keyframes`
    from {
        opacity: 0.1;
    }

    to {
        opacity: 1;
    }
`


/** 遮挡框, 也就是弹出框的背景信息 */
export const MaskStyled = styled.div.attrs(props => {
})`
    display: ${props => props.visible ? 'block' : 'none'};
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    height: 100%;
    z-index: 1000;
    background-color: rgba(0,0,0,.45);
`


/** 弹出框的主体部分 */
export const ModalStyled = styled.div.attrs(props => {
})`
    display: ${props => props.visible ? 'block' : 'none'};
    position: relative;
    z-index: 1001;
    width: 520px;
    top: 100px;
    margin: 0 auto;
    background-color: #fff;
    transition: display .5s;
    box-shadow: 0 3px 6px -4px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%), 0 9px 28px 8px rgb(0 0 0 / 5%);
`

/** 弹出框的主题 Header 头部信息 */
export const ModalHeader = styled.div.attrs(props => {
})`
    display: flex;
    width: 100%;
    height: 3em;
    align-items: center;
    padding-left: 1.5em;
    border-radius: 2px;
    border-bottom: 1px solid #f0f0f0;
`

/** 弹出框的 title 信息 */
export const ModalTitle = styled.span`
    width: calc(100% - 55px);
`

/** 弹出框的 body 信息 */
export const ModalBody = styled.div`
    margin: 1em;
    min-height: 200px;
`

/** 弹出框的底部信息 */
export const ModalFooter = styled.div`
    display: flex;
    justify-content: flex-end;
    border-top: 1px solid #f0f0f0;
    padding: .6em;
`

/** 关闭的按钮图标 */
export const CloseIconStyled = styled(AiOutlineClose)`
    cursor: pointer;
    width: 55px;
`