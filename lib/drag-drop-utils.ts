import { BUILDER_IDS, getSelectorByElementId } from "./utils";



export const getElementPositionInScreen = (element: Element): { x: number; y: number } => {
    const iframe = document.getElementsByTagName("iframe")[0];
    const iframeDoc = iframe.contentDocument;
    if (!iframeDoc) return { x: 0, y: 0 }

    const rect = element.getBoundingClientRect();
    const scrollLeft = window.pageXOffset || iframeDoc.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || iframeDoc.documentElement.scrollTop;

    return {
        x: rect.left,
        y: rect.top
    };
}

export const getElementPosition = (element: Element): { x: number; y: number } => {
    const iframe = document.getElementsByTagName("iframe")[0];
    const iframeDoc = iframe.contentDocument;
    if (!iframeDoc) return { x: 0, y: 0 }

    const rect = element.getBoundingClientRect();
    const scrollLeft = window.pageXOffset || iframeDoc.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || iframeDoc.documentElement.scrollTop;

    return {
        x: rect.left + scrollLeft,
        y: rect.top + scrollTop
    };
}

export const handleDragStart = (event) => {
    if (!event || !event.target.id && ['HTML', 'BODY','STYLE'].includes(event.target.tagName)) return
    event.dataTransfer.setData("text/plain", event.target.getAttribute(BUILDER_IDS.DATA_ID));
    const iframe = document.getElementsByTagName("iframe")[0];
    const iframeDoc = iframe.contentDocument;
    iframeDoc?.querySelectorAll('.drag-hover').forEach(el => el.classList.remove('drag-hover'));
    iframeDoc?.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
    iframeDoc?.querySelectorAll('.draggable').forEach(el => {
        el.classList.remove('draggable')
    });
    event.target.classList.add('draggable')
}

export const handleDragLeave = (event) => {
    if (!event) return
    const iframe = document.getElementsByTagName("iframe")[0];
    const iframeDoc = iframe.contentDocument;
    iframeDoc?.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
    iframeDoc?.querySelectorAll('.drag-hover').forEach(el => el.classList.remove('drag-hover'));
    iframeDoc?.querySelectorAll('.draggable').forEach(el => {
        el.classList.remove('draggable')
    });
}

export const handleDragOver = (e) => {
    if (!e) return
    e.preventDefault();

    const iframe = document.getElementsByTagName("iframe")[0];
    const iframeDoc = iframe.contentDocument;

    const target = e.target as HTMLElement;

    // const {x, y} = getElementPositionInScreen(target);
    const x = e.clientX - target.offsetWidth / 2;
    const y = e.clientY - target.offsetHeight / 2;
    // const x = e.clientX; // X coordinate relative to the viewport
    // const y = e.clientY;
    console.log(x,y,'mouse:', e.clientX,e.clientY)
    const elementsAtPoint = iframeDoc?.elementsFromPoint(x, y).filter((el) => {
        if ( el !== target && !['BODY','HTML'].includes(el.tagName)) {
            return el;
        }
    })
    iframeDoc?.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
    elementsAtPoint?.forEach(elementAtPoint => {
        if (!elementAtPoint?.classList.contains('draggable')) {
            elementAtPoint?.classList.add('drag-over');
        }
    })

}

export const handleDrop = (event) => {
    if (!event) return
    event.preventDefault();

    const iframe = document.getElementsByTagName("iframe")[0];
    const iframeDoc = iframe.contentDocument;

    const id = event.dataTransfer.getData("text/plain");
    const draggedElement = iframeDoc?.querySelector(getSelectorByElementId(id));

    const lengthOfDropTargets = iframeDoc?.querySelectorAll('.drag-over').length || 1;
    const dropTarget = Array.from(iframeDoc?.querySelectorAll('.drag-over') || [])[lengthOfDropTargets-1]
    console.log(iframeDoc?.querySelectorAll('.drag-over'))
    if (draggedElement && dropTarget) {
        console.log('target',dropTarget)
        const targetRect = dropTarget.getBoundingClientRect();
        const draggedRect = draggedElement?.getBoundingClientRect();

        // Calculate the midpoint of the target element
        const targetMidpointY = targetRect.top + targetRect.height / 2;


        // dropTarget.insertAdjacentElement('beforeend',
        //     draggedElement
        // );
        if (dropTarget.parentNode && dropTarget.parentElement && ['DIV','SECTION','DIV'].includes(dropTarget.parentElement?.tagName)){
            dropTarget.appendChild(draggedElement);
        }else{
            return
        }
            

        iframeDoc?.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
        iframeDoc?.querySelectorAll('.draggable').forEach(el => {
            el.classList.remove('draggable')
        });
    }
}