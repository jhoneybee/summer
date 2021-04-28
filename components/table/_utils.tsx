
/** 进行 hover 的 css 修改 */
export const hoverRender = (innerRef: HTMLDivElement, rowIndex: number) => {
    innerRef?.querySelectorAll(`.summer-cell`).forEach((element: HTMLDivElement) => {
        element.style.backgroundColor = '';
    }) 
    innerRef?.querySelectorAll(`.summer-row-${rowIndex}`).forEach((element: HTMLDivElement) => {
        element.style.backgroundColor = 'hsl(0deg 0% 96%)';
    })
}
