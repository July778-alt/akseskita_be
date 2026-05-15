import { usersSeed } from "./seeds/users-seed";

import { categoriesSeed } from "./seeds/categories-seed";

import { reportsSeed } from "./seeds/reports-seed";

import { commentsSeed } from "./seeds/comments-seed";

async function runSeeds() {
  try {
    await usersSeed();

    await categoriesSeed();

    await reportsSeed();

    await commentsSeed();

    console.log(
      "All seeds completed"
    );

    process.exit(0);
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
}

runSeeds();