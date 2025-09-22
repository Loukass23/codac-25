// Debug script to test GitHub API access
import { Octokit } from '@octokit/rest';

async function testGitHubAPI() {
  console.log('Testing GitHub API access...');

  // Test with a public repository
  const octokit = new Octokit({
    userAgent: 'CODAC-Platform/1.0.0',
  });

  try {
    // Test fetching a public repository
    const { data } = await octokit.rest.repos.get({
      owner: 'vercel',
      repo: 'next.js',
    });

    console.log('✅ GitHub API access works');
    console.log('Repository:', data.name);
    console.log('Description:', data.description);
    console.log('Stars:', data.stargazers_count);
  } catch (error) {
    console.log('❌ GitHub API error:', error.message);
    console.log('Status:', error.status);
    console.log('Response:', error.response?.data);
  }
}

testGitHubAPI();
