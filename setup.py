from setuptools import setup

setup(
    name="OctoprintBrickWeave",
    version="0.1.0",
    packages=["octoprint_brickweave"],
    include_package_data=True,
    install_requires=["octoprint"],
    python_requires=">=3.13,<4",
    entry_points={
        "octoprint.plugin": [
            "brickweave = octoprint_brickweave",
        ]
    },
)
