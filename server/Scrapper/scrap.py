import re
import fitz  # PyMuPDF for PDF handling
import docx
import os
import requests
import base64
import json

def repository_details(repo_url):
    """Fetch repository details like description and README content."""
    parts = repo_url.strip('/').split('/')
    if len(parts) != 5:
        print("Invalid repository URL format")
        return []

    owner, repo = parts[3], parts[4]
    api_url = f"https://api.github.com/repos/{owner}/{repo}"
    response = requests.get(api_url)
    
    if response.status_code != 200:
        print(f"Error: Unable to fetch repository details for {repo_url}")
        return []
    
    repo_details = []
    data = response.json()
    project_data = data.get('description', 'No description available')
    repo_details.append(project_data)
    
    readme_url = f"{api_url}/readme"
    readme_response = requests.get(readme_url)
    
    if readme_response.status_code == 200:
        readme_data = readme_response.json()
        decoded_content = base64.b64decode(readme_data['content']).decode('utf-8')
        repo_details.append(decoded_content)
    else:
        repo_details.append("Error: Unable to fetch README content.")
    
    return repo_details

def leetcode_details(username):
    """Fetch LeetCode problem-solving stats."""
    url = "https://leetcode.com/graphql/"
    headers = {"Content-Type": "application/json"}
    query = {
        "query": """
        query skillStats($username: String!) {
  matchedUser(username: $username) {
    tagProblemCounts {
      advanced {
        tagName
        tagSlug
        problemsSolved
      }
      intermediate {
        tagName
        tagSlug
        problemsSolved
      }
      fundamental {
        tagName
        tagSlug
        problemsSolved
      }
    }
  }
}
        """,
        "variables": {"username": username}
    }
    try:
        response = requests.post(url, headers=headers, data=json.dumps(query))
        response.raise_for_status()
        data = response.json()
        return json.dumps(data.get("data", {}).get("matchedUser", {}), indent=4)
    except requests.exceptions.RequestException as e:
        return f"Error: {e}"

def extract_links_from_pdf(pdf_path):
    """Extract all clickable and text-based links from a PDF file."""
    links = []
    try:
        doc = fitz.open(pdf_path)
        for page in doc:
            for link in page.get_links():
                if 'uri' in link and link['uri'].startswith("http"):
                    links.append(link['uri'])
            links.extend(extract_links_from_text(page.get_text("text")))
    except Exception as e:
        print(f"Error extracting PDF links: {e}")
    return list(set(links))

def extract_text_from_docx(docx_path):
    """Extract text from a DOCX file."""
    try:
        doc = docx.Document(docx_path)
        return "\n".join([para.text for para in doc.paragraphs])
    except Exception as e:
        print(f"Error extracting DOCX text: {e}")
        return ""

def extract_links_from_text(text):
    """Extract all links from text using regex."""
    url_pattern = re.compile(r'https?://[^\s<>"]+|www\.[^\s<>"]+')
    return url_pattern.findall(text)

def get_github_details(file_path):
    """Extract and return GitHub repository details from a resume."""
    if not os.path.exists(file_path):
        print("Error: File not found!")
        return []
    
    _, ext = os.path.splitext(file_path)
    links = extract_links_from_pdf(file_path) if ext.lower() == ".pdf" else extract_links_from_text(extract_text_from_docx(file_path))
    github_links = [link for link in links if "github.com" in link and link.count('/') >= 4]
    return [repository_details(link) for link in github_links]

def get_leetcode_details(file_path):
    """Extract and return LeetCode user details from a resume."""
    if not os.path.exists(file_path):
        print("Error: File not found!")
        return ""
    
    _, ext = os.path.splitext(file_path)
    links = extract_links_from_pdf(file_path) if ext.lower() == ".pdf" else extract_links_from_text(extract_text_from_docx(file_path))
    leetcode_links = [link for link in links if "leetcode.com" in link]
    if leetcode_links:
        match = re.search(r'leetcode.com/u/([a-zA-Z0-9_]+)', leetcode_links[0])
        return leetcode_details(match.group(1)) if match else "Invalid URL"
    return "No LeetCode link found."

