

export const getElementPosition =(element: Element): { x: number; y: number }=> {
    const iframe = document.getElementsByTagName("iframe")[0];
    const iframeDoc = iframe.contentDocument;
    if (!iframeDoc) return {x: 0, y: 0}

    const rect = element.getBoundingClientRect();
    const scrollLeft = window.pageXOffset || iframeDoc.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || iframeDoc.documentElement.scrollTop;
    
    return {
        x: rect.left + scrollLeft,
        y: rect.top + scrollTop
    };
}
export const handleDragStart = (event) => {
    if (!event || !event.target.id && ['DIV','SECTION'].includes(event.target.tagName)) return
    event.dataTransfer.setData("text/plain", event.target.id);
    console.log(event.target.id)
    const iframe = document.getElementsByTagName("iframe")[0];
    const iframeDoc = iframe.contentDocument;
    iframeDoc?.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
    iframeDoc?.querySelectorAll('.draggable').forEach(el => {
        el.classList.remove('draggable')
    });
    event.target.classList.add('draggable')
}

export const handleDragLeave = (event: MouseEvent) => {
    if (!event) return
    const iframe = document.getElementsByTagName("iframe")[0];
    const iframeDoc = iframe.contentDocument;
    iframeDoc?.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
    iframeDoc?.querySelectorAll('.draggable').forEach(el => {
        el.classList.remove('draggable')
    });
}

export const handleDragOver = (e: MouseEvent) => {
    if (!e) return
    e.preventDefault();

    const iframe = document.getElementsByTagName("iframe")[0];
    const iframeDoc = iframe.contentDocument;

    const target = e.target as Element;
    
    const {x, y} = getElementPosition(target);

    const elementAtPoint = iframeDoc?.elementsFromPoint(x, y).filter((el) => {
        if (['DIV', 'SECTION'].includes(el.tagName) || el !== target) {
            return el;
        }
    })[0];

    iframeDoc?.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
    if (!elementAtPoint?.classList.contains('draggable')) {
        elementAtPoint?.classList.add('drag-over');
    }

}

export const handleDrop = (event) => {
    if (!event) return
    event.preventDefault();

    const iframe = document.getElementsByTagName("iframe")[0];
    const iframeDoc = iframe.contentDocument;

    const id = event.dataTransfer.getData("text/plain");

    const draggedElement = iframeDoc?.getElementById(id);
    const dropTarget = iframeDoc?.querySelectorAll('.drag-over')[0] as Element

    if (draggedElement && dropTarget) {

        dropTarget.insertAdjacentElement('afterbegin',
            draggedElement
        );

        iframeDoc?.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
        iframeDoc?.querySelectorAll('.draggable').forEach(el => {
            el.classList.remove('draggable')

        });
    }
}