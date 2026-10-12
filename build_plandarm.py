with open('about.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

header_lines = lines[0:184]
footer_lines = lines[1053:]

with open('plandarm.html', 'w', encoding='utf-8') as f:
    f.writelines(header_lines)
    f.write('\n    <!-- MAIN CONTENT GOES HERE -->\n\n')
    f.writelines(footer_lines)

print("Created plandarm.html with header and footer from about.html")
