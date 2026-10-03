import logging
import sys


def setup_logging(debug: bool = False) -> logging.Logger:
    """
    Configure application-wide structured logging.
    Ensures safe logs that do NOT expose credentials, tokens, or raw passwords.
    """
    log_level = logging.DEBUG if debug else logging.INFO
    formatter = logging.Formatter(
        "[%(asctime)s] [%(levelname)s] [%(name)s]: %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(formatter)

    root_logger = logging.getLogger()
    # Remove existing handlers to avoid duplicates
    for existing_handler in root_logger.handlers[:]:
        root_logger.removeHandler(existing_handler)

    root_logger.setLevel(log_level)
    root_logger.addHandler(handler)

    # Silence overly verbose third-party loggers
    logging.getLogger("uvicorn.access").setLevel(logging.INFO)
    logging.getLogger("motor").setLevel(logging.WARNING)
    logging.getLogger("pymongo").setLevel(logging.WARNING)

    logger = logging.getLogger("mr_office")
    logger.info("Logging configured. Debug mode: %s", debug)
    return logger


logger = logging.getLogger("mr_office")
