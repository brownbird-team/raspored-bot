export const createHeader = (headerLinks) => {
    if (document.querySelector(".home-heading") != null) {
        return;
    }

    // Root Heading
    const rootHeading = document.createElement("div");
    rootHeading.classList.add("home-heading");
    rootHeading.id = "home";
    document.body.appendChild(rootHeading);

    // Left Navigation
    const leftNavigation = document.createElement("div");
    leftNavigation.classList.add("home-left-navigation");
    rootHeading.appendChild(leftNavigation);

    const leftLen = Object.keys(headerLinks.left).length;
    for (let headerLink = 0; headerLink < leftLen; headerLink++) {
        const link = document.createElement("a");
        link.classList.add(headerLinks.left[headerLink].class);
        link.innerText = headerLinks.left[headerLink].name;
        link.addEventListener("click", headerLinks.left[headerLink].handler);
        leftNavigation.appendChild(link);
    }

    // Right Navigation
    const rightNavigation = document.createElement("div");
    rightNavigation.classList.add("home-right-navigation");
    rootHeading.appendChild(rightNavigation);

    const rightLen = Object.keys(headerLinks.right).length;
    for (let headerLink = 0; headerLink < rightLen; headerLink++) {
        const link = document.createElement("a");
        link.classList.add(headerLinks.right[headerLink].class);
        link.innerText = headerLinks.right[headerLink].name;
        link.addEventListener("click", headerLinks.right[headerLink].handler);
        rightNavigation.appendChild(link);
    }
}