# New ability: _editable_.

## Tag containers with `class="editable-container"`
- These receive mouse click and hover events.

## Tag elements with `class="editable-position"` and/or `"editable-size"`
- Future: editable paths

## On hover (on container)
- Identify element under it. Walk parent to one of those classes.
- Add "editable-hover" class.
- First remove any other editable-hover.
- Disable entirely when another is editable-selected.
  
## On click (on container)
- Identify element under it. Walk parent to one of those classes.
- Add "editable-selected" class.
- Remove "editable-hover".
  
## On shift-click
- Try to move position to this point
- Position is presumed to be left/top
  - Future:
    - center (cy/cy)
    - detect and support right and/or bottom-aligned
    - position is first point in a path/polygon
    - position is subsequent points in path/polygon
- Transform
  - Walk up the parent tree from element, accumulating transform matrices
  - Calculate reverse matrix
  - Map mouse x/y to point in element's from of reference
  - Change appropriate attribute
    - If position:absolute (default for any SVG)…
      - x/y for SVG
      - Left/top for HTML
    - Else
      - Margin-left/margin-top for HTML
  - Contrast with original element position and original attributes

## On ctrl+click
- Try to move size to this point
- Size is presumed to be width/height relative to top/left
  - Alternates:
    - Radius of ellipse
    - Width/height relative to bottom/right
- Same transform math
  - Position doesn't care if absolute or relative

## On Escape or simple click on non-editable
- De-select
