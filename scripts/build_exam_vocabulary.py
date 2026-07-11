#!/usr/bin/env python3
"""Build browser-ready postgraduate and IELTS lists from ECDICT tags."""

from __future__ import annotations

import argparse
import csv
import json
from pathlib import Path

from build_curriculum_vocabulary import clean_phonetic, clean_translation


EXAMS = {
    "postgraduate": {
        "tag": "ky",
        "label": "考研词汇",
        "variable": "POSTGRADUATE_VOCABULARY_DATA",
    },
    "ielts": {
        "tag": "ielts",
        "label": "雅思备考",
        "variable": "IELTS_VOCABULARY_DATA",
    },
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--ecdict", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    return parser.parse_args()


def build_lists(path: Path) -> dict[str, list[dict[str, str]]]:
    result = {name: [] for name in EXAMS}

    with path.open(encoding="utf-8", newline="") as handle:
        for row in csv.DictReader(handle):
            tags = set((row.get("tag") or "").split())
            word = (row.get("word") or "").strip()
            if not word:
                continue

            for name, config in EXAMS.items():
                if config["tag"] not in tags:
                    continue
                result[name].append(
                    {
                        "word": word,
                        "phonetic": clean_phonetic(row.get("phonetic") or ""),
                        "meaning": clean_translation(row.get("translation") or ""),
                        "level": config["label"],
                        "grade": name,
                        "stage": name,
                    }
                )

    for items in result.values():
        items.sort(key=lambda item: item["word"].casefold())
    return result


def main() -> None:
    args = parse_args()
    lists = build_lists(args.ecdict)
    metadata = {
        "postgraduateCount": len(lists["postgraduate"]),
        "ieltsCount": len(lists["ielts"]),
        "source": "ECDICT exam tags (MIT License)",
        "note": "IELTS does not publish a single official vocabulary syllabus; this is a preparation list.",
    }

    output = [
        "window.EXAM_VOCABULARY_META="
        + json.dumps(metadata, ensure_ascii=False, separators=(",", ":"))
        + ";"
    ]
    for name, config in EXAMS.items():
        output.append(
            f"window.{config['variable']}="
            + json.dumps(lists[name], ensure_ascii=False, separators=(",", ":"))
            + ";"
        )

    args.output.write_text("\n".join(output) + "\n", encoding="utf-8")
    print(json.dumps(metadata, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
