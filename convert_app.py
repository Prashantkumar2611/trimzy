import re

with open('app.html', 'r') as f:
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
    # Very basic parsing, not perfect for all cases but works for this file
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
    # If it's a simple function call like closePincodeModal()
    # we wrap it in () => { window.func() }
    # Let's just do () => { eval(code) } - wait, no eval in React typically, but it's okay for this port if we just do window.eval or translate manually.
    # Actually, most onclicks are like `func()` or `func('arg')`. We can just prefix with `window.` if it's a known function, or just use a generic wrapper.
    # We will just do `onClick={(event) => { /* manual fix */ }}` for now, but let's try to parse:
    if "typeof openAuthModal" in code:
         return "onClick={() => window.openAuthModal ? window.openAuthModal() : (window.location.href='auth.html?redirect=app.html')}"
    
    # Simple replacement: just wrap the whole thing inside () => { ... }
    # But we need to make sure variables like 'event' are passed if used.
    # if 'event' in code:
    code = code.replace("event", "e")
    
    # Just run it using a new Function or just prefix window.
    # Let's just output onClick={() => { ... }} and we'll fix window. manually if needed.
    return f"onClick={{(e) => {{ {code} }}}}"

body = re.sub(r'onclick="([^"]+)"', onclick_replacer, body)
body = re.sub(r'onkeydown="([^"]+)"', r'onKeyDown={(e) => { \1 }}', body)
body = re.sub(r'oninput="([^"]+)"', r'onInput={(e) => { \1 }}', body)
body = re.sub(r'onchange="([^"]+)"', r'onChange={(e) => { \1 }}', body)


jsx_template = f"""import React, {{ useEffect }} from 'react';
import {{ useNavigate, Link }} from 'react-router-dom';
import '../../css/app.css';

const AppPage = () => {{
  const navigate = useNavigate();

  useEffect(() => {{
    // Dynamically import the app.js script so it runs after the component mounts
    import('../../js/app.js').then((module) => {{
      // module loaded
    }}).catch(err => console.error(err));
  }}, []);

  return (
    <>
      {body}
    </>
  );
}};

export default AppPage;
"""

with open('src/pages/AppPage.jsx', 'w') as f:
    f.write(jsx_template)
