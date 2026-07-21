# Pico look mechanics

Pico is a soft-bodied, front-facing studio buddy. The feet and lower torso stay planted as the stable registration anchor. The cream face panel and eye shapes lead the gaze; the head/upper teal hood follows with a restrained bend, while the pencil remains tucked behind the same ear and lags only slightly rather than flipping independently.

## Cardinal pose families

- `000 up`: lower body stays planted; face panel lifts subtly, eyelids open toward the top edge, pupils sit high, and the small top tuft follows upward.
- `090 screen-right`: torso remains mostly frontal; face panel and eye construction turn/bend toward screen-right, with nose and pupils clearly right of head center; the pencil stays attached and becomes slightly more side-on.
- `180 down`: lower body stays planted; face panel settles downward, eyelids and pupils aim toward the bottom edge, with a small upper-body tuck.
- `270 screen-left`: inverse of screen-right in viewer coordinates; face panel and pupils clearly move toward screen-left, with the pencil still attached and partly occluded by the head turn.

## Interpolation budget

Each 22.5-degree step changes the face-panel bend, pupil/eyelid aim, and upper-body follow-through by a small even amount. The feet, belly, and baseline do not slide. The pencil remains attached in every direction, with only gradual occlusion and slight lag. No whole-sprite rotation, skew, or affine tilt is allowed.
