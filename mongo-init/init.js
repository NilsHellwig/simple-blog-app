db = db.getSiblingDB("blogapp");

db.posts.insertMany([
  {
    title: "First Post",
    description: "This is a sample post.",
    imageUrl: "example_1",
    postedAt: Math.floor(new Date() / 1000),
    author: {
      username: "max",
      name: "Max Mustermann",
    },
  },
  {
    title: "Second Post",
    description: "Another blog post.",
    imageUrl: "example_2",
    postedAt: Math.floor(new Date() / 1000),
    author: {
      username: "lisa",
      name: "Lisa Musterfrau",
    },
  },
]);
