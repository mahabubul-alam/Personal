#!/usr/bin/env python3
"""
Refreshes the Citations / h-index / i10-index numbers shown on index.html
from the public Google Scholar profile.

Google Scholar has no official API and actively serves CAPTCHA pages to
requests it flags as automated (this is common for cloud/datacenter IPs,
including GitHub Actions runners). This script fails safe: if the page
can't be parsed as expected, it leaves index.html untouched and exits
non-zero, rather than writing garbage into the page. A failed run just
means the stats stay as they were until the next scheduled attempt.
"""

import re
import sys
from pathlib import Path
from datetime import datetime, timezone

import requests

SCHOLAR_URL = "https://scholar.google.com/citations?user=wdwoHuMAAAAJ&hl=en"
INDEX_HTML = Path(__file__).resolve().parent.parent / "index.html"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "en-US,en;q=0.9",
}


def fetch_stats():
    resp = requests.get(SCHOLAR_URL, headers=HEADERS, timeout=20)
    resp.raise_for_status()
    html = resp.text

    if "gs_captcha" in html or "sorry/index" in resp.url:
        raise RuntimeError("Google Scholar served a CAPTCHA/blocked response")

    values = re.findall(r'<td class="gsc_rsb_std">([\d,]+)</td>', html)
    if len(values) < 5:
        raise RuntimeError(f"Expected citation table not found (got {len(values)} values)")

    # Table rows in order: Citations(all, since), h-index(all, since), i10-index(all, since)
    citations, _, h_index, _, i10_index = values[:5]

    def fmt(n):
        return f"{int(n.replace(',', '')):,}"

    return fmt(citations), fmt(h_index), fmt(i10_index)


def update_html(citations, h_index, i10_index):
    text = INDEX_HTML.read_text(encoding="utf-8")

    start_marker = "<!-- scholar-stats:start"
    end_marker = "<!-- scholar-stats:end -->"
    start = text.find(start_marker)
    end = text.find(end_marker)
    if start == -1 or end == -1:
        raise RuntimeError("scholar-stats anchors not found in index.html")

    block = text[start:end]

    def replace_stat(block, label, value):
        pattern = re.compile(
            r'(<span class="stat-num">)[\d,]+(</span>\s*<span class="stat-label">' + re.escape(label) + r'</span>)'
        )
        new_block, count = pattern.subn(r"\g<1>" + value + r"\g<2>", block)
        if count != 1:
            raise RuntimeError(f"Could not update stat for {label!r} (found {count} matches)")
        return new_block

    block = replace_stat(block, "Citations", citations)
    block = replace_stat(block, "h-index", h_index)
    block = replace_stat(block, "i10-index", i10_index)

    month_year = datetime.now(timezone.utc).strftime("%b %Y")
    block, count = re.subn(r"Updated \w+ \d{4}", f"Updated {month_year}", block)
    if count != 1:
        raise RuntimeError("Could not update the 'Updated <Month Year>' note")

    new_text = text[:start] + block + text[end:]
    if new_text == text:
        print("Stats unchanged; nothing to write.")
        return False

    INDEX_HTML.write_text(new_text, encoding="utf-8")
    return True


def main():
    try:
        citations, h_index, i10_index = fetch_stats()
    except Exception as exc:
        print(f"Skipping update: {exc}", file=sys.stderr)
        return 0  # not a hard failure — just no update this run

    print(f"Fetched: citations={citations}, h-index={h_index}, i10-index={i10_index}")
    changed = update_html(citations, h_index, i10_index)
    print("index.html updated." if changed else "No changes needed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
