from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent


def test_tab_template_has_requested_controls():
    html = (ROOT / "octoprint_brickweave" / "templates" / "brickweave_tab.jinja2").read_text(encoding="utf-8")

    assert "Style" in html
    assert "50-50" in html and "Percent" in html and "Chevron" in html
    assert "Number of divisions" in html
    assert "Total Depth" in html
    assert "Depth Increment" in html
    assert "Plunge Feedrate" in html
    assert "Pull off distance" in html
    assert "Cutter Head Width" in html
