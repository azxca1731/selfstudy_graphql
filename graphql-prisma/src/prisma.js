import { Prisma } from "prisma-binding";

const prisma = new Prisma({
  typeDefs: "src/generated/prisma.graphql",
  endpoint: "http://localhost:4466"
});

//prisma exist
//이런식으로 쓴다
// prisma.exists
//   .Comment({
//     id: "cjryqzxqh00va09775uno45f7"
//   })
//   .then(exists => console.log(exists));

//data selection on graphql
// prisma.query.users(null, "{ id name email posts { id title } }").then(data => {
//   console.log(JSON.stringify(data, undefined, 2));
// });

const createPostForUser = async (authorId, data) => {
  const userExists = await prisma.exists.User({ id: authorId });

  if (!userExists) {
    throw new Error("User not found!");
  }

  const { author } = await prisma.mutation.createPost(
    {
      data: {
        ...data,
        author: {
          connect: {
            id: authorId
          }
        }
      }
    },
    "{ author { id name email posts { id title published } } }"
  );
  return author;
};

// createPostForUser("cjryqwvtv00tf0977xsx28vr", {
//   title: "Great book is so good",
//   body: "I don't know fucking dude",
//   published: true
// })
//   .then(user => console.log(JSON.stringify(user, null, 2)))
//   .catch(err => {
//     console.log(err.message);
//   });

// prisma.mutation
//   .createPost(
//     {
//       data: {
//         title: "Graphql example",
//         body: "",
//         published: false,
//         author: {
//           connect: {
//             email: "azxca1731@gmail.com"
//           }
//         }
//       }
//     },
//     "{ id title body published author { id } }"
//   )
//   .then(data => {
//     console.log(data);
//     return prisma.query.users(null, "{ id name posts { id title } }");
//   })
//   .then(data => {
//     console.log(JSON.stringify(data, null, 2));
//   });

// Promise로 만듬
const updatePostForUser = async (id, data) => {
  const postExists = await prisma.exists.Post({ id });
  if (!postExists) {
    throw new Error("Post not found!");
  }
  const { author } = await prisma.mutation.updatePost(
    {
      data: {
        ...data
      },
      where: {
        id
      }
    },
    "{ author { id name email posts { id title published } } }"
  );
  return author;
};
// updatePostForUser("cjrypmait00o709777569wbnw", {
//   title: "fuck you ass hole",
//   body: "똥구멍좋아용"
// })
//   .then(data => console.log(JSON.stringify(data, null, 2)))
//   .catch(error => {
//     console.log(error.message);
//   });

// prisma.mutation
//   .createPost(
//     {
//       data: {
//         title: "Graphql Example",
//         body: "",
//         published: false,
//         author: {
//           connect: {
//             id: "cjryqwvtv00tf0977xsqx28vr"
//           }
//         }
//       }
//     },
//     "{ id }"
//   )
//   .then(({ id }) => {
//     return prisma.mutation.updatePost({
//       data: {
//         body: "Example is so hard but i want to be a great programmer ever!",
//         published: true
//       },
//       where: {
//         id
//       }
//     });
//   })
//   .then(_ => {
//     return prisma.query.posts(null, "{ id title body published }");
//   })
//   .then(data => {
//     console.log(JSON.stringify(data, null, 2));
//   });
