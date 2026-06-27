db = db.getSiblingDB("blogapp");

db.posts.insertMany([
  {
    _id: ObjectId("507f191e810c19729de860ea"),
    title: "Sunrise hike at Zugspitze",
    description:
      "Started the trail at 4am in complete darkness, but arriving at the summit just as the first light broke over the horizon made every steep step worth it. The valley below was still wrapped in clouds — one of those moments you simply have to experience yourself.",
    postedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    author: {
      username: "julian_k",
      name: "Julian Kraft",
    },
  },
  {
    _id: ObjectId("507f1f77bcf86cd799439011"),
    title: "Sourdough – third attempt",
    description:
      "Finally nailed the scoring pattern and got the oven spring I have been chasing for weeks. Used 80% hydration with a 16-hour cold ferment. The crust turned out crispy, the crumb open and chewy. Absolutely worth the patience.",
    postedAt: Date.now() - 3 * 60 * 60 * 1000,
    author: {
      username: "sarah_m",
      name: "Sarah Müller",
    },
  },
]);
