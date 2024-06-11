export function getMainContentColWidth(): number {
    let result = document.querySelector('#mainContentCol')?.clientWidth;
    if(result == undefined) {
        return 0;
    } else {
        return result;
    }
}

export function setButtonAsToggleCollapse(buttonId, tableId) {
    document.querySelector('#' + buttonId)?.addEventListener('click', function () {
        if (document.querySelector('#' + tableId)?.classList.contains("show")) {
            collapseHtml(tableId);
        } else {
            unCollapseHtml(tableId);
        }
    });
}

export function collapseHtml(htmlId) {
    document.querySelector('#' + htmlId)?.classList.replace('show', 'collapse');
}

export function unCollapseHtml(htmlId) {
    document.querySelector('#' + htmlId)?.classList.replace('collapse', 'show');
}