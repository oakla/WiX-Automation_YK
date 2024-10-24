import json
from pprint import pprint

def load_json_file(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)
    return data

# Example usage
json_dict = load_json_file('Mailchimp_groups.json')
# pprint(json_dict)

interests = json_dict['interests']

for interest in interests:
    print(f"{interest['id']}: {interest['name']}")