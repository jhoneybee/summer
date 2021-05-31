import styled, { keyframes } from 'styled-components';
import { AiOutlineLoading } from 'react-icons/ai'
import { DefaultTheme } from '@jhonebee/theme';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

export const Loading = styled(AiOutlineLoading)`
  display: inline-block;
  animation: ${rotate} .9s linear infinite;
`

export const IconStyled = styled.div`
    display: inline-block;
    margin-right: 8px;
    width: 16px;
`

export const TreeNodeStyled = styled.div.attrs(props => {
})`
    display: inline-flex;
    cursor: pointer;
    height: 25px;
    align-items: center;
    width: ${props => `calc(100% - ${(props.level * 2) + .2}em)`};
    margin-left: ${props => `${(props.level * 2) + .2}em`};
    border-bottom: ${props => props.dropState === 'bottom' ? `1px solid ${props.theme.colorPrimary}` : 'unset'};
    border-top: ${props => props.dropState === 'top' ? `1px solid ${props.theme.colorPrimary}` : 'unset'};
    :hover {
        background-color: #f5f5f5;
    };
`

TreeNodeStyled.defaultProps = {
    theme: DefaultTheme
}


