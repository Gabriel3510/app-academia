#!/usr/bin/env python3
"""
Gera os ícones da versão web (PWA) e do Android a partir do logo do app.
O desenho segue src/components/UI/Logo.tsx e public/favicon.svg (grade de 64 x 64).

Uso, na raiz do projeto:
  npm run icons
"""

import os

from PIL import Image, ImageDraw

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
RES = os.path.join(ROOT, "android", "app", "src", "main", "res")

BACKGROUND = (24, 26, 34, 255)   # #181A22
ORANGE = (255, 106, 26, 255)     # #FF6A1A
BAR = (243, 244, 246, 255)       # #F3F4F6

# x, y, largura, altura, raio, cor (grade de 64)
SHAPES = [
    (21, 29, 22, 6, 3, BAR),
    (14, 17, 8, 30, 3, ORANGE),
    (42, 17, 8, 30, 3, ORANGE),
    (7, 23, 6, 18, 2.5, ORANGE),
    (51, 23, 6, 18, 2.5, ORANGE),
]

SUPERSAMPLE = 4


def draw_mark(draw, offset_x, offset_y, scale):
    for x, y, w, h, r, color in SHAPES:
        box = [offset_x + x * scale, offset_y + y * scale, offset_x + (x + w) * scale, offset_y + (y + h) * scale]
        draw.rounded_rectangle(box, radius=r * scale, fill=color)


def render(size, background=True, rounded=True, circle=False, mark_ratio=1.0):
    """Desenha em tamanho maior e reduz, para bordas suaves."""
    big = size * SUPERSAMPLE
    image = Image.new("RGBA", (big, big), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    if background:
        if circle:
            draw.ellipse([0, 0, big - 1, big - 1], fill=BACKGROUND)
        elif rounded:
            draw.rounded_rectangle([0, 0, big - 1, big - 1], radius=big * 16 / 64, fill=BACKGROUND)
        else:
            draw.rectangle([0, 0, big, big], fill=BACKGROUND)
    mark = big * mark_ratio
    offset = (big - mark) / 2
    draw_mark(draw, offset, offset, mark / 64)
    return image.resize((size, size), Image.LANCZOS)


def save(image, *parts):
    path = os.path.join(ROOT, *parts)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    image.save(path, optimize=True)
    print("gerado", os.path.relpath(path, ROOT))


def splash(width, height):
    image = Image.new("RGBA", (width, height), BACKGROUND)
    size = int(min(width, height) * 0.32)
    mark = render(size, background=False)
    image.alpha_composite(mark, ((width - size) // 2, (height - size) // 2))
    return image.convert("RGB")


def main():
    # PWA: o ícone "maskable" precisa de margem, então usa o fundo inteiro com a marca menor
    save(render(192, rounded=False, mark_ratio=0.8), "public", "icons", "icon-192.png")
    save(render(512, rounded=False, mark_ratio=0.8), "public", "icons", "icon-512.png")
    save(render(180, rounded=False, mark_ratio=0.8), "public", "icons", "apple-touch-icon.png")

    if not os.path.isdir(RES):
        print("Projeto Android não encontrado, ícones nativos ignorados")
        return

    densities = {"mdpi": 1, "hdpi": 1.5, "xhdpi": 2, "xxhdpi": 3, "xxxhdpi": 4}
    for name, factor in densities.items():
        legacy = round(48 * factor)
        save(render(legacy, rounded=True, mark_ratio=0.86), RES, f"mipmap-{name}", "ic_launcher.png")
        save(render(legacy, circle=True, mark_ratio=0.72), RES, f"mipmap-{name}", "ic_launcher_round.png")
        # Ícone adaptativo: 108 dp, com a área segura de 66 dp no centro
        save(render(round(108 * factor), background=False, mark_ratio=0.56), RES, f"mipmap-{name}", "ic_launcher_foreground.png")

    for folder in os.listdir(RES):
        path = os.path.join(RES, folder, "splash.png")
        if os.path.isfile(path):
            with Image.open(path) as current:
                width, height = current.size
            save(splash(width, height), RES, folder, "splash.png")


if __name__ == "__main__":
    main()
