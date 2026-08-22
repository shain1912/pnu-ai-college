#!/usr/bin/env bash
# Higgsfield asset generation — PNU AI College cinematic site
set -u
OUT=assets/jobs.txt
: > "$OUT"

mk () {  # mk <slug> <aspect> <res> <prompt>
  local slug="$1" ar="$2" res="$3" prompt="$4"
  local id
  id=$(higgsfield generate create nano_banana_pro \
        --prompt "$prompt" --aspect-ratio "$ar" --resolution "$res" --json 2>&1 \
       | grep -oE '"id"[[:space:]]*:[[:space:]]*"[^"]+"' | head -1 | grep -oE '[0-9a-f-]{36}')
  echo "$slug|$id" | tee -a "$OUT"
}

STYLE="Cinematic still, anamorphic lens, volumetric haze, shallow depth of field, fine film grain, restrained premium color grade of deep navy graphite and charcoal with cool cyan-teal accent light. Absolutely no text, no words, no letters, no logos, no watermarks."

mk hero 21:9 4k "Wide establishing shot of a monumental university AI research atrium at blue hour. Double-height dark concrete and glass hall, thin horizontal light strips receding into deep perspective, a faint holographic neural-network lattice suspended in mid-air and softly out of focus. Empty, silent, awe-inducing. $STYLE"

mk campus 16:9 2k "A modern university engineering building at blue hour, brutalist concrete and glass, warm interior lights glowing from within, low camera angle looking up, wet plaza reflecting the facade. $STYLE"

mk lab 16:9 2k "Interior of an advanced machine-learning laboratory at night, rows of dark workstations with large monitors glowing cyan, GPU server rack visible through glass partition, anonymous silhouetted researchers seen from behind, heavily backlit. $STYLE"

mk r_health 4:5 2k "Abstract medical AI visualization: a translucent volumetric scan of a human torso rendered as a luminous cyan point cloud floating in a dark void, delicate data contour lines wrapping it. $STYLE"

mk r_factory 4:5 2k "Abstract smart-factory visualization: a robotic arm silhouette in a dark automated plant, cyan laser scan lines sweeping across a conveyor, sparse glowing sensor nodes connected by thin lines. $STYLE"

mk r_finance 4:5 2k "Abstract digital-finance visualization: a dark vertical wall of flowing luminous data ribbons and candlestick-like light bars, cyan and pale gold highlights, deep perspective, no readable numbers. $STYLE"

mk r_logistics 4:5 2k "Abstract intelligent-logistics visualization: a night aerial view of a port terminal reduced to a dark grid, stacked containers as dim geometric blocks, glowing cyan route lines arcing between nodes. $STYLE"

mk lattice 1:1 2k "Seamless abstract texture: a dense three-dimensional neural network lattice of fine luminous cyan filaments and small glowing nodes on a near-black background, even distribution, macro depth of field. $STYLE"
