import os
import re

target_dir = '/Users/prasantkumar/Downloads/trimzy_2'

def fix_fonts(content):
    # Match any google fonts link and replace with Inter
    content = re.sub(
        r'https://fonts\.googleapis\.com/css2\?[^"\'\)]+',
        r'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
        content
    )
    # Replace Sora and Plus Jakarta Sans with Inter
    content = content.replace("'Sora'", "'Inter'")
    content = content.replace('"Sora"', '"Inter"')
    content = content.replace("Sora,", "Inter,")
    content = content.replace("'Plus Jakarta Sans'", "'Inter'")
    content = content.replace('"Plus Jakarta Sans"', '"Inter"')
    return content

for root, dirs, files in os.walk(target_dir):
    if '.git' in root or 'node_modules' in root:
        continue
    for file in files:
        if file.endswith(('.html', '.css', '.js')):
            filepath = os.path.join(root, file)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                new_content = fix_fonts(content)
                
                if new_content != content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Updated fonts in {filepath}")
            except Exception as e:
                pass
