const requestCounts = {};

const rateLimit = (options) => {
    const { windowMs, max } = options;
  
    return (req, res, next) => {
      const ipAddress = req.ip;
      const now = Date.now();
  
      if (!requestCounts[ipAddress]) {
        requestCounts[ipAddress] = {
          count: 1,
          resetTime: now + windowMs,
        };
      } else {
        const { count, resetTime } = requestCounts[ipAddress];
  
        if (now > resetTime) {
          requestCounts[ipAddress] = {
            count: 1,
            resetTime: now + windowMs,
          };
        } else {
          if (count >= max) {
            return res.status(429).json({
              error: 'Too many requests from this IP, please try again after some time',
            });
          }
  
          requestCounts[ipAddress].count++;
        }
      }
  
      next();
    };
  };