/** 获取当前浏览器的滚动条宽度信息 */
let scrollbarWidth = 0;
export const getScrollbarWidth = () => {
    if (scrollbarWidth > 0) {
        return scrollbarWidth
    }
    const scrollDiv = document.createElement("div");
    scrollDiv.style.cssText = 'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;';
    document.body.appendChild(scrollDiv);

    scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);
    return scrollbarWidth;
}

/** 进行 hover 的 css 修改 */
export const hoverRender = (innerRef: HTMLDivElement, rowIndex: number) => {
    innerRef.querySelectorAll(`.summer-cell`).forEach((element: HTMLDivElement) => {
        element.style.backgroundColor = '';
    }) 
    innerRef.querySelectorAll(`.summer-row-${rowIndex}`).forEach((element: HTMLDivElement) => {
        element.style.backgroundColor = 'hsl(0deg 0% 96%)';
    })
}
