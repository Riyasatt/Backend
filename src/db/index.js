import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from "./schema.js"

const sql = neon("postgresql://neondb_owner:K7inZadrljM9@ep-black-heart-a5pc5owh.us-east-2.aws.neon.tech/SIH_PMSSS?sslmode=require");

export const db = drizzle(sql,{schema}); 


