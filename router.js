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
        //pagenum-YYYY-MM-DD
        /^\/blog\/(\d+)-(\d{4}-\d{2}-\d{2})$/
    );

    if (blogPost) {
        const pageNum = Number(blogPost[1]);
        const postId = blogPost[2];

        const onBlogReady = (event) => {
            if (
                event.source !== content.contentWindow ||
                event.origin !== window.location.origin ||
                event.data?.type !== "blog-ready"
            ) {
                return;
            }

            window.removeEventListener("message", onBlogReady);

            content.contentWindow.navToPost(pageNum, postId, false);
        };

        window.addEventListener("message", onBlogReady);

        content.src = `/pages/blog.html`;
        return;
    }

    content.src = routes[path] || "pages/404.html";
};

window.addEventListener("hashchange", handleLocation);
window.route = route;

handleLocation();