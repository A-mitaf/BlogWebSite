const data = {
    blogs: require('../model/blogs.json').blogs,
    archiveBlogs: require('../model/archiveBlogs.json'),
    setBlogs: function (data) { this.blogs = data },
    setArchiveBlogs: function (data) { this.archiveBlogs = data}
};
const fs = require('fs').promises;
const path = require('path');


// const data = {
//     blogs: require('../model/blogs.json').blogs,
//     setBlogs: async function (data) {
//         this.blogs = data;
//         try {
//             await fs.writeFile('../model/blogs.json', JSON.stringify(data, null, 2));
//         } catch (error) {
//             console.error('Error writing to blogs.json:', error);
//         }
//     }
// };

const usersDB = {
    users: require('../model/users.json')
    // setUsers: function (data) { this.users = data }
}

const {v4: uuidv4 }= require('uuid');



const getAllBlogs = (req, res) => {
    res.json(data.blogs);
}
//get all post by name
//get post zith id qnd nqme
//get post all posts with type
//get all posts with type and name
const createNewBlog = async (req, res) => {
    const currentDate = new Date();
    const u = req.body.user;
    const currentUser = usersDB.users.find(person => person.username === u)
    const id_user = currentUser.id;
    const newBlog = {
        id: uuidv4(),
        // id: data.blogs?.length ? data.blogs[data.blogs.length - 1].id + 1 : 1,     //add uuid // id user 
        user: req.body.user,
        userId: id_user,
        date: currentDate.toISOString(),
        content: req.body.content,
        title: req.body.title
    }

    if (!newBlog.user ) {
        return res.status(400).json({ 'message': 'First and last names are required.' });
    }
    // data.blogs.push(newBlog);
    // data.setBlogs([...data.blogs, newBlog]);
    // res.status(201).json(data.blogs);
    data.blogs.push(newBlog);

    // Write the updated blogs array back to the JSON file
    const filePath = path.resolve(__dirname, '../model/blogs.json');

    try {
        await fs.writeFile(filePath, JSON.stringify({ blogs: data.blogs }, null, 2));
        res.status(201).json(data.blogs);
    } catch (error) {
        console.error('Error writing to blogs.json:', error);
        res.status(500).json({ 'message': 'Internal Server Error.' });
    }
}
/// create blog name and type ///////////////////////////////////
const createBlogWithNameAndType = async (req, res) => {
    const currentDate = new Date();
    const u = req.body.user;
    const currentUser = usersDB.users.find(person => person.username === u)
    const id_user = currentUser.id;
    const newBlog = {
        id: uuidv4(),
        // id: data.blogs?.length ? data.blogs[data.blogs.length - 1].id + 1 : 1,     //add uuid // id user 
        user: req.body.user,
        userId: id_user,
        date: currentDate.toISOString(),
        content: req.body.content,
        title: req.body.title,
        type: req.body.type
    }

    if (!newBlog.user ) {
        return res.status(400).json({ 'message': 'First and last names are required.' });
    }
    // data.blogs.push(newBlog);
    // data.setBlogs([...data.blogs, newBlog]);
    // res.status(201).json(data.blogs);
    data.blogs.push(newBlog);

    // Write the updated blogs array back to the JSON file
    const filePath = path.resolve(__dirname, '../model/blogs.json');

    try {
        await fs.writeFile(filePath, JSON.stringify({ blogs: data.blogs }, null, 2));
        res.status(201).json(data.blogs);
    } catch (error) {
        console.error('Error writing to blogs.json:', error);
        res.status(500).json({ 'message': 'Internal Server Error.' });
    }
};


//////////////////////////////////////////////////

const updateBlog = async (req, res) => {

    const blogId = req.body.id;
    const blogIndex = data.blogs.findIndex(blg => blg.id === blogId);

    if (blogIndex === -1) {
        return res.status(404).json({ "message": `Blog ID ${blogId} not found` });
    }

    const updatedBlog = {
        ...data.blogs[blogIndex],
        content: req.body.content || data.blogs[blogIndex].content,
        title: req.body.title || data.blogs[blogIndex].title
    };

    const updatedBlogs = [...data.blogs];
    updatedBlogs[blogIndex] = updatedBlog;

    // Update the in-memory data
    data.setBlogs(updatedBlogs);

    // Write the updated blogs array back to the JSON file
    const filePath = path.resolve(__dirname, '../model/blogs.json');

    try {
        await fs.writeFile(filePath, JSON.stringify({ blogs: updatedBlogs }, null, 2));
        res.json(updatedBlogs);
    } catch (error) {
        console.error('Error writing to blogs.json:', error);
        res.status(500).json({ 'message': 'Internal Server Error.' });
    }
}

