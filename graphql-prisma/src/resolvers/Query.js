const Query = {
    users(parent, args, { prisma }, info) {
        const onArgs = {};
        if (args.query) {
            onArgs.where = {
                OR: [
                    { name_contains: args.query },
                    { email_contains: args.query }
                ]
            };
        }
        return prisma.query.users(onArgs, info);
    },
    posts(parent, args, { prisma }, info) {
        const onArgs = {};
        if (args.query) {
            onArgs.where = {
                OR: [
                    { title_contains: args.query },
                    { body_contains: args.query }
                ]
            };
        }
        return prisma.query.posts(onArgs, info);
    },
    comments(parent, args, { prisma }, info) {
        // return db.comments;
        return prisma.query.comments(null, info);
    },
    me() {
        return {
            id: "123098",
            name: "Mike",
            email: "mike@example.com"
        };
    },
    post() {
        return {
            id: "092",
            title: "GraphQL 101",
            body: "",
            published: false
        };
    }
};

export { Query as default };
