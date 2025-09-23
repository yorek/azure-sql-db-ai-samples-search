// fetchRetry utility: behaves like fetch but retries up to `retries` times on network errors or 5xx responses
async function fetchRetry(input, init = undefined, retries = 3, retryDelay = 500) {
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt++) {
    console.log(`Fetch attempt ${attempt} to ${input}`);
    try {
      const response = await fetch(input, init);
      // If server error (5xx) and we still have attempts left, retry
      if (!response.ok && response.status >= 500 && attempt < retries) {
        lastError = new Error(`HTTP ${response.status} ${response.statusText}`);
        console.log(`Fetch attempt ${attempt} failed: ${lastError.message}. Retrying in ${retryDelay * attempt}ms...`);
        await new Promise((res) => setTimeout(res, retryDelay * attempt));
        continue;
      }
      // For non-5xx errors (e.g., 4xx) return the response so callers can handle it
      return response;
    } catch (err) {
      lastError = err;
      if (attempt < retries) {
        await new Promise((res) => setTimeout(res, retryDelay * attempt));
        continue;
      }
      // no attempts left, throw the last error
      throw lastError;
    }
  }
  throw lastError;
}

export default fetchRetry;