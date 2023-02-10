export const removeElement = (element) => {
    if (element === null) {
        return;
    }
 
    for (let child of element.childNodes) {
        removeElement(child);
    }

    element.remove();
}


export const blurElement = (element) => {
    if (element === null) {
        return;
    }

    element.style.filter = "blur(6px)";
}


export const unBlurElement = (element) => {
    if (element === null) {
        return;
    }

    element.style.filter = "blur(0px)";
}