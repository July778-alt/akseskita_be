import app from "./app";

import { config } from "./config/env";
import { initNotificationListeners } from "./modules/notifications/notifications-events";
import { logger } from "./config/logger";

// Start background listeners
initNotificationListeners();

app.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`);
});