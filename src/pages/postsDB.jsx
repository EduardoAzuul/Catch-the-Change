const url = process.env.REACT_APP_API_URL?.replace(/\/$/, '');

//store in db
export const getPosts = async (data) => {
    const res = await fetch(`${url}/posts`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    const result = await res.json();

    return result;
};

//store in db
export const setPost = async (data) => {
    const res = await fetch(`${url}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    const result = await res.json();

    return result;
};

//update in db
export const updatePost = async (id, newText) => {
    const res = await fetch(`${url}/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto: newText }),
    });
    const result = await res.json();

    return result;
}

//delete in db
export const deletePost = async (id) => {
    const res = await fetch(`${url}/posts/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    });
    const result = await res.json();

    return result;
}
