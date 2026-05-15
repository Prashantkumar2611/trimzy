import os
import re

target_dir = '/Users/prasantkumar/Downloads/trimzy_2'

def update_css(content):
    new_blocks = []
    blocks = content.split('}')
    for block in blocks:
        if '{' not in block:
            new_blocks.append(block)
            continue
            
        selector_part, rules_part = block.split('{', 1)
        sel = selector_part.lower()
        target_weight = None
        
        # Hero titles
        if 'hero' in sel or '.cta-title' in sel or 'h1' in sel:
            target_weight = '800'
        # Headings
        elif 'title' in sel or 'heading' in sel or 'h2' in sel or 'h3' in sel or 'logo' in sel or 'name' in sel:
            if target_weight is None:
                target_weight = '700'
        # Subheadings
        elif 'sub' in sel or 'desc' in sel or 'detail' in sel:
            if target_weight is None:
                target_weight = '600'
        # Buttons / Navbar
        elif 'btn' in sel or 'button' in sel or 'nav' in sel or 'tab' in sel or 'chip' in sel or 'badge' in sel or 'menu' in sel:
            if target_weight is None:
                target_weight = '500'
                
        if target_weight:
            if 'font-weight:' in rules_part:
                rules_part = re.sub(r'font-weight:\s*[a-zA-Z0-9]+;?', f'font-weight: {target_weight};', rules_part)
            else:
                rules_part = f" font-weight: {target_weight};" + rules_part
                
        new_blocks.append(f"{selector_part}{{{rules_part}")
        
    return '}'.join(new_blocks)

# Update HTML inline styles
def update_html(content):
    # Regex to find <button ... style="... font-weight: \d+ ..."> and replace weight
    def btn_replacer(match):
        return re.sub(r'font-weight:\s*\d+;?', 'font-weight:500;', match.group(0))
    
    # replace inside <button>
    content = re.sub(r'<button[^>]+style="[^"]+"[^>]*>', btn_replacer, content)
    
    # regex for titles (divs with title or heading in class/id)
    def title_replacer(match):
        return re.sub(r'font-weight:\s*\d+;?', 'font-weight:700;', match.group(0))
    content = re.sub(r'<[^>]+(?:class|id)="[^"]*(?:title|heading|name)[^"]*"[^>]+style="[^"]+"[^>]*>', title_replacer, content)

    # regex for subheadings
    def sub_replacer(match):
        return re.sub(r'font-weight:\s*\d+;?', 'font-weight:600;', match.group(0))
    content = re.sub(r'<[^>]+(?:class|id)="[^"]*(?:sub|desc)[^"]*"[^>]+style="[^"]+"[^>]*>', sub_replacer, content)
    
    return content

for root, dirs, files in os.walk(target_dir):
    if '.git' in root or 'node_modules' in root:
        continue
    for file in files:
        filepath = os.path.join(root, file)
        try:
            if file.endswith('.css'):
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                new_content = update_css(content)
                if new_content != content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Updated weights in {filepath}")
            elif file.endswith('.html'):
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                new_content = update_html(content)
                if new_content != content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Updated inline weights in {filepath}")
        except Exception as e:
            pass
