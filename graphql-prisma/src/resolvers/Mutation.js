import uuidv4 from "uuid/v4";

const Mutation = {
    async createUser(parent, args, { prisma }, info) {
        const emailTaken = await prisma.exists.User({ email: args.data.email });

        if (emailTaken) {
            throw new Error("Email Already taken!");
        }

        const createdUser = await prisma.mutation.createUser(
            { data: args.data },
            info
        );

        return createdUser;
    },
    async deleteUser(parent, args, { prisma }, info) {
        const idExist = await prisma.exists.User({ id: args.id });
        if (!idExist) {
            throw new Error("User doesn't exists");
        }

        const deletedUser = await prisma.mutation.deleteUser(
            { where: { id: args.id } },
            info
        );

        return deletedUser;
        // const userIndex = db.users.findIndex(user => user.id === args.id);

        // if (userIndex === -1) {
        //     throw new Error("User not found");
        // }

        // const deletedUsers = db.users.splice(userIndex, 1);

        // db.posts = db.posts.filter(post => {
        //     const match = post.author === args.id;

        //     if (match) {
        //         db.comments = db.comments.filter(
        //             comment => comment.post !== post.id
        //         );
        //     }

        //     return !match;
        // });
        // db.comments = db.comments.filter(comment => comment.author !== args.id);

        // return deletedUsers[0];
    },
    async updateUser(parent, args, { prisma }, info) {
        const idExist = await prisma.exists.User({ id: args.id });

        if (!idExist) {
            throw new Error("User doesn't exists");
        }

        const updatedUser = await prisma.mutation.updateUser(
            {
                where: { id: args.id },
                data: args.data
            },
            info
        );

        return updatedUser;
        // const { id, data } = args;
        // const user = db.users.find(user => user.id === id);

        // if (!user) {
        //     throw new Error("User not found");
        // }

        // if (typeof data.email === "string") {
        //     const emailTaken = db.users.some(user => user.email === data.email);

        //     if (emailTaken) {
        //         throw new Error("Email taken");
        //     }

        //     user.email = data.email;
        // }

        // if (typeof data.name === "string") {
        //     user.name = data.name;
        // }

        // if (typeof data.age !== "undefined") {
        //     user.age = data.age;
        // }

        // return user;
    },
    async createPost(parent, args, { prisma, pubsub }, info) {
        const { author: id, ...otheArgs } = args.data;
        const userExists = await prisma.exists.User({ id });

        if (!userExists) {
            throw new Error("User not found");
        }

        const createdPost = await prisma.mutation.createPost(
            {
                data: { author: { connect: { id } }, ...otheArgs }
            },
            info
        );

        if (args.data.published) {
            pubsub.publish("post", {
                post: {
                    mutation: "CREATED",
                    data: createdPost
                }
            });
        }

        return createdPost;
    },
    deletePost(parent, args, { prisma, pubsub }, info) {
        // const postIndex = db.posts.findIndex(post => post.id === args.id);

        // if (postIndex === -1) {
        //     throw new Error("Post not found");
        // }
        // const postExists = await prisma.exists.Post({ id: args.id });

        // if (!postExists) {
        //     throw new Error("Post doesn't exist");
        // }

        return prisma.mutation.deletePost(
            {
                where: {
                    id: args.id
                }
            },
            info
        );

        // const [post] = db.posts.splice(postIndex, 1);

        // db.comments = db.comments.filter(comment => comment.post !== args.id);

        // if (post.published) {
        //     pubsub.publish("post", {
        //         post: {
        //             mutation: "DELETED",
        //             data: post
        //         }
        //     });
        // }

        // return post;
    },
    async updatePost(parent, args, { prisma, pubsub }, info) {
        const existPost = await prisma.exists.Post({ id: args.id });
        if (!existPost) {
            throw new Error("Post doesn't exist");
        }

        const updatedPost = await prisma.mutation.updatePost(
            {
                where: {
                    id: args.id
                },
                data: {
                    title: args.data.title,
                    body: args.data.body,
                    published: args.data.published,
                    author: args.data.author,
                    comment: args.data.comment
                }
            },
            info
        );

        return updatedPost;
        // const { id, data } = args;
        // const post = db.posts.find(post => post.id === id);
        // const originalPost = { ...post };

        // if (!post) {
        //     throw new Error("Post not found");
        // }

        // if (typeof data.title === "string") {
        //     post.title = data.title;
        // }

        // if (typeof data.body === "string") {
        //     post.body = data.body;
        // }

        // if (typeof data.published === "boolean") {
        //     post.published = data.published;

        //     if (originalPost.published && !post.published) {
        //         pubsub.publish("post", {
        //             post: {
        //                 mutation: "DELETED",
        //                 data: originalPost
        //             }
        //         });
        //     } else if (!originalPost.published && post.published) {
        //         pubsub.publish("post", {
        //             post: {
        //                 mutation: "CREATED",
        //                 data: post
        //             }
        //         });
        //     }
        // } else if (post.published) {
        //     pubsub.publish("post", {
        //         post: {
        //             mutation: "UPDATED",
        //             data: post
        //         }
        //     });
        // }

        // return post;
    },
    async createComment(parent, args, { prisma, pubsub }, info) {
        const userExists = await prisma.exists.User({ id: args.data.author });
        const postExists = await prisma.exists.Post({ id: args.data.post });

        if (!userExists || !postExists) {
            throw new Error("User or Post doesn't exist");
        }

        const createdComment = await prisma.mutation.createComment(
            {
                data: {
                    author: {
                        connect: {
                            id: args.data.author
                        }
                    },
                    post: {
                        connect: {
                            id: args.data.post
                        }
                    },
                    text: args.data.text
                }
            },
            info
        );

        return createdComment;
        // const userExists = db.users.some(user => user.id === args.data.author);
        // const postExists = db.posts.some(
        //     post => post.id === args.data.post && post.published
        // );

        // if (!userExists || !postExists) {
        //     throw new Error("Unable to find user and post");
        // }

        // const comment = {
        //     id: uuidv4(),
        //     ...args.data
        // };

        // db.comments.push(comment);
        // pubsub.publish(`comment ${args.data.post}`, {
        //     comment: {
        //         mutation: "CREATED",
        //         data: comment
        //     }
        // });

        // return comment;
    },
    async deleteComment(parent, args, { prisma, pubsub }, info) {
        const commentExist = await prisma.exists.Comment({ id: args.id });

        if (!commentExist) {
            throw new Error("Comment doesn'y exist");
        }

        const deletedComment = await prisma.mutation.deleteComment(
            {
                where: {
                    id: args.id
                }
            },
            info
        );
        return deletedComment;
    },
    async updateComment(parent, args, { prisma, pubsub }, info) {
        const commentExist = await prisma.exists.Comment({ id: args.id });

        if (!commentExist) {
            throw new Error("Comment doesn'y exist");
        }

        const updatedComment = await prisma.mutation.updateComment(
            {
                data: {
                    text: args.data.text
                },
                where: {
                    id: args.id
                }
            },
            info
        );

        return updatedComment;
    }
};

export { Mutation as default };
