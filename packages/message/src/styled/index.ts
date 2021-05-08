import styled, { css, keyframes } from 'styled-components';

import { AiOutlineLoading } from 'react-icons/ai'

/**
 * 旋转动画
 */
const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

/**
 * 落下
 */
const fallMessage = keyframes`
    from {
        transform: translateY(-50px);
        opacity: .2;
    }

    to {
        transform: translateY(0px);
        opacity: 1;
    }
`

/**
 * 收起
 */
const closeMessage = keyframes`
    from {
        opacity: 1;
        transform: translateY(0px);
    }
    to {
        opacity: .2;
        transform: translateY(-50px);
    }
`

export const ContainerStyled = styled.div.attrs(props => {
})`
    width: 100%;
    display: flex;
    justify-content: center;
    animation: ${props => {
        if (props.animation) {
            return props.animation === 'show' ? css`${fallMessage} .2s`: css`${closeMessage} .2s`
        }
        return 'unset';
    }} ;
    animation-fill-mode: forwards;
`;

export const ContentStyled = styled.div.attrs((props) => {
})`
    display: flex;
    align-items: center;
    position: relative;
    box-shadow: 0 3px 6px -4px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%), 0 9px 28px 8px rgb(0 0 0 / 5%);
    background: #fff;
    padding: 8px 25px 8px 20px;
    font-size: 14px;
    line-height: 1.5715;
`;

const getIconColor = (type: string) => {
    if (type === 'info' || type === 'loading') {
        return '#1890ff';
    } else if (type === 'warn') {
        return '#faad14';
    } else if (type === 'error') {
        return '#ff4d4f';
    } else if (type === 'success') {
        return '#52c41a';
    }
    return 'unset';
}

export const IconStyled = css`
    display: flex;
    align-items: center;
    padding-right: .5em;
    > svg {
        height: 16px;
        width: 16px;
        color: ${(props: any) => getIconColor(props.type)};
        animation: ${rotate} ${(props: any) => props.type === 'loading' ? '.9s' : '0s' } linear infinite;
    }
`;
export const StateIconStyled = styled.i.attrs(props => {
})`
    ${IconStyled}
`

// 关闭的icon信息
export const CloseIconStyled = styled.i.attrs(props => {
})`
    ${IconStyled}
    cursor: pointer;
    margin-left: 1em;
    opacity: .5;
    position: absolute;
    right: 0px;
    visibility: ${props => props.isHover ? 'visible' : 'hidden'};
`;
