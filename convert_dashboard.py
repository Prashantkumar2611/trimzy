import re

def convert_file(html_file, jsx_file, comp_name, script_name, css_name):
    with open(html_file, 'r') as f:
        html = f.read()

    body_match = re.search(r'<body[^>]*>(.*?)</body>', html, re.DOTALL)
    body = body_match.group(1) if body_match else html

    body = re.sub(r'<script.*?>.*?</script>', '', body, flags=re.DOTALL)
    body = re.sub(r'<!--(.*?)-->', r'{/* \1 */}', body, flags=re.DOTALL)
    body = body.replace('class="', 'className="')

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
                key_parts = key.split('-')
                key_camel = key_parts[0] + ''.join(x.title() for x in key_parts[1:])
                props[key_camel] = f"'{val}'"
        style_obj = "{" + ", ".join(f"{k}: {v}" for k, v in props.items()) + "}"
        return f"style={{{style_obj}}}"

    body = re.sub(r'style="([^"]+)"', style_replacer, body)
    body = re.sub(r'<input([^>]*?)(?<!/)>', r'<input\1 />', body)
    body = re.sub(r'<hr([^>]*?)(?<!/)>', r'<hr\1 />', body)
    body = re.sub(r'<img([^>]*?)(?<!/)>', r'<img\1 />', body)
    body = re.sub(r'<br([^>]*?)(?<!/)>', r'<br\1 />', body)

    def onclick_replacer(match):
        code = match.group(1)
        code = code.replace("event", "e")
        funcs = [
            'switchTab', 'toggleStatus', 'handleLogout', 'saveServices', 'editProfile',
            'saveProfile', 'closePincodeModal', 'lookupPincode', 'addServiceField', 'removeServiceField'
        ]
        for func in funcs:
            code = code.replace(f"{func}(", f"window.{func}(")
        return f"onClick={{(e) => {{ {code} }}}}"

    body = re.sub(r'onclick="([^"]+)"', onclick_replacer, body)
    body = re.sub(r'onkeydown="([^"]+)"', r'onKeyDown={(e) => { \1 }}', body)
    body = re.sub(r'oninput="([^"]+)"', r'onInput={(e) => { \1 }}', body)
    body = re.sub(r'onchange="([^"]+)"', r'onChange={(e) => { \1 }}', body)

    body = body.replace("''Sora'", "\"'Sora'")
    body = body.replace("''DM Sans'", "\"'DM Sans'")
    body = body.replace("''Inter'", "\"'Inter'")
    body = body.replace(",sans-serif'", ",sans-serif'\"")
    body = body.replace(", sans-serif'", ", sans-serif'\"")

    body = body.replace('checked ', 'defaultChecked ')
    body = body.replace('required ', 'required={true} ')
    body = body.replace('disabled ', 'disabled={true} ')
    body = body.replace('readonly ', 'readOnly={true} ')
    body = body.replace('for="', 'htmlFor="')

    jsx_template = f"""import React, {{ useEffect }} from 'react';
import {{ useNavigate }} from 'react-router-dom';
import '../../css/{css_name}';

const {comp_name} = () => {{
  const navigate = useNavigate();

  useEffect(() => {{
    import('../../js/{script_name}').catch(err => console.error(err));
  }}, []);

  return (
    <>
      {body}
    </>
  );
}};

export default {comp_name};
"""
    with open(f'src/pages/{jsx_file}', 'w') as f:
        f.write(jsx_template)

convert_file('barber-dashboard.html', 'BarberDashboard.jsx', 'BarberDashboard', 'barber-dashboard.js', 'barber-dashboard.css')
