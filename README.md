# Brick Weave

An Octoprint plugin that generates gcode to make repeated plunge cuts around a cylinder resulting in the traditional Rose Engine turned Brick Weave pattern.

## What It Does

- Adds a **Brick Weave** tab in OctoPrint.
- Shows one textbox labeled **Move x by**.
- When you click **Generate gCode**, the plugin creates a one-line gcode file:
  - `G1 X<value>`
- Saves the generated file into OctoPrint's `uploads` directory.

## Installation

### OctoPrint Plugin Manager

1. In OctoPrint, open **Settings > Plugin Manager > Get More...**
2. Use **...from URL** and paste this in:
  https://github.com/OpenSourceModular/BrickWeave/releases/latest 
3. Install and restart OctoPrint.

## Usage

Fill out the controls with values and click Generate gCode. The gcode will be saved in the OctoPrint Plugin directory.

