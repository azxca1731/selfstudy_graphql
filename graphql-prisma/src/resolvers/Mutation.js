import bcrypt from "bcryptjs";

const Mutation = {
	async createUser(parent, args, { prisma }, info) {
		const emailTaken = await prisma.exists.User({ email: args.data.email });

		if (args.data.password.length < 8) {
			throw new Error("Password must be 8 characters or longer.");
		}

		if (emailTaken) {
			throw new Error("Email Already taken!");
		}

		const password = await bcrypt.hash(args.data.password, 10);

		const createdUser = await prisma.mutation.createUser(
			{
				data: {
					...args.data,
					password
				}
			},
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
		return prisma.mutation.deletePost(
			{
				where: {
					id: args.id
				}
			},
			info
		);
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
