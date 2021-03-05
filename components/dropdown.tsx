import React, {
    cloneElement,
    HTMLAttributes,
    isValidElement,
    ReactNode,
    useEffect,
    useRef,
    useState,
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

    return (
        <MenuStyled
            {...restProps}
            ref={ref}
            height={150}
            itemCount={itemCount}
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
    left: ${props => `${props.x || 0}px`};
    top: ${props => `${(props.y || 0)}px`};
    width: ${props => props.width ? `${props.width}px` : 'unset'};
    visibility: ${props => props.dropdownHeight ? 'visible': 'hidden'};
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
    const [show, setShow] = useState<boolean>(false);
    const [rect, setRect] = useState<DOMRect>(null);

    const ref = useRef<HTMLElement>(null);
    const dropdownRef = useRef<HTMLElement>(null);

    const { onMouseOver, onMouseOut, onClick, ...restProps } = children.props;

    useEffect(() => {
        const setRectState = () => {
            setRect(ref.current?.getBoundingClientRect());
        }

        const rectInterval = setInterval(() => {
            if (ref.current?.getBoundingClientRect().y !== NaN) {
                setRectState();
            }
        }, 1)

        const observer = new IntersectionObserver(() => {
            dropdownRef.current?.blur();
        });
        observer.observe(ref.current);
        return () => {
            clearInterval(rectInterval);
            observer.disconnect();
        }
    }, [])

    useEffect(() => {
        if (visible === undefined) {
            setTimeout(() => {
                dropdownRef.current?.focus();
            }, 200);
        }
    }, [show])

    useEffect(() => {
        if (visible === undefined) {
            setTimeout(() => {
                dropdownRef.current?.focus();
            }, 200);
        }
    }, [visible])


    useEffect(() => {
        setRect(ref.current?.getBoundingClientRect());
    }, [ref.current])

    const dom = cloneElement(children, {
        ...restProps,
        ref: (refDom: HTMLElement) => {
            ref.current = refDom;

            if (restProps.ref instanceof Function) {
                restProps.ref?.(ref.current);
            }else {
                restProps.ref = ref;
            }
        },
        onClick: (event) => {
            if (trigger === 'click' && visible === undefined) {
                setShow(true);
            }
            onClick?.(event)
        },
        onMouseOver: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            if (trigger === 'hover' && visible === undefined) {
                setShow(true);
            }
            onMouseOver?.(event);
        }
    })

    let y = rect?.y || 0;
    if (placement === 'bottom' && y) {
        y += rect?.height + 2;
    }

    const dropdownHeight = dropdownRef.current?.getBoundingClientRect().height;
    if (placement === 'top' && y && dropdownHeight) {
        y -=  dropdownHeight + 2;
    }

    let visibleDom = visible || show;

    return (
        <>
            {
                visibleDom ? (
                    <DropDownStyled
                        {...restPropsDropDown}
                        tabIndex="0"
                        ref={dropdownRef}
                        width={width === 'auto' ? rect?.width : width }
                        x={rect?.x}
                        y={y}
                        dropdownHeight={dropdownHeight}
                        onMouseDown={(event) => {
                            event.preventDefault();
                        }}
                        onBlur={(event) => {
                            setShow(false);
                            onBlur?.(event);
                        }}
                    >
                        {overlay}
                    </DropDownStyled>
                ) : undefined
            }
            {dom}
        </>
    )   
}

export default DropDown;