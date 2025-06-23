import csv, json
with open('astronomical_information.csv','r') as f: data_rows=[{k.strip():v.strip() for k,v in row.items()} for row in csv.DictReader(f)]
with open('data.js','w') as js_file: js_file.write(f"const astronomicalData = {json.dumps(data_rows,indent=2)};")