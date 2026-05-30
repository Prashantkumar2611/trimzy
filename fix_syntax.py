import os

path = "src/pages/AppPage.jsx"
with open(path, "r") as f:
    text = f.read()

# Fix nested quotes caused by font-family
text = text.replace("''Sora'", "\"'Sora'")
text = text.replace("''DM Sans'", "\"'DM Sans'")
text = text.replace("''Inter'", "\"'Inter'")
text = text.replace(",sans-serif'", ",sans-serif'\"")

with open(path, "w") as f:
    f.write(text)
