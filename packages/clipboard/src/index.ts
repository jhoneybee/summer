
const clipboard = document.createElement("input");
clipboard.style.cssText = 'position: absolute; top: -9999px;';
document.body.appendChild(clipboard);

/**
 * 写入剪贴板内容
 */
export const writeText = (text: string) => {
    clipboard.value = text;
    clipboard.select();
    document.execCommand('copy');
}