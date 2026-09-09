import re

with open('src/components/TefasFundsSection.tsx', 'r') as f:
    lines = f.readlines()

new_lines = []
for i, line in enumerate(lines):
    # If the line is EXACTLY "    </div>\n" or "</div>\n" or "      </div>\n" 
    # but not part of a valid structure... this is hard.
    pass

