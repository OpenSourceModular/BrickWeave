import os
import sys


__plugin_pythoncompat__ = ">=3.13,<4"
__plugin_name__ = "Brick Weave"
__plugin_version__ = "0.1.0"
__plugin_identifier__ = "brickweave"
__plugin_description__ = "A minimal OctoPrint plugin that generates a one-line X-axis move gcode file."
__plugin_author__ = "Brick Weave"
__plugin_license__ = "MIT"
__plugin_url__ = "https://example.com/brickweave"
__plugin_import_name__ = "octoprint_brickweave"


def __plugin_load__():
    global __plugin_implementation__
    plugin_dir = os.path.dirname(os.path.realpath(__file__))
    if plugin_dir not in sys.path:
        sys.path.insert(0, plugin_dir)
    from octoprint_brickweave import BrickWeavePlugin

    __plugin_implementation__ = BrickWeavePlugin()
    global __plugin_hooks__
    __plugin_hooks__ = {
        "octoprint.plugin.softwareupdate.check_config": __plugin_implementation__.get_update_information,
    }
