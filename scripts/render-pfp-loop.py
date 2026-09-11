"""Render exported PFP crops with the folder loop's half-second pop cadence.
Inputs: original Figma crops in superr-case-study/pfps, section 358:981.
"""
from PIL import Image
from pathlib import Path
import math, subprocess
out=Path('public/assets/invoice-folio/superr-case-study')
icons=[Image.open(out / 'pfps' / f'pfp-{i}.png').convert('RGBA') for i in range(9)]
proc=subprocess.Popen(['ffmpeg','-y','-f','rawvideo','-pixel_format','rgb24','-video_size','1080x540','-framerate','60','-i','-','-an','-c:v','libx264','-crf','19','-pix_fmt','yuv420p','-movflags','+faststart',str(out/'pfp-pop-loop.mp4'),'-loglevel','error'],stdin=subprocess.PIPE)
for frame in range(270):
    t=(frame%30)/60
    scale=1-0.10*math.exp(-14*t)*math.cos(28*t)
    size=round(240*scale)
    icon=icons[frame//30].resize((size,size),Image.Resampling.LANCZOS)
    canvas=Image.new('RGB',(1080,540),'#fffbf7')
    canvas.paste(icon,((1080-size)//2,(540-size)//2),icon)
    if frame==15:canvas.save(out/'pfp-pop-loop-poster.png')
    proc.stdin.write(canvas.tobytes())
proc.stdin.close()
assert proc.wait()==0
