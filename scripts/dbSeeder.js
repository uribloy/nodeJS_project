require("dotenv/config");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { User } = require("../models/userSchema");
const { Card, numberGeneration } = require("../models/cardSchema");
const { usersData, cardsData } = require("./dbSeederData");
const config = require("config");
const chalk = require("chalk");

mongoose
  .connect(config.get("mongoDB.MONGO_URI"))
  .then(() => console.log(chalk.blue("connected to db successfully")))
  .then(seed)
  .then(() => mongoose.connection.close())
  .catch((err) => console.log(chalk.red(`could not connect to db: ${err}`)));

async function seed() {
  await User.deleteMany();
  await Card.deleteMany();

  for (let i = 0; i < usersData.length - 1; i++) {
    await seedUser(usersData[i]);
  }

  const user = await seedUser(usersData[usersData.length - 1]);

  for (let j = 0; j < cardsData.length; j++) {
    await createCard({
      ...cardsData[j],
      "user_id": user._id,
    });
  }

  console.log(
    chalk.black.bgWhiteBright(
      "Seeding Complete. Run 'npm run start/dev' to start the application..."
    )
  );
}
async function createCard(card) {
  const savedCard = await new Card({
    ...card,
    bizNumber: await numberGeneration(),
  }).save();

  console.log(chalk.white.bgGreen(`new Card: ${savedCard._id}`));

  return savedCard;
}
async function seedUser(userData) {
  const user = await new User({
    ...userData,
    "password": await bcrypt.hash(userData.password, 12),
  }).save();

  console.log(chalk.white.bgBlue(`New User: ${userData.email}`));

  return user;
}
