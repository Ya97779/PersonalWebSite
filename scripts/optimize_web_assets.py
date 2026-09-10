"""Generate web-friendly WebP variants for the portfolio's large raster images."""

from pathlib import Path

from PIL import Image, ImageFilter, ImageOps


ROOT = Path(__file__).resolve().parents[1]
PROJECTS = ROOT / "assets" / "projects"

# source name: (output name, maximum width, WebP quality)
ASSETS = {
    "ios01.png": ("ios01.webp", 1000, 86),
    "ios02.png": ("ios02.webp", 1000, 86),
    "ios03.png": ("ios03.webp", 1000, 86),
    "llm-wiki-workspace.jpg": ("llm-wiki-workspace.webp", 1600, 84),
    "mybody.jpg": ("mybody.webp", 1600, 84),
    "wa.png": ("wa.webp", 1600, 84),
    "wgame1.png": ("wgame1.webp", 1600, 84),
    "yunding.jpg": ("yunding.webp", 1600, 84),
    "shibo.jpg": ("shibo-redacted.webp", 900, 82),
}

# Privacy-sensitive regions in source-image pixels: left, top, right, bottom.
# The source remains local-only; the generated WebP is safe to publish.
REDACTIONS = {
    "shibo.jpg": (530, 805, 1090, 900),
}


for source_name, (output_name, max_width, quality) in ASSETS.items():
    source = PROJECTS / source_name
    output = PROJECTS / output_name

    with Image.open(source) as opened:
        image = ImageOps.exif_transpose(opened)
        if source_name in REDACTIONS:
            region = REDACTIONS[source_name]
            redacted = image.crop(region).filter(ImageFilter.GaussianBlur(radius=20))
            redacted = redacted.resize((14, 3), Image.Resampling.BOX)
            redacted = redacted.resize(
                (region[2] - region[0], region[3] - region[1]),
                Image.Resampling.NEAREST,
            )
            image.paste(redacted, region)
        if image.width > max_width:
            height = round(image.height * max_width / image.width)
            image = image.resize((max_width, height), Image.Resampling.LANCZOS)
        if image.mode not in ("RGB", "RGBA"):
            image = image.convert("RGB")
        image.save(output, "WEBP", quality=quality, method=6)

    old_kib = source.stat().st_size / 1024
    new_kib = output.stat().st_size / 1024
    print(
        f"{source_name} -> {output_name} "
        f"({image.width}x{image.height}, {old_kib:.0f} KiB -> {new_kib:.0f} KiB)"
    )
