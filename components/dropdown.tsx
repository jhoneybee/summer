import React, {
    cloneElement,
    HTMLAttributes,
    ReactNode,
    MutableRefObject,
    useEffect,
    useRef,
    useState,
} from 'react';

import styled from 'styled-components';

export interface DropDownProps extends HTMLAttributes<HTMLDivElement> {
    children?: JSX.Element,
    overlay?: ReactNode,
    trigger?: 'click' | 'hover',
    placement?: 'bottom' | 'top',
    visible?: boolean,
}

const MenuStyled = styled.ul`
    list-style: none;
    padding: 4px 0;
    margin: 0px;
`

export const DropDownMenu = (props: HTMLAttributes<HTMLUListElement>) => {
    return <MenuStyled {...props} />
}

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

export default function DropDown ({
    children,
    overlay,
    placement = 'bottom',
    trigger='hover',
    visible,
    onBlur,
    ...restPropsDropDown
}: DropDownProps) {
    const [show, setShow] = useState<boolean>(false);
    const [rect, setRect] = useState<DOMRect>(null);


    const ref = useRef<HTMLElement>(null);
    const dropdownRef = useRef<HTMLElement>(null);
    const isHover = useRef<boolean>(false);

    const { onMouseOver, onMouseOut, onClick, ...restProps } = children.props;

    useEffect(() => {
        const setRectState = () => {
            setRect(ref.current?.getBoundingClientRect());
        }

        const rectInterval = setInterval(() => {
            if (ref.current?.getBoundingClientRect().y !== NaN) {
                setRectState();
            }
        }, 20)

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
    
    if (isHover.current) {
        visibleDom = true;
    }

    return (
        <>
            {
                visibleDom ? (
                    <DropDownStyled
                        {...restPropsDropDown}
                        tabIndex="0"
                        ref={dropdownRef}
                        width={visible === undefined ? undefined : rect?.width}
                        x={rect?.x}
                        y={y}
                        dropdownHeight={dropdownHeight}
                        onMouseOver={(event) => {
                            isHover.current = true;
                        }}
                        onMouseOut={(event) => {
                            isHover.current = false;
                        }}
                        onBlur={(event) => {
                            if (visible === undefined) {
                                setShow(false);
                            }
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