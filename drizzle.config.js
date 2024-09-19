/** @type { import("drizzle-kit").Config } */
export default {
  schema: "./src/db/schema.js",
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://neondb_owner:K7inZadrljM9@ep-black-heart-a5pc5owh.us-east-2.aws.neon.tech/SIH_PMSSS?sslmode=require',
  }
};