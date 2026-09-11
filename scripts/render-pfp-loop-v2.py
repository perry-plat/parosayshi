"""Animate complete PNG exports from Figma b34YcQifsZU0S2emcxC6Lk / 191:2853.
No SVG reconstruction, recoloring, or individual-path manipulation.
"""
from PIL import Image, ImageOps
from pathlib import Path
import math, subprocess
out=Path('public/assets/invoice-folio/superr-case-study')
frames=[Image.open(out/'pfp-frames-v2'/f'{i}.png').convert('RGB') for i in range(8)]
sheet=Image.new('RGB',(728*4,714*2),'white')
for i,im in enumerate(frames):sheet.paste(im,((i%4)*728,(i//4)*714))
sheet.resize((1456,714)).save('/tmp/pfp-v2-contact.png')
proc=subprocess.Popen(['ffmpeg','-y','-f','rawvideo','-pixel_format','rgb24','-video_size','728x714','-framerate','60','-i','-','-an','-c:v','libx264','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart',str(out/'pfp-pop-loop-v3.mp4'),'-loglevel','error'],stdin=subprocess.PIPE)
fps = 60
frames_per_profile = 48  # Equal 0.8-second pop and hold for every profile.
for f in range(len(frames) * frames_per_profile):
    t=(f%frames_per_profile)/fps
    scale=1-0.10*math.exp(-14*t)*math.cos(28*t)
    im=frames[f//frames_per_profile]
    w,h=round(im.width*scale),round(im.height*scale)
    canvas=Image.new('RGB',(728,714),'white')
    canvas.paste(im.resize((w,h),Image.Resampling.LANCZOS),((728-w)//2,(714-h)//2))
    if f==frames_per_profile + 20:canvas.save(out/'pfp-pop-loop-v3-poster.png')
    proc.stdin.write(canvas.tobytes())
proc.stdin.close()
assert proc.wait()==0
