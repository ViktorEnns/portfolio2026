import os
import shutil

src_dir = r"g:\OneDrive\Dokumente\- Bewerbung\Bilder"
dest_dir = r"e:\- CODE\VEwebsite\assets\sometimes"

if not os.path.exists(dest_dir):
    print(f"Creating directory: {dest_dir}")
    os.makedirs(dest_dir)

if not os.path.exists(src_dir):
    print(f"Error: Source directory {src_dir} does not exist!")
    exit(1)

files = os.listdir(src_dir)
print(f"Found {len(files)} files in source.")

copied = 0
for f in files:
    src_path = os.path.join(src_dir, f)
    dest_path = os.path.join(dest_dir, f)
    
    # We copy files that are images, video, or the text file
    if os.path.isfile(src_path) and f.lower().endswith(('.jpg', '.jpeg', '.png', '.mp4', '.txt')):
        try:
            shutil.copy2(src_path, dest_path)
            copied += 1
        except Exception as e:
            print(f"Error copying {f}: {e}")

print(f"Successfully copied {copied} files to {dest_dir}.")
