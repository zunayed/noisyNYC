import csv
import json
import sys

items = {}

with open(sys.argv[1], 'rb') as f:
    rows = csv.DictReader(f, fieldnames=['zip', 'weekday', 'hour', 'value'])
    for row in rows:
        items[row['zip']] = {
            'weekday': row['weekday'],
            'hour': row['hour'],
            'value': row['value']
        }

with open('output.json', 'wb') as f:
    json.dump(items, f, indent=3)
