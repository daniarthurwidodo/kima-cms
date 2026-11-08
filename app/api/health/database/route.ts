import { getPool } from "@/lib/db";
import { logger } from "@/lib/logger";

const DATABASE_CHECK_QUERY = "SELECT 1";
const SERVICE_UNAVAILABLE_STATUS = 503;

export async function GET() {
  try {
    await getPool().query(DATABASE_CHECK_QUERY);
    return Response.json({ status: "ok" });
  } catch (error) {
    logger.error({ err: error }, "Database health check failed");
    return Response.json(
      { status: "unavailable" },
      { status: SERVICE_UNAVAILABLE_STATUS },
    );
  }
}
