with open('style.css', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for idx, line in enumerate(lines):
    if 'FMOA: Our Approach Section' in line:
        # found it, we need to cut before the comment block
        cut_idx = idx - 1 # the /* ========
        # let's be sure
        if '=====' in lines[cut_idx]:
            new_lines = lines[:cut_idx]
        else:
            new_lines = lines[:idx]
        break

if new_lines:
    with open('style.css', 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    print(f"Truncated style.css to {len(new_lines)} lines")
else:
    print("Could not find FMOA section")
