import re
import os

with open('auth.html', 'r') as f:
    html = f.read()

# Extract body contents
body_match = re.search(r'<body>(.*?)</body>', html, re.DOTALL)
if body_match:
    body = body_match.group(1)
else:
    body = html

# Remove scripts
body = re.sub(r'<script.*?>.*?</script>', '', body, flags=re.DOTALL)
# Remove comments (except if they are useful, but let's just strip them to avoid JSX comment issues)
body = re.sub(r'<!--(.*?)-->', r'{/* \1 */}', body, flags=re.DOTALL)

# Convert class to className
body = body.replace('class="', 'className="')

# Convert inline styles
def style_replacer(match):
    style_str = match.group(1)
    props = {}
    for rule in style_str.split(';'):
        rule = rule.strip()
        if not rule:
            continue
        parts = rule.split(':', 1)
        if len(parts) == 2:
            key = parts[0].strip()
            val = parts[1].strip()
            # camelCase the key
            key_parts = key.split('-')
            key_camel = key_parts[0] + ''.join(x.title() for x in key_parts[1:])
            # wrap val in quotes
            props[key_camel] = f"'{val}'"
    style_obj = "{" + ", ".join(f"{k}: {v}" for k, v in props.items()) + "}"
    return f"style={{{style_obj}}}"

body = re.sub(r'style="([^"]+)"', style_replacer, body)

# Convert self-closing tags
body = re.sub(r'<input([^>]*?)(?<!/)>', r'<input\1 />', body)
body = re.sub(r'<hr([^>]*?)(?<!/)>', r'<hr\1 />', body)
body = re.sub(r'<img([^>]*?)(?<!/)>', r'<img\1 />', body)
body = re.sub(r'<br([^>]*?)(?<!/)>', r'<br\1 />', body)

# Replace onclick
def onclick_replacer(match):
    code = match.group(1)
    code = code.replace("event", "e")
    # For common known functions, add window. prefix
    funcs = [
        'goBack', 'sendOTP', 'verifyOTP', 'handleLoginSuccess'
    ]
    for func in funcs:
        code = code.replace(f"{func}(", f"window.{func}(")
    
    return f"onClick={{(e) => {{ {code} }}}}"

body = re.sub(r'onclick="([^"]+)"', onclick_replacer, body)
body = re.sub(r'onkeydown="([^"]+)"', r'onKeyDown={(e) => { \1 }}', body)
body = re.sub(r'oninput="([^"]+)"', r'onInput={(e) => { \1 }}', body)
body = re.sub(r'onchange="([^"]+)"', r'onChange={(e) => { \1 }}', body)

# Fix nested quotes
body = body.replace("''Sora'", "\"'Sora'")
body = body.replace("''DM Sans'", "\"'DM Sans'")
body = body.replace("''Inter'", "\"'Inter'")
body = body.replace(",sans-serif'", ",sans-serif'\"")
body = body.replace(", sans-serif'", ", sans-serif'\"")

jsx_template = f"""import React, {{ useEffect }} from 'react';
import {{ useNavigate, Link }} from 'react-router-dom';
import '../../css/auth.css';

const Auth = () => {{
  const navigate = useNavigate();

  useEffect(() => {{
    // Dynamically import the auth.js script so it runs after the component mounts
    import('../../js/auth.js').then((module) => {{
      // module loaded
    }}).catch(err => console.error(err));
  }}, []);

  return (
    <>
      {body}
    </>
  );
}};

export default Auth;
"""

with open('src/pages/Auth.jsx', 'w') as f:
    f.write(jsx_template)
