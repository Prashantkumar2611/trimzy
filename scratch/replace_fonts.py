import os

target_dir = '/Users/prasantkumar/Downloads/trimzy_2'

for root, dirs, files in os.walk(target_dir):
    if '.git' in root or 'node_modules' in root:
        continue
    for file in files:
        if file.endswith('.html') or file.endswith('.css') or file.endswith('.js'):
            filepath = os.path.join(root, file)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                if 'DM Sans' in content or 'DM+Sans' in content:
                    new_content = content.replace('DM Sans', 'Inter').replace('DM+Sans', 'Inter')
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Updated {filepath}")
            except Exception as e:
                print(f"Error reading {filepath}: {e}")
