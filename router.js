const route = (event) => {
    event = event || window.event;
    event.preventDefault();
    window.location.hash = event.currentTarget.getAttribute("href");
};

const routes = {
    404: "/pages/404.html",
    "/": "pages/welcome.html",
    "/blog": "/pages/blog.html",
    "/contact": "/pages/contact.html",
    "/links": "/pages/links.html",
};

const handleLocation = async () => {
    const path = window.location.hash.replace("#", "") || "/";
    const content = document.getElementById("content");

    const blogPost = path.match(
        /^\/blog\/(\d{4}-\d{2}-\d{2})$/
    );

    if (blogPost) {
        content.src = `/pages/blog.html#${blogPost[1]}`;
        return;
    }

    content.src = routes[path] || "pages/404.html";
};

window.addEventListener("hashchange", handleLocation);
window.route = route;

handleLocation();