const deleteBlog =async  (req, res) => {
    // const blog = data.blogs.find(emp => emp.id === req.body.id);
    // if (!blog) {
    //     return res.status(400).json({ "message": `blog ID ${req.body.id} not found` });
    // }
    // const filteredArray = data.blogs.filter(emp => emp.id !== req.body.id);
    // data.setBlogs([...filteredArray]);
    // res.json(data.blogs);
    const blogId = req.body.id;
    const blogIndex = data.blogs.findIndex(blg => blg.id === blogId);

    if (blogIndex === -1) {
        return res.status(404).json({ "message": `Blog ID ${blogId} not found` });
    }

    const filteredBlogs = data.blogs.filter(blg => blg.id !== blogId);

    // Update the in-memory data
    data.setBlogs(filteredBlogs);

    // Write the updated blogs array back to the JSON file
    const filePath = path.resolve(__dirname, '../model/blogs.json');

    try {
        await fs.writeFile(filePath, JSON.stringify({ blogs: filteredBlogs }, null, 2));
        res.json(filteredBlogs);
    } catch (error) {
        console.error('Error writing to blogs.json:', error);
        res.status(500).json({ 'message': 'Internal Server Error.' });
    }
}

const getBlog = (req, res) => {
    const blog = data.blogs.find(emp => emp.id === req.params.id);
    if (!blog) {
        return res.status(400).json({ "message": `blog ID ${req.params.id} not found` });
    }
    res.json(blog);
}
/*
const getBlogName = (req, res) => {
    // const blog = data.blogs.find(emp => emp.user === req.params.user);
    // if (!blog) {
    //     return res.status(400).json({ "message": `blog name ${req.params.user} not found` });
    // }
    // res.json(blog);
    const username = req.params.user;
    console.log('Searching for blog with username:', username);

    const blog = data.blogs.find(emp => emp.user === username);
    
    if (!blog) {
        console.log('Blog not found');
        return res.status(400).json({ "message": `Blog with username ${username} not found` });
    }

    console.log('Blog found:', blog);
    res.json(blog);
}
*/

const getAllPostsByName = (req, res) => {
    const user = req.params.user
    const postsByName = data.blogs.filter(blog => blog.user === user);
    if (postsByName.length > 0) {
        res.json(postsByName);
    } else {
        res.status(404).json({ "message": `No posts found by ${user}` });
    }
};

const archiveBlog = async (req, res) => {
    const blogId = req.params.id;

    const blogIndex = data.blogs.findIndex(blg => blg.id === blogId);
    if (blogIndex === -1) {
        return res.status(404).json({ "message": `Blog ID ${blogId} not found` });
    }

    const archivedBlog = data.blogs[blogIndex];
    const filteredBlogs = data.blogs.filter(blg => blg.id !== blogId);
    data.setBlogs(filteredBlogs);

    const blogsFilePath = path.resolve(__dirname, '../model/blogs.json');
    const archiveFilePath = path.resolve(__dirname, '../model/archiveBlogs.json');

    try {
        await fs.writeFile(blogsFilePath, JSON.stringify({ blogs: filteredBlogs }, null, 2));
    } catch (error) {
        console.error('Error writing to blogs.json:', error);
        return res.status(500).json({ 'message': 'Internal Server Error.' });
    }

    try {
        let archivedBlogsData = { blogs: [] };
        try {
            const data = await fs.readFile(archiveFilePath, 'utf8');
            archivedBlogsData = JSON.parse(data);
        } catch (error) {
            if (error.code !== 'ENOENT') {
                console.error('Error reading from archiveBlogs.json:', error);
                throw error; // Lancer une exception si l'erreur n'est pas due à un fichier inexistant
            }
            // Si le fichier n'existe pas, continuer avec un objet vide
        }

        archivedBlogsData.blogs.push(archivedBlog); // Ajoutez le blog archivé à la liste

        await fs.writeFile(archiveFilePath, JSON.stringify(archivedBlogsData, null, 2));
        res.json({ "message": `Blog ID ${blogId} archived successfully` });
    } catch (error) {
        console.error('Error writing to archiveBlogs.json:', error);
        res.status(500).json({ 'message': 'Internal Server Error.' });
    }
};





module.exports = {
    getAllBlogs,
    createNewBlog,
    updateBlog,
    deleteBlog,
    getBlog,
    getAllPostsByName,
    createBlogWithNameAndType,
    archiveBlog
}