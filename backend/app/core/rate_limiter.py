import time
from collections import defaultdict
from typing import Dict, List
from fastapi import HTTPException, Request, status


class InMemoryRateLimiter:
    """
    Sliding window in-memory rate limiter for public endpoints.
    Tracks client IP request timestamps.
    In multi-worker production, Redis or a Cloudflare WAF rule should be used.
    """
    def __init__(self, requests_limit: int, window_seconds: int):
        self.requests_limit = requests_limit
        self.window_seconds = window_seconds
        self.ip_records: Dict[str, List[float]] = defaultdict(list)

    def check_rate_limit(self, request: Request) -> None:
        client_ip = (
            request.headers.get("x-forwarded-for")
            or (request.client.host if request.client else "127.0.0.1")
        ).split(",")[0].strip()

        now = time.time()
        window_start = now - self.window_seconds

        # Clean old timestamps
        recent_timestamps = [t for t in self.ip_records[client_ip] if t > window_start]
        self.ip_records[client_ip] = recent_timestamps

        if len(recent_timestamps) >= self.requests_limit:
            retry_after = int(recent_timestamps[0] + self.window_seconds - now)
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Too many requests. Please try again in {max(1, retry_after)} seconds.",
                headers={"Retry-After": str(max(1, retry_after))}
            )

        self.ip_records[client_ip].append(now)


# Standard rate limiters
login_rate_limiter = InMemoryRateLimiter(requests_limit=10, window_seconds=300)      # 10 attempts / 5 mins
enquiry_rate_limiter = InMemoryRateLimiter(requests_limit=5, window_seconds=600)     # 5 enquiries / 10 mins
