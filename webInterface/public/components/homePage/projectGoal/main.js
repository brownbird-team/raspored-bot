const content = {
    title: {
        1: "Cilj projekta <span class='yellow'>Raspored bot</span>",
        2: "Kako smo došli do ideje ?",
        3: "Koje smo rezultate postigli ?"
    },
    paragraph: { 
        1: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque eros lorem, imperdiet sed odio nec, luctus rutrum massa. Donec ornare neque vitae risus ultrices tincidunt.",
        2: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque eros lorem, imperdiet sed odio nec, luctus rutrum massa. Donec ornare neque vitae risus ultrices tincidunt.",
        3: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque eros lorem, imperdiet sed odio nec, luctus rutrum massa. Donec ornare neque vitae risus ultrices tincidunt."
    }
};


export const createProjectGoal = () => {
    if (document.querySelector(".project-goal") != null) {
        return;
    }

    // Root
    const root = document.createElement("div");
    root.classList.add("project-goal");
    root.id = "project-goal";
    document.body.appendChild(root);

    // Header
    const header = document.createElement("div");
    header.classList.add("project-goal-header");
    root.appendChild(header);

    // Vertical Line
    const verticalLine = document.createElement("div");
    verticalLine.classList.add("project-goal-vertical-line");
    root.appendChild(verticalLine);

    // Circle 1
    const circle1 = document.createElement("div");
    circle1.classList.add("project-goal-circle");
    root.appendChild(circle1);

    // Circle 2
    const circle2 = document.createElement("div");
    circle2.classList.add("project-goal-circle");
    root.appendChild(circle2);

    // Line Container 1
    const lineContainer1 = document.createElement("div");
    lineContainer1.classList.add("project-goal-line-container");
    lineContainer1.classList.add("line-container-1");
    root.appendChild(lineContainer1);

    // Line 1
    const line1 = document.createElement("div");
    line1.classList.add("project-goal-line");
    lineContainer1.appendChild(line1);

    // Text 1
    const text1 = document.createElement("h3");
    text1.innerText = "Početak";
    lineContainer1.appendChild(text1);

    // Line Container 2
    const lineContainer2 = document.createElement("div");
    lineContainer2.classList.add("project-goal-line-container");
    lineContainer2.classList.add("line-container-2");
    root.appendChild(lineContainer2);

    // Text 2
    const text2 = document.createElement("h3");
    text2.innerText = "Izrada ideje";
    lineContainer2.appendChild(text2);

    // Line 2
    const line2 = document.createElement("div");
    line2.classList.add("project-goal-line");
    lineContainer2.appendChild(line2);

    // Line Container 3
    const lineContainer3 = document.createElement("div");
    lineContainer3.classList.add("project-goal-line-container");
    lineContainer3.classList.add("line-container-3");
    root.appendChild(lineContainer3);

    // Line 3
    const line3 = document.createElement("div");
    line3.classList.add("project-goal-line");
    lineContainer3.appendChild(line3);

    // Text 3
    const text3 = document.createElement("h3");
    text3.innerText = "Izrada aplikacije";
    lineContainer3.appendChild(text3);

    // Line Container 4
    const lineContainer4 = document.createElement("div");
    lineContainer4.classList.add("project-goal-line-container");
    lineContainer4.classList.add("line-container-4");
    root.appendChild(lineContainer4);

    // Text 4
    const text4 = document.createElement("h3");
    text4.innerText = "Verzija 1.0";
    lineContainer4.appendChild(text4);

    // Line 4
    const line4 = document.createElement("div");
    line4.classList.add("project-goal-line");
    lineContainer4.appendChild(line4);

    // Arrow
    const arrow = document.createElement("div");
    arrow.classList.add("project-goal-arrow");
    root.appendChild(arrow);

    for (let pIndex = 1; pIndex <= 3; pIndex++) {
        // Paragraph
        const paragraph = document.createElement("div");
        paragraph.classList.add(`project-goal-paragraph-${pIndex}`);
        root.appendChild(paragraph);

        // Paragraph Title
        const title = document.createElement("h1");
        title.classList.add("project-goal-paragraph-title");
        if (pIndex === 1) {
            title.innerHTML = content.title[pIndex];
        } else {
            title.innerText = content.title[pIndex];
        }
        paragraph.appendChild(title);

        // Paragraph Desc
        const desc = document.createElement("p");
        desc.classList.add("project-goal-paragraph-desc");
        desc.innerText = content.paragraph[pIndex];
        paragraph.appendChild(desc);
    }
}