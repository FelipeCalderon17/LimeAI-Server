import "reflect-metadata";
import "@config/IoCUseCases";
import "@config/IocAdapters";
import app from "./app";
import logger from "@config/Logger";
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
  logger.info("Press CTRL+C to stop");
});
