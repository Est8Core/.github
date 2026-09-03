const sidebarNav =
    document.getElementById("sidebar-nav");
const markdownContent =
    document.getElementById("markdown-content");

const appTitle =
    document.getElementById("app-title");

/*
|--------------------------------------------------------------------------
| App Title
|--------------------------------------------------------------------------
*/
if (CONTENT.appTitle) {
    appTitle.textContent =
        CONTENT.appTitle;
    document.title =
        CONTENT.appTitle;
}
/*
|--------------------------------------------------------------------------
| Render View
|--------------------------------------------------------------------------
*/
function renderView(index) {

    const item =
        CONTENT.items[index];

    if (!item) {
        return;
    }


    /*
    Render Markdown
    */

    markdownContent.innerHTML =
        marked.parse(item.content);


    /*
    Active Sidebar Item
    */

    document
        .querySelectorAll(".nav-item")
        .forEach((button, i) => {

            button.classList.toggle(
                "active",
                i === index
            );

        });


    /*
    Browser Title
    */

    document.title =
        `${item.title} — ${CONTENT.appTitle}`;


    /*
    Scroll Content To Top
    */

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/*
|--------------------------------------------------------------------------
| Build Sidebar
|--------------------------------------------------------------------------
*/

CONTENT.items.forEach((item, index) => {
    const button =
        document.createElement("button");
    button.type =
        "button";
    button.className =
        "nav-item";
    button.textContent =
        item.title;
    button.addEventListener(
        "click",
        () => renderView(index)
    );
    sidebarNav.appendChild(button);

});


/*
|--------------------------------------------------------------------------
| Initial View
|--------------------------------------------------------------------------
*/

if (CONTENT.items.length > 0) {
    renderView(0);
}