import matter from "gray-matter";
import { fetchGitHubContent, fetchFileContent } from './github';

interface Hunt {
  id: string;
  tactic: string;
  hypothesis: string;
  tags: string[];
  submitter: {
    name: string;
    link: string;
  };
  content: string;
  notes?: string;
}

const GITHUB_DIRS = ['Alchemy', 'Embers', 'Flames'];
const REPO_OWNER = 'triw0lf';
const REPO_NAME = 'HEARTH';

function parseMarkdownTable(content: string): Partial<Hunt> | null {
  try {
    // First, find the table in the content
    const lines = content.split('\n');

    // Find the header row and data row
    const headerIndex = lines.findIndex(line => line.includes('Hunt #') || line.includes('| Idea'));
    if (headerIndex === -1) {
      console.debug('No header row found');
      return null;
    }

    // Get the data row (should be 2 rows after header, accounting for separator line)
    const dataRow = lines[headerIndex + 2];
    if (!dataRow) {
      console.debug('No data row found');
      return null;
    }

    // Clean up the data row and split into columns
    const columns = dataRow
        .split('|')
        .map(col => col.trim())
        .filter(Boolean);

    console.debug('Parsed columns:', columns);

    if (columns.length < 5) {
      console.debug('Not enough columns found:', columns.length);
      return null;
    }

    // Extract submitter information
    const submitterMatch = columns[5]?.match(/\[([^\]]+)\]\(([^)]+)\)/);

    // Parse tags, handling different formats
    const tagsString = columns[4] || '';
    const tags = tagsString
        .split(/[\s,]+/) // Split on whitespace or commas
        .map(tag => tag.trim())
        .filter(tag => tag.startsWith('#'))
        .map(tag => tag.substring(1))
        .filter(Boolean);

    const huntData = {
      id: columns[0].replace(/[^HMB0-9]/g, ''), // Clean up ID to just the identifier
      hypothesis: columns[1],
      tactic: columns[2],
      notes: columns[3],
      tags,
      submitter: {
        name: submitterMatch ? submitterMatch[1] : '',
        link: submitterMatch ? submitterMatch[2] : ''
      }
    };

    console.debug('Parsed hunt data:', huntData);
    return huntData;

  } catch (error) {
    console.error('Error parsing markdown table:', error);
    return null;
  }
}

export async function getAllHunts(): Promise<Hunt[]> {
  const hunts = await collectMarkdownFiles();
  return hunts
      .map(hunt => {
        try {
          const { content } = matter(hunt.content);
          const parsedData = parseMarkdownTable(content);

          if (!parsedData) {
            console.warn(`Failed to parse hunt data for ${hunt.id}`, 'Content:', content);
            return null;
          }

          return {
            ...parsedData,
            content // Keep the full content for the dialog
          } as Hunt;
        } catch (error) {
          console.error(`Error processing hunt ${hunt.id}:`, error);
          return null;
        }
      })
      .filter((hunt): hunt is Hunt => hunt !== null && Boolean(hunt.hypothesis));
}

export async function getHunt(id: string): Promise<Hunt | null> {
  try {
    const hunts = await getAllHunts();
    return hunts.find(hunt => hunt.id === id) || null;
  } catch {
    return null;
  }
}

export async function searchHunts(query: string): Promise<Hunt[]> {
  const hunts = await getAllHunts();
  const searchTerm = query.toLowerCase();

  return hunts.filter(hunt =>
      hunt.content.toLowerCase().includes(searchTerm) ||
      hunt.hypothesis.toLowerCase().includes(searchTerm) ||
      hunt.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
      hunt.notes?.toLowerCase().includes(searchTerm)
  );
}

async function collectMarkdownFiles(): Promise<{ id: string, content: string }[]> {
  const hunts: { id: string, content: string }[] = [];

  for (const dir of GITHUB_DIRS) {
    try {
      const files = await fetchGitHubContent(REPO_OWNER, REPO_NAME, dir);

      for (const file of files) {
        if (!file.download_url) continue;

        const content = await fetchFileContent(file.download_url);
        const id = file.name.replace('.md', '');
        hunts.push({ id, content });
      }
    } catch (error) {
      console.error(`Error reading directory ${dir}:`, error);
    }
  }

  return hunts;
}