#!/usr/bin/env python3
"""Bump the version number across all project files."""

import re
import sys
from pathlib import Path

ROOT = Path(__file__).parent

VERSION_FILES = [
    (ROOT / "pyproject.toml",              r'(?<=version = ")([^"]+)(?=")'),
    (ROOT / "setup.py",                    r'(?<=version=")([^"]+)(?=")'),
    (ROOT / "octoprint_brickweave" / "__init__.py", r'(?<=__plugin_version__ = ")([^"]+)(?=")'),
]


def parse_version(v: str) -> tuple[int, int, int]:
    parts = v.split(".")
    if len(parts) != 3 or not all(p.isdigit() for p in parts):
        raise ValueError(f"Invalid version format: {v!r}  (expected MAJOR.MINOR.PATCH)")
    return int(parts[0]), int(parts[1]), int(parts[2])


def bump(v: tuple[int, int, int], part: str) -> tuple[int, int, int]:
    major, minor, patch = v
    if part == "major":
        return major + 1, 0, 0
    if part == "minor":
        return major, minor + 1, 0
    if part == "patch":
        return major, minor, patch + 1
    raise ValueError(f"Unknown bump part: {part!r}  (choose major / minor / patch)")


def get_current_version() -> str:
    path, pattern = VERSION_FILES[0]
    text = path.read_text()
    m = re.search(pattern, text)
    if not m:
        raise RuntimeError(f"Could not find version in {path}")
    return m.group(1)


def update_file(path: Path, pattern: str, new_version: str) -> bool:
    text = path.read_text()
    new_text, count = re.subn(pattern, new_version, text)
    if count == 0:
        print(f"  WARNING: no match found in {path.relative_to(ROOT)}")
        return False
    path.write_text(new_text)
    print(f"  updated {path.relative_to(ROOT)}")
    return True


def main() -> None:
    part = sys.argv[1].lower() if len(sys.argv) > 1 else "patch"

    current = get_current_version()
    new_version = ".".join(str(x) for x in bump(parse_version(current), part))

    print(f"Bumping {part}: {current} -> {new_version}")
    for path, pattern in VERSION_FILES:
        update_file(path, pattern, new_version)
    print("Done.")


if __name__ == "__main__":
    main()
