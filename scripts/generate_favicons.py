from PIL import Image

# Load source symbol (clean SF logo)
src = Image.open('public/logo-transparent.png').convert('RGBA')
pix = src.load()

# Clean dark noise pixels at outer edges
for y in range(src.height):
    for x in range(src.width):
        r, g, b, a = pix[x, y]
        if a > 0 and r < 20 and g < 20 and b < 20 and a < 220:
            pix[x, y] = (0, 0, 0, 0)

bbox = src.getbbox()
symbol = src.crop(bbox) # 198x198

def create_icon(canvas_size, symbol_ratio=0.664):
    symbol_size = int(round(canvas_size * symbol_ratio))
    # Make sure symbol_size has same parity as canvas_size for perfect centering
    if (canvas_size - symbol_size) % 2 != 0:
        symbol_size += 1
    
    resized_sym = symbol.resize((symbol_size, symbol_size), Image.Resampling.LANCZOS)
    img = Image.new('RGBA', (canvas_size, canvas_size), (0, 0, 0, 255))
    offset = ((canvas_size - symbol_size) // 2, (canvas_size - symbol_size) // 2)
    img.paste(resized_sym, offset, resized_sym)
    return img

# 1. High-res 512x512
icon_512 = create_icon(512)
icon_512.save('public/logo.png', 'PNG')
icon_512.save('public/logo-sf.png', 'PNG')

# 2. Apple Touch Icon 180x180
icon_180 = create_icon(180)
icon_180.save('public/apple-touch-icon.png', 'PNG')

# 3. Google Search multiples of 48px: 48, 96, 144, 192
for sz in [48, 96, 144, 192]:
    create_icon(sz).save(f'public/favicon-{sz}x{sz}.png', 'PNG')

# 4. 32x32 and 16x16 PNGs
icon_32 = create_icon(32)
icon_32.save('public/favicon-32x32.png', 'PNG')

icon_16 = create_icon(16)
icon_16.save('public/favicon-16x16.png', 'PNG')

# 5. Multi-resolution favicon.ico (16, 32, 48)
icon_48 = create_icon(48)
icon_48.save('public/favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48)])

print("Successfully generated:")
print(" - public/logo.png (512x512)")
print(" - public/logo-sf.png (512x512)")
print(" - public/apple-touch-icon.png (180x180)")
print(" - public/favicon-32x32.png (32x32)")
print(" - public/favicon-16x16.png (16x16)")
print(" - public/favicon.ico (16, 32, 48)")
