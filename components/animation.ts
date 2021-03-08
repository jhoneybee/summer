import { keyframes } from 'styled-components';


/**
 * 旋转动画
 */
export const rotate = keyframes`
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
export const fallMessage = keyframes`
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
export const closeMessage = keyframes`
    from {
        opacity: 1;
        transform: translateY(0px);
    }
    to {
        opacity: .2;
        transform: translateY(-50px);
    }
`