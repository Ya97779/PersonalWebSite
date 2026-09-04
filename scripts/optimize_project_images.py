import argparse
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "assets" / "projects"
OUTPUT.mkdir(parents=True, exist_ok=True)

SOURCE_NAMES = {
    "fitness-01.webp": "健身助手Agent01.png",
    "fitness-02.webp": "健身助手Agent02.png",
    "fitness-03.webp": "健身助手Agent03.png",
    "fitness-04.webp": "健身助手Agent04.png",
    "fitness-05.webp": "健身助手Agent05.png",
    "ios-01.webp": "iosapp01.png",
    "ios-02.webp": "iosapp02.png",
    "ios-03.webp": "iosapp03.png",
    "robot-01.webp": "移动机器人01.png",
}


parser = argparse.ArgumentParser(description="Optimize portfolio project screenshots as WebP files.")
parser.add_argument("source_dir", type=Path, help="Directory containing the original PNG screenshots")
args = parser.parse_args()

for output_name, source_name in SOURCE_NAMES.items():
    source = args.source_dir / source_name
    with Image.open(source) as image:
        max_width = 1800 if output_name.startswith("robot") else 900
        if image.width > max_width:
            height = round(image.height * max_width / image.width)
            image = image.resize((max_width, height), Image.Resampling.LANCZOS)
        if image.mode not in ("RGB", "RGBA"):
            image = image.convert("RGB")
        image.save(OUTPUT / output_name, "WEBP", quality=84, method=6)
        print(f"{source.name} -> {output_name} ({image.width}x{image.height})")
