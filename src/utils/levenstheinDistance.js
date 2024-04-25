export function levenshteinDistance(str1, str2) {
  const m = str1.length;
  const n = str2.length;
  
  // Create a 2D array to store the distances
  const dp = [];
  for (let i = 0; i <= m; i++) {
    dp.push([]);
    for (let j = 0; j <= n; j++) {
      if (i === 0) {
        dp[i][j] = j;
      } else if (j === 0) {
        dp[i][j] = i;
      } else {
        dp[i][j] = 0;
      }
    }
  }
  
  // Fill in the DP table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  
  // Return the distance
  return dp[m][n];
}