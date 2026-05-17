import app from "./app";

import { config } from "./config/env";
import { initNotificationListeners } from "./modules/notifications/notifications-events";

// Start background listeners
initNotificationListeners();

app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`);
});