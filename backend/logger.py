import logging
import json
import os
from datetime import datetime

class StructuredLogger:
    def __init__(self, name="DHUND"):
        self.logger = logging.getLogger(name)
        self.logger.setLevel(logging.INFO)
        
        # Avoid duplicate handlers
        if not self.logger.handlers:
            handler = logging.StreamHandler()
            formatter = logging.Formatter('%(message)s')
            handler.setFormatter(formatter)
            self.logger.addHandler(handler)

    def _log(self, level, message, **kwargs):
        log_data = {
            "timestamp": datetime.now().isoformat(),
            "level": level,
            "message": message,
            **kwargs
        }
        self.logger.info(json.dumps(log_data))

    def info(self, message, **kwargs):
        self._log("INFO", message, **kwargs)

    def error(self, message, **kwargs):
        self._log("ERROR", message, **kwargs)

    def warning(self, message, **kwargs):
        self._log("WARNING", message, **kwargs)

    def debug(self, message, **kwargs):
        self._log("DEBUG", message, **kwargs)

logger = StructuredLogger()
