const route = (event) => {
    event = event || window.event;
    event.preventDefault();
    window.location.hash = event.currentTarget.getAttribute("href");
};

const routes = {
    404: "/pages/404.html",
    "/": "pages/welcome.html",
    "/blog": "/pages/blog.html",
    "/artworks": "/pages/artworks.html",
    "/projects": "/pages/projects.html",
    "/archive": "/pages/archive.html",
    "/links": "/pages/links.html",
};

const handleLocation = async () => {
    const path = window.location.hash.replace("#", "") || "/";
    const route = routes[path] || "pages/404.html";

    document.getElementById("content").src = route;
};

window.addEventListener("hashchange", handleLocation);
window.route = route;

handleLocation();