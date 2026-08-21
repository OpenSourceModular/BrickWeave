import os
import sys


__plugin_pythoncompat__ = ">=3.13,<4"
__plugin_name__ = "BrickWeave"
__plugin_version__ = "0.1.0"
__plugin_identifier__ = "brickweave"
__plugin_description__ = "An Octoprint plugin that creates plunging gCode for a brick weave pattern."
__plugin_author__ = "Justin Ahrens"
__plugin_license__ = "MIT"
__plugin_url__ = "https://github.com/OpenSourceModular/BrickWeave/"
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
