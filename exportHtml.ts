function removeDraggableFromCanvas(canvasSelector: string) {
    const canvasElements = document.querySelectorAll(`${canvasSelector} [draggable="true"]`);
    canvasElements.forEach(element => {
      element.removeAttribute('draggable');
      element.removeAttribute('style');
    });
}
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export async function exportHTML() {
    const zip = new JSZip();
    const iframe = document.getElementsByTagName('iframe')[0] as HTMLIFrameElement;
    
    const doc = iframe.contentDocument;
    if (!doc) return;
    // Convert the clone to HTML string
    const doctype = new XMLSerializer().serializeToString(doc.documentElement);
    let html = doc.documentElement.outerHTML;
  
    // Find all img elements
    const imgElements = doc.getElementsByTagName('img');
    const imgPromises: Array<Promise<any>> = [];
    const imgFolder = zip.folder("images");

    for (let i = 0; i < imgElements.length; i++) {
        const img = imgElements[i];
        const src = img.src;
        const imageName = src.split('/').pop() || `image${i + 1}`;
        // Fetch the image and store it in the zip folder
        imgPromises.push(
            fetch(src)
                .then(response => response.blob())
                .then(blob => {
                    imgFolder?.file(imageName, blob);
                    html = html.replace(src, `images/${imageName}`);
                })
        );
    }

    // Wait for all images to be fetched and added to the zip
    await Promise.all(imgPromises);

    // Add the modified HTML file to the zip
    const htmlString = `${doctype}\n${html}`;
    zip.file("landing-page.html", htmlString);

    // Generate the zip file and trigger the download
    zip.generateAsync({ type: "blob" }).then(blob => {
        saveAs(blob, "landing-page.zip");
    });

    // // Create a Blob and download the HTML
    // const blob = new Blob([htmlString], { type: 'text/html' });
    // const url = URL.createObjectURL(blob);
    // const a = document.createElement('a');
    // a.href = url;
    // a.download = 'landing-page.html';
    // a.click();
    // URL.revokeObjectURL(url);
}