import { Octokit } from '@octokit/rest';

const octokit = new Octokit();

export async function fetchGitHubContent(owner: string, repo: string, path: string) {
    try {
        const response = await octokit.repos.getContent({
            owner,
            repo,
            path,
        });

        if (Array.isArray(response.data)) {
            return response.data
                .filter(file => file.name.endsWith('.md'))
                .map(file => ({
                    name: file.name,
                    path: file.path,
                    download_url: file.download_url,
                }));
        }
        return [];
    } catch (error) {
        console.error('Error fetching GitHub content:', error);
        return [];
    }
}

export async function fetchFileContent(url: string): Promise<string> {
    try {
        const response = await fetch(url);
        return await response.text();
    } catch (error) {
        console.error('Error fetching file content:', error);
        return '';
    }
}
