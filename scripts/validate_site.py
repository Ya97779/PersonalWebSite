"""Static smoke checks for the portfolio's six-page site."""

from html.parser import HTMLParser
from pathlib import Path
import re
import sys


REQUIRED_PAGES = [
    "index.html",
    "education.html",
    "projects.html",
    "internship.html",
    "skills.html",
    "interests.html",
]
REQUIRED_NAV = REQUIRED_PAGES
REQUIRED_BODY_PAGES = [
    "home",
    "education",
    "projects",
    "internship",
    "skills",
    "interests",
]


class SiteParser(HTMLParser):
    """Collect only the structural data needed by the smoke checks."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.title_parts = []
        self.in_title = False
        self.body_pages = []
        self.main_ids = []
        self.nav_links = []
        self.nav_depth = 0
        self.references = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        tag = tag.lower()
        if tag == "title":
            self.in_title = True
        elif tag == "body" and "data-page" in attrs:
            self.body_pages.append(attrs["data-page"])
        elif tag == "main" and "id" in attrs:
            self.main_ids.append(attrs["id"])
        elif tag == "nav" and attrs.get("id") == "site-nav":
            self.nav_depth = 1
        elif self.nav_depth and tag == "nav":
            self.nav_depth += 1

        if tag in {"a", "link", "script", "img", "source", "iframe", "video", "audio"}:
            for attribute in ("href", "src"):
                if attribute in attrs and attrs[attribute]:
                    self.references.append(attrs[attribute])

        if self.nav_depth and tag == "a":
            self.nav_links.append(
                (attrs.get("href", ""), "data-page-link" in attrs)
            )

    def handle_endtag(self, tag):
        tag = tag.lower()
        if tag == "title":
            self.in_title = False
        elif self.nav_depth and tag == "nav":
            self.nav_depth -= 1

    def handle_data(self, data):
        if self.in_title:
            self.title_parts.append(data)

    @property
    def title(self):
        return "".join(self.title_parts).strip()


def local_reference_path(reference):
    """Return a relative local path, or None for intentionally external URLs."""
    reference = reference.strip()
    if (
        not reference
        or reference.startswith(("mailto:", "#", "http://", "https://"))
    ):
        return None
    return re.split(r"[?#]", reference, maxsplit=1)[0]


def validate_page(root, page, expected_body_page):
    errors = []
    path = root / page
    if not path.is_file():
        return [f"{page}: required page is missing"]

    parser = SiteParser()
    try:
        parser.feed(path.read_text(encoding="utf-8"))
        parser.close()
    except (OSError, UnicodeError) as exc:
        return [f"{page}: cannot read/parse HTML ({exc})"]

    if not parser.title:
        errors.append(f"{page}: <title> must be non-empty")
    if parser.body_pages != [expected_body_page]:
        errors.append(
            f"{page}: expected one body[data-page] of {expected_body_page!r}; "
            f"found {parser.body_pages!r}"
        )
    if parser.main_ids.count("main") != 1:
        errors.append(
            f"{page}: expected exactly one <main id=\"main\">; "
            f"found {parser.main_ids.count('main')}"
        )

    nav_hrefs = [href for href, _ in parser.nav_links]
    if nav_hrefs != REQUIRED_NAV:
        errors.append(
            f"{page}: #site-nav hrefs must be {REQUIRED_NAV!r}; found {nav_hrefs!r}"
        )
    if not any(has_hook for _, has_hook in parser.nav_links):
        errors.append(f"{page}: #site-nav needs a data-page-link hook")

    for reference in parser.references:
        local_path = local_reference_path(reference)
        if local_path is None:
            continue
        target = (path.parent / local_path).resolve()
        try:
            target.relative_to(root.resolve())
        except ValueError:
            errors.append(f"{page}: local reference escapes site root: {reference!r}")
            continue
        if not target.is_file():
            errors.append(f"{page}: missing local reference {reference!r}")
    return errors


def main():
    root = Path(__file__).resolve().parent.parent
    failures = []
    passed = 0
    for page, body_page in zip(REQUIRED_PAGES, REQUIRED_BODY_PAGES):
        page_errors = validate_page(root, page, body_page)
        if page_errors:
            failures.extend(page_errors)
            print(f"FAIL {page}")
        else:
            passed += 1
            print(f"PASS {page}")

    for failure in failures:
        print(f"ERROR: {failure}", file=sys.stderr)
    print(f"Result: {passed}/{len(REQUIRED_PAGES)} pages passed")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
