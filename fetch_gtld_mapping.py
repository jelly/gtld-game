#!/usr/bin/python

import json
from lxml import html

URL = 'http://www.worldstandards.eu/other/tlds/'

html_content = html.parse(URL)
table = html_content.getroot().find_class('table-striped')[0]
tbody = table.find('tbody')

mapping = {}
for tr in tbody.findall('tr'):
    country, domain = tr.getchildren()
    country, domain = country.text, domain.text

    # Skip first row
    if 'Country' in country:
        continue

    # Invalid entry, skip
    if len(domain) < 3:
        continue

    # Some domain entries contain comments strip them
    domain = domain[1:3]

    mapping[domain] = country

format_str = "var countries = JSON.parse('{}');"
open('countries.js', 'w').writelines(format_str.format(json.dumps(mapping)))
