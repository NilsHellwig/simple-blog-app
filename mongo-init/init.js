db = db.getSiblingDB("blogapp");

db.posts.insertMany([
  {
    title: "First Post",
    description: "This is a sample post.",
    imageId: "example_1",
    postedAt: Date.now(),
    author: {
      username: "max",
      name: "Max Mustermann",
    },
  },
  {
    title: "Second Post",
    description: "Another blog post.",
    imageId: "example_2",
    postedAt: Date.now(),
    author: {
      username: "lisa",
      name: "Lisa Musterfrau",
    },
  },
]);
