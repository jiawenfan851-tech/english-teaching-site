#!/usr/bin/env python3
"""Build browser-ready curriculum vocabulary from official PDF text and ECDICT.

Before running this script, convert the two curriculum PDFs with:

    pdftotext -layout compulsory-english-2022.pdf compulsory-english-2022.txt
    pdftotext -layout high-school-english-2020.pdf high-school-english-2020.txt

The PDFs and ECDICT CSV are intentionally not committed to this static site.
Their canonical download locations and licences are documented in
THIRD_PARTY_NOTICES.md.
"""

from __future__ import annotations

import argparse
import csv
import json
import re
import unicodedata
from pathlib import Path


PRIMARY_OCR_CORRECTIONS = {
    "bg": "bag",
    "basketall": "basketball",
    "aple": "apple",
    "coow": "cow",
    "dol": "doll",
    "nty": "fly",
    "fee": "free",
    "hppy": "happy",
    "gif": "gift",
    "lttr": "letter",
    "litle": "little",
    "offr": "off",
    "to0": "too",
    "top": "top",
}

# These four entries are visible in the official PDF but dropped entirely by
# pdftotext because of the embedded font encoding.
PRIMARY_DROPPED_BY_PDF_TEXT = ["good", "ill", "see", "zoo"]

# The official PDF uses an embedded font whose text layer occasionally drops
# or substitutes glyphs. These corrections were checked against the rendered
# pages of Appendix 3, rather than inferred from the old website word list.
COMPULSORY_OCR_CORRECTIONS = {
    "activiy": "activity",
    "arive": "arrive",
    "blod": "blood",
    "borm": "born",
    "bow/l": "bowl",
    "buly": "bully",
    "cagle": "eagle",
    "classoom": "classroom",
    "coffe": "coffee",
    "crtain": "certain",
    "den": "pen",
    "dffence": "difference",
    "diffcult": "difficult",
    "diner": "dinner",
    "dol": "doll",
    "eel": "feel",
    "eveningt": "evening",
    "fal": "fall",
    "fim": "film",
    "fin": "fine",
    "fir": "fire",
    "fiu": "flu",
    "fooball": "football",
    "fre": "free",
    "fu": "full",
    "fuit": "fruit",
    "g0al": "goal",
    "gif": "gift",
    "ginl": "girl",
    "hury": "hurry",
    "ig": "pig",
    "illess": "illness",
    "lef": "left",
    "leter": "letter",
    "lif": "lift",
    "litle": "little",
    "necesary": "necessary",
    "ny": "fly",
    "oclock": "o'clock",
    "offr": "offer",
    "pai": "pair",
    "peper": "pepper",
    "plae": "place",
    "recyele": "recycle",
    "sad t": "sad",
    "scholbag": "schoolbag",
    "sily": "silly",
    "skit": "skirt",
    "sory": "sorry",
    "spech": "speech",
    "spig": "spring",
    "sthip": "ship",
    "stil": "still",
    "tenis": "tennis",
    "terible": "terrible",
    "toilt": "toilet",
    "trafic": "traffic",
    "ty": "try",
    "uffer": "suffer",
    "wil": "will",
    "wory": "worry",
    "z0o": "zoo",
}

COMPULSORY_DROPPED_GLYPHS = {
    "皂”": "all",
    "号": "buy",
    "自”": "call",
    "自皂”": "email",
    "当": "fill",
    "宕句”": "help",
    "中”": "it",
    "吕": "pill",
    "宁": "press",
    "图己台": "screen",
    "名岂”": "wall",
}

COMPULSORY_DROPPED_BY_PDF_TEXT = ["go"]

PHONETIC_OVERRIDES = {
    "app": "/æp/",
    "ice cream": "/ˌaɪs ˈkriːm/",
    "a.m.": "/ˌeɪ ˈem/",
    "bc": "/ˌbiː ˈsiː/",
    "bean curd": "/ˈbiːn kɜːd/",
    "blog": "/blɒɡ/",
    "download": "/ˌdaʊnˈləʊd/",
    "due to": "/ˈdjuː tuː/",
    "firework": "/ˈfaɪəwɜːk/",
    "laptop": "/ˈlæptɒp/",
    "ought to": "/ˈɔːt tuː/",
    "online": "/ˌɒnˈlaɪn/",
    "p.m.": "/ˌpiː ˈem/",
    "theatre": "/ˈθɪətə/",
    "website": "/ˈwebsaɪt/",
}

