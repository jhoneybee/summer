import React, {
    cloneElement,
    HTMLAttributes,
    isValidElement,
    ReactNode,
    useEffect,
    useRef
} from 'react';
import { FixedSizeList as List, ListOnScrollProps } from 'react-window';
import styled from 'styled-components';

const MenuItemStyled = styled.li.attrs(props => {
})`
    cursor: ${props => props.disabled ? 'default': 'pointer'};
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    padding: 5px 12px;
    pointer-events: ${props => props.disabled ? 'none' : 'auto'};
    color: ${props => props.disabled ? 'rgba(0, 0, 0, 0.26)' : 'rgba(0,0,0,.85)'};
    :hover {
        background-color: #f5f5f5;
    }
`

export interface DropDownMenuItemProps extends HTMLAttributes<HTMLLIElement>{
    disabled: boolean
}

export const DropDownMenuItem = (props: DropDownMenuItemProps) => {
    return <MenuItemStyled {...props} />
}

export interface DropDownProps extends HTMLAttributes<HTMLDivElement> {
    children?: JSX.Element,
    overlay?: ReactNode,
    trigger?: 'click' | 'hover',
    width?: number | 'auto';
    placement?: 'bottom' | 'top',
    visible?: boolean,
}

const MenuStyled = styled(List)`
    list-style: none;
    padding: 4px 0;
    margin: 0px;
`


interface DropDownMenuProps extends Omit<HTMLAttributes<HTMLUListElement>, 'onScroll'> {
    scrollTop?: number;
    onScroll?: (props: ListOnScrollProps) => any;
}

export const DropDownMenu = ({
    scrollTop,
    children,
    ...restProps
}: DropDownMenuProps) => {
    let itemCount = 0;
    if (children instanceof Array) {
        itemCount = children.length;
    } else if (isValidElement(children)) {
        itemCount = 1;
    }

    const ref = useRef<List>(null)

    useEffect(() => {
        if (scrollTop) {
            ref.current.scrollTo(scrollTop);
        }
    }, [])

    let height = 150;
    if (isValidElement(children)) {
        height = 30 + 10;
    } else if (children instanceof Array && children.length * 30 < 150){
        height = children.length * 30 + 10;
    }

    return (
        <MenuStyled
            {...restProps}
            ref={ref}
            height={height}
            itemCount={ itemCount}
            itemSize={30}
            width="100%"
        >
            {({ index, style }) => cloneElement(children[index], { style })}
        </MenuStyled> 
    )
}


const DropDownStyled = styled.div.attrs((props) => {
})`
    z-index: 1000;
    min-width: 90px;
    position: fixed;
    width: ${props => props.width ? `${props.width}px` : 'unset'};
    visibility: ${props => props.visible ? 'visible': 'hidden'};
    background-color: #fff;
    padding: 0px;
    box-shadow: 0 3px 6px -4px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%), 0 9px 28px 8px rgb(0 0 0 / 5%);
`;

const DropDown = ({
    children,
    overlay,
    placement = 'bottom',
    trigger = 'hover',
    visible,
    width = 'auto',
    onBlur,
    ...restPropsDropDown
}: DropDownProps) => {
    const ref = useRef<HTMLElement>(null);
    const dropdownRef = useRef<HTMLElement>(null);
    const { onMouseOver, onMouseOut, onClick, ...restProps } = children.props;

    useEffect(() => {
        
        const movePostion = () => {
            let top: string;
            let left: string;
            const rect = ref.current?.getBoundingClientRect();
            const dropRect = dropdownRef.current.getBoundingClientRect();
            if (placement === 'bottom' && rect) {
                top = `${rect.y + rect.height}px`;
                left = `${ref.current?.getBoundingClientRect()?.x ||  0}px`;
                dropdownRef.current?.style?.setProperty('top', top);
                dropdownRef.current?.style?.setProperty('left', left);
            } else if (placement === 'top' && dropRect && rect) {
                top = `${rect.y - dropRect.height}px`;
                left = `${rect.x}px`;
                dropdownRef.current?.style?.setProperty('top', top);
                dropdownRef.current?.style?.setProperty('left', left);
            }
        }
        
        // 执行一次，初始化滚动位置
        movePostion();
        window.addEventListener('scroll', movePostion, true);
        const observer = new IntersectionObserver(() => {
            dropdownRef.current?.blur();
        });
        
        observer.observe(ref.current);
        return () => {
            window.removeEventListener('scroll', movePostion);
            observer.disconnect();
        }
    }, [])

    const dom = cloneElement(children, {
        ...restProps,
        ref: (refDom: HTMLElement) => {
            ref.current = refDom;

            if (restProps.ref instanceof Function) {
                restProps.ref?.(ref.current);
            }else {
                restProps.ref = ref;
            }
        }
    })


    return (
        <>
            <DropDownStyled
                    {...restPropsDropDown}
                    tabIndex="0"
                    ref={dropdownRef}
                    width={width === 'auto' ? ref.current?.getBoundingClientRect()?.width : width }
                    visible={visible}
                    onMouseDown={(event) => {
                        event.preventDefault();
                    }}
                    onBlur={(event) => {
                        onBlur?.(event);
                    }}
                >
                    {overlay}
            </DropDownStyled>
            {dom}
        </>
    )   
}

export default DropDown;