MEANING_OVERRIDES = {
    "a / an": "art. 一个；一（不定冠词）",
    "app": "n. 应用程序；手机应用",
    "ice cream": "n. 冰淇淋",
    "a.m.": "abbr. 上午；午前",
    "bc": "abbr. 公元前",
    "bean curd": "n. 豆腐",
    "café": "n. 咖啡馆",
    "download": "v. 下载；n. 下载内容",
    "due to": "由于；因为",
    "laptop": "n. 笔记本电脑",
    "miss": "v. 想念；错过；未击中",
    "miss-title": "n. 小姐；女士（称谓）",
    "ought to": "应该；应当",
    "online": "adj. 在线的；联网的；adv. 在线地",
    "p.m.": "abbr. 下午；午后",
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--compulsory-text", type=Path, required=True)
    parser.add_argument("--high-school-text", type=Path, required=True)
    parser.add_argument("--ecdict", type=Path, required=True)
    parser.add_argument("--existing-vocabulary", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    return parser.parse_args()


def unique_casefold(values: list[str]) -> list[str]:
    result: list[str] = []
    seen: set[str] = set()
    for value in values:
        key = value.casefold()
        if key not in seen:
            seen.add(key)
            result.append(value)
    return result


def extract_primary_words(text: str) -> list[str]:
    pages = text.split("\f")
    start_page = next(index for index, page in enumerate(pages) if "二级词汇表" in page)
    raw_entries: list[str] = []

    for page in pages[start_page + 1 : start_page + 11]:
        for raw_line in page.splitlines():
            line = unicodedata.normalize("NFKC", raw_line).strip()
            if not line or any(label in line for label in ("义务教育", "附 录", "课程标准")):
                continue
            for item in re.split(r"\s{2,}", line):
                item = item.strip()
                if not item or (re.fullmatch(r"[A-Z]", item) and item != "I"):
                    continue
                if item == "w" or not re.match(r"^[A-Za-z]", item):
                    continue
                raw_entries.append(item)

    words: list[str] = []
    for entry in raw_entries:
        canonical = re.sub(r"\s*\(.*$", "", entry).strip()
        if canonical.casefold() == "a/an":
            words.extend(["a", "an"])
        else:
            words.append(PRIMARY_OCR_CORRECTIONS.get(canonical.casefold(), canonical))

    words.extend(PRIMARY_DROPPED_BY_PDF_TEXT)
    words = sorted(unique_casefold(words), key=str.casefold)
    if len(words) != 505:
        raise ValueError(f"Expected 505 primary words, extracted {len(words)}")
    return words


def extract_compulsory_words(text: str) -> list[str]:
    """Extract the complete 1,600-entry Level 3 compulsory-school list."""

    pages = text.split("\f")
    start_page = next(index for index, page in enumerate(pages) if "三级词汇表" in page)
    raw_entries: list[str] = []
    reached_number_table = False

    for page in pages[start_page:]:
        for raw_line in page.splitlines():
            line = unicodedata.normalize("NFKC", raw_line).strip()
            if line.startswith("数词"):
                reached_number_table = True
                break

            for item in re.split(r"\s{2,}", line):
                item = item.strip()
                if item in COMPULSORY_DROPPED_GLYPHS:
                    raw_entries.append(COMPULSORY_DROPPED_GLYPHS[item])
                    continue
                if not re.match(r"^[A-Za-z]", item):
                    continue
                if item == "tion)。" or re.fullmatch(r"[A-Z]", item):
                    continue
                if item == "policemen/policewomen)" or item == "x":
                    continue

                # One line in the PDF text layer joins the two visual columns.
                if item.startswith("maths(") and "minute" in item:
                    raw_entries.extend(["maths", "minute"])
                else:
                    raw_entries.append(item)

        if reached_number_table:
            break

    words: list[str] = []
    hi_count = 0
    too_count = 0
    for entry in raw_entries:
        if entry == "I*":
            canonical = "I"
        elif entry == "i*":
            canonical = "ill"
        elif entry == "wet*":
            canonical = "well"
        else:
            canonical = re.sub(r"\s*\(.*$", "", entry).strip()
            canonical = re.sub(r"[^A-Za-z0-9.\-/' ]+$", "", canonical).strip()
            canonical = canonical.rstrip("'\"’")

            if canonical.casefold() == "hi":
                hi_count += 1
                canonical = "hi" if hi_count == 1 else "hill"
            elif canonical.casefold() == "too":
                too_count += 1
                canonical = "too" if too_count == 1 else "tool"
            else:
                canonical = COMPULSORY_OCR_CORRECTIONS.get(canonical.casefold(), canonical)

        canonical = re.sub(r"\s*/\s*", " / ", canonical)
        canonical = canonical.lower()
        if canonical in {"ai", "i", "miss", "mr", "mrs", "ms", "ok", "pe", "tv"}:
            canonical = {
                "ai": "AI",
                "i": "I",
                "miss": "Miss" if entry.startswith("Miss") else "miss",
                "mr": "Mr",
                "mrs": "Mrs",
                "ms": "Ms",
                "ok": "OK",
                "pe": "PE",
                "tv": "TV",
            }[canonical]
        elif canonical == "t-shirt":
            canonical = "T-shirt"
        elif canonical == "x-ray":
            canonical = "X-ray"
        words.append(canonical)

    words.extend(COMPULSORY_DROPPED_BY_PDF_TEXT)
    words = sorted(words, key=lambda value: re.sub(r"[^a-z0-9]", "", value.casefold()))
    if len(words) != 1600:
        raise ValueError(f"Expected 1600 compulsory-school words, extracted {len(words)}")
    if len(set(words)) != 1600:
        raise ValueError("The compulsory-school word list contains duplicate entries")
    return words


def extract_high_school_words(text: str) -> list[tuple[str, str]]:
    """Extract all 3,000 entries from Appendix 2, preserving course markers."""

    headings = list(re.finditer(r"附录\s*2\s*词汇表", text))
    if not headings:
        raise ValueError("Could not find high-school Appendix 2 vocabulary heading")
    start = headings[-1].end()
    country_tables = list(re.finditer(r"主要国家名称及相关信息", text[start:]))
    if not country_tables:
        raise ValueError("Could not find the end of the high-school vocabulary table")
    end = start + country_tables[-1].start()
    entries: list[tuple[str, str]] = []
    seen_i_heading = False

    for raw_line in text[start:end].splitlines():
        line = unicodedata.normalize("NFKC", raw_line).strip()
        line = line.replace("millimetre (millimeter)** monkey", "millimetre (millimeter)**  monkey")
        for item in re.split(r"\s{2,}", line):
            item = item.strip().replace("’", "'")
            if not item or not re.match(r"^[A-Za-z]", item):
                continue
            if item == "kilogram)":
                # Wrapped continuation of "kilo (kilogramme, kilogram)".
                continue
            if re.fullmatch(r"[A-Z]", item):
                if item != "I" or not seen_i_heading:
                    seen_i_heading = seen_i_heading or item == "I"
                    continue

            marker = re.search(r"(\*{1,2})$", item)
            canonical = re.sub(r"\*+$", "", item).strip()
            grade = "high2" if marker and marker.group(1) == "**" else "high1" if marker else "high0"
            canonical = "a / an" if canonical.casefold() == "a (an)" else re.sub(r"\s*\(.*$", "", canonical).strip()
            entries.append((canonical, grade))

    if len(entries) != 3000 or len({word for word, _ in entries}) != 3000:
        raise ValueError(f"Expected 3000 unique high-school entries, extracted {len(entries)}")
    return entries


def dictionary_keys(word: str) -> list[str]:
    keys = [word.casefold()]
    if word.casefold() == "café":
        keys.append("cafe")
    if " / " in word:
        keys.extend(part.strip().casefold() for part in word.split(" / "))
    return keys


def load_ecdict(path: Path, needed: set[str]) -> dict[str, dict[str, str]]:
    result: dict[str, dict[str, str]] = {}
    with path.open(encoding="utf-8", newline="") as handle:
        for row in csv.DictReader(handle):
            word = (row.get("word") or "").strip().casefold()
            if word in needed and word not in result:
                result[word] = row
    return result


def load_existing_vocabulary(path: Path) -> dict[str, dict[str, str]]:
    source = path.read_text(encoding="utf-8")
    payload = source[source.index("=") + 1 :].strip().removesuffix(";")
    return {item["word"].casefold(): item for item in json.loads(payload)}


def clean_translation(value: str) -> str:
    value = value.replace("\\r", "").replace("\\n", "\n")
    lines = [line.strip() for line in value.splitlines()]
    lines = [line for line in lines if line and not line.startswith("[网络]")]
    text = "；".join(lines[:2]).replace(";;", ";")
    if len(text) > 150:
        text = text[:147].rstrip("；;，, ") + "…"
    return text or "释义整理中"


def clean_phonetic(value: str) -> str:
    value = value.strip().strip("/")
    return f"/{value}/" if value else ""


def make_entry(
    word: str,
    grade: str,
    level: str,
    stage: str,
    dictionary: dict[str, dict[str, str]],
    existing: dict[str, dict[str, str]],
) -> dict[str, str]:
    keys = dictionary_keys(word)
    rows = [dictionary[key] for key in keys if key in dictionary]
    if not rows:
        raise KeyError(f"ECDICT has no entry for {word!r}")

    previous = existing.get(word.casefold())
    if previous and previous.get("meaning") != "释义整理中":
        phonetic = previous.get("phonetic") or clean_phonetic(rows[0].get("phonetic") or "")
        meaning = previous["meaning"]
    elif " / " in word:
        parts = word.split(" / ")
        phonetic = " · ".join(clean_phonetic(row.get("phonetic") or "") for row in rows)
        meanings = [f"{part.strip()}：{clean_translation(row.get('translation') or '')}" for part, row in zip(parts, rows)]
        meaning = "；".join(meanings)
    else:
        phonetic = clean_phonetic(rows[0].get("phonetic") or "")
        meaning = clean_translation(rows[0].get("translation") or "")

    phonetic = PHONETIC_OVERRIDES.get(word.casefold(), phonetic)
    meaning_key = "miss-title" if word == "Miss" else word.casefold()
    meaning = MEANING_OVERRIDES.get(meaning_key, meaning)

    return {
        "word": word,
        "phonetic": phonetic,
        "meaning": meaning,
        "level": level,
        "grade": grade,
        "stage": stage,
    }


def main() -> None:
    args = parse_args()
    compulsory_text = args.compulsory_text.read_text(encoding="utf-8")
    primary_words = extract_primary_words(compulsory_text)
    compulsory_words = extract_compulsory_words(compulsory_text)
    high_school_words = extract_high_school_words(args.high_school_text.read_text(encoding="utf-8"))

    needed: set[str] = set()
    for word in primary_words:
        needed.update(dictionary_keys(word))
    for word in compulsory_words:
        needed.update(dictionary_keys(word))
    for word, _ in high_school_words:
        needed.update(dictionary_keys(word))
    dictionary = load_ecdict(args.ecdict, needed)
    existing = load_existing_vocabulary(args.existing_vocabulary)

    primary = [make_entry(word, "primary", "课标二级", "primary", dictionary, existing) for word in primary_words]
    middle_school = [
        make_entry(word, "middle", "课标三级", "middle", dictionary, existing)
        for word in compulsory_words
    ]
    high_school = [
        make_entry(
            word,
            grade,
            "义务教育基础" if grade == "high0" else "必修" if grade == "high1" else "选择性必修",
            "high",
            dictionary,
            existing,
        )
        for word, grade in high_school_words
    ]

    metadata = {
        "primaryCount": len(primary),
        "compulsoryCount": len(middle_school),
        "middleSchoolNewCount": len(middle_school) - len(primary),
        "highSchoolCount": len(high_school),
        "highSchoolFoundationCount": sum(item["grade"] == "high0" for item in high_school),
        "highSchoolRequiredCount": sum(item["grade"] == "high1" for item in high_school),
        "highSchoolElectiveCount": sum(item["grade"] == "high2" for item in high_school),
        "generatedFrom": [
            "义务教育英语课程标准（2022年版）附录3二级词汇表",
            "义务教育英语课程标准（2022年版）附录3三级词汇表",
            "普通高中英语课程标准（2017年版2020年修订）附录2词汇表",
            "ECDICT MIT-licensed English-Chinese dictionary",
        ],
    }

    output = (
        "window.CURRICULUM_VOCABULARY_META="
        + json.dumps(metadata, ensure_ascii=False, separators=(",", ":"))
        + ";\nwindow.PRIMARY_VOCABULARY_DATA="
        + json.dumps(primary, ensure_ascii=False, separators=(",", ":"))
        + ";\nwindow.MIDDLE_SCHOOL_VOCABULARY_DATA="
        + json.dumps(middle_school, ensure_ascii=False, separators=(",", ":"))
        + ";\nwindow.HIGH_SCHOOL_VOCABULARY_DATA="
        + json.dumps(high_school, ensure_ascii=False, separators=(",", ":"))
        + ";\n"
    )
    args.output.write_text(output, encoding="utf-8")
    print(json.dumps(metadata, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
